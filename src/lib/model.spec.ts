import { describe, expect, it, vi } from 'vitest';
import {
	applyStash, breakEnd, cToF, defaultTempUnit, fToC, vapeTemps, breakProgress, clamp, dailyGrams, DEFAULT_SETTINGS, groupByDay, mgThc, nudge, periodRange, prefill, previousSpan, snapshot, totals,
	type Session, type Strain
} from './model.ts';
import { initials } from './photo.ts';
import { formatNumber, formatPercent, parseNumber, translate } from './i18n.svelte.ts';

const nl: Strain = { id: 'nl', name: 'Northern Lights', type: 'indica', thc: 18, cbd: 0.2, terpenes: [], stashG: 3.2, createdAt: 0, updatedAt: 0 };
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();
const sess = (p: Partial<Session>): Session => ({ id: Math.random() + '', at: 0, strainName: 'Northern Lights', strainType: 'indica', thc: 18, cbd: 0.2, method: 'vape', amount: 0.15, unit: 'g', effects: [], ...p });

describe('THC and snapshot', () => {
	it('derives mg THC from grams × % × 10', () => expect(mgThc(0.15, 'g', 18)).toBe(27));
	it('takes edible mg as THC', () => expect(mgThc(5, 'mg', 18)).toBe(5));
	it('snapshots the strain at save time', () => {
		const snap = snapshot(nl, { method: 'vape', amount: 0.15, unit: 'g' });
		expect(snap).toMatchObject({ strainName: 'Northern Lights', thc: 18, mgThc: 27 });
	});
});

describe('prefill', () => {
	it('uses last strain, method and amount for that strain', () => {
		const p = prefill({ ...DEFAULT_SETTINGS, lastStrainId: 'nl', lastMethod: 'joint', amountByStrain: { nl: { amount: 0.3, unit: 'g' } } }, [nl]);
		expect(p).toMatchObject({ strainId: 'nl', method: 'joint', amount: 0.3, amountIsLast: true });
	});
	it('falls back to sensible defaults', () => expect(prefill(DEFAULT_SETTINGS, [])).toMatchObject({ strainId: undefined, method: 'vape', amount: 0.15, tempC: 190, tempIsLast: false }));
	it('vape temperature: this strain, else the last one used, else 190', () => {
		const set = { ...DEFAULT_SETTINGS, lastTempC: 185, amountByStrain: { nl: { amount: 0.1, unit: 'g' as const, tempC: 200 } } };
		expect(prefill(set, [nl], 'nl')).toMatchObject({ tempC: 200, tempIsLast: true });
		expect(prefill({ ...set, amountByStrain: {} }, [nl], 'nl')).toMatchObject({ tempC: 185, tempIsLast: true });
	});
});

describe('stash', () => {
	it('subtracts grams, never below 0', () => {
		expect(applyStash(3.2, 0.15, 'g')).toBe(3.05);
		expect(applyStash(0.1, 0.15, 'g')).toBe(0);
	});
	it('ignores edibles and untracked stash', () => {
		expect(applyStash(3.2, 5, 'mg')).toBe(3.2);
		expect(applyStash(undefined, 0.15, 'g')).toBeUndefined();
	});
	it('gives back on delete', () => expect(applyStash(3.05, 0.15, 'g', 1)).toBe(3.2));
});

describe('periods and totals', () => {
	it('starts the week on Monday for de and pl', () => {
		const r = periodRange('week', at(2026, 10, 21), 'de'); // Wednesday
		expect(new Date(r.start).getDate()).toBe(19);
		expect(new Date(r.end).getDate()).toBe(26);
	});
	it('sums grams, mg THC, sessions and days clear', () => {
		const r = periodRange('week', at(2026, 10, 21), 'pl');
		const list = [sess({ at: at(2026, 10, 19) }), sess({ at: at(2026, 10, 19, 21), amount: 0.3, mgThc: 54 }), sess({ at: at(2026, 10, 21), unit: 'mg', method: 'edible', amount: 5, mgThc: 5 }), sess({ at: at(2026, 10, 10) })];
		list[0].mgThc = 27;
		const tot = totals(list, r.start, r.end, at(2026, 10, 21, 23));
		expect(tot).toMatchObject({ grams: 0.45, edibleMg: 5, sessions: 3, mgThc: 86, daysClear: 1 });
		expect(tot.byStrain).toEqual([{ name: 'Northern Lights', grams: 0.45 }]);
	});
	it('builds a 7-day trend, oldest first', () => {
		const tr = dailyGrams([sess({ at: at(2026, 10, 21) }), sess({ at: at(2026, 10, 15) })], at(2026, 10, 21, 22));
		expect(tr).toEqual([0.15, 0, 0, 0, 0, 0, 0.15]);
	});
	it('groups by day, newest first', () => {
		const g = groupByDay([sess({ at: at(2026, 10, 19) }), sess({ at: at(2026, 10, 21) }), sess({ at: at(2026, 10, 21, 20) })]);
		expect(g.map((x) => x.sessions.length)).toEqual([2, 1]);
	});
});

describe('previousSpan: same elapsed span of the previous period', () => {
	const span = (p: 'week' | 'month' | 'year', now: number) => previousSpan(p, now, 'de');
	it('week: Mon–Wed vs Mon–Wed', () => expect(span('week', at(2026, 11, 18, 9))).toEqual({ start: at(2026, 11, 9, 0), end: at(2026, 11, 12, 0) }));
	it('week: Monday morning vs last Monday', () => expect(span('week', at(2026, 11, 16, 1))).toEqual({ start: at(2026, 11, 9, 0), end: at(2026, 11, 10, 0) }));
	it('month: days 1–17 vs days 1–17', () => expect(span('month', at(2026, 11, 17))).toEqual({ start: at(2026, 10, 1, 0), end: at(2026, 10, 18, 0) }));
	it('month: clamps to a shorter previous month', () => expect(span('month', at(2026, 3, 31))).toEqual({ start: at(2026, 2, 1, 0), end: at(2026, 3, 1, 0) }));
	it('year: same day count', () => expect(span('year', at(2026, 3, 1))).toEqual({ start: at(2025, 1, 1, 0), end: at(2025, 3, 2, 0) }));
	it('year: clamps after a leap year', () => expect(span('year', at(2024, 12, 31))).toEqual({ start: at(2023, 1, 1, 0), end: at(2024, 1, 1, 0) }));
	it('ends at local midnight across a DST change', () => {
		vi.stubEnv('TZ', 'Europe/Berlin'); // clocks go back on 25 Oct 2026
		try {
			expect(span('month', at(2026, 11, 30))).toEqual({ start: at(2026, 10, 1, 0), end: at(2026, 10, 31, 0) });
			expect(span('week', at(2026, 10, 28))).toEqual({ start: at(2026, 10, 19, 0), end: at(2026, 10, 22, 0) });
			expect(new Date(span('month', at(2026, 11, 30)).end).getHours()).toBe(0);
		} finally {
			vi.unstubAllEnvs();
		}
	});
});

describe('break', () => {
	it('counts day N of total', () => {
		const b = { id: 'b', start: at(2026, 10, 13, 9), lengthDays: 21, notes: [] };
		expect(breakProgress(b, at(2026, 10, 21))).toMatchObject({ day: 9, daysLeft: 12, complete: false });
		expect(breakProgress(b, at(2026, 11, 20))).toMatchObject({ day: 21, daysLeft: 0, complete: true });
	});
	it('ends at midnight after the last calendar day, even when started late and across DST', () => {
		const b = { id: 'b', start: at(2026, 10, 20, 22), lengthDays: 7, notes: [] }; // DST ends 25 Oct in Europe
		expect(breakProgress(b, at(2026, 10, 26, 23))).toMatchObject({ day: 7, complete: false });
		expect(breakProgress(b, at(2026, 10, 27, 0) + 1)).toMatchObject({ complete: true });
		expect(breakEnd(b)).toBe(at(2026, 10, 27, 0));
	});
});

describe('design-system helpers', () => {
	it('makes initials', () => {
		expect(initials('Northern Lights')).toBe('NL');
		expect(initials('ACDC')).toBe('AC');
		expect(initials('Gelato #41')).toBe('G4');
		expect(initials('łódzka mgła')).toBe('ŁM');
	});
	it('clamps and nudges NumberField values', () => {
		expect(clamp(12, 0, 10)).toBe(10);
		expect(nudge(0.15, 1, 0.05, 0, 10)).toBe(0.2);
		expect(nudge(0, -1, 0.05, 0, 10)).toBe(0);
		expect(parseNumber('0,15')).toBe(0.15);
		expect(parseNumber('abc')).toBeNull();
	});
	it('formats per locale and uses Polish plurals', () => {
		expect(formatNumber('de', 0.15, 2)).toBe('0,15');
		expect(formatPercent('de', 21)).toBe('21\u00a0%');
		expect(formatPercent('pl', 21)).toBe('21%');
		expect(translate('pl', 'daysToGo', { count: 1 })).toBe('Został 1 dzień');
		expect(translate('pl', 'daysToGo', { count: 2 })).toBe('Zostały 2 dni');
		expect(translate('pl', 'daysToGo', { count: 5 })).toBe('Zostało 5 dni');
	});
});

describe('temperature units', () => {
	it('defaults to °F only for a US region', () => {
		expect(defaultTempUnit('en-US')).toBe('F');
		for (const l of ['en', 'en-GB', 'de-DE', 'pl', 'not a locale!']) expect(defaultTempUnit(l)).toBe('C');
	});
	it('converts both ways', () => {
		expect(cToF(190)).toBe(374);
		expect(fToC(392)).toBe(200);
	});
	it('round-trips °F → °C → °F exactly over the whole input range', () => {
		for (let f = 212; f <= 482; f++) expect(cToF(fToC(f))).toBe(f);
	});
});

describe('vapeTemps', () => {
	const day = at(2026, 3, 10);
	it('is undefined without vape temperatures in range', () => {
		expect(vapeTemps([sess({ at: day }), sess({ at: day, method: 'joint', tempC: 190 })], day - 1, day + 1)).toBeUndefined();
	});
	it('gives median, range and per-strain medians, most sessions first', () => {
		const list = [
			sess({ at: day, tempC: 180 }), sess({ at: day, tempC: 200 }), sess({ at: day, tempC: 190 }),
			sess({ at: day, tempC: 210, strainName: 'Lemon Haze' }), sess({ at: day, tempC: 200, strainName: 'Lemon Haze' }),
			sess({ at: day + 10, tempC: 250 }) // out of range
		];
		expect(vapeTemps(list, day - 1, day + 1)).toEqual({
			count: 5, median: 200, min: 180, max: 210,
			byStrain: [{ name: 'Northern Lights', median: 190, count: 3 }, { name: 'Lemon Haze', median: 205, count: 2 }]
		});
	});
});
