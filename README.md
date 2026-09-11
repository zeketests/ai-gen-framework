# ai-gen-framework

Playwright E2E test framework built to work hand-in-hand with AI coding agents (Claude Code). The goal: use agents to write, extend, and maintain browser tests faster than doing it by hand — page objects, specs, and CI wiring generated and reviewed through an agent workflow instead of typed line by line.

## Stack

- TypeScript + Playwright Test
- Page Object Model (`tests/pages/`) + custom fixtures (`tests/fixtures.ts`)
- ESLint (`eslint-plugin-playwright`) + Prettier
- Target app under test: [saucedemo.com](https://www.saucedemo.com) (`baseURL` in `playwright.config.ts`, override with `BASE_URL` env var)

## Getting started

```bash
npm ci
npx playwright install --with-deps
npm test
```

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm test`              | Run full suite, all browsers             |
| `npm run test:chromium` | Run suite on Chromium only               |
| `npm run test:headed`   | Run headed, for local debugging          |
| `npm run test:report`   | Open the last HTML report                |
| `npm run lint`          | ESLint (playwright rules, zero warnings) |
| `npm run format`        | Prettier write                           |
| `npm run format:check`  | Prettier check (CI)                      |

Run a single file: `npx playwright test tests/example.spec.ts`

## Tests

| Spec                                | Coverage                                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `tests/example.spec.ts`             | Playwright.dev smoke test (title, get-started link) — scaffold sample, not app-specific                                            |
| `tests/login/login.spec.ts`         | Invalid credentials, locked-out user, valid login lands on inventory page                                                          |
| `tests/cart/cart.spec.ts`           | Add-to-cart badge count, multi-item add, remove clears badge, cart survives reload                                                 |
| `tests/inventory/inventory.spec.ts` | Sort by price (low/high, high/low) and name (A–Z), logout via burger menu blocks back-navigation into inventory                    |
| `tests/checkout/checkout.spec.ts`   | Full purchase flow (add to cart → checkout info → overview → finish → confirmation); blocked checkout when required fields missing |

Page objects: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` (`tests/pages/`).
Fixtures (`tests/fixtures.ts`): inject page objects directly (`{ loginPage, inventoryPage, cartPage, checkoutPage }`), plus a `loggedInPage` fixture that logs in as `standard_user` before the test body runs — use it instead of repeating login steps in every spec.

## Integrations

- **GitHub Actions** (`.github/workflows/playwright.yml`) — `lint` job (ESLint + Prettier check) gates a `test` job that installs browsers, runs the full suite headless, uploads the HTML report as a build artifact.
- **Claude Code** — repo instructions live in `CLAUDE.md` (commands, conventions, branch rules) so an agent can pick up context and generate/extend tests consistently with the existing structure.
- **`@playwright/cli`** ([microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)) — official CLI for driving Playwright from coding agents (record/generate code, inspect selectors, screenshots) without loading MCP-sized tool schemas into context. Skill installed at `.claude/skills/playwright-cli/`.
- **`/pr` skill** (`.claude/skills/pr/`) — opens well-structured pull requests (diff-based summary, required test plan) via `gh pr create`.
- **PR template** (`.github/pull_request_template.md`) — mirrors the `/pr` skill's structure (Summary / Test plan / Notes) for humans opening PRs manually.

## Conventions

- Test files: `tests/<feature>/<feature>.spec.ts`
- Page interactions go through page objects in `tests/pages/`, not raw locators in specs
- Prefer the `tests/fixtures.ts` `test`/`expect` over importing directly from `@playwright/test`
- Never commit directly to `main` — branch, then PR
- `playwright.config.ts` changes require sign-off before editing
- `npm run lint` must pass with zero warnings before merge (enforced in CI)
