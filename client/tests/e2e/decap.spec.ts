import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

const homeJson = path.resolve(__dirname, '../../public/content/en/pages/home.json');
const backupJson = `${homeJson}.bak-test`;

async function withHomeRenamed(run: () => Promise<void>) {
  await fs.rm(backupJson, { force: true });
  await fs.rename(homeJson, backupJson);
  try {
    await run();
  } finally {
    await fs.rename(backupJson, homeJson);
  }
}

test.describe('Decap content smoke', () => {
  test('home renders decap sections and falls back to legacy when missing', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'One ingredient. Real results.' })).toBeVisible();
    await expect(page.locator('#bestSellersReact')).toBeVisible();

    await withHomeRenamed(async () => {
      await page.goto('/?fallback=1');
      await expect(page.locator('#bestSellersReact')).toHaveCount(0);
      await expect(page.locator('img[src="images/product-item1.jpg"]')).toBeVisible();
    });

    await page.goto('/?restored=1');
    await expect(page.locator('#bestSellersReact')).toBeVisible();
  });

  test('shop page lists products from normalized content', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.getByRole('heading', { name: 'Shop' })).toBeVisible();
    await expect(page.getByText('Argan Oil 30ml')).toBeVisible();
  });
});
