import { test, expect } from '@playwright/test';

test.describe('FRC Platform Smoke Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  });

  test('homepage loads and has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Fractal Resonance/i);
    // Logo image with alt="FRC"
    await expect(page.locator('header img[alt="FRC"]')).toBeVisible();
  });

  test('header navigation links are present', async ({ page }) => {
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();
    // Check key nav links exist
    await expect(nav.getByRole('link', { name: /articles/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /papers/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /formulas/i })).toBeVisible();
  });

  test('can navigate to Articles', async ({ page }) => {
    const articlesLink = page.locator('header nav').getByRole('link', { name: /articles/i });
    await expect(articlesLink).toBeVisible();
    await articlesLink.click();
    await expect(page).toHaveURL(/.*articles/);
  });

  test('can navigate to Papers', async ({ page }) => {
    const papersLink = page.locator('header nav').getByRole('link', { name: /papers/i });
    await expect(papersLink).toBeVisible();
    await papersLink.click();
    await expect(page).toHaveURL(/.*papers/);
  });

  test('internal nav links return 200', async ({ page }) => {
    const nav = page.locator('header nav');
    const links = await nav.getByRole('link').all();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && href.startsWith('/')) {
        const response = await page.request.get(href);
        expect(response.status(), `${href} should return 200`).toBe(200);
      }
    }
  });

});