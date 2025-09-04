import { getJson } from 'serpapi';
import * as cheerio from 'cheerio';
import { config } from '../utils/config.js';

class SerpApiRetriever {
  constructor(apiKey) {
    this.apiKey = apiKey || config.serpapi.apiKey || process.env.SERPAPI_API_KEY;
    this.maxResults = config.maxResults || 5;
  }

  async search(query) {
    if (!this.apiKey) {
      console.error('SerpApiRetriever: SERPAPI_API_KEY not found in environment variables');
      return this.fallbackSearch(query);
    }

    try {
      console.log(`SerpApiRetriever: Searching for "${query}"`);
      console.log(`SerpApiRetriever: Using API Key: ${this.apiKey.substring(0, 5)}...`);
      
      const params = {
        engine: "google",
        api_key: this.apiKey,
        q: query,
        //num: this.maxResults,
      };
      
      console.log('SerpApiRetriever: Params being sent:', JSON.stringify(params, null, 2));
      
      const response = await getJson(params);
      
      console.log('SerpApiRetriever: Raw response:', JSON.stringify(response, null, 2));

      const results = response.organic_results || [];
      
      // Process results to match our expected format
      const formattedResults = results.map(result => ({
        url: result.link || '',
        title: result.title || 'Untitled',
        content: result.snippet || ''
      }));

      console.log(`SerpApiRetriever: Found ${formattedResults.length} results`);
      return formattedResults;
    } catch (error) {
      console.error('SerpApiRetriever: Error in search:');
      console.error("error", error);
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
    console.log(`SerpApiRetriever: Using fallback search for "${query}"`);
    
    // Return a mock result for now
    return [{
      url: 'https://example.com',
      title: `Search results for: ${query}`,
      content: `This is a placeholder result for the query: "${query}". In a full implementation with SerpApi, this would contain actual search results from Google.`
    }];
  }

  async scrapeContent(url) {
    try {
      if (!url || !url.startsWith('http')) {
        return '';
      }

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
      console.error(`SerpApiRetriever: Error scraping ${url}:`, error.message);
      return '';
    }
  }
}

export default SerpApiRetriever;