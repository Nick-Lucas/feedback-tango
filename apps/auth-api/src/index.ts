import { config } from 'dotenv'

config({ override: true, path: '../../.env' })

// Only boot after config is loaded
await import('./api.ts')
