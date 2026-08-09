import { Page } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');

  constructor(private page: Page) {}

  async addToCart(productSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async getCartCount(): Promise<string> {
    return this.cartBadge.textContent() as Promise<string>;
  }
}
