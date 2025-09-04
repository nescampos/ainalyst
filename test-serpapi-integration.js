// Test SerpApi integration

import { getJson } from 'serpapi';
import dotenv from 'dotenv';
dotenv.config();

async function testSerpApi() {
  console.log('Testing SerpApi integration...');
  
  // Try to get account information to verify the API key
  try {
    console.log('Attempting to verify SerpApi key...');
    
    // First check if API key is set
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.log('❌ SERPAPI_API_KEY not found in environment variables');
      console.log('Please set your SerpApi API key in the .env file');
      return;
    }
    
    console.log('API Key found, testing search...');
    
    // Perform a simple search
    const response = await getJson({
      engine: "google",
      api_key: apiKey,
      q: "test",
      num: 1,
    });
    
    if (response && response.organic_results) {
      console.log('✅ SerpApi is working correctly!');
      console.log(`Found ${response.organic_results.length} results`);
    } else {
      console.log('❌ Unexpected response from SerpApi');
      console.log('Response:', response);
    }
  } catch (error) {
    console.log('❌ Error testing SerpApi:', error.message);
    console.log('This might be because:');
    console.log('1. Your API key is invalid');
    console.log('2. You have exceeded your API quota');
    console.log('3. There is a network connectivity issue');
  }
}

testSerpApi();