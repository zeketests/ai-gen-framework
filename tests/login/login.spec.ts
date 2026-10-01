import { test, expect } from '../fixtures';
import { LOGIN_ENABLED_USERS, PASSWORD, USERS } from '../data/users';

test.describe('Login', () => {
  test('rejects invalid credentials', { tag: '@smoke' }, async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    await expect(page).toHaveURL('/');
  });

  test('rejects locked out user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test(
    'logs in successfully with valid credentials',
    { tag: '@smoke' },
    async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(USERS.standard, PASSWORD);

      await expect(page).toHaveURL(/inventory/);
    },
  );

  for (const username of LOGIN_ENABLED_USERS.filter((u) => u !== USERS.standard)) {
    test(`logs in successfully as ${username}`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(username, PASSWORD);

      await expect(page).toHaveURL(/inventory/);
    });
  }
});
