// App-wide settings, loaded once from IndexedDB. Theme + locale are applied by the root layout.
import { getSettings, putSettings } from './db.ts';
import { detectLocale, i18n } from './i18n.svelte.ts';
import { DEFAULT_SETTINGS, type Settings } from './model.ts';

export const app = $state<{ settings: Settings; ready: boolean }>({ settings: structuredClone(DEFAULT_SETTINGS), ready: false });

export async function loadSettings() {
	app.settings = await getSettings();
	i18n.locale = app.settings.locale ?? detectLocale();
	app.ready = true;
}

export async function updateSettings(patch: Partial<Settings>) {
	app.settings = { ...app.settings, ...patch };
	if (patch.locale) i18n.locale = patch.locale;
	await putSettings(app.settings);
}

/** light | dark, resolving 'system' against the OS preference. */
export function applyTheme(theme: Settings['theme']) {
	const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
	document.documentElement.dataset.theme = dark ? 'dark' : 'light';
	try { localStorage.setItem('lh-theme', theme); } catch { /* private mode */ }
}
