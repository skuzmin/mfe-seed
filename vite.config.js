import { defineConfig, loadEnv } from 'vite';
import playgroundServ from './playground-plugin.js';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'src', '');
  const rootConfig = 'src';

  const cssConfig = {
    preprocessorOptions: {
      scss: {
        additionalData: `
          $namespace: '${env.VITE_MFE_NAME}';
        `,
      },
    },
  };

  const testConfig = {
    globals: true,
    environment: 'jsdom',
    include: ['../test/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: '../coverage',
      all: true,
      exclude: ['**/*.d.ts', 'test/**', '**/node_modules/**'],
    },
  };

  return {
    root: rootConfig,
    cacheDir: '../node_modules/.vite',
    server: {
      port: 7000,
    },
    css: cssConfig,
    test: testConfig,
    build: {
      outDir: '../dist/frontend',
      emptyOutDir: true,
      target: 'esnext',
      lib: {
        name: 'frontend',
        entry: 'frontend/index.ts',
        formats: ['iife'],
        fileName: () => 'demo.js',
      },
    },
    plugins: [
      playgroundServ(),
      viteStaticCopy({
        targets: [
          {
            src: ['manifest.yaml'],
            dest: './',
          },
        ],
      }),
    ],
  };
});
