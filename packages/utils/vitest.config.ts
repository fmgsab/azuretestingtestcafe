import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],

  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportOnFailure: true,
      include: ['**/src/**'],
      exclude: [
        ...configDefaults.exclude,
        '**/*.stories.*',
        '**/*.table.*',
        '**/*.test.*',
        '**/*/types',
        '**/*/test',
        '**/*index.ts',
        '**/*d.ts',
        '**/*types.ts',
        '**/*test.ts',
        '**/*schema.ts',
      ],
    },
    exclude: [...configDefaults.exclude],
  },
});
