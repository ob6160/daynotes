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
  integrations: [preact({ compat: true })],
  // Enable SSR on Vercel.
  output: 'server',
  adapter: vercel(),
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
