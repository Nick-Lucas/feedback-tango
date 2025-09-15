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
    console.log(chalk.gray('\nAvailable commands:'))
    console.log(
      chalk.blue('  /analyze <projectId>') + ' - Analyze project feedback'
    )
    console.log(
      chalk.blue('  /suggest <featureId>') +
        ' - Get feature improvement suggestions'
    )
    console.log(chalk.blue('  /summary <projectId>') + ' - Get project summary')
    console.log(
      chalk.blue('  /recommendations <creator>') +
        ' - Get personalized recommendations'
    )
    console.log(
      chalk.gray('Or just chat naturally about your feedback management needs!')
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
      // Handle special commands
      if (input.startsWith('/')) {
        await this.handleCommand(input)
      } else {
        // Regular chat with streaming
        await this.handleStreamingChat(input)
      }
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

    for await (const chunk of stream.textStream) {
      process.stdout.write(chunk)
      fullText += chunk
    }

    // Handle tool calls and results
    const toolCalls = await stream.toolCalls
    const toolResults = await stream.toolResults

    if (toolCalls && toolCalls.length > 0) {
      console.log(chalk.gray('\n\n🔧 Using tools...'))

      if (toolResults && toolResults.length > 0) {
        console.log(chalk.gray('\n📊 Tool Results:'))
        toolResults.forEach((result: unknown, index: number) => {
          console.log(
            chalk.gray(`${index + 1}. ${JSON.stringify(result, null, 2)}`)
          )
        })
      }
    }

    // Add the complete response to conversation history
    this.agent.addAssistantMessage(fullText)
  }

  private async handleCommand(input: string): Promise<void> {
    const [command, ...args] = input.slice(1).split(' ')

    if (!command) {
      console.log(chalk.red('No command specified'))
      return
    }

    switch (command.toLowerCase()) {
      case 'analyze': {
        if (args.length === 0) {
          console.log(chalk.red('Usage: /analyze <projectId>'))
          return
        }
        const projectId = parseInt(args[0]!)
        if (isNaN(projectId)) {
          console.log(chalk.red('Project ID must be a number'))
          return
        }
        const analysis = await this.agent.analyzeProjectFeedback(projectId)
        console.log(chalk.blue.bold('AI: ') + analysis.text)
        break
      }

      case 'suggest': {
        if (args.length === 0) {
          console.log(chalk.red('Usage: /suggest <featureId>'))
          return
        }
        const featureId = parseInt(args[0]!)
        if (isNaN(featureId)) {
          console.log(chalk.red('Feature ID must be a number'))
          return
        }
        const suggestions =
          await this.agent.suggestFeatureImprovements(featureId)
        console.log(chalk.blue.bold('AI: ') + suggestions.text)
        break
      }

      case 'summary': {
        if (args.length === 0) {
          console.log(chalk.red('Usage: /summary <projectId>'))
          return
        }
        const summaryProjectId = parseInt(args[0]!)
        if (isNaN(summaryProjectId)) {
          console.log(chalk.red('Project ID must be a number'))
          return
        }
        const summary = await this.agent.createProjectSummary(summaryProjectId)
        console.log(chalk.blue.bold('AI: ') + summary.text)
        break
      }

      case 'recommendations': {
        if (args.length === 0) {
          console.log(chalk.red('Usage: /recommendations <creator>'))
          return
        }
        const creator = args.join(' ')
        const recommendations = await this.agent.recommendNextActions(creator)
        console.log(chalk.blue.bold('AI: ') + recommendations.text)
        break
      }

      default:
        console.log(chalk.red(`Unknown command: /${command}`))
        console.log(
          chalk.gray(
            'Available commands: /analyze, /suggest, /summary, /recommendations'
          )
        )
    }
  }

  private exit(): void {
    console.log(chalk.yellow('\n👋 Thanks for chatting! Goodbye!'))
    this.rl.close()
    process.exit(0)
  }
}

const cli = new ChatCLI()
cli.start()
