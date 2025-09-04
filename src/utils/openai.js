import OpenAI from 'openai';
import { config } from './config.js';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  baseURL: config.openai.baseUrl
});

export default openai;