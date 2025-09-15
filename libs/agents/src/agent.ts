import {
  stepCountIs,
  streamText,
  type ModelMessage,
  type ToolResultPart,
} from 'ai'
import { google } from '@ai-sdk/google'
import { databaseTools } from './tools.ts'

export class FeedbackAgent {
  private model = google('gemini-2.5-flash-lite')
  private conversationHistory: ModelMessage[] = []

  chatStream(prompt: string, _options?: { maxTokens?: number }) {
    const userName = 'CLI User' // Replace with actual user name when available

    const history = this.conversationHistory
    // Add user message to conversation history
    history.push({
      role: 'user',
      content: prompt,
    })

    const result = streamText({
      model: this.model,
      system: `
        You are a product manager at a tech company. 
        Your job is to manage and analyze user feedback, issues, and suggestions for improvement, then track feedback against product features and projects.

        # Definitions

        - A "Project" is a high-level initiative or product that encompasses multiple features and feedback items. Never put feedback in here, it describes the application only.
        - A "Feature" is a specific existing or non-existing functionality within a project. Never put feedback in here, it describes the feature only.
        - "Feedback" is user comments, suggestions, or issues related to projects and features. User comments should be stored verbatim here.

        # Guidelines
        
        - You have tools available to help you search for existing projects and features
        - Never ask the user for an ID. If you need to reference an ID, use the relevant search tool to find it
        - You can create new projects, features, and feedback entries as needed without asking for permission
        - If something is ambiguous, ask the user for clarification and ideally present them with options.
        - ALWAYS summarise the output of your tool calls in your response to the user

        # Tone

        - Always respond in a direct and professional manner.
        - Be concise and clear.

        # Minor Context

        The user's name is: ${userName}
        The date today is: ${new Date().toLocaleDateString()} is it a ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}
      `,
      messages: this.conversationHistory,
      tools: databaseTools,
      // maxOutputTokens: options?.maxTokens ?? 10000,
      stopWhen: stepCountIs(20),
      onStepFinish(step) {
        // Add tool results into context
        if (step.toolResults.length > 0) {
          console.log(
            ` -- Tool calls: ${JSON.stringify(
              step.toolResults.map((t) => {
                return {
                  toolName: t.toolName,
                  input: t.input,
                  output: t.output,
                }
              }),
              null,
              2
            )}`
          )
          history.push({
            role: 'tool',
            content: step.toolResults.map<ToolResultPart>((r) => {
              return {
                type: 'tool-result',
                toolName: r.toolName,
                toolCallId: r.toolCallId,
                output: { type: 'json', value: JSON.stringify(r.output) },
              }
            }),
          })
        }

        console.log(` -- Step finished`) //, JSON.stringify(step, null, 2))
      },
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
