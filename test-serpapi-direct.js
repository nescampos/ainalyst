// Simple SerpApi test

import { getJson } from 'serpapi';

async function testSerpApiDirectly() {
  console.log('Testing SerpApi directly...');
  
  const apiKey = process.env.SERPAPI_API_KEY;
  console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
  
  if (!apiKey) {
    console.log('No API key found');
    return;
  }
  
  try {
    console.log('Making request to SerpApi...');
    const response = await getJson({
      engine: "google",
      api_key: apiKey,
      q: "What is Node.js?",
      num: 5,
    });
    
    console.log('Success! Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error occurred:');
    console.error('Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSerpApiDirectly();