import { num, t } from '#lib/i18n.svelte.ts';

/** Grams with only the decimals it needs: 3.2 g, 0.15 g, 0 g. */
export function grams(g = 0): string {
	const c = Math.round(g * 100);
	return `${num(g, c % 10 ? 2 : c % 100 ? 1 : 0)} ${t('gUnit')}`;
}
