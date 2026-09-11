---
name: pr
description: Push the current branch and open a clear, well-structured pull request. Use when the user asks to open/create a PR, "push and PR", or wants a PR description written from the diff.
---

# Clear PRs

Open pull requests that a reviewer can approve without asking follow-up questions.

## Steps

1. **Never PR from `main`/`master`.** If on it, branch first: `git checkout -b <type>/<short-description>` (e.g. `tests/checkout-flow`, `docs/readme`, `fix/login-timeout`).
2. **Check for uncommitted changes** (`git status --short`). Commit them with a clear message before pushing (see repo's commit conventions if any).
3. **Push the branch**: `git push -u origin <branch>`.
4. **Read the actual diff** against the base branch (`git diff main...HEAD` or `git log main..HEAD --oneline`) — don't guess the summary from memory.
5. **Open the PR** with `gh pr create` using the structure below. Never leave the body empty or as a one-liner.

## PR body structure

```markdown
## Summary
- What changed, as bullet points (one per logical change, not per file)
- Why, if not obvious from the diff (motivation, bug being fixed, gap being closed)

## Test plan
- Exact commands run and their result (e.g. `npx playwright test --project=chromium` — 5 passed)
- Manual verification steps if no automated coverage exists

## Notes (only if relevant)
- Follow-ups intentionally left out of scope
- Config/infra changes that need reviewer attention (e.g. touched playwright.config.ts, CI workflow, secrets)
```

## Rules

- Title: short, imperative, describes the change (not the ticket number alone) — e.g. "Add checkout and login test coverage", not "Updates".
- Summary bullets describe the *change*, not narrate the work session ("Add X", "Fix Y" — not "I looked into X and then did Y").
- Always include a test plan. If tests weren't run, say so explicitly and why — don't omit the section.
- Call out anything risky or easy to miss: schema/config changes, skipped tests, TODOs left behind.
- Keep it scannable: bullets over paragraphs, no filler ("this PR aims to...", "hopefully this helps").
- End the body with:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```
- After creating, report the PR URL back to the user — don't just say "done".
