// Test to verify API key

async function testApiKey() {
  console.log('Testing API Key...');
  
  const apiKey = process.env.SERPAPI_API_KEY;
  console.log('API Key:', apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key type:', typeof apiKey);
  
  // Check if it contains only valid characters
  if (apiKey) {
    const validChars = /^[a-zA-Z0-9_-]+$/.test(apiKey);
    console.log('Contains only valid characters:', validChars);
    
    // Check for common issues
    if (apiKey.includes('your-serpapi-key-here')) {
      console.log('⚠️  Warning: API key contains placeholder text');
    }
    
    if (apiKey.startsWith('sk-')) {
      console.log('⚠️  Warning: API key looks like an OpenAI key, not SerpApi');
    }
  } else {
    console.log('❌ No API key found');
  }
}

testApiKey();