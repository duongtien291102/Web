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

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected')
}).catch((e) => {
  console.error('MongoDB connection error')
})

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model('User', userSchema)

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  shareId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
noteSchema.pre('save', function (next) {
  if (!this.shareId) this.shareId = crypto.randomBytes(16).toString('hex')
  this.updatedAt = new Date()
  next()
})
noteSchema.index({ user: 1, updatedAt: -1 })
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

app.get('/api/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 })
    return res.json(notes)
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    let userId = null
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        userId = decoded.id
      } catch (e) {}
    }
    const note = await Note.create({ user: userId, title: title || '', content: content || '' })
    return res.status(201).json(note)
  } catch (e) {
    console.error('Error creating note:', e)
    return res.status(500).json({ error: 'server_error', message: e.message })
  }
})

app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content } = req.body
    const n = await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title: title || '', content: content || '', updatedAt: new Date() },
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

app.get('/api/notes/share/:shareId', async (req, res) => {
  try {
    const n = await Note.findOne({ shareId: req.params.shareId })
    if (!n) return res.status(404).json({ error: 'not_found' })
    return res.json({ title: n.title, content: n.content, updatedAt: n.updatedAt })
  } catch (e) {
    return res.status(500).json({ error: 'server_error' })
  }
})

app.get('/share/:shareId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'share.html'))
})

const port = process.env.PORT || 3000
async function ensureDb() {
  const db = mongoose.connection.db
  const cols = await db.listCollections().toArray()
  const names = cols.map(c => c.name)
  if (!names.includes('users')) await db.createCollection('users')
  if (!names.includes('notes')) await db.createCollection('notes')
  await User.init()
  await Note.init()
}

;(async () => {
  try {
    await ensureDb()
  } catch (e) {}
  app.listen(port, () => {
    console.log('Server listening on ' + port)
  })
})()
