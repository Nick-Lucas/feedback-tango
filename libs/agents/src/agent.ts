import { generateText, generateObject } from 'ai'
import { z } from 'zod'
import { google } from '@ai-sdk/google'
import { databaseTools } from './tools.ts'

export class FeedbackAgent {
  private model = google('gemini-2.5-flash-lite')

  async chat(prompt: string, options?: { maxTokens?: number }) {
    const result = await generateText({
      model: this.model,
      prompt,
      tools: databaseTools,
      maxTokens: options?.maxTokens ?? 1000,
    })

    return {
      text: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
    }
  }

  async generateStructuredResponse<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: { maxTokens?: number }
  ) {
    const result = await generateObject({
      model: this.model,
      prompt,
      schema,
      maxTokens: options?.maxTokens ?? 1000,
    })

    return result.object
  }

  // Convenience methods for common operations
  async analyzeProjectFeedback(projectId: number) {
    const prompt = `Analyze all feedback for project ID ${projectId}. 
    First get the project details and all its feedback, then provide insights about:
    - Overall sentiment
    - Common themes
    - Actionable recommendations
    - Feature-specific feedback if applicable`

    return await this.chat(prompt)
  }

  async suggestFeatureImprovements(featureId: number) {
    const prompt = `Analyze feedback for feature ID ${featureId} and suggest specific improvements.
    Get the feature details and its feedback, then provide:
    - Summary of user concerns
    - Specific improvement suggestions
    - Priority level for each suggestion`

    return await this.chat(prompt)
  }

  async createProjectSummary(projectId: number) {
    const prompt = `Create a comprehensive summary for project ID ${projectId}.
    Get the project with all its features and feedback, then provide:
    - Project overview
    - Feature status summary
    - Key metrics (number of features, feedback count, average ratings)
    - Top user concerns and requests`

    return await this.chat(prompt)
  }

  async recommendNextActions(createdBy: string) {
    const prompt = `Based on all projects and feedback for user "${createdBy}", recommend next actions.
    Get all their projects and recent feedback, then suggest:
    - Which projects need immediate attention
    - Features that should be prioritized
    - New feature ideas based on user feedback patterns`

    return await this.chat(prompt)
  }
}
