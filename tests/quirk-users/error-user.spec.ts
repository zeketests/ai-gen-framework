import { test, expect } from '../fixtures';
import { USERS } from '../data/users';

/**
 * error_user is seeded with deliberate defects that surface as JS errors and alerts.
 * These tests pin the defective behaviour so a change on SauceDemo's side is surfaced.
 */
test.describe('error_user known defects', { tag: '@quirk' }, () => {
  test.use({ user: USERS.error });

  test('sorting raises a "Sorting is broken" alert and leaves order unchanged', async ({
    page,
    loggedInPage: inventoryPage,
  }) => {
    const before = await inventoryPage.itemNames.allTextContents();

    const dialogPromise = page.waitForEvent('dialog');
    const sort = inventoryPage.sortBy('za');
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Sorting is broken!');
    await dialog.dismiss();
    await sort;

    await expect(inventoryPage.itemNames).toHaveText(before);
  });

  test('adding the Bolt T-Shirt throws and leaves the cart empty', async ({
    page,
    loggedInPage: inventoryPage,
  }) => {
    const pageError = page.waitForEvent('pageerror');

    await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');

    expect((await pageError).message).toContain('Failed to add item to the cart.');
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('removing from inventory page throws and keeps the badge', async ({
    page,
    loggedInPage: inventoryPage,
  }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    const pageError = page.waitForEvent('pageerror');
    await inventoryPage.removeFromCart('sauce-labs-backpack');

    expect((await pageError).message).toContain('Failed to remove item from cart.');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('checkout skips last name validation but finish does not complete the order', async ({
    page,
    loggedInPage: inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await test.step('last name cannot be filled yet step one passes', async () => {
      await checkoutPage.fillInfo('John', 'Doe', '12345');
      await expect(checkoutPage.lastNameInput).toHaveValue('');

      await checkoutPage.continueToOverview();
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('finish throws and stays on step two', async () => {
      const pageError = page.waitForEvent('pageerror');
      await checkoutPage.finish();

      expect((await pageError).message).toBeTruthy();
      await expect(page).toHaveURL(/checkout-step-two/);
      await expect(checkoutPage.completeHeader).toBeHidden();
    });
  });
});
