exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
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
    if (event.httpMethod === 'GET') {
      // Mock data for demo
      const mockData = [
        { id: 1, name: 'Sample Data 1', description: 'This is sample data from Netlify' },
        { id: 2, name: 'Sample Data 2', description: 'This is another sample from Netlify' }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: mockData })
      };
    } else if (event.httpMethod === 'POST') {
      const { data } = JSON.parse(event.body);
      
      // In a real app, you would save to database here
      console.log('Saving data:', data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Data saved successfully' })
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request' })
    };
  }
}; 