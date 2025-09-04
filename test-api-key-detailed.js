// Verify the exact API key value

import dotenv from 'dotenv';
dotenv.config();

console.log('Environment variables:');
console.log('SERPAPI_API_KEY:', process.env.SERPAPI_API_KEY);
console.log('SERPAPI_API_KEY length:', process.env.SERPAPI_API_KEY ? process.env.SERPAPI_API_KEY.length : 0);

// Check for hidden characters
if (process.env.SERPAPI_API_KEY) {
  console.log('First 10 chars:', process.env.SERPAPI_API_KEY.substring(0, 10));
  console.log('Last 10 chars:', process.env.SERPAPI_API_KEY.substring(process.env.SERPAPI_API_KEY.length - 10));
  
  // Check for hidden characters
  const chars = process.env.SERPAPI_API_KEY.split('').map((char, i) => ({
    index: i,
    char: char,
    code: char.charCodeAt(0)
  }));
  
  console.log('Character codes:', chars.map(c => c.code));
  
  // Check if all characters are ASCII
  const isAscii = chars.every(c => c.code >= 32 && c.code <= 126);
  console.log('All characters are ASCII:', isAscii);
}