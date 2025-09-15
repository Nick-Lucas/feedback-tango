# @feedback-thing/agents

AI agents library for feedback management using Vercel AI SDK and Gemini 2.5 Flash Lite.

## Features

- **Database Tools**: Comprehensive set of tools that use the `@feedback-thing/core` access methods
- **Zod Validation**: All parameters are validated using Zod schemas
- **AI Agent**: Pre-configured agent with convenience methods for common operations
- **Type Safety**: Full TypeScript support with proper typing

## Installation

```bash
pnpm install @feedback-thing/agents
```

## Usage

### Basic Agent Usage

```typescript
import { FeedbackAgent } from '@feedback-thing/agents'

const agent = new FeedbackAgent()

// Chat with the agent using database tools
const response = await agent.chat(
  'Create a new project called "Mobile App" with description "iOS app" created by "user@example.com"'
)

console.log(response.text)
console.log(response.toolResults)
```

### Convenience Methods

```typescript
// Analyze project feedback
const analysis = await agent.analyzeProjectFeedback(1)

// Get feature improvement suggestions
const suggestions = await agent.suggestFeatureImprovements(1)

// Create project summary
const summary = await agent.createProjectSummary(1)

// Get personalized recommendations
const recommendations = await agent.recommendNextActions('user@example.com')
```

### Using Individual Tools

```typescript
import { createProjectTool, getAllProjectsTool } from '@feedback-thing/agents'

// Use tools individually with the AI SDK
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

const result = await generateText({
  model: google('gemini-2.5-flash-lite'),
  prompt: 'Create a new project for mobile development',
  tools: {
    createProject: createProjectTool,
    getAllProjects: getAllProjectsTool,
  },
})
```

### Structured Responses

```typescript
import { z } from 'zod'

const analysisSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  themes: z.array(z.string()),
  recommendations: z.array(z.string()),
})

const analysis = await agent.generateStructuredResponse(
  'Analyze the feedback for project 1',
  analysisSchema
)
```

## Available Tools

### Project Tools

- `createProject` - Create a new project
- `getAllProjects` - Get all projects
- `getProjectById` - Get project by ID
- `getProjectWithFeedback` - Get project with feedback and features
- `updateProject` - Update project
- `deleteProject` - Delete project
- `getProjectsByCreator` - Get projects by creator

### Feature Tools

- `createFeature` - Create a new feature
- `getAllFeatures` - Get all features
- `getFeatureById` - Get feature by ID
- `getFeatureWithFeedback` - Get feature with feedback
- `getFeaturesByProject` - Get features by project
- `updateFeature` - Update feature
- `deleteFeature` - Delete feature
- `getFeaturesByCreator` - Get features by creator

### Feedback Tools

- `createFeedback` - Create new feedback
- `getAllFeedback` - Get all feedback
- `getFeedbackById` - Get feedback by ID
- `getFeedbackWithProject` - Get feedback with project info
- `getFeedbackByProject` - Get feedback by project
- `getFeedbackByFeature` - Get feedback by feature
- `updateFeedback` - Update feedback
- `deleteFeedback` - Delete feedback
- `getFeedbackByCreator` - Get feedback by creator

## Environment Variables

Make sure to set up your Google API key:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## Schema Validation

All tools use Zod schemas for parameter validation:

```typescript
import {
  projectCreateSchema,
  featureCreateSchema,
  feedbackCreateSchema,
} from '@feedback-thing/agents'

// Example schemas
projectCreateSchema // { name: string, createdBy: string }
featureCreateSchema // { name: string, description: string, projectId: number, createdBy: string }
feedbackCreateSchema // { feedback: string, projectId: number, featureId: number, createdBy: string }
```
