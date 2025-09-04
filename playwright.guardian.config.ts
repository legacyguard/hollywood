import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Guardian of Memories Journey testing
 * Optimized for the complete user flow as defined in product manual
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/working-guardian-journey.spec.ts',

  /* Run tests in files in parallel */
  fullyParallel: false, // Guardian journey needs to be sequential

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1, // Guardian journey is serial by design

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      'html',
      {
        outputFolder: 'playwright-report/guardian',
        open: 'never',
      },
    ],
    [
      'json',
      {
        outputFile: 'test-results/guardian-results.json',
      },
    ],
    ['list'],
  ],

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8080',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,

    /* Set timeouts */
    actionTimeout: 30000,
    navigationTimeout: 30000,

    /* Set viewport */
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium-guardian',
      use: {
        ...devices['Desktop Chrome'],
        // Additional Chromium-specific settings for Guardian testing
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'],
        },
      },
    },
  ],

  /* Global setup and teardown */
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: true, // Use existing server
    timeout: 120000,
    env: {
      NODE_ENV: 'test',
    },
  },

  /* Test timeout */
  timeout: 180000, // 3 minutes per test for Guardian journey

  /* Global timeout */
  globalTimeout: 30 * 60 * 1000, // 30 minutes total

  /* Expect timeout */
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },

  /* Output directories */
  outputDir: 'test-results/guardian',
});
