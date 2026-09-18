import fs from 'fs';
import path from 'path';
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

export const STANDARD_USER = { username: 'standard_user', password: 'secret_sauce' };

const AUTH_DIR = path.join(__dirname, '..', 'playwright', '.auth');

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Inventory page with a standard_user session already logged in. */
  loggedInPage: InventoryPage;
};

type WorkerFixtures = {
  /** Path to a storageState file holding a standard_user session, logged in once per worker. */
  authStatePath: string;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  authStatePath: [
    async ({ browser }, use, workerInfo) => {
      const fileName = path.join(AUTH_DIR, `${workerInfo.parallelIndex}.json`);

      if (!fs.existsSync(fileName)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });

        const page = await browser.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
        await page.context().storageState({ path: fileName });
        await page.close();
      }

      await use(fileName);
    },
    { scope: 'worker' },
  ],

  loggedInPage: async ({ page, inventoryPage, authStatePath }, use) => {
    const { cookies } = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));
    await page.context().addCookies(cookies);
    await page.goto('/inventory.html');
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
