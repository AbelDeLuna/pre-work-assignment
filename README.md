# SauceDemo Purchase Flow: Playwright Automation

This set of test cases are setup to do End-to-end test of the login → add to cart → checkout → order confirmation flow for the `saucedemo.com` website

## Framework and language

**Playwright with TypeScript.**
- Playwright auto-waits for elements to be actionable removing sleeps and manual waits.
- Built-in test runner, parallelism, HTML reports, traces, screenshots and video stored in `./playwright-report/`
- Web-first assertions (`expect(locator)`) retry until they pass or time out.

## Prerequisites
- Node.js 18+ (LTS recommended)

## Run it
```bash
npm install
npx playwright install chromium
npm test
```
Other commands:
```bash
npm run test:headed   # watch the browser
npm run test:debug    # step through with the Playwright inspector
npm run report        # open the HTML report from the last run
```

## Project structure
```
pages/                  Page objects (one class per page)
tests/                  Test specs (flow and assertions only)
test-data/              Users, product and customer data
playwright.config.ts
.env                    Should typically be ignored in .gitignore, but included for simplicity
```

## Assumptions
- `standard_user` / `secret_sauce` (published on the login page) is the valid account.
- "A specific product" is **Sauce Labs Backpack**, expected price **$29.99**.
- The site is a stable public demo, so the expected price is hard-coded in test data. In a real system I would source it from an API or product team
- Customer details does not need validatation beyond being non-empty.
- Only Chrome needs to be tested through chromium. More browsers can be added in the config

## Validation approach
- Each step asserts something observable, not just that a click happened: URL and page title after login, cart badge count, exactly one item in the cart, and item name and price.
- Price is checked in three places: the inventory listing, the cart, and the checkout overview, where the item total is also checked.
- Final check: the confirmation header and the `checkout-complete` URL.
- `test.step` groups actions so failures in the report point to the exact scenario step.

## Synchronization and waiting
- No fixed sleeps. Playwright auto-waits for elements to be visible, enabled and stable before acting.
- Assertions use web-first `expect(...)`, which retry until the condition holds or the timeout expires. This covers page transitions without explicit waits.
- Locators use stable `data-test` attributes (configured via `testIdAttribute`) and roles, not brittle CSS or XPath.

## Failure handling
- Each test is independent and starts from a fresh browser context, so one failure cannot cascade.
- Screenshot and video created on failure, and a trace captured on first retry (viewable with `npx playwright show-trace`).
- Retries are enabled only on CI (`retries: 2`) so local failures are not hidden.
- Assertion messages from Playwright show expected vs. actual, and the HTML report includes the step that failed.

## Scaling to hundreds of tests
- **Layers:** keep specs thin (intent and assertions), page objects for interactions, and shared fixtures/helpers for setup. Add components (header, cart badge) as reusable classes when pages share them.
- **Fixtures:** use Playwright custom fixtures to inject page objects and pre-authenticated state. Log in once via `storageState` (or API) and reuse it, instead of logging in through the UI in every test.
- **Organization:** folder per feature area (`tests/checkout`, `tests/auth`), tags such as `@smoke` and `@regression` to select subsets.
- **Stability:** environment config via env vars (base URL, credentials from secrets)
