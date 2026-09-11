# ai-gen-framework

Playwright E2E test framework built to work hand-in-hand with AI coding agents (Claude Code). The goal: use agents to write, extend, and maintain browser tests faster than doing it by hand — page objects, specs, and CI wiring generated and reviewed through an agent workflow instead of typed line by line.

## Stack

- TypeScript + Playwright Test
- Page Object Model (`tests/pages/`)
- Target app under test: [saucedemo.com](https://www.saucedemo.com)

## Getting started

```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

Run a single file: `npx playwright test tests/example.spec.ts`
Run one browser: `npx playwright test --project=chromium`
Headed/debug: `npx playwright test --headed`
View last report: `npx playwright show-report`

## Tests

| Spec | Coverage |
|---|---|
| `tests/example.spec.ts` | Playwright.dev smoke test (title, get-started link) — scaffold sample, not app-specific |
| `tests/login/login.spec.ts` | Invalid credentials, locked-out user, valid login lands on inventory page |
| `tests/cart/cart.spec.ts` | Adding a product updates cart badge to 1 |
| `tests/checkout/checkout.spec.ts` | Full purchase flow (add to cart → checkout info → overview → finish → confirmation); blocked checkout when required fields missing |

Page objects: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` (`tests/pages/`).

## Integrations

- **GitHub Actions** (`.github/workflows/playwright.yml`) — installs deps + browsers, runs the full suite headless on push/PR, uploads the HTML report as a build artifact.
- **Claude Code** — repo instructions live in `CLAUDE.md` (commands, conventions, branch rules) so an agent can pick up context and generate/extend tests consistently with the existing structure.

## Conventions

- Test files: `tests/<feature>/<feature>.spec.ts`
- Page interactions go through page objects in `tests/pages/`, not raw locators in specs
- Never commit directly to `main` — branch, then PR
- `playwright.config.ts` changes require sign-off before editing
