// Simple example to test the research functionality

import ResearchSkill from './src/skills/ResearchSkill.js';

async function testResearch() {
  console.log('Testing research functionality...');
  
  try {
    const researcher = new ResearchSkill();
    
    // Test planning research
    console.log('\n🔍 Testing research planning...');
    const subQuestions = await researcher.planResearch('What is Node.js?');
    console.log('Sub-questions generated:', subQuestions);
    
    console.log('\n✅ Research functionality test completed successfully!');
  } catch (error) {
    console.error('❌ Error in research functionality test:', error.message);
  }
}

testResearch();