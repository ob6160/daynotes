import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path, { dirname } from 'node:path';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  // Enable Preact to support Preact JSX components.
  integrations: [preact({ compat: false })],
  // Enable SSR on Vercel.
  output: 'server',
  adapter: vercel(),
  server: {
    port: 8861,
  },
  // Custom vite configuration.
  vite: {
    ssr: {
      noExternal: ['modern-css-reset'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
