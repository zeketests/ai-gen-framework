import { Page } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');
  readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');
  readonly sortSelect = this.page.locator('[data-test="product-sort-container"]');
  readonly itemNames = this.page.locator('[data-test="inventory-item-name"]');
  readonly itemPrices = this.page.locator('[data-test="inventory-item-price"]');
  readonly menuButton = this.page.locator('#react-burger-menu-btn');
  readonly logoutLink = this.page.locator('[data-test="logout-sidebar-link"]');

  constructor(private page: Page) {}

  async addToCart(productSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async openProduct(name: string) {
    await this.itemNames.filter({ hasText: name }).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<string> {
    return this.cartBadge.textContent() as Promise<string>;
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortSelect.selectOption(option);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
