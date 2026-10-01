import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 412, height: 915 } });

test('verify short form video feed and event boundary overlay', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  // Take main video feed screenshot
  await page.screenshot({ path: 'video_feed.png' });

  // Click Condition Selector Button
  await page.click('button:has-text("fixation")');
  await page.waitForTimeout(500);

  // Take condition selector modal screenshot
  await page.screenshot({ path: 'condition_selector.png' });

  // Start Session
  await page.click('button:has-text("Start Session")');
  await page.waitForTimeout(500);
});
