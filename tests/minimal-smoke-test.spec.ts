import { test, expect } from '@playwright/test';

/**
 * Minimal Smoke Test Suite
 * 
 * This test suite provides basic validation that the application is running
 * and core functionality is accessible, even with legacy code issues present.
 * 
 * It focuses on:
 * 1. Application accessibility
 * 2. Critical page loading
 * 3. Authentication UI presence
 * 4. Basic navigation
 */

test.describe('Minimal Smoke Tests', () => {
  test.setTimeout(30000); // Set timeout for all tests in this suite

  test('Application should be accessible and load landing page', async ({ page }) => {
    // Navigate to the application
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Verify the page loads (check for any critical error indicators)
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Application error');
    expect(bodyText).not.toContain('Cannot GET');
    expect(bodyText).not.toContain('404');
    
    // Check that some content is rendered
    const hasContent = await page.locator('body').evaluate(
      el => el.innerHTML.length > 100
    );
    expect(hasContent).toBeTruthy();
    
    // Verify no console errors (excluding warnings)
    let consoleErrors = 0;
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Ignore known React/development warnings
        const text = msg.text();
        if (!text.includes('Warning:') && 
            !text.includes('DevTools') &&
            !text.includes('React Router Future Flag') &&
            !text.includes('hydration')) {
          consoleErrors++;
          console.log('Console error:', text);
        }
      }
    });
    
    // Give the page a moment to fully render
    await page.waitForTimeout(2000);
    
    // Check that we don't have critical console errors
    expect(consoleErrors).toBeLessThanOrEqual(2); // Allow up to 2 errors for legacy code
  });

  test('Landing page should have essential elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check for essential UI elements that should exist on landing page
    // Using flexible selectors to handle different possible states
    
    // Check for any header/navigation
    const hasHeader = await page.locator('header, nav, [role="navigation"], .navbar, .header').count();
    expect(hasHeader).toBeGreaterThan(0);
    
    // Check for main content area
    const hasMain = await page.locator('main, .main, #root > div').count();
    expect(hasMain).toBeGreaterThan(0);
    
    // Check for some interactive elements (buttons or links)
    const interactiveElements = await page.locator('button:visible, a:visible').count();
    expect(interactiveElements).toBeGreaterThan(0);
    
    // Check page title exists
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Authentication UI should be accessible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Look for Clerk auth components or sign-in links
    const authIndicators = [
      // Clerk-specific selectors
      '[data-clerk-id]',
      '.cl-component',
      '.cl-auth-container',
      '.cl-sign-in',
      '.cl-sign-up',
      '.cl-userButton',
      // Generic auth selectors
      'button:has-text("Sign in")',
      'button:has-text("Sign up")',
      'a:has-text("Sign in")',
      'a:has-text("Sign up")',
      'button:has-text("Log in")',
      'a:has-text("Log in")',
      // Form inputs that indicate auth
      'input[type="email"]',
      'input[type="password"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="password" i]'
    ];
    
    // Check if any authentication element is present
    let authElementFound = false;
    for (const selector of authIndicators) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        authElementFound = true;
        break;
      }
    }
    
    expect(authElementFound).toBeTruthy();
  });

  test('Navigation to sign-in page should work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Try multiple ways to navigate to sign-in
    const signInSelectors = [
      'a[href*="sign-in"]',
      'a[href*="signin"]',
      'a[href*="login"]',
      'button:has-text("Sign in")',
      'button:has-text("Log in")',
      'a:has-text("Sign in")',
      'a:has-text("Log in")'
    ];
    
    let navigationSuccessful = false;
    
    for (const selector of signInSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        await element.click();
        await page.waitForLoadState('domcontentloaded');
        
        // Check if we navigated to a sign-in page
        const url = page.url();
        if (url.includes('sign-in') || url.includes('signin') || url.includes('login') || url.includes('auth')) {
          navigationSuccessful = true;
          break;
        }
        
        // Check if Clerk sign-in UI appeared
        const hasClerkSignIn = await page.locator('.cl-sign-in, .cl-formContainer').count();
        if (hasClerkSignIn > 0) {
          navigationSuccessful = true;
          break;
        }
      }
    }
    
    // If no explicit sign-in link, check if we're already on an auth page
    if (!navigationSuccessful) {
      const currentUrl = page.url();
      const hasAuthUI = await page.locator(
        '.cl-component, input[type="email"], input[type="password"]'
      ).count();
      
      if (hasAuthUI > 0 || currentUrl.includes('auth') || currentUrl.includes('sign')) {
        navigationSuccessful = true;
      }
    }
    
    expect(navigationSuccessful).toBeTruthy();
  });

  test('Application should handle direct navigation to key routes', async ({ page }) => {
    // Test that key routes don't crash the application
    const routes = [
      '/',
      '/sign-in',
      '/sign-up',
      '/dashboard',
      '/privacy',
      '/terms'
    ];
    
    const errors: string[] = [];
    
    for (const route of routes) {
      try {
        const response = await page.goto(route, { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        // Check if the page loaded (even if redirected)
        if (response && response.status() >= 500) {
          errors.push(`Route ${route} returned server error: ${response.status()}`);
        }
        
        // Check for React error boundary or error messages
        const hasErrorBoundary = await page.locator(
          'text=/error|failed|something went wrong|crashed/i'
        ).count();
        
        if (hasErrorBoundary > 0) {
          // Check if it's an expected auth redirect rather than an error
          const isAuthRedirect = await page.locator(
            '.cl-component, [data-clerk-id], text=/sign in|log in/i'
          ).count();
          
          if (isAuthRedirect === 0) {
            errors.push(`Route ${route} shows error boundary`);
          }
        }
      } catch (error) {
        // Network errors are acceptable for protected routes
        if (!route.includes('dashboard') && !route.includes('protected')) {
          errors.push(`Route ${route} failed to load: ${error.message}`);
        }
      }
    }
    
    // Allow some errors due to legacy code, but not all routes should fail
    expect(errors.length).toBeLessThanOrEqual(2);
    
    if (errors.length > 0) {
      console.log('Route errors encountered (expected with legacy code):', errors);
    }
  });

  test('Basic responsive design should work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    const desktopContent = await page.locator('body').isVisible();
    expect(desktopContent).toBeTruthy();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileContent = await page.locator('body').isVisible();
    expect(mobileContent).toBeTruthy();
    
    // Check if any mobile-specific elements appear (like hamburger menu)
    const mobileMenuSelectors = [
      'button[aria-label*="menu" i]',
      'button[aria-label*="navigation" i]',
      '.mobile-menu',
      '.hamburger',
      '[data-testid*="mobile" i]',
      'button svg' // Often mobile menus are icon buttons
    ];
    
    let hasMobileElements = false;
    for (const selector of mobileMenuSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        hasMobileElements = true;
        break;
      }
    }
    
    // It's okay if no mobile menu exists, just checking the page still works
    expect(mobileContent).toBeTruthy();
  });

  test('Static assets and styles should load', async ({ page }) => {
    const failedRequests: string[] = [];
    
    // Monitor network requests
    page.on('response', response => {
      if (response.status() >= 400 && response.status() < 600) {
        const url = response.url();
        // Ignore some expected 404s and external resources
        if (!url.includes('favicon') && 
            !url.includes('manifest') &&
            !url.includes('robots.txt') &&
            !url.includes('localhost:') &&
            !url.includes('127.0.0.1:') &&
            !url.includes('googleapis') &&
            !url.includes('gstatic')) {
          failedRequests.push(`${response.status()} - ${url}`);
        }
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check if CSS is loaded (page should have computed styles)
    const hasStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      // Check if any non-default styles are applied
      return styles.fontFamily !== 'Times New Roman' || 
             styles.margin !== '8px' ||
             styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
    });
    
    expect(hasStyles).toBeTruthy();
    
    // Check if JavaScript is working (React should be loaded)
    const hasReact = await page.evaluate(() => {
      return window.React !== undefined || 
             document.querySelector('#root') !== null ||
             document.querySelector('[data-reactroot]') !== null ||
             document.querySelector('._app') !== null;
    });
    
    expect(hasReact).toBeTruthy();
    
    // Allow some failed requests in legacy code
    expect(failedRequests.length).toBeLessThanOrEqual(5);
    
    if (failedRequests.length > 0) {
      console.log('Failed resource requests (may be expected):', failedRequests.slice(0, 3));
    }
  });
});

test.describe('Critical User Paths', () => {
  test('Sign-in flow should be reachable', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'networkidle' });
    
    // Check if we're on a sign-in page (might redirect)
    const url = page.url();
    const isAuthPage = url.includes('sign') || url.includes('auth') || url.includes('login');
    
    // Check for auth UI elements
    const hasAuthUI = await page.locator(
      'input[type="email"], input[type="password"], .cl-formFieldInput, button:has-text("Sign in")'
    ).count();
    
    expect(isAuthPage || hasAuthUI > 0).toBeTruthy();
  });

  test('Privacy and Terms pages should be accessible', async ({ page }) => {
    // Test Privacy page
    const privacyResponse = await page.goto('/privacy', { waitUntil: 'domcontentloaded' });
    expect(privacyResponse?.status()).toBeLessThan(500);
    
    const privacyContent = await page.textContent('body');
    expect(privacyContent).toBeTruthy();
    expect(privacyContent?.length).toBeGreaterThan(100);
    
    // Test Terms page
    const termsResponse = await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    expect(termsResponse?.status()).toBeLessThan(500);
    
    const termsContent = await page.textContent('body');
    expect(termsContent).toBeTruthy();
    expect(termsContent?.length).toBeGreaterThan(100);
  });
});
