// Test SerpApi using direct HTTP request

import axios from 'axios';

async function testSerpApiDirect() {
  console.log('Testing SerpApi with direct HTTP request...');
  
  const apiKey = process.env.SERPAPI_API_KEY;
  console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
  
  if (!apiKey) {
    console.log('No API key found');
    return;
  }
  
  try {
    console.log('Making direct request to SerpApi...');
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',
        api_key: apiKey,
        q: 'What is Node.js?',
        num: 5
      }
    });
    
    console.log('Success! Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
    if (response.data.organic_results) {
      console.log('Number of results:', response.data.organic_results.length);
    }
  } catch (error) {
    console.error('Error occurred:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSerpApiDirect();