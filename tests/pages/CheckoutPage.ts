import { Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  readonly continueButton = this.page.locator('[data-test="continue"]');
  readonly finishButton = this.page.locator('[data-test="finish"]');
  readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  readonly summaryTotalLabel = this.page.locator('[data-test="total-label"]');

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
}
