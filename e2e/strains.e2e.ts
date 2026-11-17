import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, locale: 'en-US' });

test('create, update stash and edit a strain', async ({ page }) => {
	await page.goto('/strains');
	await page.getByRole('button', { name: 'Add strain' }).first().click();

	// Step 1: name is required.
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByLabel('Strain name')).toBeFocused();
	await page.getByLabel('Strain name').fill('Durban Poison');
	await page.getByRole('radio', { name: /Sativa/ }).click();
	await page.getByLabel('Breeder (optional)').fill('Dutch Passion');
	await page.getByRole('button', { name: 'Continue' }).click();

	// Step 2: label facts.
	await page.getByLabel('THC', { exact: true }).fill('21');
	await page.getByLabel('THC', { exact: true }).blur();
	await page.getByRole('button', { name: 'Pinene' }).click();
	await page.getByRole('button', { name: 'Continue' }).click();

	// Step 3: skip the photo.
	await expect(page.getByText('Stays on this device')).toBeVisible();
	await page.getByRole('button', { name: 'Skip' }).click();

	// Detail.
	await expect(page.getByRole('heading', { level: 1, name: 'Durban Poison' })).toBeVisible();

	// In the list.
	await page.getByRole('button', { name: 'All strains' }).click();
	const card = page.getByRole('link', { name: /Durban Poison/ });
	await expect(card).toContainText(/THC\s*21\s?%/);
	await expect(page.getByText(/1 strain · 0 in stash/i)).toBeVisible();

	// Update the stash.
	await card.click();
	await page.getByRole('button', { name: 'Update' }).click();
	await page.getByLabel('In stash', { exact: true }).fill('3.2');
	await page.getByRole('button', { name: 'Save', exact: true }).click();
	await expect(page.getByText(/^3[.,]2\s?g$/)).toBeVisible();

	// Edit THC to 22.
	await page.getByRole('button', { name: 'Edit' }).click();
	await expect(page.getByLabel('Strain name')).toHaveValue('Durban Poison');
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByLabel('THC', { exact: true }).fill('22');
	await page.getByLabel('THC', { exact: true }).blur();
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('button', { name: 'Save strain' }).click();
	await expect(page.getByRole('heading', { level: 1, name: 'Durban Poison' })).toBeVisible();

	await page.getByRole('button', { name: 'All strains' }).click();
	await expect(page.getByRole('link', { name: /Durban Poison/ })).toContainText(/THC\s*22\s?%/);
	await expect(page.getByRole('link', { name: /Durban Poison/ })).toContainText(/3[.,]2\s?g/);
});
