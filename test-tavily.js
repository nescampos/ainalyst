// Test the TavilyRetriever

import TavilyRetriever from './src/retrievers/TavilyRetriever.js';

async function testTavily() {
  console.log('Testing TavilyRetriever...');
  
  try {
    const retriever = new TavilyRetriever();
    
    // Check if API key is set
    console.log('TAVILY_API_KEY from env:', process.env.TAVILY_API_KEY ? 'SET' : 'NOT SET');
    console.log('API Key in retriever:', retriever.apiKey ? 'SET' : 'NOT SET');
    
    // Test search functionality
    console.log('\n🔍 Testing search functionality...');
    const results = await retriever.search('What is Node.js?');
    console.log('Search results:', JSON.stringify(results, null, 2));
    
    console.log('\n✅ TavilyRetriever test completed successfully!');
  } catch (error) {
    console.error('❌ Error in TavilyRetriever test:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testTavily();