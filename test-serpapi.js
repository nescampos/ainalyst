// Test the SerpApiRetriever

import SerpApiRetriever from './src/retrievers/SerpApiRetriever.js';

async function testSerpApi() {
  console.log('Testing SerpApiRetriever...');
  
  try {
    const retriever = new SerpApiRetriever();
    
    // Test search functionality
    console.log('\n🔍 Testing search functionality...');
    const results = await retriever.search('What is Node.js?');
    console.log('Search results:', results);
    
    console.log('\n✅ SerpApiRetriever test completed successfully!');
  } catch (error) {
    console.error('❌ Error in SerpApiRetriever test:', error.message);
  }
}

testSerpApi();