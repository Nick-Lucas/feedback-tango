import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/client/index.ts'],
    outDir: './dist/client',
    platform: 'neutral',
    dts: true,
  },
  {
    entry: ['./src/react/index.tsx'],
    outDir: './dist/react',
    platform: 'neutral',
    dts: true,
    external: ['tailwindcss', 'tw-animate-css'],
  },
])
