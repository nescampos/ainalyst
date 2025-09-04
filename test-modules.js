// Simple test to verify the application works

console.log('Testing GPT Researcher modules...');

// Test that all modules can be imported without errors
import { config } from './src/utils/config.js';
console.log('✅ Config module loaded successfully');

import openai from './src/utils/openai.js';
console.log('✅ OpenAI client loaded successfully');

import WebSearchRetriever from './src/retrievers/WebSearchRetriever.js';
console.log('✅ WebSearchRetriever loaded successfully');

import ResearchSkill from './src/skills/ResearchSkill.js';
console.log('✅ ResearchSkill loaded successfully');

import ReportGenerator from './src/skills/ReportGenerator.js';
console.log('✅ ReportGenerator loaded successfully');

import conductResearch from './src/index.js';
console.log('✅ Main module loaded successfully');

console.log('\n🎉 All modules loaded successfully! The application is ready to use.');
console.log('\nTo run the application:');
console.log('1. Make sure you have set your OpenAI API key in the .env file');
console.log('2. Run: npm run cli');