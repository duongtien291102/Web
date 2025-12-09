const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const crypto = require('crypto')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables')
  process.exit(1)
}

mongoose.set('strictQuery', false)

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model('User', userSchema)

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestId: { type: String, default: null },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  contentType: { type: String, enum: ['plain', 'rich', 'task'], default: 'plain' },
  shareId: { type: String },
  isPublic: { type: Boolean, default: true },
  password: { type: String, default: null },
  editorPassword: { type: String, default: null },
  folder: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
noteSchema.pre('save', function () {
  this.updatedAt = new Date()
})
noteSchema.index({ user: 1, updatedAt: -1 })
noteSchema.index({ guestId: 1, createdAt: -1 })
noteSchema.index({ shareId: 1 })
const Note = mongoose.model('Note', noteSchema)

function auth(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'unauthorized' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' })
  }
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password || String(password).length < 6) return res.status(400).json({ error: 'missing_fields' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'email_exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hash })
    return res.status(201).json({ id: user._id })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'missing_fields' })
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'invalid_credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' })
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.get('/api/guest/token', (req, res) => {
  try {
    const guestId = crypto.randomBytes(16).toString('hex')
    const guestToken = jwt.sign({ guestId, isGuest: true }, JWT_SECRET, { expiresIn: '30d' })
    return res.json({ token: guestToken, guestId })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.get('/api/notes', async (req, res) => {
  try {
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'unauthorized' })
    
    const decoded = jwt.verify(token, JWT_SECRET)
    let notes = []
    
    if (decoded.isGuest) {
      notes = await Note.find({ guestId: decoded.guestId }).sort({ updatedAt: -1 }).lean()
    } else {
      notes = await Note.find({ user: decoded.id }).sort({ updatedAt: -1 }).lean()
    }
    
    return res.json(notes)
  } catch (e) {
    console.error('Error loading notes:', e.message)
    return res.status(500).json({ error: 'server_error', message: e.message })
  }
})

app.post('/api/notes', async (req, res) => {
  try {
    console.log('POST /api/notes - Request body:', JSON.stringify(req.body).substring(0, 200))
    
    const { title, content, contentType, isPublic, password, editorPassword, folder } = req.body
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    let userId = null
    let guestId = null
    let isGuest = false
    
    console.log('Token present:', !!token)
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log('Token decoded:', { isGuest: decoded.isGuest, guestId: decoded.guestId?.substring(0, 8) })
        if (decoded.isGuest) {
          guestId = decoded.guestId
          isGuest = true
        } else {
          userId = decoded.id
        }
      } catch (e) {
        console.error('Token verification failed:', e.message)
      }
    }
    
    if (isGuest) {
      console.log('Checking guest note count for:', guestId?.substring(0, 8))
      const guestCount = await Note.countDocuments({ guestId, user: null })
      console.log('Guest note count:', guestCount)
      if (guestCount >= 10) {
        return res.status(429).json({ error: 'guest_limit', message: 'Khách chỉ được tạo tối đa 10 ghi chú. Vui lòng đăng nhập.' })
      }
    }
    
    const shareId = crypto.randomBytes(16).toString('hex')
    console.log('Creating note with shareId:', shareId.substring(0, 8))
    
    const note = await Note.create({ 
      user: userId, 
      guestId: isGuest ? guestId : null,
      title: title || '', 
      content: content || '', 
      contentType: contentType || 'plain',
      shareId,
      isPublic: isPublic !== false,
      password: password || null,
      editorPassword: editorPassword || null,
      folder: folder || null
    })
    
    console.log('Note created successfully:', note._id)
    return res.status(201).json(note)
  } catch (e) {
    console.error('❌ Error creating note:', e.message)
    console.error('Stack:', e.stack)
    return res.status(500).json({ error: 'server_error', message: e.message })
  }
})

app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content, contentType, isPublic, password, editorPassword, folder } = req.body
    const updateData = { updatedAt: new Date() }
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (contentType !== undefined) updateData.contentType = contentType
    if (isPublic !== undefined) updateData.isPublic = isPublic
    if (password !== undefined) updateData.password = password
    if (editorPassword !== undefined) updateData.editorPassword = editorPassword
    if (folder !== undefined) updateData.folder = folder
    
    const n = await Note.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true }
    )
    if (!n) return res.status(404).json({ error: 'not_found' })
    return res.json(n)
  } catch (e) {
    console.error('Error updating note:', e)
    return res.status(500).json({ error: 'server_error', message: e.message })
  }
})

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const n = await Note.findOneAndDelete({ _id: req.params.id })
    if (!n) return res.status(404).json({ error: 'not_found' })
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.post('/api/notes/share/:shareId/verify', async (req, res) => {
  try {
    const { password } = req.body
    const n = await Note.findOne({ shareId: req.params.shareId })
    if (!n) return res.status(404).json({ error: 'not_found' })
    if (n.password && n.password !== password) {
      return res.status(401).json({ error: 'invalid_password' })
    }
    return res.json({ 
      title: n.title, 
      content: n.content, 
      contentType: n.contentType,
      updatedAt: n.updatedAt,
      hasEditorPassword: !!n.editorPassword
    })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.get('/api/notes/share/:shareId', async (req, res) => {
  try {
    const n = await Note.findOne({ shareId: req.params.shareId })
    if (!n) return res.status(404).json({ error: 'not_found' })
    if (n.password) {
      return res.json({ requiresPassword: true })
    }
    return res.json({ 
      title: n.title, 
      content: n.content, 
      contentType: n.contentType,
      updatedAt: n.updatedAt,
      hasEditorPassword: !!n.editorPassword
    })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.put('/api/notes/share/:shareId', async (req, res) => {
  try {
    const { title, content, editorPassword } = req.body
    const n = await Note.findOne({ shareId: req.params.shareId })
    if (!n) return res.status(404).json({ error: 'not_found' })
    if (n.editorPassword && n.editorPassword !== editorPassword) {
      return res.status(401).json({ error: 'invalid_editor_password' })
    }
    n.title = title || n.title
    n.content = content || n.content
    n.updatedAt = new Date()
    await n.save()
    return res.json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.get('/share/:shareId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'share.html'))
})

const port = process.env.PORT || 3000

async function startServer() {
  try {
    console.log('Starting server...')
    console.log('MONGO_URI exists:', !!MONGO_URI)
    console.log('JWT_SECRET exists:', !!JWT_SECRET)
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    console.log('✓ MongoDB connected successfully')
    
    await User.init()
    await Note.init()
    console.log('✓ Database indexes created')
    
  } catch (e) {
    console.error('✗ MongoDB connection failed:', e.message)
    console.error('Server will start anyway but database operations will fail')
  }
  
  app.listen(port, () => {
    console.log(`✓ Server listening on port ${port}`)
  })
}

startServer()
