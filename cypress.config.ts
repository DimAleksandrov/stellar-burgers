import { defineConfig } from 'cypress';

require('dotenv').config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env = {
        ...process.env,
        ...config.env
      };
      return config;
    }
  }
});
