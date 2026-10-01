import fs from 'fs';
import path from 'path';
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductPage } from './pages/ProductPage';
import { PASSWORD, USERS, Username } from './data/users';

export const STANDARD_USER = { username: USERS.standard, password: PASSWORD };

const AUTH_DIR = path.join(__dirname, '..', 'playwright', '.auth');

type Fixtures = {
  /** User that `loggedInPage` logs in as. Override with `test.use({ user: USERS.problem })`. */
  user: Username;
  /** Path to a storageState file holding a session for `user`, cached per worker and user. */
  authStatePath: string;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
  /** Inventory page with a `user` session already logged in (standard_user by default). */
  loggedInPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  user: [USERS.standard, { option: true }],

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
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  authStatePath: async ({ browser, user }, use, testInfo) => {
    const fileName = path.join(AUTH_DIR, `${testInfo.parallelIndex}-${user}.json`);

    if (!fs.existsSync(fileName)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });

      const page = await browser.newPage();
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user, PASSWORD);
      await page.context().storageState({ path: fileName });
      await page.close();
    }

    await use(fileName);
  },

  loggedInPage: async ({ page, inventoryPage, authStatePath }, use) => {
    const { cookies } = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));
    await page.context().addCookies(cookies);
    await page.goto('/inventory.html');
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
