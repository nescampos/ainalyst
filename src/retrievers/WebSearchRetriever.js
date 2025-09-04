import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from '../utils/config.js';

class WebSearchRetriever {
  constructor() {
    this.maxResults = config.maxResults;
  }

  async search(query) {
    try {
      // Using a simple approach with DuckDuckGo Instant Answer API
      // Note: This is a simplified approach and may not work for all queries
      // For production use, you'd want to use a proper search API like Tavily, SerpAPI, etc.
      const response = await axios.get(`https://api.duckduckgo.com/`, {
        params: {
          q: query,
          format: 'json',
          no_html: '1',
          skip_disambig: '1'
        }
      });

      const results = [];
      const data = response.data;

      // Process abstract
      if (data.AbstractText) {
        results.push({
          url: data.AbstractURL || '',
          title: data.Heading || query,
          content: data.AbstractText
        });
      }

      // Process related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, this.maxResults - 1)) {
          if (topic.Text) {
            results.push({
              url: topic.FirstURL || '',
              title: topic.FirstURL ? this.extractTitle(topic.FirstURL) : 'Unknown Source',
              content: topic.Text
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error in web search:', error.message);
      // Fallback to scraping a simple search result
      return await this.fallbackSearch(query);
    }
  }

  extractTitle(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Unknown Source';
    }
  }

  async fallbackSearch(query) {
    try {
      // Simple fallback using a search engine scraping approach
      // Note: This is a very basic implementation and may not work reliably
      console.log(`Fallback search for: ${query}`);
      
      // Return a mock result for now
      return [{
        url: 'https://example.com',
        title: `Search results for: ${query}`,
        content: `This is a placeholder result for the query: "${query}". In a full implementation, this would contain actual search results from the web.`
      }];
    } catch (error) {
      console.error('Fallback search also failed:', error.message);
      return [];
    }
  }

  async scrapeContent(url) {
    try {
      if (!url || !url.startsWith('http')) {
        return '';
      }

      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Remove script and style elements
      $('script, style, nav, footer, header').remove();
      
      // Extract text content from main content areas
      const content = $('main, article, .content, #content, .post, .article').first().text() || 
                     $('body').text();
      
      // Clean up the text
      return content.replace(/\s+/g, ' ').trim().substring(0, 2000);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
      return '';
    }
  }
}

export default WebSearchRetriever;