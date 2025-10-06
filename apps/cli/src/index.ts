#!/usr/bin/env node

import chalk from 'chalk'
import { createInterface, Interface } from 'readline'
import { FeedbackAgent } from '@feedback-thing/agents'
// import { createAuthClient } from 'better-auth/client'

// const authClient = createAuthClient({
//   baseURL: 'http://localhost:3000/',
//   // baseURL: 'http://localhost:3000/api/auth',
// })

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

  async start(): Promise<void> {
    console.clear()
    console.log(chalk.bold.magenta('🤖 Feedback AI Assistant'))
    console.log(chalk.gray('='.repeat(60)))

    // const authCookie = await this.checkAuthentication()
    // console.log('Session cookie:', authCookie)

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
    const stream = await this.agent.chatStream(input)

    for await (const chunk of stream.fullStream) {
      switch (chunk.type) {
        case 'text-start':
          process.stdout.write(chalk.blue.bold('AI: '))
          break
        case 'text-delta':
          process.stdout.write(chunk.text)
          break
        case 'text-end':
          process.stdout.write('\n')
          break
        case 'reasoning-delta': {
          process.stdout.write(
            chalk.gray(
              `[Reasoning] ${chalk.italic(chunk.text.replace(/\n+/g, '\n'))}\n`
            )
          )
          break
        }
        case 'tool-result':
          process.stdout.write(
            chalk.gray(
              `[Tool Used: ${chalk.blue.bold(chunk.toolName)}] Input: ${JSON.stringify(
                chunk.input
              )} | Output: ${JSON.stringify(chunk.output)}\n`
            )
          )
          break
        case 'tool-error':
          process.stdout.write(
            chalk.red(
              `[Tool Error: ${chunk.toolName}] Input: ${JSON.stringify(
                chunk.input
              )} | Error: ${String(chunk.error)}\n`
            )
          )
          break
        case 'finish-step':
        case 'finish':
        case 'start':
        case 'start-step':
        case 'tool-input-start':
        case 'tool-input-delta':
        case 'tool-input-end':
        case 'tool-call':
        case 'reasoning-start':
        case 'reasoning-end':
          // Ignore these
          break
        default:
          process.stdout.write(
            chalk.gray(`\n[${chunk.type}] ${JSON.stringify(chunk)}\n`)
          )
          break
      }
    }

    const warnings = (await stream.warnings) ?? []
    for (const warning of warnings) {
      console.log(
        chalk.gray(
          `\n\n[Warning: ${warning.type} | Context: ${JSON.stringify(
            warning
          )}]\n`
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
void cli.start()
