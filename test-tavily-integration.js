// Integration test showing how to use TavilyRetriever in the application

import TavilyRetriever from './src/retrievers/TavilyRetriever.js';

async function integrationTest() {
  console.log('Running TavilyRetriever integration test...');
  
  // Initialize the retriever
  const retriever = new TavilyRetriever();
  
  // Perform a search
  const query = "latest developments in artificial intelligence 2025";
  console.log(`\nSearching for: "${query}"`);
  
  const searchResults = await retriever.search(query);
  console.log(`\nFound ${searchResults.length} results:`);
  
  // Display the results
  searchResults.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.title}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Content: ${result.content.substring(0, 100)}...`);
  });
  
  // Try to scrape content from the first result (if available and not fallback)
  if (searchResults.length > 0 && searchResults[0].url !== 'https://example.com') {
    console.log('\n--- Scraping content from first result ---');
    const scrapedContent = await retriever.scrapeContent(searchResults[0].url);
    console.log(`Scraped content preview: ${scrapedContent.substring(0, 200)}...`);
  }
  
  console.log('\n✅ Integration test completed!');
}

integrationTest();