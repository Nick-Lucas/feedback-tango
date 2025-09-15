#!/usr/bin/env node

import chalk from 'chalk';
import { createInterface, Interface } from 'readline';

class ChatCLI {
  private rl: Interface;
  private isRunning: boolean;

  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('You: ')
    });
    
    this.isRunning = false;
  }

  start(): void {
    console.clear();
    console.log(chalk.bold.magenta('🤖 AI Chat CLI'));
    console.log(chalk.gray('='.repeat(50)));
    console.log(chalk.yellow('Welcome to the interactive AI chat!'));
    console.log(chalk.gray('Type your message and press Enter. Type "exit" or "quit" to leave.\n'));
    
    this.isRunning = true;
    this.rl.prompt();
    
    this.rl.on('line', (input: string) => {
      this.handleInput(input.trim());
    });
    
    this.rl.on('close', () => {
      this.exit();
    });
  }
  
  private handleInput(input: string): void {
    if (!input) {
      this.rl.prompt();
      return;
    }
    
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      this.exit();
      return;
    }
    
    console.log(chalk.blue.bold('AI: ') + chalk.green('received'));
    console.log();
    this.rl.prompt();
  }
  
  private exit(): void {
    console.log(chalk.yellow('\n👋 Thanks for chatting! Goodbye!'));
    this.rl.close();
    process.exit(0);
  }
}

const cli = new ChatCLI();
cli.start();