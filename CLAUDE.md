# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies and browsers
npm ci
npx playwright install --with-deps

# Run all tests
npx playwright test

# Run single test file
npx playwright test tests/example.spec.ts

# Run specific browser only
npx playwright test --project=chromium

# Debug mode (headed browser)
npx playwright test --headed

# View HTML report after run
npx playwright show-report
```

## Test conventions

- Language: TypeScript + Playwright
- Test files: `tests/<feature>/<feature>.spec.ts` (mirror feature folder structure)
- Page objects: `tests/pages/` — use Page Object Model for all page interactions
- Never commit directly to `main`
- Never modify `playwright.config.ts` without asking first
- CI: always headless; local debugging: use `--headed`

## Architecture

Playwright E2E test framework scaffold. No application source — only test infrastructure.

- `playwright.config.ts` — test config: Chromium/Firefox/WebKit, HTML reporter, parallel execution, CI retries (2), trace on first retry
- `tests/` — all test specs go here
- `.github/workflows/playwright.yml` — CI pipeline: install → browsers → test → upload HTML report artifact

Tests run fully parallel locally, single worker on CI (`CI` env var controls both).
