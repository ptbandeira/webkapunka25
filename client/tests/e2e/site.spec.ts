import { test, expect } from '@playwright/test';

test.describe('Locale routing', () => {
  const locales = ['en', 'pt', 'es'] as const;
  const productSlug = '100ml';

  for (const locale of locales) {
    test(`renders home for /${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('text=Calm, Repair, Protect').first()).toBeVisible();
      await expect(page.locator('text=One ingredient').first()).toBeVisible();
    });

    test(`renders PDP for /${locale}/shop/${productSlug}`, async ({ page }) => {
      await page.goto(`/${locale}/shop/${productSlug}`);
      await expect(page.locator('h1').first()).toHaveText(/Argan Oil/i);
      await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
    });
  }
});

async function setFeatureOverrides(page, overrides) {
  const payload = JSON.stringify(overrides);
  await page.context().addCookies([
    {
      name: 'feature-overrides',
      value: encodeURIComponent(payload),
      url: 'http://127.0.0.1:3000/',
    },
  ]);
  await page.addInitScript(value => {
    window.localStorage.setItem('feature-overrides', value);
  }, payload);
}

async function clearOverrides(page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    window.localStorage.removeItem('feature-overrides');
  });
}

test.describe('Reviews feature flag', () => {
  test(`renders customer reviews when enabled`, async ({ page }) => {
    await setFeatureOverrides(page, { reviews: true });
    try {
      await page.goto('/en');
      await expect(page.getByRole('heading', { name: /What our customers say/i })).toBeVisible();
      await expect(page.getByText('Ana M.')).toBeVisible();
    } finally {
      await clearOverrides(page);
    }
  });
});

test.describe('Search flag flow', () => {
  test('opens search drawer and finds results', async ({ page }) => {
    await setFeatureOverrides(page, { search: true });
    try {
      await page.goto('/en');
      await page.getByLabel('Open search').click();
      const searchInput = page.getByPlaceholder('Search Kapunka...');
      await expect(searchInput).toBeVisible();
      await searchInput.fill('Argan');
      const dialog = page.getByRole('dialog');
      await expect(dialog.locator('a[href="/en/shop/100ml"]').first()).toBeVisible();
    } finally {
      await clearOverrides(page);
    }
  });
});

test.describe('Forms', () => {
  test('contact form validation and submission', async ({ page }) => {
    await page.goto('/en/contact');
    await page.route('**/api/contact', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    const nameInput = page.locator('#name');
    await nameInput.focus();
    await nameInput.blur();
    await expect(page.getByText('Please enter your name.')).toBeVisible();

    await nameInput.fill('Playwright User');
    await page.locator('#email').fill('user@example.com');
    await page.locator('#message').fill('This is a friendly test message.');
    await page.locator('#consent').check();

    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByRole('status').filter({ hasText: 'Thanks — your message has been sent.' })).toBeVisible();
  });

  test('clinics form validation and submission', async ({ page }) => {
    await page.goto('/en/clinics');
    await page.route('**/api/clinics', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    const nameInput = page.locator('#name');
    await nameInput.focus();
    await nameInput.blur();
    await expect(page.getByText('Please enter your name.')).toBeVisible();

    await nameInput.fill('Clinic Tester');
    await page.locator('#clinic').fill('Test Clinic');
    await page.locator('#email').fill('clinic@example.com');
    await page.locator('#phone').fill('+48 123 456 789');
    await page.locator('#message').fill('We are interested in partnering.');
    await page.locator('#consent').check();

    await page.getByRole('button', { name: 'Send inquiry' }).click();

    await expect(page.getByRole('alert').filter({ hasText: /we’ll be in touch/i })).toBeVisible();
  });
});
