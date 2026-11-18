import type { Messages } from '../i18n.svelte.ts';

// Shown in-page when an IndexedDB write fails (e.g. storage full). The user's input stays on screen.
export const messages: Record<string, Messages> = {
	en: { 'errors.saveFailed': 'That did not save, but nothing is lost: try again, and check that your device has some free space.' },
	de: { 'errors.saveFailed': 'Das wurde nicht gespeichert, aber nichts ist verloren: Versuch es noch einmal und schau, ob dein Gerät noch freien Speicher hat.' },
	pl: { 'errors.saveFailed': 'Nie udało się zapisać, ale nic nie przepadło: spróbuj jeszcze raz i sprawdź, czy na urządzeniu jest wolne miejsce.' }
};
