// Simple test to verify the application works

import { config } from './src/utils/config.js';
import openai from './src/utils/openai.js';

console.log('Testing OpenAI connection...');

// Test if the API key is set
if (!config.openai.apiKey || config.openai.apiKey === 'your_openai_api_key_here') {
  console.log('⚠️  API key not set. Please set your OpenAI API key in the .env file');
  process.exit(1);
}

// Test OpenAI connection
try {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: 'Say "Hello, World!"'
      }
    ],
    max_tokens: 10
  });

  console.log('✅ OpenAI connection successful!');
  console.log('Response:', completion.choices[0].message.content);
} catch (error) {
  console.error('❌ OpenAI connection failed:', error.message);
  process.exit(1);
}