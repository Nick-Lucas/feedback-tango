/// <reference types="vite/client" />

// Client-side environment variables
interface ImportMetaEnv {
  readonly VITE_BETTER_AUTH_URL: string
  readonly VITE_SELF_FEEDBACK_ENDPOINT: string
  readonly VITE_SELF_FEEDBACK_PUBLIC_KEY?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly GOOGLE_GENERATIVE_AI_API_KEY: string
      readonly POSTGRES_URI: string
      readonly BETTER_AUTH_SECRET: string
      readonly BETTER_AUTH_URL: string
      readonly SOCIAL_GITHUB_CLIENT_ID: string
      readonly SOCIAL_GITHUB_CLIENT_SECRET: string
    }
  }
}

export {}
