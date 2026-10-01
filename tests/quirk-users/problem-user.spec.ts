import { test, expect } from '../fixtures';
import { USERS } from '../data/users';

/**
 * problem_user is seeded with deliberate defects. These tests pin the defective
 * behaviour so a change on SauceDemo's side (fixed or new bug) is surfaced.
 */
test.describe('problem_user known defects', { tag: '@quirk' }, () => {
  test.use({ user: USERS.problem });

  test('every product shows the same placeholder image', async ({
    loggedInPage: inventoryPage,
  }) => {
    const srcs = await inventoryPage.itemImages.evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('src')),
    );

    expect(srcs).toHaveLength(6);
    expect(new Set(srcs).size).toBe(1);
    expect(srcs[0]).toContain('sl-404');
  });

  test('sorting by name Z to A does not reorder products', async ({
    loggedInPage: inventoryPage,
  }) => {
    const before = await inventoryPage.itemNames.allTextContents();

    await inventoryPage.sortBy('za');

    await expect(inventoryPage.itemNames).toHaveText(before);
  });

  for (const slug of [
    'sauce-labs-bolt-t-shirt',
    'sauce-labs-fleece-jacket',
    'test.allthethings()-t-shirt-(red)',
  ]) {
    test(`add to cart is a no-op for ${slug}`, async ({ loggedInPage: inventoryPage }) => {
      await inventoryPage.addToCart(slug);

      await expect(inventoryPage.cartBadge).toBeHidden();
      await expect(inventoryPage.removeButton(slug)).toBeHidden();
    });
  }

  test('remove from inventory page does not decrement the badge', async ({
    loggedInPage: inventoryPage,
  }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart('sauce-labs-backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('last name field cannot be filled, blocking checkout', async ({
    page,
    loggedInPage: inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('John', 'Doe', '12345');
    await expect(checkoutPage.lastNameInput).toHaveValue('');

    await checkoutPage.continueToOverview();
    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
    await expect(page).toHaveURL(/checkout-step-one/);
  });
});
