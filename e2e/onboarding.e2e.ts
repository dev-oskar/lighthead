import { expect, test } from '@playwright/test'; // plain test: a fresh browser, onboarding not done

// An iPhone: the install step shows Safari's Share steps (headless Chromium never offers its own prompt).
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const DESKTOP_CHROME = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
test.use({ viewport: { width: 390, height: 844 }, userAgent: IPHONE });

test('first launch shows onboarding once', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/welcome$/);
	await expect(page.getByRole('heading', { level: 1, name: 'LightHead' })).toBeVisible();
	await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '3');
	await expect(page.locator('.lh-tabbar')).toHaveCount(0);

	// Language switches live.
	await page.getByRole('radio', { name: 'Deutsch' }).click();
	await expect(page.getByText('Nur auf diesem Gerät gespeichert')).toBeVisible();
	await page.getByRole('radio', { name: 'English' }).click();
	await page.getByRole('button', { name: 'Continue' }).click();

	// Install: Safari steps.
	await expect(page.getByRole('heading', { name: 'Keep it on your home screen' })).toBeVisible();
	await expect(page.getByText('Add to Home Screen')).toBeVisible();
	await page.getByRole('button', { name: 'Skip' }).click();

	await expect(page.getByRole('heading', { name: 'What do you have at home?' })).toBeVisible();
	await page.getByRole('button', { name: 'Later' }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('.lh-tabbar')).toBeVisible();

	// Back must not reopen onboarding
	await page.goBack();
	await expect(page).not.toHaveURL(/\/welcome/);
	await page.goto('/');

	await page.reload();
	await expect(page.locator('.lh-tabbar')).toBeVisible();
	await expect(page).toHaveURL(/\/$/);
});

test('privacy and help open directly from the landing page, onboarding comes with the app', async ({ page }) => {
	await page.goto('/privacy');
	await expect(page.getByRole('heading', { level: 1, name: 'How your data is kept' })).toBeVisible();
	await page.goto('/help');
	await expect(page).toHaveURL(/\/help$/);
	await page.goto('/');
	await expect(page).toHaveURL(/\/welcome$/);
});

test('language picked during onboarding is kept', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('radio', { name: 'Deutsch' }).click();
	await page.getByRole('button', { name: 'Weiter' }).click();
	await page.getByRole('button', { name: 'Überspringen' }).click();
	await page.getByRole('button', { name: 'Sorte hinzufügen' }).click();

	// The new-strain flow, then back to Today.
	await page.getByLabel('Name der Sorte').fill('Amnesia');
	for (let n = 0; n < 2; n++) await page.getByRole('button', { name: 'Weiter' }).click();
	await page.getByRole('button', { name: 'Überspringen' }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('navigation').getByText('Statistik')).toBeVisible();

	await page.reload();
	await expect(page).toHaveURL(/\/$/);
});

test('installed app skips the install step', async ({ page }) => {
	await page.addInitScript(() => {
		const mm = window.matchMedia.bind(window);
		window.matchMedia = (q: string) => (q === '(display-mode: standalone)' ? ({ ...mm(q), matches: true } as MediaQueryList) : mm(q));
	});
	await page.goto('/');
	await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '2');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByRole('heading', { name: 'What do you have at home?' })).toBeVisible();
});

test.describe('desktop', () => {
	test.use({ viewport: { width: 1440, height: 900 }, userAgent: DESKTOP_CHROME });

	test('brand panel, centred step, no install step without a browser prompt', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/welcome$/);
		await expect(page.locator('aside.brand')).toBeVisible();
		await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
		await expect(page.getByRole('heading', { level: 1, name: 'LightHead' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Which language?' })).toBeVisible();

		// The ActionBar sits right under the step, not at the window's bottom edge.
		const box = (await page.getByRole('button', { name: 'Continue' }).boundingBox())!;
		expect(box.y + box.height).toBeLessThan(900 - 150);

		// Headless Chromium never fires beforeinstallprompt: nothing to install, so two steps.
		await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '2');
		await page.getByRole('button', { name: 'Continue' }).click();
		await expect(page.getByRole('heading', { name: 'What do you have at home?' })).toBeVisible();
	});

	test.describe('Safari on a Mac', () => {
		test.use({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15' });

		test('shows the Add to Dock steps', async ({ page }) => {
			await page.goto('/');
			await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '3');
			await page.getByRole('button', { name: 'Continue' }).click();
			await expect(page.getByRole('heading', { name: 'Install it on this computer' })).toBeVisible();
			await expect(page.getByText('Add to Dock')).toBeVisible();
		});
	});
});
