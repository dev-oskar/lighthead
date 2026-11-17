import type { Messages } from '../i18n.svelte.ts';

// Messages for the form/feedback design-system components and their dev gallery (/dev/ds-a).
export const messages: Record<string, Messages> = {
	en: {
		language: 'Language', week: 'Week', month: 'Month', year: 'Year', period: 'Period',
		strainName: 'Strain name', strainNamePh: 'e.g. Northern Lights', strainNameError: 'Add a name so you can find this strain later.',
		breeder: 'Breeder', note: 'Note', noteHint: 'Only you can see this.',
		privateTitle: 'Your data stays on this device', privateBody: 'Nothing is sent anywhere. No account, no tracking.',
		backupTitle: 'Back up your journal', backupBody: 'With Premium, an encrypted copy stays safe even if you lose your phone.', learnMore: 'Learn more',
		stashLow: 'Your stash is running low.', deleteForGood: 'This deletes the session for good.'
	},
	de: {
		language: 'Sprache', week: 'Woche', month: 'Monat', year: 'Jahr', period: 'Zeitraum',
		strainName: 'Name der Sorte', strainNamePh: 'z. B. Northern Lights', strainNameError: 'Gib einen Namen ein, damit du die Sorte später wiederfindest.',
		breeder: 'Züchter', note: 'Notiz', noteHint: 'Das siehst nur du.',
		privateTitle: 'Deine Daten bleiben auf diesem Gerät', privateBody: 'Nichts wird verschickt. Kein Konto, kein Tracking.',
		backupTitle: 'Sichere dein Tagebuch', backupBody: 'Mit Premium bleibt eine verschlüsselte Kopie sicher, auch wenn du dein Handy verlierst.', learnMore: 'Mehr erfahren',
		stashLow: 'Dein Vorrat geht zur Neige.', deleteForGood: 'Damit wird die Session endgültig gelöscht.'
	},
	pl: {
		language: 'Język', week: 'Tydzień', month: 'Miesiąc', year: 'Rok', period: 'Okres',
		strainName: 'Nazwa odmiany', strainNamePh: 'np. Northern Lights', strainNameError: 'Dodaj nazwę, żeby łatwo znaleźć tę odmianę później.',
		breeder: 'Hodowca', note: 'Notatka', noteHint: 'Widzisz to tylko ty.',
		privateTitle: 'Twoje dane zostają na tym urządzeniu', privateBody: 'Nic nie jest nigdzie wysyłane. Bez konta, bez śledzenia.',
		backupTitle: 'Zrób kopię dziennika', backupBody: 'Z Premium zaszyfrowana kopia jest bezpieczna, nawet gdy zgubisz telefon.', learnMore: 'Dowiedz się więcej',
		stashLow: 'Zapas się kończy.', deleteForGood: 'To usunie sesję na zawsze.'
	}
};
