// Example of how to use the GPT Researcher programmatically

import conductResearch from './src/index.js';

// Example research query
const query = "What are the latest advancements in artificial intelligence?";

// Conduct research
try {
  const results = await conductResearch(query);
  console.log('Research completed successfully!');
  console.log(`Report saved to: ${results.filepath}`);
} catch (error) {
  console.error('Research failed:', error.message);
}