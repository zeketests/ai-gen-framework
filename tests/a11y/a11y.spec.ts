import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures';

test.describe('Accessibility', () => {
  test('login page has no axe violations', async ({ page, loginPage }) => {
    await loginPage.goto();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('inventory page has no axe violations', async ({ page, loggedInPage: _loggedInPage }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('cart page has no axe violations', async ({ page, loggedInPage: inventoryPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('checkout step one has no axe violations', async ({
    page,
    loggedInPage: inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });
});
