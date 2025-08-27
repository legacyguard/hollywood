import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Diagnostic Tests', () => {
  test('should load the application', async ({ page }) => {
    console.log('Starting diagnostic test...');

    // Setup Clerk testing token
    await setupClerkTestingToken({ page });

    // Set a shorter timeout for this test
    test.setTimeout(15000);

    // Try to navigate to the application
    console.log('Navigating to http://127.0.0.1:8080...');
    const response = await page.goto('http://127.0.0.1:8080', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    console.log('Response status:', response?.status());

    // Check if we got a response
    expect(response).toBeTruthy();
    expect(response?.status()).toBe(200);

    // Check if page has any content
    const title = await page.title();
    console.log('Page title:', title);
    expect(title).toBeTruthy();

    // Take a screenshot for debugging
    await page.screenshot({
      path: 'tests/screenshots/diagnostic-page-load.png',
      fullPage: true
    });

    // Check if there's any visible content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text length:', bodyText?.length);

    // Check for React root element
    const reactRoot = await page.locator('#root, [id="root"]').count();
    console.log('React root elements found:', reactRoot);

    // Check for Clerk elements
    const clerkElements = await page.locator('[class*="cl-"], [data-clerk]').count();
    console.log('Clerk elements found:', clerkElements);

    // Wait a bit for JavaScript to load
    await page.waitForTimeout(2000);

    // Check again for dynamic content
    const dynamicContent = await page.locator('div').count();
    console.log('Total div elements:', dynamicContent);

    console.log('Diagnostic test completed successfully');
  });

  test('should detect Clerk authentication', async ({ page }) => {
    console.log('Testing Clerk detection...');

    // Setup Clerk testing token
    await setupClerkTestingToken({ page });

    await page.goto('http://127.0.0.1:8080');

    // Wait for any Clerk elements to appear
    try {
      await page.waitForSelector('[class*="cl-"], [data-clerk]', {
        timeout: 5000
      });
      console.log('Clerk elements detected');
    } catch (e) {
      console.log('No Clerk elements found within 5 seconds');
    }

    // Check if Clerk is available on window
    const hasClerk = await page.evaluate(() => {
      return typeof (window as any).Clerk !== 'undefined';
    });

    console.log('Clerk available on window:', hasClerk);

    // Check for sign-in/sign-up buttons or forms
    const authButtons = await page.locator('button:has-text("Sign in"), button:has-text("Sign up"), a:has-text("Sign in"), a:has-text("Sign up")').count();
    console.log('Auth buttons found:', authButtons);

    // Check for input fields that might be part of auth
    const authInputs = await page.locator('input[type="email"], input[type="password"], input[name="email"], input[name="password"]').count();
    console.log('Auth input fields found:', authInputs);
  });
});
