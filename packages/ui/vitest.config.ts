import react from '@vitejs/plugin-react';
import svgx from '@svgx/vite-plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), svgx()],

  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportOnFailure: true,
      include: ['**/src/**'],
      exclude: [
        ...configDefaults.exclude,
        '**/*.stories.*',
        '**/*.test.*',
        '**/*/types',
        '**/*/test',
        '**/*index.ts',
        '**/*.d.ts',
        '**/*types.ts',
        '**/*test.ts',
        'src/context',
      ],
    },
    exclude: [...configDefaults.exclude],
  },
});
