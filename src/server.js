import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import ResearchSkill from './skills/ResearchSkill.js';
import ReportGenerator from './skills/ReportGenerator.js';
import PresentationGenerator from './skills/PresentationGenerator.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/outputs', express.static(path.join(__dirname,"..", 'outputs')));

// Store research jobs
const researchJobs = new Map();

// API Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/presentation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'presentation.html'));
});

app.get('/api/history', (req, res) => {
  try {
    const outputsDir = path.join(__dirname,"..", 'outputs');
    if (!fs.existsSync(outputsDir)) {
      return res.json([]);
    }
    
    const folders = fs.readdirSync(outputsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const folderPath = path.join(outputsDir, dirent.name);
        const stats = fs.statSync(folderPath);
        return {
          id: dirent.name,
          name: dirent.name.replace(/_/g, ' '),
          folderName: dirent.name,
          createdAt: stats.birthtime
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(folders);
  } catch (error) {
    console.error('Error reading history:', error);
    res.status(500).json({ error: 'Failed to read history' });
  }
});

app.get('/api/results/:folderName', (req, res) => {
  try {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname,"..", 'outputs', folderName);
    
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Research not found' });
    }
    
    // Find markdown file
    const files = fs.readdirSync(folderPath);
    const markdownFile = files.find(file => file.endsWith('.md'));
    const pptxFile = files.find(file => file.endsWith('.pptx'));
    
    if (!markdownFile) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const markdownPath = path.join(folderPath, markdownFile);
    const reportContent = fs.readFileSync(markdownPath, 'utf8');
    
    res.json({
      folderName,
      reportContent,
      hasPresentation: !!pptxFile,
      presentationPath: pptxFile ? `/outputs/${folderName}/${pptxFile}` : null,
      markdownPath: `/outputs/${folderName}/${markdownFile}`
    });
  } catch (error) {
    console.error('Error reading results:', error);
    res.status(500).json({ error: 'Failed to read results' });
  }
});

app.get('/api/download/markdown/:folderName', (req, res) => {
  try {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname,"..", 'outputs', folderName);
    
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Research not found' });
    }
    
    // Find markdown file
    const files = fs.readdirSync(folderPath);
    const markdownFile = files.find(file => file.endsWith('.md'));
    
    if (!markdownFile) {
      return res.status(404).json({ error: 'Markdown file not found' });
    }
    
    const markdownPath = path.join(folderPath, markdownFile);
    const fileName = `${folderName}.md`;
    
    res.download(markdownPath, fileName, (err) => {
      if (err) {
        console.error('Error downloading markdown file:', err);
        res.status(500).json({ error: 'Failed to download markdown file' });
      }
    });
  } catch (error) {
    console.error('Error downloading markdown:', error);
    res.status(500).json({ error: 'Failed to download markdown file' });
  }
});

app.post('/api/research', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Research query is required' });
    }
    
    // Generate a unique job ID
    const jobId = Date.now().toString();
    
    // Store job info
    researchJobs.set(jobId, {
      id: jobId,
      query,
      status: 'started',
      createdAt: new Date()
    });
    
    // Emit job started event
    io.emit('researchStarted', { jobId, query });
    
    // Start research in background
    processResearch(jobId, query);
    
    res.json({ jobId });
  } catch (error) {
    console.error('Error starting research:', error);
    res.status(500).json({ error: 'Failed to start research' });
  }
});

async function processResearch(jobId, query) {
  try {
    // Update job status
    researchJobs.set(jobId, {
      ...researchJobs.get(jobId),
      status: 'initializing'
    });
    
    io.emit('researchStatus', { jobId, status: 'initializing', message: '🚀 Initializing research process...' });
    
    // Wait a bit to show the initializing message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Initialize skills
    io.emit('researchStatus', { jobId, status: 'initializing', message: '🔧 Initializing research tools...' });
    const researcher = new ResearchSkill();
    const reportGenerator = new ReportGenerator();
    const presentationGenerator = new PresentationGenerator();
    
    // Wait a bit to show the initializing message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Planning research
    io.emit('researchStatus', { jobId, status: 'planning', message: '🧠 Planning research approach...' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Conduct research
    io.emit('researchStatus', { jobId, status: 'researching', message: '🔍 Conducting research...' });
    const researchResults = await researcher.conductResearch(query);
    
    // Display research results summary
    console.log('\n✅ Research completed. Found information on:');
    for (const [index, result] of researchResults.entries()) {
      console.log(`  ${index + 1}. ${result.question}`);
      // Emit progress for each sub-question
      io.emit('researchStatus', { 
        jobId, 
        status: 'researching', 
        message: `🔍 Researching: ${result.question}` 
      });
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Generate report
    io.emit('researchStatus', { jobId, status: 'generating', message: '📝 Generating comprehensive report...' });
    const report = await reportGenerator.writeReport(query, researchResults);
    
    // Save report to file
    io.emit('researchStatus', { jobId, status: 'saving', message: '💾 Saving research report...' });
    const reportFilepath = await reportGenerator.saveReport(report, query);
    
    // Generate presentation from markdown report
    io.emit('researchStatus', { jobId, status: 'presenting', message: '📊 Creating presentation slides...' });
    const presentationFilepath = await presentationGenerator.generatePresentationFromReport(query, report);
    
    // Extract folder name from filepath
    const folderName = path.basename(path.dirname(reportFilepath));
    
    // Update job status to completed
    researchJobs.set(jobId, {
      ...researchJobs.get(jobId),
      status: 'completed',
      folderName,
      completedAt: new Date()
    });
    
    // Emit completion event
    io.emit('researchCompleted', { 
      jobId, 
      folderName,
      message: 'Research completed successfully!' 
    });
    
    console.log(`\n✅ Report saved to: ${reportFilepath}`);
    console.log(`\n✅ Presentation saved to: ${presentationFilepath}`);
  } catch (error) {
    console.error('Error during research:', error.message);
    
    // Update job status to failed
    researchJobs.set(jobId, {
      ...researchJobs.get(jobId),
      status: 'failed',
      error: error.message,
      completedAt: new Date()
    });
    
    // Emit error event
    io.emit('researchFailed', { 
      jobId, 
      error: error.message,
      message: 'Research failed. Please try again.' 
    });
  }
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`GPT Researcher Web Server running on http://localhost:${PORT}`);
});