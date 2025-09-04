// Simple example to test the report generation functionality

import ReportGenerator from './src/skills/ReportGenerator.js';

async function testReportGeneration() {
  console.log('Testing report generation functionality...');
  
  try {
    const reportGenerator = new ReportGenerator();
    
    // Mock research results
    const mockResearchResults = [
      {
        question: 'What is Node.js?',
        answer: 'Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser. It allows developers to use JavaScript to write command-line tools and for server-side scripting.',
        sources: [
          { title: 'Node.js Official Website', url: 'https://nodejs.org' },
          { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Node.js' }
        ]
      },
      {
        question: 'What are the key features of Node.js?',
        answer: 'Key features of Node.js include asynchronous and event-driven architecture, fast code execution through the V8 engine, single-threaded but highly scalable design, and a rich ecosystem of packages through npm.',
        sources: [
          { title: 'Node.js Documentation', url: 'https://nodejs.org/en/docs' }
        ]
      }
    ];
    
    // Test generating report
    console.log('\n📝 Testing report generation...');
    const report = await reportGenerator.writeReport('What is Node.js?', mockResearchResults);
    console.log('Report generated successfully (first 200 characters):');
    console.log(report.substring(0, 200) + '...');
    
    // Test saving report
    console.log('\n💾 Testing report saving...');
    const filepath = await reportGenerator.saveReport(report, 'What is Node.js?');
    console.log(`Report saved to: ${filepath}`);
    
    console.log('\n✅ Report generation functionality test completed successfully!');
  } catch (error) {
    console.error('❌ Error in report generation functionality test:', error.message);
  }
}

testReportGeneration();