#!/usr/bin/env node

import readline from 'readline';
import conductResearch from './index.js';

// Create readline interface for better CLI experience
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('GPT Researcher - Node.js Version');
console.log('==================================\n');

// If query provided as argument, use it directly
const args = process.argv.slice(2);
if (args.length > 0) {
  const query = args.join(' ');
  try {
    await conductResearch(query);
  } catch (error) {
    console.error('Error during research:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
} else {
  // Otherwise, prompt user for input
  rl.question('Enter your research query: ', async (query) => {
    if (!query || query.trim().length === 0) {
      console.log('Please provide a research query.');
      rl.close();
      process.exit(1);
      return;
    }
    
    try {
      await conductResearch(query);
    } catch (error) {
      console.error('Error during research:', error.message);
      process.exit(1);
    } finally {
      rl.close();
    }
  });
}