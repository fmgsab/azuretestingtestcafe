// vite-env.d.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgx from '@svgx/vite-plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgx()],

  define: {
    'import.meta.env.LOG_LEVEL_PROD': JSON.stringify(process.env.LOG_LEVEL_PROD),
    'import.meta.env.LOG_LEVEL_DEV': JSON.stringify(process.env.LOG_LEVEL_DEV),
    'import.meta.env.LOG_ENABLED': JSON.stringify(process.env.LOG_ENABLED),
  },
});
