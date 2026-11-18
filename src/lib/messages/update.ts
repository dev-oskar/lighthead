import type { Messages } from '../i18n.svelte.ts';

// App update notice (src/lib/update.svelte.ts) and the build line in Settings.
export const messages: Record<string, Messages> = {
	en: {
		'update.ready': 'A new version is ready.',
		'update.reload': 'Reload',
		'update.version': 'Version {date}, {time}'
	},
	de: {
		'update.ready': 'Eine neue Version ist bereit.',
		'update.reload': 'Neu laden',
		'update.version': 'Version vom {date}, {time}'
	},
	pl: {
		'update.ready': 'Nowa wersja jest gotowa.',
		'update.reload': 'Odśwież',
		'update.version': 'Wersja z {date}, {time}'
	}
};
