import { expect, test } from './fixtures.ts';

// Privacy + offline: the app never contacts another origin, and works with no network once installed.
test('makes no third-party requests and works offline after first load', async ({ page, context, baseURL }) => {
	const foreign: string[] = [];
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	page.on('request', (r) => { if (!r.url().startsWith(baseURL!) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) foreign.push(r.url()); });

	await page.goto('/');
	await page.evaluate(() => navigator.serviceWorker.ready);
	await page.reload(); // now controlled by the service worker

	for (const path of ['/log', '/strains', '/stats', '/break', '/settings']) await page.goto(path);
	expect(foreign).toEqual([]);

	// Server unreachable: abort everything that reaches the network (service-worker cache hits are untouched).
	// (context.setOffline interferes unreliably with service-worker responses in Chromium.)
	await context.route('**/*', (r) => r.abort('internetdisconnected'));
	errors.length = 0;
	await page.goto('/stats');
	await expect(page.getByRole('navigation')).toBeVisible();
	await page.goto('/strains/new');
	await expect(page.getByRole('progressbar')).toBeVisible();
	expect(errors).toEqual([]);
});
