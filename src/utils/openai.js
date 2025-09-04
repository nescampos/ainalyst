import OpenAI from 'openai';
import { config } from './config.js';

const openaiConfig = {
  apiKey: config.openai.apiKey,
};

if (config.openai.baseUrl) {
  openaiConfig.baseURL = config.openai.baseUrl;
}

const openai = new OpenAI(openaiConfig);

export default openai;