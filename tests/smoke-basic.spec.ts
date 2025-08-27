import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should load the main page successfully', async ({ page }) => {
    // Check that page loads without errors
    await expect(page).toHaveTitle(/LegacyGuard/i);

    // Verify the page URL
    expect(page.url()).toContain('http://');

    // Check for main root element
    const rootElement = page.locator('#root');
    await expect(rootElement).toBeVisible();
  });

  test('should display main heading and CTA button', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check for main heading (adjust selector based on your actual content)
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Check for primary CTA button
    const ctaButton = page.locator('button, a').filter({
      hasText: /get started|sign up|sign in|start|begin|create/i
    }).first();

    // Verify CTA is visible
    await expect(ctaButton).toBeVisible({ timeout: 10000 });

    // Verify CTA is clickable
    await expect(ctaButton).toBeEnabled();
  });

  test('should have proper page structure', async ({ page }) => {
    // Check for header/navigation
    const header = page.locator('header, nav, [role="navigation"]').first();
    await expect(header).toBeVisible();

    // Check for main content area
    const main = page.locator('main, #root > div').first();
    await expect(main).toBeVisible();

    // Check that there's actual content (not blank page)
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('should handle CTA interaction', async ({ page }) => {
    // Wait for interactive elements
    await page.waitForLoadState('networkidle');

    // Find the primary CTA
    const ctaButton = page.locator('button, a').filter({
      hasText: /get started|sign up|sign in|start|begin|create/i
    }).first();

    // Check if CTA exists
    const ctaCount = await ctaButton.count();
    if (ctaCount > 0) {
      // Get initial URL
      const initialUrl = page.url();

      // Click the CTA
      await ctaButton.click();

      // Wait for navigation or modal
      await page.waitForTimeout(1000);

      // Check that something happened (URL change or modal opened)
      const newUrl = page.url();
      const modalVisible = await page.locator('[role="dialog"], .modal, [data-state="open"]').isVisible().catch(() => false);

      // Either URL changed or a modal opened
      const actionOccurred = newUrl !== initialUrl || modalVisible;
      expect(actionOccurred).toBeTruthy();
    } else {
      // If no CTA found, at least check page rendered
      const hasContent = await page.locator('body').evaluate(el => el.textContent?.length || 0);
      expect(hasContent).toBeGreaterThan(0);
    }
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate and wait
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for critical errors (ignoring some common dev warnings)
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('DevTools') &&
      !error.includes('[vite]') &&
      !error.includes('Download the React DevTools')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const mobileContent = page.locator('#root');
    await expect(mobileContent).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    const tabletContent = page.locator('#root');
    await expect(tabletContent).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const desktopContent = page.locator('#root');
    await expect(desktopContent).toBeVisible();
  });
});
