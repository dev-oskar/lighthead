import { date, num, t } from '#lib/i18n.svelte.ts';
import { startOfDay, type Session, type Unit } from '#lib/model.ts';

/** "0.15 g", "0.3 g", "5 mg": only the decimals the amount needs, thin space before the unit. */
export function amountText(amount: number, unit: Unit) {
	const c = Math.round(amount * 100);
	return num(amount, c % 10 ? 2 : c % 100 ? 1 : 0) + ' ' + t(unit === 'g' ? 'gUnit' : 'mgUnit');
}

/** "190 °C" */
export const tempText = (c: number) => num(c) + ' °C';

/** "Vape · 190 °C", "Joint" */
export const methodText = (s: Pick<Session, 'method' | 'tempC'>) => [t(s.method), s.tempC != null ? tempText(s.tempC) : ''].filter(Boolean).join(' · ');

/** Day heading: Today, Yesterday, or the full date. */
export function dayLabel(day: number, now = Date.now()) {
	const today = startOfDay(now);
	if (day === today) return t('today');
	if (day === startOfDay(today - 1)) return t('log.yesterday');
	return date(day);
}
