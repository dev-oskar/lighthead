import { expect, test } from './fixtures.ts';

test('Settings links to How your data is kept and to Questions', async ({ page }) => {
	await page.goto('/settings');
	await page.getByRole('link', { name: 'How your data is kept' }).click();
	await expect(page).toHaveURL(/\/privacy$/);
	await expect(page.getByRole('heading', { level: 1, name: 'How your data is kept' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Source code on GitHub' })).toHaveAttribute('href', 'https://github.com/dev-oskar/lighthead');

	await page.getByRole('button', { name: 'Settings' }).click();
	await page.getByRole('link', { name: 'Questions' }).click();
	await expect(page).toHaveURL(/\/help$/);
	await expect(page.getByRole('heading', { level: 1, name: 'Questions' })).toBeVisible();
	const answer = page.getByText('Each browser keeps its own journal, so');
	await expect(answer).toBeHidden();
	await page.getByText('Why can’t I see my data on my computer?').click();
	await expect(answer).toBeVisible();
	await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible(); // not a flow: tab bar stays
});

test('both pages render in German', async ({ page }) => {
	await page.goto('/settings');
	await page.getByRole('radio', { name: 'Deutsch' }).click();
	await page.getByRole('link', { name: 'So werden deine Daten aufbewahrt' }).click();
	await expect(page.getByRole('heading', { level: 1, name: 'So werden deine Daten aufbewahrt' })).toBeVisible();
	await page.goto('/help');
	await expect(page.getByRole('heading', { level: 1, name: 'Fragen' })).toBeVisible();
	await page.getByText('Wie lösche ich alles?').click();
	await expect(page.getByText('Lösch die Daten dieser Seite')).toBeVisible();
});

test('privacy and help load offline after the first visit', async ({ page, context }) => {
	await page.goto('/');
	await page.evaluate(() => navigator.serviceWorker.ready);
	await page.reload(); // now controlled by the service worker
	await context.route('**/*', (r) => r.abort('internetdisconnected'));
	await page.goto('/privacy');
	await expect(page.getByRole('heading', { level: 1, name: 'How your data is kept' })).toBeVisible();
	await page.goto('/help');
	await expect(page.getByRole('heading', { level: 1, name: 'Questions' })).toBeVisible();
});
