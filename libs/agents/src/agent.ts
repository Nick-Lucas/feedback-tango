import {
  stepCountIs,
  streamText,
  type ModelMessage,
  experimental_createMCPClient,
} from 'ai'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { google } from '@ai-sdk/google'
import { MemoryOAuthProvider } from './MemoryOAuthProvider.ts'
import type { OAuthClientProvider } from '@modelcontextprotocol/sdk/client/auth.js'

globalThis.AI_SDK_LOG_WARNINGS = false

export class FeedbackAgent {
  private model = google('gemini-2.5-flash-lite')
  private conversationHistory: ModelMessage[] = []

  private authProvider: OAuthClientProvider | null = null

  private mcpClientInstance: Awaited<
    ReturnType<typeof experimental_createMCPClient>
  > | null = null

  private async getMcpClient() {
    if (!this.authProvider) {
      this.authProvider = await MemoryOAuthProvider.createWithPreparedRedirect()
    }

    if (!this.mcpClientInstance) {
      const uri = new URL(
        '/mcp',
        process.env.MCP_URL ?? 'http://localhost:3001'
      )
      this.mcpClientInstance = await experimental_createMCPClient({
        transport: new StreamableHTTPClientTransport(uri, {
          authProvider: this.authProvider,
        }),
        onUncaughtError(error) {
          console.error('Uncaught MCP Client Error:', error)
        },
      })
    }
    return this.mcpClientInstance
  }

  async chatStream(prompt: string, _options?: { maxTokens?: number }) {
    const mcp = await this.getMcpClient()

    const userName = 'CLI User' // Replace with actual user name when available

    const history = this.conversationHistory

    history.push({
      role: 'user',
      content: prompt,
    })

    const result = streamText({
      model: this.model,
      system: `
        I am a product management AI assistant for managing user feedback, features, and projects.
      
        Your primary goal is to call your createFeedback tool, and work with the user to gather the necessary context to do so. 

        # Terminology

        - "Project" is an application or product, there should be very few of these. Never put feedback in here. Always search for an existing one and if none exists, create one without asking for permission
        - "Feature" is a specific functionality for a project. Never put feedback in here. Always search for an existing one and if none exists, create one without asking for permission and infer the name/description from context
        - "Feedback" is user comments, suggestions, or issues related to projects and features. User comments should be stored verbatim here and are linked to a project and feature.

        # Guidelines
        
        - Prefer calling more tools to gather context rather than fewer, try recalling search tools with different terms to find the best match
        - Never ask the user for an ID. If you need to reference an ID, use the relevant search tool to find it
        - Never ask for permission to call a tool, just do it
        - If something is ambiguous, ask the user for clarification and present the user with a suggestion to accept
        - ALWAYS summarise the output of your tool calls in your response to the user
        - When searching/naming things, think carefully about what the name should be. For instance a user saying "the invoices app" should never produce a project called "invoices app" but instead "invoices", or could even be referring to the "billing" app so you should check for similar names too

        # Tone

        - Respond in a direct and professional manner
        - Be concise and clear

        # Initial Context

        The user's name is: ${userName}
        The date today is: ${new Date().toLocaleDateString()} is it a ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}

        # Example Interactions

        - User: I have some feedback about the fizzbuzz app
        - You: 
          - [searchProjectsTool({ searchTerm: 'fizzbuzz' }) => [{ id: 123, name: 'FizzBuzz' }]] 
          - Great, what's the feedback?
        - User: The invoices screen doesn't work very well on mobile, it has layout issues
        - You: 
          - [searchFeaturesTool({ projectId: "abc-def", searchTerm: 'Invoices' }) => []] 
          - [searchFeaturesTool({ projectId: "abc-def", searchTerm: 'Invoice' }) => [{ id: "abc-789", name: 'Invoice Viewer' }]] 
          - [createFeedbackTool({ projectId: "abc-def", featureId: "abc-789", feedback: 'The invoices screen doesn't work very well on mobile, it has layout issues', createdBy: '${userName}' })] 
          - I've logged your feedback for the team, thank you for sending it in!

        - User: I have some feedback about the fizzbuzz app, the invoices screen doesn't work very well on mobile, it has layout issues
        - You: 
          - [searchProjectsTool({ searchTerm: 'fizzbuzz' }) => [{ id: 123, name: 'FizzBuzz' }]]   
          - [searchFeaturesTool({ projectId: "abc-def", searchTerm: 'Invoices' }) => []] 
          - [searchFeaturesTool({ projectId: "abc-def", searchTerm: 'Invoice' }) => []] 
          - [createFeatureTool({ projectId: "abc-def", name: 'Invoice Viewer', description: 'A feature to view and manage invoices', createdBy: '${userName}' }) => { id: "abc-789", name: 'Invoice Viewer' }]
          - [createFeedbackTool({ projectId: "abc-def", featureId: "abc-789", feedback: 'The invoices screen doesn't work very well on mobile, it has layout issues', createdBy: '${userName}' })] 
          - I've logged your feedback for the team, thank you for sending it in!
      `.trim(),
      messages: history,
      tools: (await mcp.tools()) as any, // TODO: 'any' to avoid a type portability issue caused by the ai-sdk
      stopWhen: stepCountIs(20),
      onFinish(finish) {
        history.push(...finish.response.messages)
      },
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
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
