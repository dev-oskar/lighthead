import { expect, test } from '@playwright/test'; // plain test: a fresh browser, onboarding not done

test.use({ viewport: { width: 390, height: 844 } });

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

	// Install: Safari steps (headless Chromium never offers its own prompt).
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
