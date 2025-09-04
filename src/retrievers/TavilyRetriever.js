import { tavily } from '@tavily/core';
import * as cheerio from 'cheerio';
import { config } from '../utils/config.js';

class TavilyRetriever {
  constructor(apiKey) {
    this.apiKey = apiKey || config.tavily?.apiKey || process.env.TAVILY_API_KEY;
    this.maxResults = config.maxResults || 5;
    
    if (this.apiKey) {
      this.client = tavily({ apiKey: this.apiKey });
    }
  }

  async search(query) {
    if (!this.apiKey) {
      console.error('TavilyRetriever: TAVILY_API_KEY not found in environment variables');
      return this.fallbackSearch(query);
    }

    try {
      console.log(`TavilyRetriever: Searching for "${query}"`);
      
      const response = await this.client.search(query, {
        max_results: this.maxResults,
        include_answer: true,
        include_raw_content: false,
        include_images: false
      });

      // Process results to match our expected format
      const results = response.results || [];
      
      const formattedResults = results.map(result => ({
        url: result.url || '',
        title: result.title || 'Untitled',
        content: result.content || result.snippet || ''
      }));

      console.log(`TavilyRetriever: Found ${formattedResults.length} results`);
      return formattedResults;
    } catch (error) {
      console.error('TavilyRetriever: Error in search:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      return this.fallbackSearch(query);
    }
  }

  async fallbackSearch(query) {
    console.log(`TavilyRetriever: Using fallback search for "${query}"`);
    
    // Return a mock result for now
    return [{
      url: 'https://example.com',
      title: `Search results for: ${query}`,
      content: `This is a placeholder result for the query: "${query}". In a full implementation with Tavily, this would contain actual search results.`
    }];
  }

  async scrapeContent(url) {
    try {
      if (!url || !url.startsWith('http')) {
        return '';
      }

      // Try to use Tavily's extract function first
      if (this.client) {
        try {
          const extractResponse = await this.client.extract(url);
          if (extractResponse.content) {
            return extractResponse.content.replace(/\s+/g, ' ').trim().substring(0, 2000);
          }
        } catch (extractError) {
          console.warn(`TavilyRetriever: Could not extract content with Tavily for ${url}:`, extractError.message);
        }
      }

      // Fall back to manual scraping
      const response = await fetch(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove script and style elements
      $('script, style, nav, footer, header').remove();
      
      // Extract text content from main content areas
      const content = $('main, article, .content, #content, .post, .article').first().text() || 
                     $('body').text();
      
      // Clean up the text
      return content.replace(/\s+/g, ' ').trim().substring(0, 2000);
    } catch (error) {
      console.error(`TavilyRetriever: Error scraping ${url}:`, error.message);
      return '';
    }
  }
}

export default TavilyRetriever;