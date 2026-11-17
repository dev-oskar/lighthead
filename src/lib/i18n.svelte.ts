// Locale state + t/num/pct. Logic copied from the design system bundle (translate/formatNumber/formatPercent).
// Message packs: every src/lib/messages/*.ts exports `messages: { en, de, pl }`; they are merged, so a
// feature adds its own file instead of editing a shared one.

export type Messages = Record<string, string | { one?: string; few?: string; many?: string; other: string }>;
export type Locale = 'en' | 'de' | 'pl';
export const LOCALES: Locale[] = ['en', 'de', 'pl'];

const packs = import.meta.glob<{ messages: Record<string, Messages> }>('./messages/*.ts', { eager: true });
const MESSAGES: Record<string, Messages> = {};
for (const mod of Object.values(packs))
	for (const [loc, pack] of Object.entries(mod.messages)) MESSAGES[loc] = { ...MESSAGES[loc], ...pack };

export const i18n = $state<{ locale: Locale }>({ locale: 'en' });

export function detectLocale(): Locale {
	for (const l of navigator.languages ?? []) {
		const base = l.slice(0, 2) as Locale;
		if (LOCALES.includes(base)) return base;
	}
	return 'en';
}

export function translate(locale: string, key: string, vars?: Record<string, string | number>): string {
	const pack = MESSAGES[locale] ?? MESSAGES.en;
	let msg = pack[key] ?? MESSAGES.en[key];
	if (msg == null) return key;
	if (typeof msg === 'object') {
		let cat = 'other';
		try { cat = new Intl.PluralRules(locale).select(Number(vars?.count ?? 0)); } catch { /* keep other */ }
		msg = (msg as Record<string, string>)[cat] ?? msg.other;
	}
	return String(msg).replace(/\{(\w+)\}/g, (_, k) => (vars?.[k] != null ? String(vars[k]) : ''));
}

export function formatNumber(locale: string, n: number, decimals = 0): string {
	try { return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n); }
	catch { return (+n).toFixed(decimals); }
}

export function formatPercent(locale: string, n: number, decimals = 1): string {
	try { return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: decimals }).format(n / 100); }
	catch { return n + '%'; }
}

/** Parse a typed number; accepts a comma or a point. */
export function parseNumber(s: string): number | null {
	const v = parseFloat(String(s).replace(',', '.'));
	return Number.isNaN(v) ? null : v;
}

/** Locale for formatting: the device's full tag (en-GB: 24h, Monday weeks) when its language is the app language. */
export function region(): string {
	const dev = typeof navigator === 'undefined' ? '' : navigator.language;
	return dev.toLowerCase().split('-')[0] === i18n.locale ? dev : i18n.locale;
}

// Reactive in templates because they read i18n.locale.
export const t = (key: string, vars?: Record<string, string | number>) => translate(i18n.locale, key, vars);
export const num = (n: number, decimals?: number) => formatNumber(region(), n, decimals);
export const pct = (n: number, decimals?: number) => formatPercent(region(), n, decimals);
export const time = (ms: number) => new Intl.DateTimeFormat(region(), { hour: '2-digit', minute: '2-digit' }).format(ms);
export const date = (ms: number, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }) =>
	new Intl.DateTimeFormat(region(), opts).format(ms);
