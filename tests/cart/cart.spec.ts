import { test, expect } from '../fixtures';

test.describe('Cart', () => {
  test('shows 1 item after adding a product', async ({ loggedInPage: inventoryPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('badge count increases for each added product', async ({ loggedInPage: inventoryPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('removing all items hides the badge', async ({ loggedInPage: inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();

    await cartPage.removeItem('sauce-labs-backpack');

    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('cart contents survive a page reload', async ({ page, loggedInPage: inventoryPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');

    await page.reload();

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
