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

## Components

| Component                                                                         | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                    | Technology                                                                                    |
| --------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [**UI**](https://github.com/Nick-Lucas/feedback-tango/tree/main/apps/ui)          | App     | Management dashboard for exploring and managing feedback. Provides project management, feature hierarchy visualization, raw feedback ingestion, feedback-to-feature association, and sentiment analysis views.                                                                                                                                                                                 | React 19, TanStack Router/Query, Vite, Tailwind CSS, shadcn/ui, Better Auth<br>**Port:** 3002 |
| [**API**](https://github.com/Nick-Lucas/feedback-tango/tree/main/apps/api)        | App     | REST API server handling feedback submission, authentication, and validation. Provides endpoints for feedback collection and serves as the public-facing API.                                                                                                                                                                                                                                  | Hono.js, PostgreSQL, Drizzle ORM, Better Auth, Google SDK (AI Gemini)<br>**Port:** 3000       |
| [**MCP Server**](https://github.com/Nick-Lucas/feedback-tango/tree/main/apps/mcp) | App     | Model Context Protocol server enabling AI agents to interact with the feedback system. Provides OAuth authentication, session management, and streamable HTTP transport for MCP clients.                                                                                                                                                                                                       | Express.js, MCP SDK, OAuth integration<br>**Port:** 3001                                      |
| [**CLI**](https://github.com/Nick-Lucas/feedback-tango/tree/main/apps/cli)        | App     | Interactive command-line interface for feedback management. Provides natural language chat interface with the Feedback AI Agent for managing projects, features, and feedback from the terminal.                                                                                                                                                                                               | Node.js, Chalk, Readline, Better Auth, MCP SDK<br>**Command:** `pnpm cli` or `tango`          |
| [**Engine**](https://github.com/Nick-Lucas/feedback-tango/tree/main/apps/engine)  | App     | Background AI worker that processes raw feedback through multiple AI agents in a polling loop:<br>1. **Safety Check** - Content moderation and filtering<br>2. **Feedback Splitter** - Breaks down multi-topic feedback into separate items<br>3. **Sentiment Analysis** - Classifies feedback (positive/constructive/negative)<br>4. **Feature Associator** - Auto-links feedback to features | AI SDK (Google Gemini), Drizzle ORM, pgvector                                                 |
| [**Core**](https://github.com/Nick-Lucas/feedback-tango/tree/main/libs/core)      | Library | Centralized authorization and access control logic. Provides project-level, feature-level, and raw feedback permission checks used across all applications.                                                                                                                                                                                                                                    | TypeScript, Drizzle ORM                                                                       |
| [**Database**](https://github.com/Nick-Lucas/feedback-tango/tree/main/libs/db)    | Library | Database schema, migrations, and ORM configuration. Defines PostgreSQL schema with vector embeddings (halfvec/3072-dim) for semantic search, HNSW indexing, and Better Auth integration.                                                                                                                                                                                                       | Drizzle ORM, PostgreSQL, pgvector, Better Auth, Drizzle Kit                                   |
| [**Agents**](https://github.com/Nick-Lucas/feedback-tango/tree/main/libs/agents)  | Library | AI agent implementation and orchestration. Provides the `FeedbackAgent` class that powers conversational AI across CLI, API, and MCP server, with embedding generation and session management.                                                                                                                                                                                                 | AI SDK (Google Gemini), MCP SDK, Zod                                                          |
| [**SDK**](https://github.com/Nick-Lucas/feedback-tango/tree/main/libs/sdk)        | Library | Embeddable feedback collection widget for client applications. Provides both a headless JavaScript client and React component library with `FeedbackWidget` for collecting user feedback directly into Feedback Tango.                                                                                                                                                                         | React 19, TypeScript, Tailwind CSS, shadcn/ui, Zod                                            |

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
