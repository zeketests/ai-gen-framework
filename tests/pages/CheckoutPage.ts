import { Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  readonly continueButton = this.page.locator('[data-test="continue"]');
  readonly finishButton = this.page.locator('[data-test="finish"]');
  readonly cancelButton = this.page.locator('[data-test="cancel"]');
  readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');
  readonly subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
  readonly taxLabel = this.page.locator('[data-test="tax-label"]');
  readonly totalLabel = this.page.locator('[data-test="total-label"]');

  constructor(private page: Page) {}

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
