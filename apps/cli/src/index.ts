#!/usr/bin/env node

import { config } from 'dotenv'
import chalk from 'chalk'
import { createInterface, Interface } from 'readline'
import { FeedbackAgent } from '@feedback-thing/agents'

config({ override: true, path: '../../.env' })

class ChatCLI {
  private rl: Interface
  private agent: FeedbackAgent

  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('You: '),
    })

    this.agent = new FeedbackAgent()
  }

  start(): void {
    console.clear()
    console.log(chalk.bold.magenta('🤖 Feedback AI Assistant'))
    console.log(chalk.gray('='.repeat(60)))
    console.log(
      chalk.yellow('Welcome to the interactive feedback management AI!')
    )
    console.log(
      chalk.gray('I can help you manage projects, features, and feedback.')
    )
    console.log(
      chalk.gray('Just chat naturally about your feedback management needs!')
    )
    console.log(chalk.gray('Type "clear" to reset conversation history.'))
    console.log(chalk.gray('Type "exit" or "quit" to leave.\n'))

    this.rl.prompt()

    this.rl.on('line', (input: string) => {
      void this.handleInput(input.trim())
    })

    this.rl.on('close', () => {
      this.exit()
    })
  }

  private async handleInput(input: string): Promise<void> {
    if (!input) {
      this.rl.prompt()
      return
    }

    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      this.exit()
      return
    }

    if (input.toLowerCase() === 'clear') {
      this.agent.clearConversation()
      console.log(chalk.yellow('Conversation history cleared.'))
      this.rl.prompt()
      return
    }

    try {
      await this.handleStreamingChat(input)
    } catch (error) {
      console.error(chalk.red('Error: ') + (error as Error).message)
    }

    console.log()
    this.rl.prompt()
  }

  private async handleStreamingChat(input: string): Promise<void> {
    const stream = this.agent.chatStream(input)

    process.stdout.write(chalk.blue.bold('AI: '))

    let fullText = ''

    // Stream the text response
    for await (const chunk of stream.textStream) {
      process.stdout.write(chunk)
      fullText += chunk
    }

    // After streaming text, handle tool calls and wait for execution
    try {
      const toolCalls = await stream.toolCalls

      if (toolCalls && toolCalls.length > 0) {
        console.log(chalk.gray(`Found ${toolCalls?.length || 0} tool calls`))

        for (const toolCall of toolCalls) {
          console.log(chalk.gray(`📞 Calling tool: ${toolCall.toolName}`))
          console.log(chalk.gray(`   Args: ${JSON.stringify(toolCall.input)}`))
        }
      }

      const toolResults = await stream.toolResults

      if (toolResults && toolResults.length > 0) {
        console.log(chalk.gray(`Got ${toolResults?.length || 0} tool results:`))

        toolResults.forEach((toolResult: unknown, index: number) => {
          // Check if this is an error result
          if (
            toolResult &&
            typeof toolResult === 'object' &&
            'error' in toolResult
          ) {
            const errorResult = toolResult as { error: string; stack?: string }
            console.log(
              chalk.red(`${index + 1}. ❌ Tool Error: ${errorResult.error}`)
            )
            if (errorResult.stack) {
              console.log(chalk.red(`   Stack: ${errorResult.stack}`))
            }
          } else if (toolResult instanceof Error) {
            console.log(
              chalk.red(`${index + 1}. ❌ Tool Error: ${toolResult.message}`)
            )
            if (toolResult.stack) {
              console.log(chalk.red(`   Stack: ${toolResult.stack}`))
            }
          } else {
            console.log(
              chalk.gray(
                `${index + 1}. ✅ ${JSON.stringify(toolResult, null, 2)}`
              )
            )
          }
        })
      }
    } catch (error) {
      console.log(
        chalk.red('\n❌ Tool execution failed: ') + (error as Error).message
      )
      console.log(chalk.red('Error details: ') + JSON.stringify(error, null, 2))
    }

    // Add the complete response to conversation history
    this.agent.addAssistantMessage(fullText)
  }

  private exit(): void {
    console.log(chalk.yellow('\n👋 Thanks for chatting! Goodbye!'))
    this.rl.close()
    process.exit(0)
  }
}

const cli = new ChatCLI()
cli.start()
