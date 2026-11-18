import { expect, test } from './fixtures.ts';

// The fastest log: three taps in the same spot (Continue, Continue, Skip), then the session shows on Today and in the Journal.
test('quick log with prefilled defaults', async ({ page }) => {
	await page.goto('/');
	// Seed one strain straight into IndexedDB (same schema as src/lib/db.ts).
	await page.evaluate(
		() =>
			new Promise<void>((res, rej) => {
				const req = indexedDB.open('lighthead', 1);
				req.onupgradeneeded = () => {
					const d = req.result;
					d.createObjectStore('strains', { keyPath: 'id' });
					const s = d.createObjectStore('sessions', { keyPath: 'id' });
					s.createIndex('at', 'at');
					s.createIndex('strainId', 'strainId');
					d.createObjectStore('breaks', { keyPath: 'id' });
					d.createObjectStore('settings');
				};
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
	await page.reload();
	await expect(page.getByText('Nothing logged yet', { exact: false })).toBeVisible();

	await page.getByRole('button', { name: 'Log session' }).click();
	await expect(page.getByRole('radio', { name: /Northern Lights/ })).toHaveAttribute('aria-checked', 'true');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByText('How much?')).toBeVisible();
	// Vape (the default method) asks for the temperature, prefilled with 190 °C.
	await expect(page.getByLabel('Temperature', { exact: true })).toHaveValue('190');
	await page.getByLabel('Temperature', { exact: true }).fill('200');
	await page.getByLabel('Temperature', { exact: true }).blur();
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('button', { name: 'Skip' }).click();

	await expect(page.getByText('Session saved')).toBeVisible();
	await expect(page.getByText(/Northern Lights · 0\.15\s?g · Vape · 200\s?°C/)).toBeVisible();
	await page.getByRole('button', { name: 'Done' }).click();

	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('heading', { name: 'Northern Lights' })).toBeVisible();
	await page.goto('/log');
	await expect(page.getByText('1 session')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Northern Lights' })).toBeVisible();
	await expect(page.getByText(/Vape · 200\s?°C/)).toBeVisible();

	// Next time the temperature starts where it was left; other methods don't ask for it.
	await page.goto('/log/new');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByLabel('Temperature', { exact: true })).toHaveValue('200');
	await page.getByRole('radio', { name: /Joint/ }).click();
	await expect(page.getByLabel('Temperature', { exact: true })).toHaveCount(0);
});
