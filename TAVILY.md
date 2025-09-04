## Tavily Retriever

This project now includes support for the Tavily search API, which provides high-quality search results optimized for AI applications.

### Setup

1. Get a Tavily API key from [tavily.com](https://tavily.com/)
2. Add it to your `.env` file:
   ```env
   TAVILY_API_KEY=tvly-your-tavily-api-key-here
   ```

### Features

- High-quality search results optimized for LLMs
- Content extraction capabilities
- Answer generation for direct question answering
- Image search capabilities

### Usage

The TavilyRetriever can be used in the same way as the SerpApiRetriever:

```javascript
import TavilyRetriever from './src/retrievers/TavilyRetriever.js';

const retriever = new TavilyRetriever();
const results = await retriever.search('Your query here');
```

For more information about Tavily's capabilities, check out the [official documentation](https://docs.tavily.com/).