class BaseRetriever {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.maxResults = 5;
  }

  /**
   * Search for results based on a query
   * @param {string} query - The search query
   * @returns {Promise<Array>} - Array of search results
   */
  async search(query) {
    throw new Error('Search method must be implemented by subclass');
  }

  /**
   * Scrape content from a URL
   * @param {string} url - The URL to scrape
   * @returns {Promise<string>} - The scraped content
   */
  async scrapeContent(url) {
    throw new Error('ScrapeContent method must be implemented by subclass');
  }

  /**
   * Fallback search method when primary search fails
   * @param {string} query - The search query
   * @returns {Promise<Array>} - Array of fallback search results
   */
  async fallbackSearch(query) {
    console.log(`${this.constructor.name}: Using fallback search for "${query}"`);
    
    // Return a mock result for now
    return [{
      url: 'https://example.com',
      title: `Search results for: ${query}`,
      content: `This is a placeholder result for the query: "${query}". In a full implementation, this would contain actual search results.`
    }];
  }
}

export default BaseRetriever;