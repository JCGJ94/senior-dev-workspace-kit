---
name: "playwright"
description: "Write and maintain E2E tests with Playwright: page objects, fixtures, assertions, network mocking, and CI configuration."
tier: 2
triggers: ["playwright", "e2e test", "end-to-end test", "page object", "test.expect", "browser test"]
context_cost: 400
---

# Playwright

## Purpose
Write reliable, maintainable E2E tests with Playwright. Enforce page object pattern, proper locator selection, and test isolation.

## Use when
- Writing or reviewing E2E tests for a web application.
- Setting up Playwright in a new project.
- Debugging flaky Playwright tests.

## Do not use when
- Writing unit or integration tests (use `test-driven-development` skill).
- The project uses Cypress or another E2E framework.

## Installation & Setup

```bash
bun add -D @playwright/test
bunx playwright install  # download browsers

# playwright.config.ts is auto-generated
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Page Object Model

```ts
// e2e/pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## Fixtures

```ts
// e2e/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { DashboardPage } from './pages/dashboard.page';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  authenticatedPage: async ({ page }, use) => {
    // Login once, reuse session
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/dashboard');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## Locator Priority (best → worst)

```ts
// 1. Role (most resilient)
page.getByRole('button', { name: 'Submit' });
page.getByRole('textbox', { name: 'Email' });

// 2. Label
page.getByLabel('Email address');

// 3. Placeholder
page.getByPlaceholder('Search...');

// 4. Text content
page.getByText('Welcome back');

// 5. Test ID (opt-in for custom attributes)
page.getByTestId('submit-btn'); // requires data-testid attribute

// AVOID: CSS selectors and XPath — fragile
page.locator('.btn-primary');  // ❌
page.locator('//button[1]');   // ❌
```

## Assertions

```ts
import { expect } from '@playwright/test';

// Visibility
await expect(page.getByRole('alert')).toBeVisible();
await expect(page.getByRole('dialog')).toBeHidden();

// Text
await expect(page.getByRole('heading')).toHaveText('Dashboard');
await expect(page.getByRole('paragraph')).toContainText('Welcome');

// URL
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/users\/\d+/);

// Form state
await expect(page.getByRole('textbox')).toHaveValue('test@example.com');
await expect(page.getByRole('checkbox')).toBeChecked();
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();

// Count
await expect(page.getByRole('listitem')).toHaveCount(5);
```

## Network Mocking

```ts
test('shows error on API failure', async ({ page }) => {
  await page.route('**/api/users', route =>
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    })
  );

  await page.goto('/users');
  await expect(page.getByRole('alert')).toContainText('Failed to load users');
});

// Intercept and modify
await page.route('**/api/products', async route => {
  const response = await route.fetch();
  const json = await response.json();
  json.items.push({ id: 999, name: 'Test Product' });
  await route.fulfill({ json });
});
```

## Tracing and Debugging

```bash
# Run with headed browser
bunx playwright test --headed

# Run specific test file
bunx playwright test e2e/login.spec.ts

# Debug mode (pause at breakpoints)
bunx playwright test --debug

# Show HTML report
bunx playwright show-report
```

## Rules
- Always use the Page Object Model for pages with multiple interactions.
- Prefer role/label locators over CSS selectors — they survive UI changes.
- Use `trace: 'on-first-retry'` in CI — traces are invaluable for debugging flaky tests.
- Never use `page.waitForTimeout()` — use proper `expect().toBeVisible()` or `waitForURL()`.
- Tests must be independent — no shared mutable state between tests.
- Use fixtures for authentication and repeated setup — not `beforeEach` with page.goto().

## Output
Flag:
- CSS/XPath locators that should use role/label equivalents
- `waitForTimeout()` calls (replace with proper assertions)
- Missing `webServer` config in `playwright.config.ts`
- Tests that depend on execution order (shared state)
- Missing `trace` configuration for CI
