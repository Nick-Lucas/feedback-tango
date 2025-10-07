# Feedback Tango

A work in progress AI-driven Feedback Manager, because product development is an ongoing dance with your users, and modern AI tools present an opportunity for processing more feedback than ever.

### Tango Provides

- An SDK you can install into any javascript project to collect feedback from your users
- A react widget to gather feedback from users
- A management app to explore and manage incoming feedback
- An MCP server you can use to manage feedback from your agent of choice, or from the provided CLI

### Core Principles

- Most actions should be taken automatically by an agent, such as organising feedback into feature hierarchies, and helping to accomplish many tasks from the UI
- Developers should be able to collect feedback from their users on UIs, CLIs, and Agents, using an SDK or MCP server
- This is not an issue tracker, it's a Product tool which lets you link requests into an issuer tracker when the time is right.

# Running locally

Prerequisites:

- docker compose
- nodejs 24+ (ideally via nvm)
- pnpm

```sh
pnpm install

pnpm dev
pnpm db:migrate

# That's it!

# To interact with the MCP Server a basic MCP Client is provided:
pnpm cli
```

- http://localhost:3002 - the management UI
- http://localhost:3000 - public API and Auth Server
- http://localhost:3001 - MCP Server
