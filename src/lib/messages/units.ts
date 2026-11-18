import type { Messages } from '../i18n.svelte.ts';

// Temperature unit setting (Settings) and vape temperature on Stats.
export const messages: Record<string, Messages> = {
	en: {
		'units.title': 'Units',
		'units.temperature': 'Temperature',
		'units.vapeTemp': 'Vape temperature',
		'units.vapeTempByStrain': 'Vape temperature by strain',
		'units.nSessions': { one: '{count} session', other: '{count} sessions' }
	},
	de: {
		'units.title': 'Einheiten',
		'units.temperature': 'Temperatur',
		'units.vapeTemp': 'Vaporizer-Temperatur',
		'units.vapeTempByStrain': 'Vaporizer-Temperatur nach Sorte',
		'units.nSessions': { one: '{count} Sitzung', other: '{count} Sitzungen' }
	},
	pl: {
		'units.title': 'Jednostki',
		'units.temperature': 'Temperatura',
		'units.vapeTemp': 'Temperatura waporyzacji',
		'units.vapeTempByStrain': 'Temperatura waporyzacji według odmiany',
		// Nominative for a tile note ("4 sesje"); insights' nSessions is accusative.
		'units.nSessions': { one: '{count} sesja', few: '{count} sesje', many: '{count} sesji', other: '{count} sesji' }
	}
};
