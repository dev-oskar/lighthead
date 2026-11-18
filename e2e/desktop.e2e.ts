import { expect, test } from './fixtures.ts';

// Desktop (>= 960px) swaps the bottom TabBar for a left rail; phones keep the TabBar.
test('desktop shows the rail, phone shows the tab bar', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');
	const rail = page.locator('.lh-rail');
	const tabbar = page.locator('.lh-tabbar');
	await expect(rail).toBeVisible();
	await expect(tabbar).toBeHidden();
	await expect(rail.getByRole('button', { name: 'Log session' })).toBeVisible();
	for (const name of ['Today', 'Journal', 'Strains', 'Stats', 'Break', 'Settings'])
		await expect(rail.getByRole('link', { name })).toBeVisible();
	await expect(rail.getByRole('link', { name: 'Today' })).toHaveAttribute('aria-current', 'page');

	await rail.getByRole('link', { name: 'Strains' }).click();
	await expect(page).toHaveURL(/\/strains$/);
	await expect(rail.getByRole('link', { name: 'Strains' })).toHaveAttribute('aria-current', 'page');
	await expect(rail.getByRole('link', { name: 'Today' })).not.toHaveAttribute('aria-current', 'page');

	await page.setViewportSize({ width: 390, height: 844 });
	await expect(tabbar).toBeVisible();
	await expect(rail).toBeHidden();
});
