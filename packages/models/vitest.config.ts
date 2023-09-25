import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],

  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles: ["../../packages/ui/src/test/setup.ts"],
    coverage: {
      include: ['**/src/**'],
      all: true,
      reportOnFailure: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        ...configDefaults.exclude,
        '**/*.stories.*',
        '**/*.table.*',
        '**/*.test.*',
        '**/*/types',
        '**/*/test',
        '**/*/*.d.ts',
        '**/*index.ts',
        '**/*types.ts',
        '**/*test.ts',
        '**/*schema.ts',
      ],
    },
    exclude: [...configDefaults.exclude],
  },
});
