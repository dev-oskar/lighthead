import { expect, test } from './fixtures.ts';

test('settings shows the build version as a date and time', async ({ page }) => {
	await page.goto('/settings');
	await expect(page.locator('footer')).toContainText(/^Version \d{1,2} \w{3,4} \d{4}, \d{2}:\d{2} ·/); // en-GB: 18 Nov 2026, 13:05
	await page.getByRole('radio', { name: 'Deutsch' }).click();
	await expect(page.locator('footer')).toContainText(/^Version vom \d{1,2}\. \S+ \d{4}, \d{2}:\d{2} ·/);
});

// The update flow itself (waiting worker, notice, Reload) needs two real builds; Playwright cannot intercept the
// browser's worker update check. ponytail: verified by hand with two builds served from a swapped folder.
