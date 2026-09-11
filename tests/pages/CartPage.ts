import { Page } from '@playwright/test';

export class CartPage {
  readonly cartItems = this.page.locator('[data-test="inventory-item"]');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');

  constructor(private page: Page) {}

  async removeItem(productSlug: string) {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
