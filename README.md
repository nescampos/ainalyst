# GPT Researcher - Node.js Implementation

A simplified Node.js implementation of the GPT Researcher, a tool that conducts research using OpenAI and web search.

## Features

- Conducts research on any given topic
- Generates comprehensive reports with citations
- Uses OpenAI GPT models for intelligent research
- CLI interface for easy interaction
- Saves reports to markdown files
- Supports multiple search providers (Tavily, Exa)

## Prerequisites

- Node.js (v14 or higher)
- An OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gpt-researcher-node
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
     # For Tavily (optional)
     TAVILY_API_KEY=tvly-your-tavily-api-key-here
     # For Exa (optional)
     EXA_API_KEY=your-exa-api-key-here
     ```

## Usage

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

### Examples

```bash
npm start "What are the benefits of renewable energy?"
```

```bash
npm start "Explain quantum computing in simple terms"
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

## How It Works

1. **Research Planning**: The system analyzes your query and breaks it down into sub-questions
2. **Information Gathering**: For each sub-question, it searches the web for relevant information
3. **Content Synthesis**: It uses OpenAI to synthesize the information into coherent answers
4. **Report Generation**: Finally, it compiles all the findings into a comprehensive report

## Project Structure

```
src/
├── index.js          # Main entry point
├── cli.js            # CLI interface
├── retrievers/       # Web search functionality
│   ├── BaseRetriever.js     # Base retriever class
│   ├── TavilyRetriever.js   # Tavily search provider
│   └── ExaRetriever.js      # Exa search provider
├── skills/           # Research and report generation skills
└── utils/            # Utility functions and configuration
```

## Extending with New Retrievers

The application is designed to be easily extensible with new retrievers:

1. Create a new class that extends `BaseRetriever`
2. Implement the required `search` and `scrapeContent` methods
3. Add your retriever to the `createRetriever` method in `ResearchSkill.js`
4. Update the CLI and environment variable handling if needed

## Limitations

This is a simplified implementation with the following limitations compared to the full Python version:

- Uses basic web search approaches (Tavily or Exa)
- Single LLM provider (OpenAI only)
- No document processing capabilities
- No advanced features like deep research or multi-agent systems

## Troubleshooting

If you encounter the error "SyntaxError: The requested module 'cheerio' does not provide an export named 'default'", it means there's an issue with how Cheerio is imported. This has been fixed in the current implementation by using:

```javascript
import * as cheerio from 'cheerio';
```

Instead of:

```javascript
import cheerio from 'cheerio';
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.