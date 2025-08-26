import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, '.env.test') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.local') });
}

// Map VITE_ prefixed variables to standard Clerk variables for testing
process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY;
process.env.CLERK_SECRET_KEY = process.env.VITE_CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY;

/**
 * Playwright configuration specifically for the full user journey tests
 * with extended timeouts and comprehensive recording
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/full-user-journey.spec.ts',
  /* Global setup file */
  globalSetup: path.resolve(__dirname, './tests/global.setup.ts'),

  /* Run tests in serial mode for journey tests */
  fullyParallel: false,
  workers: 1,

  /* Longer timeouts for complete journey */
  timeout: 180000, // 3 minutes per test
  expect: {
    timeout: 15000 // 15 seconds for assertions
  },

  /* Reporter configuration */
  reporter: [
    ['html', { outputFolder: 'playwright-report/journey' }],
    ['json', { outputFile: 'test-results/journey-results.json' }],
    ['list'],
    ['junit', { outputFile: 'test-results/journey-junit.xml' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions */
    baseURL: process.env.BASE_URL || 'http://localhost:8080',

    /* Collect comprehensive traces for debugging */
    trace: 'on',

    /* Capture video for all tests */
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 }
    },

    /* Screenshot on every action */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },

    /* Viewport size */
    viewport: { width: 1280, height: 720 },

    /* Additional headers for API mocking if needed */
    extraHTTPHeaders: {
      'X-E2E-Test': 'journey',
      'X-Test-User': 'guardian-journey'
    },

    /* Action timeout */
    actionTimeout: 10000,

    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium-journey',
      use: {
        ...devices['Desktop Chrome'],
        // Store artifacts in specific folder
        storageState: 'tests/.auth/journey-user.json',
      },
    },

    // Optional: Test on different viewport sizes
    {
      name: 'mobile-journey',
      use: {
        ...devices['iPhone 13'],
        // Mobile specific settings
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Additional folders to preserve */
  preserveOutput: 'always',

  /* Output folder for test artifacts */
  outputDir: './test-results/journey',
});
