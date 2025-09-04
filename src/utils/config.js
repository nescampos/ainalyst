import dotenv from 'dotenv';
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_BASE_URL,
    model: process.env.OPENAI_MODEL || 'gpt-oss-20b',
  },
  maxResults: 5,
  maxSubtopics: 3,
  maxTokens: 2000,
};