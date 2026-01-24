import { test, expect } from '@playwright/test';

test.describe('FRC Platform Smoke Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to home page before each test
    await page.goto('/');
    // Wait for the header to be visible which confirms hydration/render
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  });

  test('homepage loads and has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Fractal Resonance/i);
    // Verify logo presence
    await expect(page.getByRole('link', { name: 'FRC', exact: true })).toBeVisible();
  });

  test('debug header content', async ({ page }) => {
    // Check if our unique attribute exists
    const header = page.getByTestId('main-header');
    if (await header.isVisible()) {
      console.log('Found header with data-testid="main-header"');
    } else {
      console.log('Header with data-testid="main-header" NOT found!');
      // log the html of header if any
      const anyHeader = page.locator('header');
      if (await anyHeader.count() > 0) {
        console.log('Found some header:', await anyHeader.innerHTML());
      } else {
        console.log('No <header> tag found on page.');
      }
    }
  });

  test('can navigate to Articles', async ({ page }) => {
    // The link might be "Articles" or "ARTICLES" visually, but accessible name is "Articles"
    const articlesLink = page.getByRole('link', { name: /articles/i }).first();
    await expect(articlesLink).toBeVisible();
    await articlesLink.click();
    
    await expect(page).toHaveURL(/.*articles/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('can navigate to Papers', async ({ page }) => {
    const papersLink = page.getByRole('link', { name: /papers/i }).first();
    await expect(papersLink).toBeVisible();
    await papersLink.click();
    
    await expect(page).toHaveURL(/.*papers/);
    // Fix: correct chaining of expect
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('check for critical 404s on main links', async ({ page }) => {
    // Target the header nav specifically
    const nav = page.locator('header nav'); 
    const links = await nav.getByRole('link').all();
    
    console.log(`Checking ${links.length} header nav links...`);
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`Link: "${text?.trim()}" -> ${href}`);
      
      if (href && href.startsWith('/')) {
        const response = await page.request.get(href);
        expect(response.status(), `Link ${href} should return 200`).toBe(200);
      }
    }
  });

});