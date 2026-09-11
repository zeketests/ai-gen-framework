import { test, expect } from '../fixtures';

test.describe('Checkout', () => {
  test('completes purchase of a single item', async ({
    page,
    loggedInPage: inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await test.step('add item and go to cart', async () => {
      await inventoryPage.addToCart('sauce-labs-backpack');
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/cart/);
    });

    await test.step('checkout with valid info', async () => {
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout-step-one/);

      await checkoutPage.fillInfo('John', 'Doe', '12345');
      await checkoutPage.continueToOverview();
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('finish and confirm order', async () => {
      await checkoutPage.finish();
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  });

  test('cannot continue past step one without required fields', async ({
    page,
    loggedInPage: inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});
