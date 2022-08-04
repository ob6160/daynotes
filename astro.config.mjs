import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  // Enable Preact to support Preact JSX components.
  integrations: [preact()],
  // Enable SSR on Vercel.
  output: 'server',
  adapter: vercel(),
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
