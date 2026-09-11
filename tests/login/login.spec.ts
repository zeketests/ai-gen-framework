import { test, expect } from '../fixtures';

test.describe('Login', () => {
  test('rejects invalid credentials', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    await expect(page).toHaveURL('/');
  });

  test('rejects locked out user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('logs in successfully with valid credentials', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory/);
  });

  for (const username of ['problem_user', 'performance_glitch_user', 'error_user', 'visual_user']) {
    test(`logs in successfully as ${username}`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(username, 'secret_sauce');

      await expect(page).toHaveURL(/inventory/);
    });
  }
});
