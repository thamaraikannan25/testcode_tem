import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**']
    }
  }
})