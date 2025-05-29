import {defineConfig} from 'vite';
import seedServ from './seed-plugin.js';

export default defineConfig(({mode}) => {
    const rootConfig = 'src';

    return {
        root: rootConfig,
        server: {
            port: 7000,
        },
        // css: cssConfig,
        // test: testConfig,
        build: {
            outDir: '../dist/frontend',
            emptyOutDir: true,
            target: 'esnext',
            lib: {
                name: 'frontend',
                entry: 'frontend/index.ts',
                formats: ['iife'],
                fileName: () => 'index.js',
            },
        },
        plugins: [seedServ()]
    };
});
