import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const storageKey = 'stuartlee:discoveries:v1';
async function awards(page: Page): Promise<string[]> {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').awarded || [], storageKey);
}
async function consoleClaim(page: Page) {
  return page.evaluate(() => (window as unknown as { portfolio: { claim: (name: string) => boolean } }).portfolio.claim('console'));
}
async function keyboardSkip(page: Page) {
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-skip]')).toBeFocused();
  await page.keyboard.press('Enter');
}

for (const route of ['/', '/de/']) {
  test(`content, metadata, mobile layouts and accessibility: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', route === '/' ? 'en' : 'de');
    await expect(page).toHaveTitle('Stuart Lee — Senior Frontend Engineer');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://stuartlee.dev${route}`);
    await expect(page.locator('#discoveries-toggle')).toBeHidden();
    await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://www.linkedin.com/in/beeglebug/');
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
    await consoleClaim(page);
    await page.locator('#discoveries-toggle').click();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await page.setViewportSize({ width: 640, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('language arrival, clean URLs and progress across locales', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page).toHaveURL(/\/de\/$/);
  expect(await awards(page)).toContain('language');
  await expect(page.locator('#achievement-notification')).toContainText('Hallo!');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/4322\/$/);
  expect((await awards(page)).filter(id => id === 'language')).toHaveLength(1);
  await page.reload();
  await expect(page.locator('#discoveries-toggle')).toBeVisible();
  await page.goto('/?explore=en');
  expect((await awards(page)).filter(id => id === 'language')).toHaveLength(1);
  await expect(page).toHaveURL(/4322\/$/);
});

test('keyboard and skip achievements require real activation', async ({ page }) => {
  await page.goto('/');
  await page.locator('.main-nav a').first().click();
  expect(await awards(page)).not.toContain('keyboard');
  await page.goto('/');
  await page.keyboard.press('Tab');
  expect(await awards(page)).not.toContain('keyboard');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  expect(await awards(page)).toEqual(expect.arrayContaining(['keyboard', 'skip']));
  // A programmatically dispatched event cannot claim keyboard navigation.
  await page.locator('#reset-discoveries').evaluate(element => (element as HTMLElement).click());
  await page.locator('.main-nav a').first().evaluate(element => {
    (element as HTMLElement).focus();
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    (element as HTMLElement).click();
  });
  expect(await awards(page)).not.toContain('keyboard');
});

test('console, source codes, duplicates and reset', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', message => consoleMessages.push(message.text()));
  await page.goto('/');
  expect(consoleMessages.some(message => message.includes('portfolio.claim("console")'))).toBe(true);
  expect(await page.evaluate(() => window.portfolio.claim('unknown'))).toBe(false);
  expect(await consoleClaim(page)).toBe(true);
  expect(await consoleClaim(page)).toBe(false);
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('#discoveries-toggle')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#source-code').fill('wrong');
  await page.locator('#source-form button').click();
  await expect(page.locator('#source-code')).toHaveAttribute('aria-invalid', 'true');
  expect(await awards(page)).not.toContain('source');
  const source = await (await page.request.get('/')).text();
  expect(source).toContain('<!-- Explorer');
  const code = source.match(/Entdecker-Code: ([A-Z-]+)\./)![1];
  await page.locator('#source-code').fill(` ${code.toLowerCase()} `);
  await page.locator('#source-form button').click();
  expect(await awards(page)).toEqual(expect.arrayContaining(['console', 'source']));
  await page.locator('#source-form button').click();
  expect((await awards(page)).filter(id => id === 'source')).toHaveLength(1);
  await expect(page.locator('#explorer-badge')).toBeHidden();
  await page.reload();
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('[data-achievement="source"]')).toHaveAttribute('data-unlocked', '');
  await page.locator('#reset-discoveries').click();
  expect(await awards(page)).toEqual([]);
  await expect(page.locator('#source-code')).toHaveValue('');
  await expect(page.locator('#discoveries-toggle')).toBeVisible();
});

test('all main discoveries earn the badge without developer bonuses', async ({ page }) => {
  await page.goto('/');
  await keyboardSkip(page);
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  for (const id of ['intro', 'about', 'approach', 'projects', 'contact']) {
    await page.locator(`[data-discovery-section="${id}"]`).scrollIntoViewIfNeeded();
    await expect.poll(async () => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').seen || [], storageKey)).toContain(id);
  }
  expect(await awards(page)).toEqual(expect.arrayContaining(['language', 'keyboard', 'skip', 'story']));
  expect(await awards(page)).not.toContain('console');
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('#explorer-badge')).toBeVisible();
  await page.reload();
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('#explorer-badge')).toBeVisible();
});

test('storage failures and malformed saved data do not break the site', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page.locator('#discoveries-toggle')).toBeVisible();
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('[data-achievement="language"]')).toHaveAttribute('data-unlocked', '');
  expect(await consoleClaim(page)).toBe(true);
  expect(await consoleClaim(page)).toBe(false);
  await page.locator('#reset-discoveries').click();
  await expect(page.locator('[data-achievement="console"]')).not.toHaveAttribute('data-unlocked', '');
  expect(errors).toEqual([]);
});

for (const saved of ['{broken', 'null', '[]', '{"awarded":["fake",null],"seen":["fake"]}']) {
  test(`invalid stored progress is ignored: ${saved}`, async ({ page }) => {
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: storageKey, value: saved });
    await page.goto('/');
    expect(await consoleClaim(page)).toBe(true);
    expect(await awards(page)).toEqual(['console']);
  });
}

test('no-JavaScript content and locale navigation', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  await expect(page.locator('#discoveries-toggle')).toBeHidden();
  await expect(page.locator('#about')).toBeVisible();
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('#discoveries-toggle')).toBeHidden();
  await context.close();
});
