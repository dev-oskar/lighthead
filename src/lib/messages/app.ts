import type { Messages } from '../i18n.svelte.ts';

// Shared app-level messages. Features add their own file next to this one (messages/<feature>.ts).
export const messages: Record<string, Messages> = {
	en: {
		appName: 'LightHead', settings: 'Settings', dryMouth: 'Dry mouth', anxious: 'Anxious',
		setting: 'Setting', home: 'At home', outside: 'Outside', friends: 'With friends', party: 'Party',
		storedOnDevice: 'Stored on this device only', delete: 'Delete', cancel: 'Cancel', save: 'Save', edit: 'Edit',
		gUnit: 'g', mgUnit: 'mg'
	},
	de: {
		appName: 'LightHead', settings: 'Einstellungen', dryMouth: 'Trockener Mund', anxious: 'Unruhig',
		setting: 'Umgebung', home: 'Zu Hause', outside: 'Draußen', friends: 'Mit Freunden', party: 'Party',
		storedOnDevice: 'Nur auf diesem Gerät gespeichert', delete: 'Löschen', cancel: 'Abbrechen', save: 'Speichern', edit: 'Bearbeiten',
		gUnit: 'g', mgUnit: 'mg'
	},
	pl: {
		appName: 'LightHead', settings: 'Ustawienia', dryMouth: 'Suchość w ustach', anxious: 'Niepokój',
		setting: 'Miejsce', home: 'W domu', outside: 'Na zewnątrz', friends: 'Ze znajomymi', party: 'Impreza',
		storedOnDevice: 'Zapisane tylko na tym urządzeniu', delete: 'Usuń', cancel: 'Anuluj', save: 'Zapisz', edit: 'Edytuj',
		gUnit: 'g', mgUnit: 'mg'
	}
};
