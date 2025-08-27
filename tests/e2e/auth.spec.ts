import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display sign in page', async ({ page }) => {
    await expect(page).toHaveTitle(/LegacyGuard/);
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should allow user to sign in with email and password', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should allow user to sign up', async ({ page }) => {
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/.*\/sign-up/);
    
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should allow user to sign out', async ({ page }) => {
    // First sign in
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Then sign out
    await page.click('button[aria-label="User menu"]');
    await page.click('text=Sign out');
    
    await expect(page).toHaveURL(/.*\/sign-in/);
  });
});