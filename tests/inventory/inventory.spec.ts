import { test, expect } from '../fixtures';
import { ProductPage } from '../pages/ProductPage';

test.describe('Inventory', () => {
  test('opens a product detail page and adds it to cart from there', async ({
    page,
    loggedInPage: inventoryPage,
  }) => {
    const productPage = new ProductPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item.html/);
    await expect(productPage.name).toHaveText('Sauce Labs Backpack');

    await productPage.addToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await productPage.backToProducts();
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('sorts products by price low to high', async ({ loggedInPage: inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.itemPrices.allTextContents();
    const values = prices.map((p) => parseFloat(p.replace('$', '')));

    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  test('sorts products by price high to low', async ({ loggedInPage: inventoryPage }) => {
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.itemPrices.allTextContents();
    const values = prices.map((p) => parseFloat(p.replace('$', '')));

    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  test('sorts products by name A to Z', async ({ loggedInPage: inventoryPage }) => {
    await inventoryPage.sortBy('az');

    // eslint-disable-next-line playwright/prefer-web-first-assertions -- comparing derived order, not element state
    const names = await inventoryPage.itemNames.allTextContents();

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('logs out via the burger menu and blocks back-navigation into inventory', async ({
    page,
    loggedInPage: inventoryPage,
  }) => {
    await inventoryPage.logout();

    await expect(page).toHaveURL('/');

    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});
