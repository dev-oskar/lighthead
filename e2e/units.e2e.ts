import { expect, test, type Page } from './fixtures.ts';

// One strain, seeded straight into IndexedDB (schema of src/lib/db.ts; the fixture has created the stores).
async function seedStrain(page: Page) {
	await page.evaluate(
		() =>
			new Promise<void>((res, rej) => {
				const req = indexedDB.open('lighthead', 1);
				req.onerror = () => rej(req.error);
				req.onsuccess = () => {
					const tx = req.result.transaction('strains', 'readwrite');
					tx.objectStore('strains').put({
						id: 'nl', name: 'Northern Lights', type: 'indica', thc: 18, cbd: 0.1, terpenes: [], createdAt: Date.now(), updatedAt: Date.now()
					});
					tx.oncomplete = () => { req.result.close(); res(); };
					tx.onerror = () => rej(tx.error);
				};
			})
	);
}

test('°F in Settings changes the quick log, the session card and Stats', async ({ page }) => {
	await seedStrain(page);
	await page.goto('/stats');
	await expect(page.getByText('Vape temperature')).toHaveCount(0);

	await page.goto('/settings');
	const unit = page.getByRole('radiogroup', { name: 'Temperature' });
	const tab = (name: string) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });
	await expect(unit.getByRole('radio', { name: '°C' })).toHaveAttribute('aria-checked', 'true'); // en-GB
	await unit.getByRole('radio', { name: '°F' }).click();
	await expect(unit.getByRole('radio', { name: '°F' })).toHaveAttribute('aria-checked', 'true');

	// In-app navigation: a page.goto right away could cut off the settings write.
	await tab('Today').click();
	await page.getByRole('button', { name: 'Log session' }).click();
	await page.getByRole('button', { name: 'Continue' }).click();
	const temp = page.getByLabel('Temperature', { exact: true });
	await expect(temp).toHaveValue('374'); // the 190 °C default
	await page.getByRole('button', { name: 'Increase Temperature' }).click();
	await expect(temp).toHaveValue('380');
	await temp.fill('392');
	await temp.blur();
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('button', { name: 'Skip' }).click();
	await expect(page.getByText(/Vape · 392\s?°F/)).toBeVisible();
	await page.getByRole('button', { name: 'Done' }).click();

	await page.goto('/log');
	await expect(page.getByText(/Vape · 392\s?°F/)).toBeVisible();

	// Stored as °C: back in °C the same session reads 200 °C, and "same as last time" still holds in °F.
	await page.goto('/log/new');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(temp).toHaveValue('392');
	await expect(page.getByText('Same as last time')).toHaveCount(2); // amount and temperature

	await page.goto('/stats');
	await expect(page.getByText('Vape temperature', { exact: true })).toBeVisible();
	await expect(page.getByText('Vape temperature by strain')).toBeVisible();
	await expect(page.getByText(/^392\s?°F · 1 session$/)).toBeVisible();

	await page.goto('/settings');
	await unit.getByRole('radio', { name: '°C' }).click();
	await tab('Today').click();
	await tab('Journal').click();
	await expect(page.getByText(/Vape · 200\s?°C/)).toBeVisible();
});

test.describe('in the US', () => {
	test.use({ locale: 'en-US' });
	test('defaults to °F', async ({ page }) => {
		await seedStrain(page);
		await page.goto('/log/new');
		await page.getByRole('button', { name: 'Continue' }).click();
		await expect(page.getByLabel('Temperature', { exact: true })).toHaveValue('374');
	});
});
