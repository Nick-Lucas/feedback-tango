import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'client/index': './src/client/index.ts',
    'react/index': './src/react/index.tsx',
  },
  outDir: './dist',
  platform: 'neutral',
  format: ['esm'],
  dts: true,
  ignoreWatch: [
    'dist',
    'node_modules',
    'test',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
})
