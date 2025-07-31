const axios = require('axios');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    
    const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
    const GOOGLE_AI_ENDPOINT = process.env.GOOGLE_AI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    if (!GOOGLE_AI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Google AI API key not configured' })
      };
    }

    const response = await axios.post(`${GOOGLE_AI_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response: response.data.candidates[0].content.parts[0].text
      })
    };
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get AI response' })
    };
  }
}; 