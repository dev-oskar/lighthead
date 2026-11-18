import type { Messages } from '../i18n.svelte.ts';

// Today, Journal and the quick log.
export const messages: Record<string, Messages> = {
	en: {
		'log.journal': 'Journal', 'log.logSession': 'Log session', 'log.yesterday': 'Yesterday',
		'log.thisWeek': 'This week', 'log.lastSession': 'Last session', 'log.agoAt': 'ago, at {time}', 'log.none': 'None yet',
		'log.sessionCount': { one: '{count} session', other: '{count} sessions' },
		'log.emptyToday': 'Nothing logged yet. When you log a session, it shows up here.',
		'log.emptyJournal': 'Your journal is empty for now. Logged sessions appear here, newest first.',
		'log.changeTime': 'Change time', 'log.time': 'Time',
		'log.newStrain': 'New strain', 'log.noStrains': 'No strains yet. Add one, then log your session.',
		'log.discardTitle': 'Discard this session?', 'log.discard': 'Discard', 'log.keepLogging': 'Keep logging',
		'log.notePh': 'Anything worth remembering?', 'log.temperature': 'Temperature', 'log.editSession': 'Edit session', 'log.deleteSession': 'Delete session'
	},
	de: {
		'log.journal': 'Tagebuch', 'log.logSession': 'Sitzung eintragen', 'log.yesterday': 'Gestern',
		'log.thisWeek': 'Diese Woche', 'log.lastSession': 'Letzte Sitzung', 'log.agoAt': 'her, um {time}', 'log.none': 'Noch keine',
		'log.sessionCount': { one: '{count} Sitzung', other: '{count} Sitzungen' },
		'log.emptyToday': 'Noch nichts eingetragen. Wenn du eine Sitzung einträgst, erscheint sie hier.',
		'log.emptyJournal': 'Dein Tagebuch ist noch leer. Eingetragene Sitzungen erscheinen hier, die neueste zuerst.',
		'log.changeTime': 'Zeit ändern', 'log.time': 'Zeit',
		'log.newStrain': 'Neue Sorte', 'log.noStrains': 'Noch keine Sorten. Leg eine an, dann trag deine Sitzung ein.',
		'log.discardTitle': 'Diese Sitzung verwerfen?', 'log.discard': 'Verwerfen', 'log.keepLogging': 'Weiter eintragen',
		'log.notePh': 'Etwas, das du dir merken willst?', 'log.temperature': 'Temperatur', 'log.editSession': 'Sitzung bearbeiten', 'log.deleteSession': 'Sitzung löschen'
	},
	pl: {
		'log.journal': 'Dziennik', 'log.logSession': 'Dodaj sesję', 'log.yesterday': 'Wczoraj',
		'log.thisWeek': 'Ten tydzień', 'log.lastSession': 'Ostatnia sesja', 'log.agoAt': 'temu, o {time}', 'log.none': 'Jeszcze brak',
		'log.sessionCount': { one: '{count} sesja', few: '{count} sesje', many: '{count} sesji', other: '{count} sesji' },
		'log.emptyToday': 'Nic jeszcze nie zapisano. Gdy dodasz sesję, pojawi się tutaj.',
		'log.emptyJournal': 'Dziennik jest na razie pusty. Dodane sesje pojawią się tutaj, od najnowszej.',
		'log.changeTime': 'Zmień godzinę', 'log.time': 'Godzina',
		'log.newStrain': 'Nowa odmiana', 'log.noStrains': 'Nie ma jeszcze odmian. Dodaj jedną, a potem zapisz sesję.',
		'log.discardTitle': 'Odrzucić tę sesję?', 'log.discard': 'Odrzuć', 'log.keepLogging': 'Wróć do sesji',
		'log.notePh': 'Coś wartego zapamiętania?', 'log.temperature': 'Temperatura', 'log.editSession': 'Edytuj sesję', 'log.deleteSession': 'Usuń sesję'
	}
};
