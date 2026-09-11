import { Page } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');
  readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');

  constructor(private page: Page) {}

  async addToCart(productSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<string> {
    return this.cartBadge.textContent() as Promise<string>;
  }
}
