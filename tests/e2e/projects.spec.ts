import { test, expect } from '@playwright/test';

test.describe('Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should create a new project', async ({ page }) => {
    await page.click('text=Projects');
    await page.waitForURL('**/projects');
    
    await page.click('text=Create Project');
    await page.fill('input[name="name"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'This is a test project');
    await page.selectOption('select[name="status"]', 'active');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Test Project')).toBeVisible();
    await expect(page.locator('text=This is a test project')).toBeVisible();
  });

  test('should edit existing project', async ({ page }) => {
    await page.click('text=Projects');
    await page.waitForURL('**/projects');
    
    // Click on first project
    await page.click('.project-card:first-child');
    await page.click('text=Edit');
    
    await page.fill('input[name="name"]', 'Updated Project Name');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Updated Project Name')).toBeVisible();
  });

  test('should delete project', async ({ page }) => {
    await page.click('text=Projects');
    await page.waitForURL('**/projects');
    
    // Click on first project
    await page.click('.project-card:first-child');
    await page.click('text=Delete');
    await page.click('text=Confirm');
    
    await expect(page.locator('text=Project deleted successfully')).toBeVisible();
  });

  test('should filter projects by status', async ({ page }) => {
    await page.click('text=Projects');
    await page.waitForURL('**/projects');
    
    await page.selectOption('select[name="statusFilter"]', 'active');
    const activeProjects = await page.locator('.project-card').count();
    expect(activeProjects).toBeGreaterThan(0);
    
    await page.selectOption('select[name="statusFilter"]', 'all');
    const allProjects = await page.locator('.project-card').count();
    expect(allProjects).toBeGreaterThanOrEqual(activeProjects);
  });
});