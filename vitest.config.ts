// import { defineConfig } from 'vitest/config';
// import react from '@vitejs/plugin-react';
import path from 'path';

// Stub for build as vitest is missing from environment
const defineConfig = (config: any) => config;
const react = () => ({ name: 'react-stub' });

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/__tests__/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
