// Test the SerpApiRetriever with detailed error logging

import SerpApiRetriever from './src/retrievers/SerpApiRetriever.js';

async function testSerpApi() {
  console.log('Testing SerpApiRetriever...');
  
  // Check if API key is set
  console.log('SERPAPI_API_KEY from env:', process.env.SERPAPI_API_KEY ? 'SET' : 'NOT SET');
  console.log('SERPAPI_API_KEY value (first 5 chars):', process.env.SERPAPI_API_KEY ? process.env.SERPAPI_API_KEY.substring(0, 5) + '...' : 'N/A');
  
  try {
    const retriever = new SerpApiRetriever();
    
    // Check if API key is set in retriever
    console.log('API Key in retriever:', retriever.apiKey ? 'SET' : 'NOT SET');
    console.log('API Key in retriever (first 5 chars):', retriever.apiKey ? retriever.apiKey.substring(0, 5) + '...' : 'N/A');
    
    // Test search functionality
    console.log('\n🔍 Testing search functionality...');
    const results = await retriever.search('What is Node.js?');
    console.log('Search results:', results);
    
    console.log('\n✅ SerpApiRetriever test completed successfully!');
  } catch (error) {
    console.error('❌ Error in SerpApiRetriever test:', error);
    console.error('Error stack:', error.stack);
  }
}

testSerpApi();