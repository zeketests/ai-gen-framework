import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout', () => {
  test('completes purchase of a single item', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);

    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one/);

    await checkoutPage.fillInfo('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    await expect(page).toHaveURL(/checkout-step-two/);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('cannot continue past step one without required fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});
