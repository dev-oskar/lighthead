import { expect, test } from './fixtures.ts';

test.use({ viewport: { width: 390, height: 844 } });

test('start a 7-day break, then end it', async ({ page }) => {
	await page.goto('/break');
	await page.getByRole('radio', { name: '7 days' }).click();
	await page.getByRole('button', { name: 'Start a break' }).click();
	await expect(page.getByRole('heading', { name: 'Day 1 of 7' })).toBeVisible();

	await page.getByRole('button', { name: 'End break' }).click();
	await page.getByRole('button', { name: 'End break' }).click(); // in-page confirm
	await expect(page.getByRole('heading', { name: 'Take a break' })).toBeVisible();
	await expect(page.getByText('Past breaks')).toBeVisible();
	await expect(page.getByText('1 of 7 days')).toBeVisible();
});

test('settings: theme, language and backup', async ({ page }) => {
	await page.goto('/settings');

	await page.getByRole('radio', { name: 'Dark' }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

	const download = page.waitForEvent('download');
	await page.getByRole('button', { name: 'Save a backup file' }).click();
	expect((await download).suggestedFilename()).toMatch(/^lighthead-\d{4}-\d{2}-\d{2}\.json$/);

	await page.getByRole('radio', { name: 'Deutsch' }).click();
	await expect(page.getByRole('navigation').getByText('Statistik')).toBeVisible();
});
