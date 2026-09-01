import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Tests live in tests/ rather than beside the source so nothing test-shaped
// ends up inside src/app/, where Next scans for route files.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
      // Velite's generated output. `npm test` runs velite first so this
      // always exists — it is gitignored build output.
      '#site/content': path.resolve('.velite'),
    },
  },
});
