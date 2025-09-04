# AInalyst - AI Research & Analysis Assistant

AInalyst is an advanced AI-powered research and analysis assistant that transforms complex queries into comprehensive reports and professional presentations. Built with Node.js and leveraging cutting-edge AI models (**gpt-oss-20b** and **gpt-oss-120b**), AInalyst automates the research process, saving hours of manual work while delivering high-quality, well-structured insights.

## 🌟 Key Features

- **Intelligent Research**: Automatically breaks down complex queries into sub-questions for thorough investigation
- **Multi-Source Information Gathering**: Utilizes multiple web search providers for comprehensive data collection
- **AI-Powered Analysis**: Employs advanced language models to synthesize information into coherent insights
- **Professional Report Generation**: Creates well-structured markdown reports with proper citations
- **Presentation Creation**: Automatically generates PowerPoint presentations from research findings
- **Dual Interface**: Command-line interface for quick tasks and web interface for interactive research
- **Research History**: Maintains a history of all research investigations for easy access
- **Export Options**: Download results in both markdown and PowerPoint formats

## 🚀 Use Cases

### Academic Research
- Literature reviews and topic exploration
- Thesis and dissertation support
- Academic paper drafting assistance

### Business Intelligence
- Market analysis and competitive research
- Industry trend identification
- SWOT analysis generation

### Content Creation
- Blog post and article research
- Social media content ideation
- Presentation material development

### Personal Learning
- Topic deep-dives and knowledge acquisition
- Study material organization
- Research skill development

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- An API key (for gpt-oss models).
- An OpenAI compatible Base URL (for gpt-oss models, by default is **https://router.huggingface.co/v1**).
- An OpenAI Model name (the default name is **openai/gpt-oss-20b**).
- Internet connection for web searches

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ainaylst
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your API keys:
   - Copy the `.env.example` file to `.env`
   - Add your API keys to the `.env` file:
     ```env
     OPENAI_API_KEY=sk-your-openai-api-key-here
     OPENAI_BASE_URL=your-openai-base-url-here
     OPENAI_MODEL=your-openai-model-here
     MAX_TOKENS=your-max-tokens-here (default is 5000)

     # For Tavily (optional)
     TAVILY_API_KEY=tvly-your-tavily-api-key-here
     # For Exa (optional)
     EXA_API_KEY=your-exa-api-key-here

     # Results size
     MAX_RESULTS=your-max-results-here (default is 5)
     ```

## ▶️ Usage

### CLI Mode

Run the application in interactive CLI mode:
```bash
npm run cli
```

Then enter your research query when prompted.

### Direct Query Mode

Run the application with a direct query:
```bash
npm start "Your research query here"
```

Or:
```bash
node src/index.js "Your research query here"
```

### Web Interface Mode

Run the web server:
```bash
npm run web
```

Then open your browser to http://localhost:3000

### Examples

```bash
npm start "What are the environmental impacts of electric vehicles compared to traditional cars?"
```

```bash
npm start "Analyze the key factors driving the growth of renewable energy adoption worldwide"
```

### Selecting a Retriever

You can select which retriever to use in several ways:

1. Set the RETRIEVER environment variable in your `.env` file:
   ```env
   RETRIEVER=exa
   ```

2. Use the --retriever flag when running the application:
   ```bash
   npm start -- --retriever exa "Your research query here"
   ```

3. When using the CLI mode, you'll be prompted to select a retriever.

Available retrievers:
- `tavily` (default)
- `exa`

## 🧠 How It Works

1. **Research Planning**: AInalyst analyzes your query and breaks it down into targeted sub-questions
2. **Information Gathering**: For each sub-question, it searches the web using multiple providers for relevant information
3. **Content Synthesis**: Advanced AI models synthesize the gathered information into coherent, well-structured answers
4. **Report Generation**: All findings are compiled into a comprehensive markdown report with proper citations
5. **Presentation Creation**: The markdown report is automatically converted into a professional PowerPoint presentation

## 📁 Project Structure

```
src/
├── index.js          # Main entry point
├── cli.js            # CLI interface
├── server.js         # Web server
├── public/           # Web interface files
│   ├── index.html    # Main HTML file
│   ├── styles.css    # Styles
│   └── script.js     # Client-side JavaScript
├── retrievers/       # Web search functionality
│   ├── BaseRetriever.js     # Base retriever class
│   ├── TavilyRetriever.js   # Tavily search provider
│   └── ExaRetriever.js      # Exa search provider
├── skills/           # Research and report generation skills
└── utils/            # Utility functions and configuration
```

## 🌐 Web Interface Features

The web interface provides a modern, ChatGPT-like experience with the following features:

1. **Chat-based Interaction**: Enter your research questions in a conversational interface
2. **Real-time Progress Updates**: See the status of your research as it progresses through different stages
3. **Research History**: Access previous research investigations from the sidebar
4. **Results Display**: View formatted research reports in the browser
5. **Presentation Mode**: View your research as an interactive slide presentation
6. **Download Options**: Download both markdown reports and PowerPoint presentations
7. **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API compatible key (required)
- `OPENAI_BASE_URL`: Your OpenAI API compatible base URL (required, by default is **https://router.huggingface.co/v1**)
- `OPENAI_MODEL`: Your OpenAI API compatible model name (required or default: **openai/gpt-oss-20b**)
- `MAX_TOKENS`: Max tokens (optional or default: 5000)
- `MAX_RESULTS`: Max results for web search (optional or default: 5)
- `TAVILY_API_KEY`: Your Tavily API key (optional, but recommended)
- `EXA_API_KEY`: Your Exa API key (optional)
- `RETRIEVER`: Default retriever to use (tavily or exa)
- `PORT`: Port for the web server (default: 3000)

### Customizing Output

You can customize the output by modifying the templates in the `skills` directory:
- `ReportGenerator.js`: Controls the structure and formatting of markdown reports
- `PresentationGenerator.js`: Controls the creation of PowerPoint presentations

## 📤 Output Formats

### Markdown Reports
Generated reports are saved as well-formatted markdown files with:
- Clear section headings
- Proper citation formatting
- Logical content organization
- Slide separators for presentation creation

### PowerPoint Presentations
Automatically generated presentations include:
- Professional slide layouts
- Proper content sizing and positioning
- Visual separation of topics
- Consistent styling throughout

## 🔄 Extending with New Retrievers

The application is designed to be easily extensible with new retrievers:

1. Create a new class that extends `BaseRetriever`
2. Implement the required `search` and `scrapeContent` methods
3. Add your retriever to the `createRetriever` method in `ResearchSkill.js`
4. Update the CLI and environment variable handling if needed

## ⚠️ Limitations

While AInalyst is powerful, it has some limitations:

- Research quality depends on the availability of relevant web content
- Generated content should be verified for accuracy, especially for critical applications
- API usage costs may accumulate with extensive use
- No offline functionality (requires internet connection)

## 🐛 Troubleshooting

**API Key Errors**: Ensure your API keys are correctly set in the `.env` file and have sufficient credits.

**Network Issues**: Verify your internet connection and firewall settings if research fails to complete.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests for:

- Bug fixes
- New features
- Performance improvements
- Documentation enhancements
- Additional retriever implementations

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

AInalyst builds upon the concepts and methodologies of AI research assistants, combining the power of large language models with efficient information retrieval systems to create a practical tool for researchers, students, and professionals.