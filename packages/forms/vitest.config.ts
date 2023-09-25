import react from '@vitejs/plugin-react';
import svgx from '@svgx/vite-plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';


export default defineConfig({
  plugins: [react(), svgx()],

  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles: ['@fmg/ui/src/test/setup.ts'],
    coverage: {
      include: ['**src/**', '!src/types.ts'],
      reportOnFailure: true,
      all: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
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
        '**/Form*',
        '**/CommercialActivities*',
        '**/ClientProvideSumInsured*',
      ],
    },
    exclude: [...configDefaults.exclude],
  },
});
