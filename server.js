const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection (placeholder - bạn cần thay thế bằng thông tin database thực tế)
const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'jaika_db',
  user: process.env.DB_USER || 'username',
  password: process.env.DB_PASSWORD || 'password'
};

// Google AI Studio API configuration
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GOOGLE_AI_ENDPOINT = process.env.GOOGLE_AI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoint để gọi Google AI Studio
app.post('/api/ai', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!GOOGLE_AI_API_KEY) {
      return res.status(500).json({ error: 'Google AI API key not configured' });
    }

    const response = await axios.post(`${GOOGLE_AI_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    res.json({
      success: true,
      response: response.data.candidates[0].content.parts[0].text
    });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Database operations
app.post('/api/save', async (req, res) => {
  try {
    const { data } = req.body;
    // Thêm logic lưu vào database ở đây
    console.log('Saving data:', data);
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    // Thêm logic lấy dữ liệu từ database ở đây
    const mockData = [
      { id: 1, name: 'Sample Data 1', description: 'This is sample data' },
      { id: 2, name: 'Sample Data 2', description: 'This is another sample' }
    ];
    res.json({ success: true, data: mockData });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    domain: 'Jaika.id.vn'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Website available at: http://localhost:${PORT}`);
  console.log(`Domain: Jaika.id.vn`);
}); 