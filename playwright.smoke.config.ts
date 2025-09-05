// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

/**
 * Minimal Playwright configuration for smoke tests
 * This config is designed to run basic tests without complex authentication setup
 */
export default defineConfig({
  testDir: './tests',

  /* Global setup - using minimal setup without Clerk */
  globalSetup: path.resolve(__dirname, './tests/global.setup.minimal.ts'),

  /* Run tests in files in parallel */
  fullyParallel: false, // Run serially for smoke tests

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,

  /* Opt out of parallel tests */
  workers: 1,

  /* Reporter to use */
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:8080',

    /* Collect trace when retrying the failed test */
    trace: 'retain-on-failure',

    /* Capture video on failure */
    video: 'retain-on-failure',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Maximum time each action can take */
    actionTimeout: 15000,

    /* Ignore HTTPS errors (for local dev) */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Disable GPU to avoid issues in CI
        launchOptions: {
          args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Global timeout for all tests */
  timeout: 60000,
});
