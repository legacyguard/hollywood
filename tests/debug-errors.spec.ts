import { test, expect } from '@playwright/test';

test('Debug: Capture console errors and page content', async ({ page }) => {
  const consoleMessages: Array<{ type: string; text: string }> = [];

  // Listen to all console messages
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  // Listen to page errors
  page.on('pageerror', error => {
    consoleMessages.push({
      type: 'pageerror',
      text: error.message
    });
  });

  // Navigate to the page
  await page.goto('/', { waitUntil: 'networkidle' });

  // Wait a bit for any async operations
  await page.waitForTimeout(3000);

  // Get page content
  // const htmlContent = await page.content();
  const bodyContent = await page.locator('body').innerHTML();
  const rootContent = await page.locator('#root').innerHTML().catch(() => 'Root element not found or empty');

      // Print all console messages
    // console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => {
      // console.log(`[${msg.type}] ${msg.text}`);
    });

      // console.log('\n=== PAGE DETAILS ===');
    // console.log('URL:', page.url());
    // console.log('Title:', await page.title());
    // console.log('Body length:', bodyContent.length);
    // console.log('Root content length:', rootContent.length);

  if (rootContent.length < 50) {
    // console.log('Root HTML:', rootContent);
  }

  // Check for any error indicators
  const hasErrors = consoleMessages.some(msg =>
    msg.type === 'error' || msg.type === 'pageerror'
  );

  if (hasErrors) {
    // console.log('\n⚠️ ERRORS DETECTED IN CONSOLE');
  }

  // Take a screenshot for visual inspection
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
      // console.log('\n📸 Screenshot saved as debug-screenshot.png');

  // Try to find any visible text
  const visibleText = await page.locator('body').innerText().catch(() => '');
      // console.log('\n=== VISIBLE TEXT ===');
    // console.log(visibleText.substring(0, 500));

  // Force test to pass so we can see the output
  expect(true).toBe(true);
});
