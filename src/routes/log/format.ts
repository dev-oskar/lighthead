import { app } from '#lib/app-state.svelte.ts';
import { date, num, region, t } from '#lib/i18n.svelte.ts';
import { cToF, defaultTempUnit, startOfDay, type Session, type TempUnit, type Unit } from '#lib/model.ts';

/** "0.15 g", "0.3 g", "5 mg": only the decimals the amount needs, thin space before the unit. */
export function amountText(amount: number, unit: Unit) {
	const c = Math.round(amount * 100);
	return num(amount, c % 10 ? 2 : c % 100 ? 1 : 0) + ' ' + t(unit === 'g' ? 'gUnit' : 'mgUnit');
}

/** The user's temperature unit: the setting, else by region. */
export const tempUnit = (): TempUnit => app.settings.tempUnit ?? defaultTempUnit(region());
export const tempSymbol = () => '°' + tempUnit();
/** A stored °C value in the user's unit, whole degrees: "190", "374". */
export const tempNum = (c: number) => num(tempUnit() === 'F' ? cToF(c) : c);

/** "190 °C", "374 °F" */
export const tempText = (c: number) => tempNum(c) + ' ' + tempSymbol();

/** "Vape · 190 °C", "Vape · 374 °F", "Joint" */
export const methodText = (s: Pick<Session, 'method' | 'tempC'>) => [t(s.method), s.tempC != null ? tempText(s.tempC) : ''].filter(Boolean).join(' · ');

/** Day heading: Today, Yesterday, or the full date. */
export function dayLabel(day: number, now = Date.now()) {
	const today = startOfDay(now);
	if (day === today) return t('today');
	if (day === startOfDay(today - 1)) return t('log.yesterday');
	return date(day);
}
