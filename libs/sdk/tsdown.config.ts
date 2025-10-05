import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'client/index': './src/client/index.ts',
    'react/index': './src/react/index.tsx',
  },
  outDir: './dist',
  platform: 'neutral',
  dts: true,
  external: ['tailwindcss', 'tw-animate-css'],
  ignoreWatch: [
    'dist',
    'node_modules',
    'test',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
})
