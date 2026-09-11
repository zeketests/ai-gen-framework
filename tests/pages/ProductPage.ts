import { Page } from '@playwright/test';

export class ProductPage {
  readonly name = this.page.locator('.inventory_details_name');
  readonly price = this.page.locator('.inventory_details_price');
  readonly addToCartButton = this.page.locator('[data-test="add-to-cart"]');
  readonly backButton = this.page.locator('[data-test="back-to-products"]');

  constructor(private page: Page) {}

  async addToCart() {
    await this.addToCartButton.click();
  }

  async backToProducts() {
    await this.backButton.click();
  }
}
