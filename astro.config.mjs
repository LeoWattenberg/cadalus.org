// @ts-check
import { defineConfig } from 'astro/config';
import i18next from './src/i18n.ts';

// https://astro.build/config
export default defineConfig({
  integrations: [i18next],
});
