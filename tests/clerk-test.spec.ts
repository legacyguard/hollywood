// @ts-nocheck
import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Clerk Testing Token Verification', () => {
  test('should bypass Clerk bot protection with testing token', async ({
    page,
  }) => {
    console.log('🔐 Testing Clerk with testing token...');

    // Setup the testing token for this page
    await setupClerkTestingToken({ page });

    // Navigate to the application
    await page.goto('/');

    // The testing token should allow us to bypass bot protection
    // and interact with Clerk components normally

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot for verification
    await page.screenshot({
      path: 'tests/screenshots/clerk-test-token.png',
      fullPage: true,
    });

    // Check if Clerk is loaded
    const clerkLoaded = await page.evaluate(() => {
      return typeof (window as Record<string, any>).Clerk !== 'undefined';
    });

    console.log('Clerk loaded:', clerkLoaded);
    expect(clerkLoaded).toBe(true);

    // Check for Clerk UI elements
    const clerkElements = await page.locator('[class*="cl-"]').count();
    console.log('Clerk UI elements found:', clerkElements);

    // The page should show authentication UI or redirect to authenticated content
    // depending on your app's configuration
    const url = page.url();
    console.log('Current URL:', url);

    // Check if we're on an auth page or the main app
    const isAuthPage = url.includes('sign-in') || url.includes('sign-up');
    const hasClerkAuth = clerkElements > 0;

    // Either we should see auth UI or be redirected to the app
    expect(isAuthPage || hasClerkAuth).toBe(true);

    console.log('✅ Clerk testing token is working!');
  });

  test('should allow interaction with Clerk sign-in form', async ({ page }) => {
    console.log('🔐 Testing Clerk sign-in form interaction...');

    // Setup the testing token
    await setupClerkTestingToken({ page });

    // Navigate to sign-in (adjust path if needed)
    await page.goto('/sign-in');

    // Wait for Clerk to render
    await page.waitForLoadState('networkidle');

    // Look for email input field
    const emailInput = page
      .locator(
        'input[type="email"], input[name="identifier"], input[name="emailAddress"]'
      )
      .first();

    if (await emailInput.isVisible({ timeout: 5000 })) {
      // We can interact with the form
      await emailInput.fill('test@example.com');
      console.log('✅ Successfully filled email field');

      // Take a screenshot
      await page.screenshot({
        path: 'tests/screenshots/clerk-signin-form.png',
        fullPage: true,
      });

      // Check if we can proceed (look for continue button)
      const continueButton = page
        .locator('button:has-text("Continue"), button[type="submit"]')
        .first();
      expect(await continueButton.isVisible()).toBe(true);
      console.log('✅ Sign-in form is interactive');
    } else {
      console.log(
        'ℹ️ No sign-in form visible - user might be already authenticated'
      );
    }
  });

  test('should verify testing token environment', async ({ page }) => {
    console.log('🔐 Verifying testing environment setup...');

    // Check if environment variables are set
    const hasPublishableKey = !!process.env.CLERK_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.CLERK_SECRET_KEY;

    console.log('Environment variables:');
    console.log(
      '- CLERK_PUBLISHABLE_KEY:',
      hasPublishableKey ? '✅ Set' : '❌ Missing'
    );
    console.log('- CLERK_SECRET_KEY:', hasSecretKey ? '✅ Set' : '❌ Missing');

    expect(hasPublishableKey).toBe(true);
    expect(hasSecretKey).toBe(true);

    // Setup testing token
    await setupClerkTestingToken({ page });

    // Navigate to the app
    await page.goto('/');

    // Check if testing token is present in the page
    const hasTestingToken = await page.evaluate(() => {
      // Check localStorage for testing token
      const token = localStorage.getItem('__clerk_testing_token');
      return !!token;
    });

    console.log(
      'Testing token in browser:',
      hasTestingToken ? '✅ Present' : '❌ Missing'
    );

    // The testing token should be injected by setupClerkTestingToken
    expect(hasTestingToken).toBe(true);

    console.log('✅ Testing environment is properly configured');
  });
});
