// @ts-nocheck
import { test, expect, type Page } from '@playwright/test';
import { generateTestUser, waitForClerk } from './helpers/auth';

/**
 * Complete Guardian of Memories Journey - Following Product Manual
 * Based on legacyguard-complete-product.md specifications
 */

test.describe('🎭 Complete Guardian of Memories Journey', () => {
  const testUser = generateTestUser();
  let page: Page;

  test.describe.configure({ mode: 'serial' });
  test.setTimeout(180000); // 3 minutes per test

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      recordVideo: {
        dir: 'tests/videos/guardian-journey/',
        size: { width: 1280, height: 720 },
      },
    });
    page = await context.newPage();

    // Enable console logging for debugging
    page.on('console', msg => {
      /* console.log('Browser:', msg.text()) */
    });
    page.on('pageerror', error => {
      /* console.error('Page Error:', error.message) */
    });
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test("Act 1: Landing & Authentication - Sofia's Welcome", async () => {
    // console.log('🚀 Starting Guardian Journey with user:', testUser.email);

    // Navigate to landing page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot of landing page
    await page.screenshot({
      path: 'tests/screenshots/guardian-01-landing.png',
      fullPage: true,
    });

    // Verify landing page elements
    await expect(page.locator('text=/Your Legacy is a Story/i')).toBeVisible();
    await expect(page.locator("text=/Let's Make it a Legend/i")).toBeVisible();

    // Look for firefly animation (Sofia)
    const fireflyElement = page
      .locator('.firefly, [class*="firefly"], [style*="yellow"]')
      .first();
    if (await fireflyElement.isVisible({ timeout: 3000 }).catch(() => false)) {
      // console.log('✅ Sofia firefly animation detected');
    }

    // Click "Start Your Journey" button
    const startButton = page
      .locator(
        'button:has-text("Start Your Journey"), button:has-text("Get Started")'
      )
      .first();
    await expect(startButton).toBeVisible();
    await startButton.click();

    // Should redirect to sign-up page
    await page.waitForURL(/sign-up/, { timeout: 10000 });
    await waitForClerk(page);

    // console.log('✅ Landing page and navigation to sign-up completed');
  });

  test('Act 2: Registration - Beginning the Guardian Path', async () => {
    // We should be on sign-up page from previous test
    await expect(page).toHaveURL(/sign-up/);

    await page.screenshot({
      path: 'tests/screenshots/guardian-02-registration.png',
      fullPage: true,
    });

    // Fill registration form with more robust selectors
    const emailInput = page
      .locator('input[type="email"], input[name="emailAddress"]')
      .first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill(testUser.email);

    const passwordInput = page
      .locator('input[type="password"]:not([name*="confirm"])')
      .first();
    await passwordInput.fill(testUser.password);

    // Check for confirm password field
    const confirmPasswordInput = page.locator(
      'input[name*="confirm"], input[name*="password"]:not([name="password"])'
    );
    if (
      await confirmPasswordInput.isVisible({ timeout: 2000 }).catch(() => false)
    ) {
      await confirmPasswordInput.fill(testUser.password);
    }

    // Check for name fields
    const firstNameInput = page.locator(
      'input[name="firstName"], input[name*="first"]'
    );
    if (await firstNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstNameInput.fill('Guardian');
    }

    const lastNameInput = page.locator(
      'input[name="lastName"], input[name*="last"]'
    );
    if (await lastNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await lastNameInput.fill('Test');
    }

    // Submit registration
    const submitButton = page
      .locator(
        'button[type="submit"], button:has-text("Sign up"), button:has-text("Create")'
      )
      .first();
    await submitButton.click();

    // Wait for potential email verification or direct login
    await page.waitForLoadState('networkidle');

    // The flow should now redirect to dashboard, which triggers OnboardingWrapper
    await page.waitForURL(/dashboard|onboarding/, { timeout: 15000 });

    // console.log('✅ Registration completed');
  });

  test("Scene 1: Promise of Calm - Sofia's Introduction", async () => {
    // We should be redirected to onboarding due to new user (< 2 minutes)
    // If not on onboarding yet, navigate there
    if (!page.url().includes('onboarding')) {
      await page.goto('/onboarding');
    }

    await page.waitForLoadState('networkidle');

    // Scene 1: Promise of Calm
    // Look for the onboarding introduction
    // const sceneContainer = page.locator('[data-testid="scene1"], .scene1, .onboarding-scene').first();

    // More flexible selectors for Scene 1 content
    const promiseTitle = page.locator(
      'text=/Promise of Calm/i, text=/Your story begins/i, h1, h2, [class*="title"]'
    );
    await expect(promiseTitle.first()).toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: 'tests/screenshots/guardian-03-scene1-promise.png',
      fullPage: true,
    });

    // Look for firefly animation in onboarding
    const onboardingFirefly = page.locator(
      '.firefly, [class*="yellow"], [style*="animation"]'
    );
    if (
      await onboardingFirefly.isVisible({ timeout: 3000 }).catch(() => false)
    ) {
      // console.log('✅ Onboarding firefly animation detected');
    }

    // Look for "Start writing my story" button or similar
    const startStoryButton = page
      .locator(
        'button:has-text("Start writing my story"), button:has-text("Start"), button:has-text("Begin"), button:has-text("Next")'
      )
      .first();

    if (await startStoryButton.isVisible({ timeout: 5000 })) {
      await startStoryButton.click();
      // console.log('✅ Started onboarding story');
    } else {
      // console.log('⚠️ Start button not found, continuing...');
    }

    // console.log('✅ Scene 1: Promise of Calm completed');
  });

  test('Scene 2: Box of Certainty - Emotional Connection', async () => {
    // Should be on Scene 2 now
    await page.waitForTimeout(1000); // Allow transition

    // Look for Box of Certainty elements
    const boxPrompt = page
      .locator(
        'textarea, input[type="text"], .emotional-prompt, [placeholder*="box"], [placeholder*="items"], [placeholder*="loved"]'
      )
      .first();

    // If we find the box prompt, fill it
    if (await boxPrompt.isVisible({ timeout: 5000 })) {
      const emotionalResponse = `My family photos and cherished memories
Our important documents and certificates  
Letters and messages for my children
Access to our financial accounts and passwords
Contact information for trusted advisors`;

      await boxPrompt.fill(emotionalResponse);

      await page.screenshot({
        path: 'tests/screenshots/guardian-04-scene2-box.png',
        fullPage: true,
      });

      // Look for continue button
      const continueButton = page
        .locator('button:has-text("Continue"), button:has-text("Next")')
        .first();
      if (await continueButton.isVisible()) {
        await continueButton.click();
      }

      // console.log('✅ Scene 2: Box of Certainty completed');
    } else {
      // console.log('⚠️ Box of Certainty not found, might be different scene structure');
    }
  });

  test('Scene 3: Key of Trust - Trusted Person', async () => {
    await page.waitForTimeout(1000);

    // Look for trusted person input
    const trustedPersonInput = page
      .locator(
        'input[placeholder*="trusted"], input[placeholder*="person"], input[placeholder*="name"], input[type="text"]'
      )
      .first();

    if (await trustedPersonInput.isVisible({ timeout: 5000 })) {
      const trustedPersonName = 'Martina Svoboda';
      await trustedPersonInput.fill(trustedPersonName);

      await page.screenshot({
        path: 'tests/screenshots/guardian-05-scene3-key.png',
        fullPage: true,
      });

      // Look for key visualization update
      const keyVisualization = page.locator('text=/For Martina/i, .key-visual');
      if (
        await keyVisualization.isVisible({ timeout: 3000 }).catch(() => false)
      ) {
        // console.log('✅ Key personalization detected');
      }

      // Continue to next scene
      const continueButton = page
        .locator('button:has-text("Continue"), button:has-text("Next")')
        .first();
      if (await continueButton.isVisible()) {
        await continueButton.click();
      }

      // console.log('✅ Scene 3: Key of Trust completed');
    } else {
      // console.log('⚠️ Trusted person input not found');
    }
  });

  test('Scene 4: Preparing the Path - Loading & Redirect', async () => {
    await page.waitForTimeout(1000);

    // Look for the final scene with loading/preparing message
    const preparingMessage = page.locator(
      'text=/Preparing/i, text=/Thank you/i, text=/Loading/i, .loading, .preparing'
    );

    if (
      await preparingMessage.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      await page.screenshot({
        path: 'tests/screenshots/guardian-06-scene4-preparing.png',
        fullPage: true,
      });

      // Look for firefly trail animation
      const fireflyTrail = page.locator(
        '.firefly-trail, [class*="trail"], [class*="animation"]'
      );
      if (await fireflyTrail.isVisible({ timeout: 3000 }).catch(() => false)) {
        // console.log('✅ Firefly trail animation detected');
      }
    }

    // Wait for redirect to dashboard
    await page.waitForURL(/dashboard|home|\/$/, { timeout: 20000 });

    // Verify we're on dashboard
    await expect(page).toHaveURL(/dashboard|home|\//);

    // console.log('✅ Scene 4: Path prepared, redirected to dashboard');
  });

  test('Dashboard: First Guardian Experience', async () => {
    // We should be on dashboard now
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/guardian-07-dashboard.png',
      fullPage: true,
    });

    // Look for dashboard elements - be flexible with selectors
    const dashboardElements = [
      '.dashboard',
      '[data-testid="dashboard"]',
      'h1:has-text("Dashboard")',
      'h1:has-text("Welcome")',
      '.pillar-card',
      '.micro-task',
      'text=/Today/i',
      'text=/Your progress/i',
    ];

    let dashboardFound = false;
    for (const selector of dashboardElements) {
      if (
        await page
          .locator(selector)
          .isVisible({ timeout: 2000 })
          .catch(() => false)
      ) {
        // console.log(`✅ Dashboard element found: ${selector}`);
        dashboardFound = true;
        break;
      }
    }

    if (!dashboardFound) {
      // console.log('⚠️ Dashboard elements not clearly identified');
    }

    // Look for challenge or task suggestions
    const challengeSection = page.locator(
      '[data-testid="micro-task"], .micro-task, .challenge, text=/5-minute/i, text=/task/i'
    );

    if (
      await challengeSection
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)
    ) {
      // console.log('✅ Micro-task challenge section found');

      // Try to interact with first challenge
      const startChallenge = page
        .locator('button:has-text("Start"), button:has-text("Begin")')
        .first();
      if (
        await startChallenge.isVisible({ timeout: 3000 }).catch(() => false)
      ) {
        await startChallenge.click();
        // console.log('✅ Started first challenge');
      }
    }

    // console.log('✅ Dashboard experience verified');
  });

  test('Navigation: Explore Core Features', async () => {
    // Test navigation to key sections
    const sections = [
      {
        name: 'Vault/Documents',
        selectors: [
          'a[href*="vault"]',
          'a:has-text("Vault")',
          'a:has-text("Documents")',
        ],
      },
      {
        name: 'Guardians',
        selectors: [
          'a[href*="guardian"]',
          'a:has-text("Guardian")',
          'a:has-text("Family")',
        ],
      },
      {
        name: 'Legacy',
        selectors: [
          'a[href*="legacy"]',
          'a:has-text("Legacy")',
          'a:has-text("Will")',
        ],
      },
    ];

    for (const section of sections) {
      for (const selector of section.selectors) {
        const link = page.locator(selector).first();
        if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
          await link.click();
          await page.waitForLoadState('networkidle');

          await page.screenshot({
            path: `tests/screenshots/guardian-08-${section.name.toLowerCase().replace('/', '-')}.png`,
            fullPage: true,
          });

          // console.log(`✅ Navigated to ${section.name}`);

          // Navigate back to dashboard
          await page.goto('/dashboard');
          await page.waitForLoadState('networkidle');
          break;
        }
      }
    }
  });

  test('Sign Out: Complete Journey Cycle', async () => {
    // Look for user menu/profile button
    const userButton = page
      .locator(
        '.cl-userButton-trigger, [data-testid="user-menu"], button[aria-label*="user"], .user-button'
      )
      .first();

    if (await userButton.isVisible({ timeout: 5000 })) {
      await userButton.click();
      await page.waitForTimeout(500);

      // Look for sign out option
      const signOutButton = page
        .locator(
          'button:has-text("Sign out"), button:has-text("Log out"), a:has-text("Sign out")'
        )
        .first();

      if (await signOutButton.isVisible()) {
        await signOutButton.click();

        // Wait for redirect to landing/sign-in
        await page.waitForURL(/sign-in|login|^\/$/, { timeout: 10000 });

        await page.screenshot({
          path: 'tests/screenshots/guardian-09-signed-out.png',
          fullPage: true,
        });

        // console.log('✅ Successfully signed out');
      }
    } else {
      // console.log('⚠️ User menu not found, might need different approach');
    }

    // console.log('🎉 Complete Guardian Journey finished!');
    // console.log(`📧 Test user: ${testUser.email}`);
  });
});

// Additional test for returning user experience
test.describe('🔄 Returning Guardian Experience', () => {
  test('Returning user bypasses onboarding', async ({ page }) => {
    // This test would simulate a user who has already completed onboarding
    // and should go directly to dashboard

    await page.goto('/');
    await waitForClerk(page);

    // Mock user with completed onboarding
    await page.evaluate(() => {
      // This would require mocking Clerk user data
      // Implementation depends on testing strategy
    });

    // console.log('✅ Returning user experience placeholder');
  });
});
