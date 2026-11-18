import type { Messages } from '../i18n.svelte.ts';

// Strain library, strain detail and the new-strain flow.
export const messages: Record<string, Messages> = {
	en: {
		strainCount: { one: '{count} strain', other: '{count} strains' }, inStashCount: '{count} in stash',
		addStrain: 'Add strain', all: 'All', filterByType: 'Filter by type',
		noStrains: 'No strains yet. Add the ones you use, and sessions can work out THC for you.',
		noStrainsOfType: 'No strains of this type yet.',
		allStrains: 'All strains', yourRating: 'Your rating', addNote: 'Add a note', editNote: 'Edit note', strainNotePh: 'Taste, smell, how it felt, would you buy it again', inStash: 'In stash', update: 'Update',
		yourSessions: 'Your sessions', noStrainSessions: 'No sessions with this strain yet.',
		deleteStrain: 'Delete strain', deleteStrainBody: 'This deletes the strain from your library. Past sessions with it are kept.',
		strainNotFound: 'This strain is not in your library. It may have been deleted.',
		qStrainName: 'What is it called?', strainType: 'Type', breederOptional: 'Breeder (optional)', breederPh: 'For example Dutch Passion',
		qStrainLabel: 'What does the label say?', strainLabelSub: 'You enter this once. Sessions use it to work out THC.',
		terpenesOptional: 'Terpenes (optional)',
		qStrainPhoto: 'Add a photo?', strainPhotoSub: 'Optional. It helps you spot the strain in lists.',
		strainPhotoHint: 'Tap to take a photo or choose one', photoPrivateTitle: 'Stays on this device',
		photoPrivateBody: 'Location and camera details are removed before it is saved.',
		saveStrain: 'Save strain', removePhoto: 'Remove photo',
		discardStrain: 'Discard this strain?', discardStrainBody: 'What you entered so far is not saved.',
		discard: 'Discard', keepEditing: 'Keep editing'
	},
	de: {
		strainCount: { one: '{count} Sorte', other: '{count} Sorten' }, inStashCount: '{count} im Vorrat',
		addStrain: 'Sorte hinzufügen', all: 'Alle', filterByType: 'Nach Art filtern',
		noStrains: 'Noch keine Sorten. Füge die hinzu, die du nutzt, dann rechnen Sitzungen das THC für dich aus.',
		noStrainsOfType: 'Noch keine Sorten dieser Art.',
		allStrains: 'Alle Sorten', yourRating: 'Deine Bewertung', addNote: 'Notiz hinzufügen', editNote: 'Notiz bearbeiten', strainNotePh: 'Geschmack, Geruch, wie es sich angefühlt hat, ob du sie wieder kaufen würdest', inStash: 'Im Vorrat', update: 'Ändern',
		yourSessions: 'Deine Sitzungen', noStrainSessions: 'Noch keine Sitzungen mit dieser Sorte.',
		deleteStrain: 'Sorte löschen', deleteStrainBody: 'Die Sorte wird aus deiner Sammlung gelöscht. Frühere Sitzungen damit bleiben erhalten.',
		strainNotFound: 'Diese Sorte ist nicht in deiner Sammlung. Vielleicht wurde sie gelöscht.',
		qStrainName: 'Wie heißt sie?', strainType: 'Art', breederOptional: 'Züchter (optional)', breederPh: 'Zum Beispiel Dutch Passion',
		qStrainLabel: 'Was steht auf dem Etikett?', strainLabelSub: 'Du gibst das einmal ein. Sitzungen rechnen damit das THC aus.',
		terpenesOptional: 'Terpene (optional)',
		qStrainPhoto: 'Ein Foto hinzufügen?', strainPhotoSub: 'Optional. So erkennst du die Sorte in Listen schneller.',
		strainPhotoHint: 'Tippe, um ein Foto aufzunehmen oder auszuwählen', photoPrivateTitle: 'Bleibt auf diesem Gerät',
		photoPrivateBody: 'Standort und Kameradaten werden vor dem Speichern entfernt.',
		saveStrain: 'Sorte speichern', removePhoto: 'Foto entfernen',
		discardStrain: 'Diese Sorte verwerfen?', discardStrainBody: 'Was du bisher eingegeben hast, wird nicht gespeichert.',
		discard: 'Verwerfen', keepEditing: 'Weiter bearbeiten'
	},
	pl: {
		strainCount: { one: '{count} odmiana', few: '{count} odmiany', many: '{count} odmian', other: '{count} odmiany' },
		inStashCount: '{count} w zapasie',
		addStrain: 'Dodaj odmianę', all: 'Wszystkie', filterByType: 'Filtruj według typu',
		noStrains: 'Brak odmian. Dodaj te, których używasz, a sesje same policzą THC.',
		noStrainsOfType: 'Brak odmian tego typu.',
		allStrains: 'Wszystkie odmiany', yourRating: 'Twoja ocena', addNote: 'Dodaj notatkę', editNote: 'Edytuj notatkę', strainNotePh: 'Smak, zapach, jak działa, czy kupić ją znowu', inStash: 'W zapasie', update: 'Zmień',
		yourSessions: 'Twoje sesje', noStrainSessions: 'Brak sesji z tą odmianą.',
		deleteStrain: 'Usuń odmianę', deleteStrainBody: 'Odmiana zniknie z kolekcji. Wcześniejsze sesje z nią zostają.',
		strainNotFound: 'Tej odmiany nie ma w kolekcji. Mogła zostać usunięta.',
		qStrainName: 'Jak się nazywa?', strainType: 'Typ', breederOptional: 'Hodowca (opcjonalnie)', breederPh: 'Na przykład Dutch Passion',
		qStrainLabel: 'Co jest na etykiecie?', strainLabelSub: 'Wpisujesz to raz. Sesje liczą na tej podstawie THC.',
		terpenesOptional: 'Terpeny (opcjonalnie)',
		qStrainPhoto: 'Dodać zdjęcie?', strainPhotoSub: 'Opcjonalnie. Łatwiej wtedy znaleźć odmianę na liście.',
		strainPhotoHint: 'Dotknij, aby zrobić lub wybrać zdjęcie', photoPrivateTitle: 'Zostaje na tym urządzeniu',
		photoPrivateBody: 'Lokalizacja i dane aparatu są usuwane przed zapisaniem.',
		saveStrain: 'Zapisz odmianę', removePhoto: 'Usuń zdjęcie',
		discardStrain: 'Odrzucić tę odmianę?', discardStrainBody: 'To, co wpisano do tej pory, nie zostanie zapisane.',
		discard: 'Odrzuć', keepEditing: 'Edytuj dalej'
	}
};
