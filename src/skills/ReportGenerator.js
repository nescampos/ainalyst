import openai from '../utils/openai.js';
import { config } from '../utils/config.js';

class ReportGenerator {
  constructor() {
    this.model = config.openai.model || 'gpt-oss-20b';
  }

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
        model: this.model,
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
        max_tokens: config.maxTokens
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
    
    // Create a folder name from the query
    const folderName = query.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 50);
    const folderPath = path.join('outputs', folderName);
    
    // Create a filename
    const filename = `${folderName}.md`;
    const filepath = path.join(folderPath, filename);
    
    // Ensure outputs directory exists
    if (!fs.existsSync('outputs')) {
      fs.mkdirSync('outputs');
    }
    
    // Ensure the investigation folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    
    fs.writeFileSync(filepath, report);
    //console.log(`Report saved to: ${filepath}`);
    return filepath;
  }
}

export default ReportGenerator;