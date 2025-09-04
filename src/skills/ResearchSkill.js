import openai from '../utils/openai.js';
import WebSearchRetriever from '../retrievers/WebSearchRetriever.js';
import { config } from '../utils/config.js';

class ResearchSkill {
  constructor() {
    this.retriever = new WebSearchRetriever();
  }

  async planResearch(query) {
    console.log(`Planning research for: ${query}`);
    
    try {
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that helps plan research tasks. Given a research query, generate 3-5 specific sub-questions that would help answer the main query comprehensively. Return ONLY a JSON array of strings, with no additional text or formatting.'
          },
          {
            role: 'user',
            content: `Generate sub-questions for this research query: "${query}"`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      console.log('Raw response:', response);
      
      // Try to parse the response as JSON
      let subQuestions;
      try {
        subQuestions = JSON.parse(response);
        // If it's an object with a sub_questions or subQuestions property, extract it
        if (typeof subQuestions === 'object' && subQuestions !== null) {
          if (Array.isArray(subQuestions.sub_questions)) {
            subQuestions = subQuestions.sub_questions;
          } else if (Array.isArray(subQuestions.subQuestions)) {
            subQuestions = subQuestions.subQuestions;
          } else if (Array.isArray(subQuestions)) {
            // Already an array, keep as is
          } else {
            // If it's an object but not in expected format, use the original query
            subQuestions = [query];
          }
        } else if (!Array.isArray(subQuestions)) {
          // If it's not an array, use the original query
          subQuestions = [query];
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError.message);
        // Fallback to using the original query
        subQuestions = [query];
      }
      
      console.log('Research plan:', subQuestions);
      return Array.isArray(subQuestions) ? subQuestions : [query];
    } catch (error) {
      console.error('Error planning research:', error.message);
      // Fallback to using the original query
      return [query];
    }
  }

  async researchSubQuestion(subQuestion) {
    console.log(`Researching sub-question: ${subQuestion}`);
    
    try {
      // Get search results
      const searchResults = await this.retriever.search(subQuestion);
      
      if (!searchResults || searchResults.length === 0) {
        console.log('No search results found');
        return {
          question: subQuestion,
          answer: 'No relevant information found for this sub-question.',
          sources: []
        };
      }

      // For each result, try to get more detailed content
      const detailedResults = [];
      for (const result of searchResults.slice(0, 3)) {
        if (result.url) {
          const content = await this.retriever.scrapeContent(result.url);
          detailedResults.push({
            ...result,
            detailedContent: content || result.content
          });
        } else {
          detailedResults.push(result);
        }
      }

      // Use OpenAI to synthesize the information
      const context = detailedResults.map(r => 
        `Source: ${r.title}
Content: ${r.detailedContent || r.content}`
      ).join('\n\n');

      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that synthesizes information from multiple sources to answer questions. Provide a comprehensive answer based on the sources provided, and cite your sources.'
          },
          {
            role: 'user',
            content: `Answer this question using the provided sources:

Question: ${subQuestion}

Sources:
${context}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const answer = completion.choices[0].message.content;
      
      return {
        question: subQuestion,
        answer: answer,
        sources: detailedResults.map(r => ({
          title: r.title,
          url: r.url
        }))
      };
    } catch (error) {
      console.error(`Error researching sub-question "${subQuestion}":`, error.message);
      return {
        question: subQuestion,
        answer: `Error researching this sub-question: ${error.message}`,
        sources: []
      };
    }
  }

  async conductResearch(query) {
    console.log(`Starting research for: ${query}`);
    
    // Plan the research
    const subQuestions = await this.planResearch(query);
    
    // Research each sub-question
    const researchResults = [];
    for (const subQuestion of subQuestions) {
      const result = await this.researchSubQuestion(subQuestion);
      researchResults.push(result);
    }
    
    return researchResults;
  }
}

export default ResearchSkill;