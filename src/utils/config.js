import dotenv from 'dotenv';
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_BASE_URL,
    model: process.env.OPENAI_MODEL || 'gpt-oss-20b'
  },
  serpapi: {
    apiKey: process.env.SERPAPI_API_KEY,
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY,
  },
  exa: {
    apiKey: process.env.EXA_API_KEY,
  },
  maxResults: process.env.MAX_RESULTS || 5,
  maxTokens: process.env.MAX_TOKENS || 5000,
};