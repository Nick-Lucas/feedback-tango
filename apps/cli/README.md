# @feedback-thing/cli

Interactive AI-powered CLI for feedback management.

## Features

- **AI Chat Interface**: Natural language interaction with your feedback data
- **Database Tools Integration**: Full access to all feedback management operations
- **Special Commands**: Quick access to common analysis tasks
- **Real-time Responses**: Powered by Gemini 2.5 Flash Lite

## Installation

```bash
# Install globally
pnpm cli-install

# Or run locally
cd apps/cli
pnpm start
```

## Usage

### Starting the CLI

```bash
feedback
```

### Available Commands

#### Special Commands

- `/analyze <projectId>` - Analyze all feedback for a project
- `/suggest <featureId>` - Get improvement suggestions for a feature
- `/summary <projectId>` - Get comprehensive project summary
- `/recommendations <creator>` - Get personalized recommendations for a user

#### Natural Language Chat

You can also chat naturally with the AI:

```
You: Create a new project called "Mobile App" created by "john@example.com"
AI: I'll create that project for you...

You: Show me all projects
AI: Here are all the projects in your system...

You: What's the feedback like for project 1?
AI: Let me analyze the feedback for project 1...
```

### Example Session

```
🤖 Feedback AI Assistant
============================================================
Welcome to the interactive feedback management AI!
I can help you manage projects, features, and feedback.

Available commands:
  /analyze <projectId> - Analyze project feedback
  /suggest <featureId> - Get feature improvement suggestions
  /summary <projectId> - Get project summary
  /recommendations <creator> - Get personalized recommendations
Or just chat naturally about your feedback management needs!
Type "exit" or "quit" to leave.

You: Create a new project for our mobile application
AI: Thinking...
AI: I'd be happy to help you create a new project for your mobile application!

📊 Tool Results:
1. {
  "id": 1,
  "name": "Mobile Application",
  "createdBy": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}

You: /summary 1
AI: Here's a comprehensive summary of your Mobile Application project...

You: exit
👋 Thanks for chatting! Goodbye!
```

## Environment Variables

The CLI automatically loads environment variables from a `.env` file in your project root. Create a `.env` file with your Google API key:

```bash
# .env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Alternatively, you can set the environment variable directly:

```bash
export GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## Available AI Tools

The AI assistant has access to all database operations:

### Project Management

- Create, read, update, delete projects
- Get projects with feedback and features
- Filter projects by creator

### Feature Management

- Create, read, update, delete features
- Get features with feedback
- Filter features by project or creator

### Feedback Management

- Create, read, update, delete feedback
- Get feedback with project/feature context
- Filter feedback by project, feature, or creator

## Tips

1. **Be Specific**: The more context you provide, the better the AI can help
2. **Use Commands**: For common tasks, the special commands are faster
3. **Natural Language**: You can ask questions in plain English
4. **Tool Results**: The AI will show you the actual database results when tools are used

## Troubleshooting

- **"Command not found"**: Make sure you've installed the CLI globally with `pnpm cli-install`
- **API Errors**: Check that your `GOOGLE_GENERATIVE_AI_API_KEY` is set correctly
- **Database Errors**: Ensure your database is set up and migrations have been run
