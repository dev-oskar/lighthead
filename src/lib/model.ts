// Types and pure logic. No IndexedDB, no DOM: everything here is unit-tested.

export type StrainType = 'indica' | 'sativa' | 'hybrid' | 'cbd';
export type Method = 'joint' | 'vape' | 'bong' | 'edible';
export type Unit = 'g' | 'mg';
export const METHODS: Method[] = ['joint', 'vape', 'bong', 'edible'];
export const STRAIN_TYPES: StrainType[] = ['indica', 'sativa', 'hybrid', 'cbd'];
export const EFFECTS = ['calm', 'happy', 'creative', 'focused', 'sleepy', 'hungry', 'dryMouth', 'anxious'] as const;
export const SETTINGS_PLACES = ['home', 'outside', 'friends', 'party'] as const;
export const TERPENES = ['Myrcene', 'Limonene', 'Caryophyllene', 'Terpinolene', 'Pinene', 'Linalool'];
export const BREAK_LENGTHS = [2, 7, 14, 21, 28];
const DAY = 86_400_000;

export interface Strain {
	id: string;
	name: string;
	type: StrainType;
	breeder?: string;
	thc: number; // percent
	cbd: number; // percent
	terpenes: string[];
	photo?: Blob; // from prepareStrainPhoto
	rating?: number; // 1–5
	note?: string; // the user's own opinion
	stashG?: number;
	createdAt: number;
	updatedAt: number;
}

/** A session keeps a snapshot of the strain; editing or deleting the strain never changes it. */
export interface Session {
	id: string;
	at: number;
	strainId?: string;
	strainName: string;
	strainType: StrainType;
	thc: number;
	cbd: number;
	mgThc?: number;
	method: Method;
	amount: number;
	unit: Unit;
	tempC?: number; // vaporiser temperature, vape sessions only
	setting?: string; // key from SETTINGS_PLACES
	effects: string[]; // keys from EFFECTS
	rating?: number;
	note?: string;
}

export interface Break {
	id: string;
	start: number;
	lengthDays: number;
	endedAt?: number;
	notes: { at: number; text: string }[]; // "Notes on this break"
}

export interface Settings {
	locale?: 'en' | 'de' | 'pl';
	theme: 'system' | 'light' | 'dark';
	lastStrainId?: string;
	lastMethod?: Method;
	lastTempC?: number;
	amountByStrain: Record<string, { amount: number; unit: Unit; tempC?: number }>;
	/** First-run onboarding was finished or skipped. */
	onboarded?: boolean;
}

export const DEFAULT_SETTINGS: Settings = { theme: 'system', amountByStrain: {} };

export const DEFAULT_TEMP_C = 190;

export const unitFor = (m: Method): Unit => (m === 'edible' ? 'mg' : 'g');

/** THC in the material (not absorbed, never a "dose"): grams × THC % × 10. Edibles: the mg is THC already. */
export function mgThc(amount: number, unit: Unit, thcPct: number): number {
	return unit === 'mg' ? amount : Math.round(amount * thcPct * 10);
}

export function snapshot(strain: Strain, s: Pick<Session, 'method' | 'amount' | 'unit'>) {
	return {
		strainId: strain.id,
		strainName: strain.name,
		strainType: strain.type,
		thc: strain.thc,
		cbd: strain.cbd,
		mgThc: mgThc(s.amount, s.unit, strain.thc)
	};
}

/** Defaults for the quick log: last strain, last method, last amount (and vape temperature) for that strain, now. */
export function prefill(settings: Settings, strains: Strain[], strainId?: string) {
	const id = strainId ?? (strains.some((s) => s.id === settings.lastStrainId) ? settings.lastStrainId : strains[0]?.id);
	const method = settings.lastMethod ?? 'vape';
	const unit = unitFor(method);
	const last = id ? settings.amountByStrain[id] : undefined;
	const amount = last && last.unit === unit ? last.amount : unit === 'mg' ? 5 : 0.15;
	const lastTemp = last?.tempC ?? settings.lastTempC;
	return {
		strainId: id, method, unit, amount, amountIsLast: !!last && last.unit === unit,
		tempC: lastTemp ?? DEFAULT_TEMP_C, tempIsLast: lastTemp != null, at: Date.now()
	};
}

/** Stash change caused by a session: flower grams leave the stash. Never below 0. */
export function applyStash(stashG: number | undefined, amount: number, unit: Unit, sign: 1 | -1 = -1): number | undefined {
	if (stashG == null || unit !== 'g') return stashG;
	return Math.max(0, +(stashG + sign * amount).toFixed(2));
}

export function startOfDay(ms: number): number {
	const d = new Date(ms);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

/** First day of week for a locale (1 = Monday … 7 = Sunday), Monday when unknown. */
export function firstDayOfWeek(locale: string): number {
	try {
		const l = new Intl.Locale(locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number } };
		return l.getWeekInfo?.().firstDay ?? l.weekInfo?.firstDay ?? 1;
	} catch {
		return 1;
	}
}

export type Period = 'week' | 'month' | 'year';

/** [start, end) of the period containing `now`, and of the previous one. */
export function periodRange(period: Period, now: number, locale = 'en'): { start: number; end: number; prevStart: number } {
	const d = new Date(startOfDay(now));
	if (period === 'week') {
		const first = firstDayOfWeek(locale) % 7; // JS: 0 = Sunday
		const back = (d.getDay() - first + 7) % 7;
		const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - back).getTime();
		const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() - back + 7).getTime();
		const prevStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() - back - 7).getTime();
		return { start, end, prevStart };
	}
	if (period === 'month')
		return {
			start: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
			end: new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(),
			prevStart: new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime()
		};
	return {
		start: new Date(d.getFullYear(), 0, 1).getTime(),
		end: new Date(d.getFullYear() + 1, 0, 1).getTime(),
		prevStart: new Date(d.getFullYear() - 1, 0, 1).getTime()
	};
}

/** [start, end) of the previous period up to the same point: as many whole days as have begun in the current
 *  period (today included), clamped to the previous period's length. DST-safe: calendar days, not 24h steps. */
export function previousSpan(period: Period, now: number, locale = 'en'): { start: number; end: number } {
	const r = periodRange(period, now, locale);
	const p = new Date(r.prevStart);
	const end = new Date(p.getFullYear(), p.getMonth(), p.getDate() + daysBetween(r.start, now) + 1).getTime();
	return { start: r.prevStart, end: Math.min(end, r.start) };
}

export interface Totals {
	grams: number;
	edibleMg: number;
	sessions: number;
	mgThc: number;
	daysClear: number;
	byStrain: { name: string; grams: number }[];
}

/** Totals over [start, end). `daysClear` counts only days up to `now`. */
export function totals(sessions: Session[], start: number, end: number, now = Date.now()): Totals {
	const inRange = sessions.filter((s) => s.at >= start && s.at < end);
	const used = new Set(inRange.map((s) => startOfDay(s.at)));
	let daysClear = 0;
	for (let d = start; d < Math.min(end, now + 1); d = new Date(new Date(d).setDate(new Date(d).getDate() + 1)).getTime())
		if (!used.has(d)) daysClear++;
	const by = new Map<string, number>();
	let grams = 0, edibleMg = 0, mg = 0;
	for (const s of inRange) {
		if (s.unit === 'g') {
			grams += s.amount;
			by.set(s.strainName, (by.get(s.strainName) ?? 0) + s.amount);
		} else edibleMg += s.amount;
		mg += s.mgThc ?? 0;
	}
	return {
		grams: +grams.toFixed(2),
		edibleMg,
		sessions: inRange.length,
		mgThc: Math.round(mg),
		daysClear,
		byStrain: [...by].map(([name, g]) => ({ name, grams: +g.toFixed(2) })).sort((a, b) => b.grams - a.grams)
	};
}

/** Grams per day for the 7 days ending today, oldest first (sparkline). */
export function dailyGrams(sessions: Session[], now: number, days = 7): number[] {
	const today = startOfDay(now);
	const out: number[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const d0 = new Date(new Date(today).setDate(new Date(today).getDate() - i)).getTime();
		const d1 = new Date(new Date(d0).setDate(new Date(d0).getDate() + 1)).getTime();
		out.push(+sessions.filter((s) => s.unit === 'g' && s.at >= d0 && s.at < d1).reduce((a, s) => a + s.amount, 0).toFixed(2));
	}
	return out;
}

/** Day N of a break (1-based, capped at length) and days left. */
/** Midnight after the break's last calendar day (DST-safe: calendar arithmetic, not 24h steps). */
export function breakEnd(b: Break): number {
	const d = new Date(startOfDay(b.start));
	d.setDate(d.getDate() + b.lengthDays);
	return d.getTime();
}

/** Calendar days from a to b (DST-safe). */
const daysBetween = (a: number, b: number) => Math.round((startOfDay(b) - startOfDay(a)) / DAY);

export function breakProgress(b: Break, now: number) {
	const end = breakEnd(b);
	const day = Math.min(b.lengthDays, daysBetween(b.start, now) + 1);
	return { day: Math.max(1, day), daysLeft: Math.max(0, b.lengthDays - day), end, complete: !b.endedAt && now >= end };
}

export const activeBreak = (breaks: Break[], now: number) => breaks.find((b) => !b.endedAt && now < breakEnd(b));

/** Sessions grouped by local day, newest day first. */
export function groupByDay(sessions: Session[]): { day: number; sessions: Session[] }[] {
	const map = new Map<number, Session[]>();
	for (const s of [...sessions].sort((a, b) => b.at - a.at)) {
		const k = startOfDay(s.at);
		map.set(k, [...(map.get(k) ?? []), s]);
	}
	return [...map].map(([day, sessions]) => ({ day, sessions }));
}

/** NumberField logic (from the design system): parse comma or point, clamp, snap to step. */
export function clamp(v: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, +(+v).toFixed(4)));
}
export function nudge(v: number, dir: 1 | -1, step: number, min: number, max: number): number {
	return clamp(Math.round((v + dir * step) / step) * step, min, max);
}

export const uid = () => crypto.randomUUID();
