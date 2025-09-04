import Exa from 'exa-js';
import * as cheerio from 'cheerio';
import { config } from '../utils/config.js';
import BaseRetriever from './BaseRetriever.js';

class ExaRetriever extends BaseRetriever {
  constructor(apiKey) {
    super(apiKey || config.exa?.apiKey || process.env.EXA_API_KEY);
    this.maxResults = config.maxResults || "5";
    
    if (this.apiKey) {
      this.client = new Exa(this.apiKey);
    }
  }

  async search(query) {
    if (!this.apiKey) {
      console.error('ExaRetriever: EXA_API_KEY not found in environment variables');
      return this.fallbackSearch(query);
    }

    try {
      console.log(`ExaRetriever: Searching for "${query}"`);
      
      const response = await this.client.searchAndContents(query, {
        type: 'neural',
        useAutoprompt: true,
        numResults: parseInt(this.maxResults)
      });

      // Process results to match our expected format
      const results = response.results || [];
      
      const formattedResults = results.map(result => ({
        url: result.url || '',
        title: result.title || 'Untitled',
        content: result.text || result.snippet || ''
      }));

      console.log(`ExaRetriever: Found ${formattedResults.length} results`);
      return formattedResults;
    } catch (error) {
      console.error('ExaRetriever: Error in search:');
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
    return super.fallbackSearch(query);
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
      console.error(`ExaRetriever: Error scraping ${url}:`, error.message);
      return '';
    }
  }
}

export default ExaRetriever;