#!/usr/bin/env node

import ResearchSkill from './skills/ResearchSkill.js';
import ReportGenerator from './skills/ReportGenerator.js';

async function conductResearch(query, options = {}) {
  console.log('GPT Researcher - Node.js Version');
  console.log('==================================\n');
  
  if (!query || query.trim().length === 0) {
    throw new Error('Research query is required');
  }
  
  const retrieverType = options.retriever || 'tavily';
  console.log(`Research query: ${query} (using ${retrieverType} retriever)\n`);
  
  try {
    // Initialize skills
    const researcher = new ResearchSkill(retrieverType);
    const reportGenerator = new ReportGenerator();
    
    // Conduct research
    console.log('🔍 Conducting research...');
    const researchResults = await researcher.conductResearch(query);
    
    // Display research results summary
    console.log('\n✅ Research completed. Found information on:');
    researchResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.question}`);
    });
    
    // Generate report
    console.log('\n📝 Generating report...');
    const report = await reportGenerator.writeReport(query, researchResults);
    
    // Display report
    console.log('\n📄 Research Report:');
    console.log('==================');
    console.log(report);
    
    // Save report to file
    console.log('\n💾 Saving report...');
    const filepath = await reportGenerator.saveReport(report, query);
    console.log(`\n✅ Report saved to: ${filepath}`);
    
    return { researchResults, report, filepath };
  } catch (error) {
    console.error('Error during research:', error.message);
    throw error;
  }
}

// Get query from command line arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  // Check if --retriever flag is provided
  let retriever = 'tavily';
  let queryArgs = args;
  
  const retrieverIndex = args.indexOf('--retriever');
  if (retrieverIndex !== -1 && args.length > retrieverIndex + 1) {
    retriever = args[retrieverIndex + 1];
    // Remove the --retriever flag and its value from the args
    queryArgs = args.filter((_, index) => 
      index !== retrieverIndex && index !== retrieverIndex + 1
    );
  }
  
  const query = queryArgs.join(' ');
  await conductResearch(query, { retriever });
}

export default conductResearch;