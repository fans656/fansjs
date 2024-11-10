import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 8,
  globalSetup: './playwright.setup.js',
});
