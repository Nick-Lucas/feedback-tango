import { streamText, type CoreMessage } from 'ai'
import { google } from '@ai-sdk/google'
import { databaseTools } from './tools.ts'

export class FeedbackAgent {
  private model = google('gemini-2.5-flash-lite')
  private conversationHistory: CoreMessage[] = []

  chatStream(prompt: string, options?: { maxTokens?: number }) {
    const userName = 'CLI User' // Replace with actual user name when available

    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: prompt,
    })

    const result = streamText({
      model: this.model,
      system: `
        You are a product manager at a tech company. 
        Your job is to manage and analyze user feedback, issues, and suggestions for improvement. Provide insights and recommendations based on the feedback provided.

        You have tools available to help you search for existing feedback and link it to relevant products (projects) and features.

        The user's name is: ${userName}
        The date today is: ${new Date().toLocaleDateString()} is it a ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}
        
        Always respond in a direct and professional manner.

        Never ask the user for an ID. If you need to reference an ID, use the relevant search tool to find it based on the information the user has provided, or ask them for clarifications
      `,
      messages: this.conversationHistory,
      tools: databaseTools,
      maxOutputTokens: options?.maxTokens ?? 1000,
    })

    return result
  }

  addAssistantMessage(content: string) {
    // Add assistant response to conversation history after streaming is complete
    this.conversationHistory.push({
      role: 'assistant',
      content,
    })
  }

  clearConversation() {
    this.conversationHistory = []
  }
}
