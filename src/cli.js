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
  // Check if --retriever flag is provided
  let retriever = process.env.RETRIEVER || 'tavily';
  let queryArgs = args;
  
  const retrieverIndex = args.indexOf('--retriever');
  if (retrieverIndex !== -1 && args.length > retrieverIndex + 1) {
    retriever = args[retrieverIndex + 1];
    // Remove the --retriever flag and its value from the args
    queryArgs = args.filter((_, index) => 
      index !== retrieverIndex && index !== retrieverIndex + 1
    );
  }
  
  const query = queryArgs.join(' ');
  
  if (!query || query.trim().length === 0) {
    console.log('Please provide a research query.');
    rl.close();
    process.exit(1);
  }
  
  try {
    await conductResearch(query, { retriever });
  } catch (error) {
    console.error('Error during research:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
} else {
  // Otherwise, prompt user for input
  console.log('Available retrievers: tavily, exa');
  rl.question('Select retriever (default: tavily): ', (retrieverInput) => {
    const retriever = retrieverInput && retrieverInput.trim() !== '' ? retrieverInput.trim() : 'tavily';
    
    rl.question('Enter your research query: ', async (query) => {
      if (!query || query.trim().length === 0) {
        console.log('Please provide a research query.');
        rl.close();
        process.exit(1);
      }
      
      try {
        await conductResearch(query, { retriever });
      } catch (error) {
        console.error('Error during research:', error.message);
        process.exit(1);
      } finally {
        rl.close();
      }
    });
  });
}