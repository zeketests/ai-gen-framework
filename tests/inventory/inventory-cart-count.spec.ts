import { test, expect } from '../fixtures';

test.describe('Inventory cart badge', () => {
  test('badge count reflects number of items added to cart', async ({
    loggedInPage: inventoryPage,
  }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.addToCart('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
