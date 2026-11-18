import { test as base } from '@playwright/test';

export { expect, type Page } from '@playwright/test';

// Every test starts from a fresh browser, which would land on first-run onboarding (/welcome).
// This `test` marks onboarding as done in IndexedDB (schema of src/lib/db.ts) first; e2e/onboarding.e2e.ts uses the plain one.
export const test = base.extend({
	page: async ({ page }, use) => {
		await page.goto('/welcome');
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
						const tx = req.result.transaction('settings', 'readwrite');
						const store = tx.objectStore('settings');
						const get = store.get('app');
						get.onsuccess = () => store.put({ theme: 'system', amountByStrain: {}, ...get.result, onboarded: true }, 'app');
						tx.oncomplete = () => { req.result.close(); res(); };
						tx.onerror = () => rej(tx.error);
					};
				})
		);
		await use(page);
	}
});
