import { defineConfig } from 'astro/config';

export default defineConfig({
    base: '/popup',
    output: 'static',
    build: {
        format: 'file',
        inlineStylesheets: 'never',
    },
});
