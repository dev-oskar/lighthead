import type { Messages } from '../i18n.svelte.ts';

// Logging during a tolerance break: the question before the quick log, and the neutral count on the Break screen.
export const messages: Record<string, Messages> = {
	en: {
		'breakAsk.title': 'You are on day {day} of {total}',
		'breakAsk.lead': 'You can end the break now, or log this session and keep the break running.',
		'breakAsk.keep': 'Log and keep the break',
		'breakAsk.end': 'End break and log',
		'breakAsk.logged': { one: '{count} session logged during this break', other: '{count} sessions logged during this break' },
		'breakAsk.startLead': 'Pick a length. You can end it early at any time. If you log a session while it runs, you choose whether the break keeps going.'
	},
	de: {
		'breakAsk.title': 'Du bist an Tag {day} von {total}',
		'breakAsk.lead': 'Du kannst die Pause jetzt beenden oder diese Sitzung eintragen und die Pause weiterlaufen lassen.',
		'breakAsk.keep': 'Eintragen, Pause läuft weiter',
		'breakAsk.end': 'Pause beenden und eintragen',
		'breakAsk.logged': { one: '{count} Sitzung während dieser Pause eingetragen', other: '{count} Sitzungen während dieser Pause eingetragen' },
		'breakAsk.startLead': 'Wähl eine Dauer. Du kannst jederzeit früher aufhören. Wenn du währenddessen eine Sitzung einträgst, entscheidest du, ob die Pause weiterläuft.'
	},
	pl: {
		'breakAsk.title': 'Dzień {day} z {total} przerwy',
		'breakAsk.lead': 'Możesz teraz zakończyć przerwę albo zapisać tę sesję i kontynuować przerwę.',
		'breakAsk.keep': 'Zapisz i kontynuuj przerwę',
		'breakAsk.end': 'Zakończ przerwę i zapisz',
		'breakAsk.logged': {
			one: '{count} sesja w trakcie tej przerwy',
			few: '{count} sesje w trakcie tej przerwy',
			many: '{count} sesji w trakcie tej przerwy',
			other: '{count} sesji w trakcie tej przerwy'
		},
		'breakAsk.startLead': 'Wybierz długość. Możesz ją skończyć wcześniej w każdej chwili. Gdy zapiszesz sesję w trakcie przerwy, zdecydujesz, czy przerwa trwa dalej.'
	}
};
