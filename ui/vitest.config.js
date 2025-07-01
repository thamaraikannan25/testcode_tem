import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/*.test.js', '**/*.spec.js'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**']
    }
  }
})