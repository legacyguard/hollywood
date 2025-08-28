import type { FullConfig } from '@playwright/test';
import { chromium } from '@playwright/test';

/**
 * Global setup for Guardian Journey tests
 * Prepares the test environment and ensures services are ready
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up Guardian Journey test environment...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');

    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:8080';

    // Try to reach the application
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });

    // Verify essential elements are present
    await page.waitForSelector('body', { timeout: 10000 });

    // Check if Clerk is loading properly
    await page.waitForFunction(() => {
      return document.readyState === 'complete';
    }, { timeout: 15000 });

    console.log('✅ Application is ready for testing');

    // Optional: Pre-warm any necessary services or caches
    // You could add API health checks here

  } catch (error) {
    console.error('❌ Failed to prepare test environment:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup complete');
}

export default globalSetup;
