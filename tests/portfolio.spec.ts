import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const storageKey = 'stuartlee:discoveries:v1';
async function awards(page: Page): Promise<string[]> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || '{}').awarded || [],
    storageKey,
  );
}
async function consoleClaim(page: Page) {
  return page.evaluate(() => window.helloThere());
}
async function keyboardSkip(page: Page, webkit = false) {
  await page.keyboard.press(webkit ? 'Alt+Tab' : 'Tab');
  await expect(page.locator('[data-skip]')).toBeFocused();
  await page.keyboard.press('Enter');
}

for (const route of ['/']) {
  test(`content, metadata, mobile layouts and accessibility: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle('Stuart Lee — Senior Frontend Engineer');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://stuartlee.dev${route}`,
    );
    await expect(page.locator('#discoveries-toggle')).toBeHidden();
    await expect(
      page.getByRole('link', { name: 'LinkedIn', exact: true }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/beeglebug/');
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await consoleClaim(page);
    await page.locator('#discoveries-toggle').click();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    for (const width of [320, 640]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test('skip link remains accessible without earning an achievement', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.locator('.main-nav a').first().click();
  expect(await awards(page)).not.toContain('keyboard');
  await page.goto('/');
  await page.keyboard.press(
    testInfo.project.name === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  expect(await awards(page)).not.toContain('keyboard');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  expect(await awards(page)).not.toContain('skip');
  expect(await awards(page)).not.toContain('keyboard');
  await expect(page.locator('#achievement-notification')).toBeHidden();
  await page.locator('[data-theme-choice="light"]').focus();
  await page.keyboard.press(
    testInfo.project.name === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await page.keyboard.press('Space');
  expect(await awards(page)).toContain('keyboard');
  // A programmatically dispatched event cannot claim keyboard navigation.
  await page
    .locator('#reset-discoveries')
    .evaluate((element) => (element as HTMLElement).click());
  await page
    .locator('.main-nav a')
    .first()
    .evaluate((element) => {
      (element as HTMLElement).focus();
      element.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      (element as HTMLElement).click();
    });
  expect(await awards(page)).not.toContain('keyboard');
});

test('console, source codes, duplicates and reset', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', (message) => consoleMessages.push(message.text()));
  await page.goto('/');
  expect(
    consoleMessages.some((message) => message.includes('helloThere()')),
  ).toBe(true);
  expect(await page.evaluate(() => 'portfolio' in window)).toBe(false);
  expect(await consoleClaim(page)).toBe(true);
  expect(await consoleClaim(page)).toBe(false);
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('#discoveries-toggle')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page.locator('#source-code').fill('wrong');
  await page.locator('#source-form button').click();
  await expect(page.locator('#source-code')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect(await awards(page)).not.toContain('source');
  const source = await (await page.request.get('/')).text();
  expect(source).toContain('<!-- Explorer');
  const code = source.match(/Explorer's code: ([A-Z-]+)\./)![1];
  await page.locator('#source-code').fill(` ${code.toLowerCase()} `);
  await page.locator('#source-form button').click();
  expect(await awards(page)).toEqual(
    expect.arrayContaining(['console', 'source']),
  );
  await page.locator('#source-form button').click();
  expect((await awards(page)).filter((id) => id === 'source')).toHaveLength(1);
  await expect(page.locator('#explorer-badge')).toBeHidden();
  await page.reload();
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('[data-achievement="source"]')).toHaveAttribute(
    'data-unlocked',
    '',
  );
  await page.locator('#reset-discoveries').click();
  expect(await awards(page)).toEqual([]);
  await expect(page.locator('#source-code')).toHaveValue('');
  await expect(page.locator('#discoveries-toggle')).toBeVisible();
});

test('all main discoveries earn the badge without developer bonuses', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await keyboardSkip(page, testInfo.project.name === 'webkit');
  await page.locator('[data-theme-choice="light"]').focus();
  await page.keyboard.press(
    testInfo.project.name === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await page.keyboard.press('Space');
  for (const id of ['intro', 'about', 'approach', 'projects', 'contact']) {
    await page
      .locator(`[data-discovery-section="${id}"]`)
      .scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        page.evaluate(
          (key) => JSON.parse(localStorage.getItem(key) || '{}').seen || [],
          storageKey,
        ),
      )
      .toContain(id);
  }
  expect(await awards(page)).toEqual(
    expect.arrayContaining(['keyboard', 'story']),
  );
  expect(await awards(page)).not.toContain('console');
  await page.locator('[data-theme-choice="light"]').click();
  await page.locator('#beeglebug').click();
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('#explorer-badge')).toBeVisible();
  await page.reload();
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('#explorer-badge')).toBeVisible();
});

test('storage failures and malformed saved data do not break the site', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('blocked');
    };
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  expect(await consoleClaim(page)).toBe(true);
  expect(await consoleClaim(page)).toBe(false);
  await page.locator('#discoveries-toggle').click();
  await page.locator('#reset-discoveries').click();
  await expect(
    page.locator('[data-achievement="console"]'),
  ).not.toHaveAttribute('data-unlocked', '');
  expect(errors).toEqual([]);
});

for (const saved of [
  '{broken',
  'null',
  '[]',
  '{"awarded":["fake",null],"seen":["fake"]}',
]) {
  test(`invalid stored progress is ignored: ${saved}`, async ({ page }) => {
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: storageKey, value: saved },
    );
    await page.goto('/');
    expect(await consoleClaim(page)).toBe(true);
    expect(await awards(page)).toEqual(['console']);
  });
}

test('no-JavaScript content and skip navigation', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  await expect(page.locator('#discoveries-toggle')).toBeHidden();
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('.language-nav')).toHaveCount(0);
  await keyboardSkip(page, testInfo.project.name === 'webkit');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#discoveries-toggle')).toBeHidden();
  await context.close();
});

test('removed achievements are discarded from saved progress', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'stuartlee:discoveries:v1',
      JSON.stringify({ awarded: ['language', 'skip', 'bug'], seen: [] }),
    );
  });
  await page.goto('/');
  expect(await awards(page)).toEqual(['bug']);
  await expect(page.locator('#discovery-count')).toHaveText('1/6');
  await expect(
    page.locator('[data-achievement="language"], [data-achievement="skip"]'),
  ).toHaveCount(0);
  await expect(page.locator('link[hreflang], .language-nav')).toHaveCount(0);
});

test('Space activates a button after native Tab focus', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await consoleClaim(page);
  // Start before the control, then reach it through actual native navigation.
  await page.locator('#discoveries-toggle').focus();
  const tab = testInfo.project.name === 'webkit' ? 'Alt+Tab' : 'Tab';
  const reverseTab =
    testInfo.project.name === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';
  await page.keyboard.press(tab);
  await page.keyboard.press(reverseTab);
  await expect(page.locator('#discoveries-toggle')).toBeFocused();
  expect(await awards(page)).not.toContain('keyboard');
  await page.keyboard.press('Space');
  await expect(page.locator('#discoveries-toggle')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(await awards(page)).toContain('keyboard');
});

test('section discovery works without IntersectionObserver', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined });
  });
  await page.goto('/');
  for (const id of ['intro', 'about', 'approach', 'projects', 'contact']) {
    await page
      .locator(`[data-discovery-section="${id}"]`)
      .scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        page.evaluate(
          (key) => JSON.parse(localStorage.getItem(key) || '{}').seen || [],
          storageKey,
        ),
      )
      .toContain(id);
  }
  expect(await awards(page)).toContain('story');
});

test('discoveries modal closes and restores focus without moving the page', async ({
  page,
}) => {
  await page.goto('/');
  await consoleClaim(page);
  await page.locator('#discoveries-toggle').scrollIntoViewIfNeeded();
  const scroll = await page.evaluate(() => scrollY);
  await page.locator('#discoveries-toggle').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#discoveries-close')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#reset-discoveries')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('#discoveries-toggle')).toBeFocused();
  await expect(page.locator('#discoveries-toggle')).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await page.locator('#discoveries-toggle').click();
  await page.locator('#discoveries-close').click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('appearance buttons support Space before any discoveries', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.locator('[data-theme-choice="light"]').focus();
  await page.keyboard.press(
    testInfo.project.name === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await expect(page.locator('[data-theme-choice="dark"]')).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await awards(page)).toContain('keyboard');
});

test('appearance follows system, persists overrides and passes dark accessibility', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('[data-theme-choice="system"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(
    await page
      .locator('html')
      .evaluate((element) => getComputedStyle(element).colorScheme),
  ).toBe('dark');
  await page.locator('[data-theme-choice="light"]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.locator('[data-theme-choice="dark"]').click();
  await page.reload();
  expect(
    await page
      .locator('html')
      .evaluate((element) => getComputedStyle(element).colorScheme),
  ).toBe('dark');
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await consoleClaim(page);
  await page.locator('#discoveries-toggle').click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await page.locator('[data-theme-choice="system"]').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
  expect(
    await page
      .locator('html')
      .evaluate((element) => getComputedStyle(element).colorScheme),
  ).toBe('light');
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(
    await page
      .locator('html')
      .evaluate((element) => getComputedStyle(element).colorScheme),
  ).toBe('dark');
});

test('new achievements require interaction and persist on reload', async ({
  page,
}) => {
  await page.goto('/');
  expect(await awards(page)).not.toContain('light');
  await page.locator('[data-theme-choice="system"]').click();
  expect(await awards(page)).not.toContain('light');
  await page.locator('[data-theme-choice="dark"]').click();
  expect(await awards(page)).toContain('light');
  await page.locator('#beeglebug').focus();
  await page.keyboard.press('Space');
  expect(await awards(page)).toContain('bug');
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('#discovery-count')).toHaveText(
    `${(await awards(page)).length}/6`,
  );
  await expect(page.locator('#discovery-star')).toBeHidden();
  await expect(page.locator('[data-achievement="light"]')).toContainText(
    'Different light',
  );
  await expect(page.locator('[data-achievement="bug"]')).toHaveAttribute(
    'data-unlocked',
    '',
  );
  await page.keyboard.press('Escape');
  await page.reload();
  await page.locator('#discoveries-toggle').click();
  await expect(page.locator('[data-achievement="light"]')).toContainText(
    'Different light',
  );
  await expect(page.locator('[data-achievement="bug"]')).toHaveAttribute(
    'data-unlocked',
    '',
  );
});

for (const last of ['bug', 'light', 'console', 'source']) {
  test(`all six completion works when the last discovery is ${last}`, async ({
    page,
  }) => {
    const ids = ['keyboard', 'story', 'light', 'bug', 'console', 'source'];
    await page.addInitScript(
      ({ key, awarded }) => {
        localStorage.setItem(key, JSON.stringify({ awarded, seen: [] }));
      },
      { key: storageKey, awarded: ids.filter((id) => id !== last) },
    );
    await page.goto('/');
    await expect(page.locator('#discovery-star')).toBeHidden();
    await expect(page.locator('#completion-notification')).toBeHidden();
    if (last === 'bug') await page.locator('#beeglebug').click();
    if (last === 'light')
      await page.locator('[data-theme-choice="dark"]').click();
    if (last === 'console') await consoleClaim(page);
    if (last === 'source') {
      await page.locator('#discoveries-toggle').click();
      await page.locator('#source-code').fill('BUILT-WITH-CARE');
      await page.locator('#source-form button').click();
    }
    await expect(page.locator('#discovery-count')).toHaveText('6/6');
    await expect(page.locator('#discovery-star')).toBeVisible();
    await expect(page.locator('#achievement-notification')).toBeVisible();
    await expect(page.locator('#completion-notification')).toBeHidden();
    await expect(page.locator('#completion-notification')).toBeVisible({
      timeout: 6000,
    });
    await expect(page.locator('#completion-notification')).toContainText(
      'All six achievements unlocked!',
    );
    await expect(page.locator('#achievement-notification')).toBeHidden();
    // A repeated claim must not create another completion toast.
    await consoleClaim(page);
    if (last !== 'source') await page.locator('#discoveries-toggle').click();
    await page.locator('#reset-discoveries').click();
    await expect(page.locator('#discovery-count')).toHaveText('0/6');
    await expect(page.locator('#discovery-star')).toBeHidden();
    await expect(page.locator('#completion-notification')).toBeHidden();
  });
}

test('completed progress restores the star without replaying the celebration', async ({
  page,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        awarded: ['keyboard', 'story', 'light', 'bug', 'console', 'source'],
        seen: [],
      }),
    );
  }, storageKey);
  await page.goto('/');
  await expect(page.locator('#discovery-count')).toHaveText('6/6');
  await expect(page.locator('#discovery-star')).toBeVisible();
  await expect(page.locator('#completion-notification')).toBeHidden();
  await consoleClaim(page);
  await expect(page.locator('#completion-notification')).toBeHidden();
  await page.reload();
  await expect(page.locator('#discovery-star')).toBeVisible();
  await expect(page.locator('#completion-notification')).toBeHidden();
});

test('hero canvas respects reduced motion and offers a pause control', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const canvas = page.locator('[data-hero-canvas]');
  const control = page.getByRole('button', {
    name: 'Animation',
    exact: true,
  });
  await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  await expect(control).toBeVisible();
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  await expect
    .poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.width))
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  await page.locator('.hero').scrollIntoViewIfNeeded();
  // Let scroll-triggered observation and canvas resizing settle before sampling.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  const pixels = () =>
    canvas.evaluate((element: HTMLCanvasElement) => {
      const pixels = element.toDataURL();
      let hash = 0;
      for (let i = 0; i < pixels.length; i++)
        hash = (hash * 31 + pixels.charCodeAt(i)) | 0;
      return hash;
    });
  const paused = await pixels();
  await page.waitForTimeout(150);
  expect(await pixels()).toBe(paused);
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.hero').scrollIntoViewIfNeeded();
  await expect.poll(pixels).not.toBe(paused);
});

for (const completion of [false, true]) {
  test(`achievement toast opens modal at footer: completion=${completion}`, async ({
    page,
  }) => {
    if (completion) {
      await page.addInitScript(() => {
        localStorage.setItem(
          'stuartlee:discoveries:v1',
          JSON.stringify({
            awarded: ['keyboard', 'story', 'light', 'bug', 'source'],
            seen: [],
          }),
        );
      });
    }
    await page.goto('/');
    await consoleClaim(page);
    const toast = page.locator(
      completion
        ? '#completion-notification button'
        : '#achievement-notification button',
    );
    await expect(toast).toBeVisible();
    await toast.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#discoveries-close')).toBeFocused();
    await expect(page.locator('#discoveries-toggle')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(500);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.locator('#discoveries-toggle')).toBeFocused();
    await expect(page.locator('#discoveries-toggle')).toBeInViewport();
    await expect(toast).toBeHidden();
  });
}
