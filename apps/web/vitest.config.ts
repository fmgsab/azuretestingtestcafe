import react from '@vitejs/plugin-react';
import svgx from '@svgx/vite-plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), svgx()],

  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    coverage: {
      include: ['**/src/**'],
      all: true,
      reportOnFailure: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        ...configDefaults.exclude,
        '**/*.stories.*',
        '**/*.test.*',
        '**/*/types',
        '**/*/test',
        '**/*index.ts',
        '**/*types.ts',
        '**/*test.ts',
      ],
    },
    exclude: [...configDefaults.exclude],
  },
});
