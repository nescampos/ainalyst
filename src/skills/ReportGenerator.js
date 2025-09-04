import openai from '../utils/openai.js';
import { config } from '../utils/config.js';

class ReportGenerator {
  async writeReport(query, researchResults) {
    console.log(`Writing report for: ${query}`);
    
    try {
      // Format the research results for the report
      const formattedResults = researchResults.map(result => 
        `## ${result.question}

${result.answer}

${
          result.sources && result.sources.length > 0 
            ? `**Sources:**
${result.sources.map(s => `- [${s.title}](${s.url})`).join(`
`)}`
            : ''
        }`
      ).join(`

`);

      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert research report writer. Your task is to create a comprehensive, well-structured report based on the research findings. Organize the information logically, maintain a professional tone, and ensure proper citation of sources. The report should have an introduction, body sections for each sub-topic, and a conclusion.'
          },
          {
            role: 'user',
            content: `Write a comprehensive research report for the query: "${query}"

Research findings:
${formattedResults}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error writing report:', error.message);
      return `# Research Report: ${query}

Unable to generate report due to an error: ${error.message}

## Research Findings

${formattedResults}`;
    }
  }

  async saveReport(report, query) {
    // Simple function to save the report to a file
    const fs = await import('fs');
    const path = await import('path');
    
    // Create a filename from the query
    const filename = query.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 50) + '.md';
    const filepath = path.join('outputs', filename);
    
    // Ensure outputs directory exists
    if (!fs.existsSync('outputs')) {
      fs.mkdirSync('outputs');
    }
    
    fs.writeFileSync(filepath, report);
    console.log(`Report saved to: ${filepath}`);
    return filepath;
  }
}

export default ReportGenerator;