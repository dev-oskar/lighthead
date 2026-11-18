import { expect, test, type Page } from './fixtures.ts';

test.use({ viewport: { width: 390, height: 844 } });

// One strain and a 21-day break started 8 days ago (day 9), seeded straight into IndexedDB (schema of src/lib/db.ts).
async function seed(page: Page) {
	await page.goto('/');
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
					const tx = req.result.transaction(['strains', 'breaks'], 'readwrite');
					tx.objectStore('strains').put({
						id: 'nl', name: 'Northern Lights', type: 'indica', thc: 18, cbd: 0.1, terpenes: [], createdAt: Date.now(), updatedAt: Date.now()
					});
					tx.objectStore('breaks').put({ id: 'b1', start: Date.now() - 8 * 86_400_000, lengthDays: 21, notes: [] });
					tx.oncomplete = () => { req.result.close(); res(); };
					tx.onerror = () => rej(tx.error);
				};
			})
	);
}

test('log during a break and keep it running', async ({ page }) => {
	await seed(page);
	await page.goto('/log/new');
	await expect(page.getByRole('heading', { name: 'You are on day 9 of 21' })).toBeVisible();
	await page.getByRole('button', { name: 'Log and keep the break' }).click();
	await expect(page.getByText('What did you have?')).toBeVisible();
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('button', { name: 'Skip' }).click();
	await expect(page.getByText('Session saved')).toBeVisible();

	await page.goto('/break');
	await expect(page.getByRole('heading', { name: 'Day 9 of 21' })).toBeVisible();
	await expect(page.getByText('1 session logged during this break')).toBeVisible();
});

test('end the break, then log', async ({ page }) => {
	await seed(page);
	await page.goto('/log/new');
	await page.getByRole('button', { name: 'End break and log' }).click();
	await expect(page.getByText('What did you have?')).toBeVisible();

	await page.goto('/break');
	await expect(page.getByRole('heading', { name: 'Take a break' })).toBeVisible();
});
