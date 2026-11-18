// Builds the static landing page into landing/dist: one template, one page per language. No dependencies.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { strings } from './src/strings.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const root = (p) => here('../' + p);
const dist = here('dist/');
const ORIGIN = 'https://lighthead.app';
const LANGS = { en: '/', de: '/de/', pl: '/pl/' };

// Icon paths come from the app's own icon set, drawn like src/lib/ds/Icon.svelte.
const PATHS = Object.fromEntries([...readFileSync(root('src/lib/icons.ts'), 'utf8').matchAll(/^\s*'?(\w+)'?:\s*'([^']+)'/gm)].map((m) => [m[1], m[2]]));
const icon = (name, size) => {
	if (!PATHS[name]) throw new Error(`Unknown icon ${name}`);
	return `<svg class="lh-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="${PATHS[name]}"/></svg>`;
};

const keys = Object.keys(strings.en).sort().join();
for (const l of Object.keys(LANGS)) if (Object.keys(strings[l]).sort().join() !== keys) throw new Error(`strings.${l} keys differ from en`);

const template = readFileSync(here('src/template.html'), 'utf8');
rmSync(dist, { recursive: true, force: true });

for (const [lang, path] of Object.entries(LANGS)) {
	const s = strings[lang];
	const links = Object.entries(LANGS).map(([l, p]) => l === lang
		? `<a href="${p}" hreflang="${l}" lang="${l}" aria-current="page"><b>${l.toUpperCase()}</b></a>`
		: `<a href="${p}" hreflang="${l}" lang="${l}">${l.toUpperCase()}</a>`);
	const vars = {
		lang,
		canonical: ORIGIN + path,
		alternates: [...Object.entries(LANGS).map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN + p}">`), `<link rel="alternate" hreflang="x-default" href="${ORIGIN}/">`].join('\n'),
		langs: `<span class="lang" role="group" aria-label="${s.langLabel}">${links.join(' · ')}</span>`,
		...s
	};
	const html = template.replace(/\{\{([\w:]+)\}\}/g, (_, k) => {
		if (k.startsWith('icon:')) { const [, n, size] = k.split(':'); return icon(n, size); }
		if (!(k in vars)) throw new Error(`Missing string "${k}" for ${lang}`);
		return vars[k];
	});
	mkdirSync(dist + path, { recursive: true });
	writeFileSync(dist + path + 'index.html', html);
}

const copy = (from, to) => cpSync(from, dist + to, { recursive: true });
copy(here('src/landing.css'), 'landing.css');
copy(here('404.html'), '404.html');
copy(here('_headers'), '_headers');
copy(root('static/icon.svg'), 'icon.svg');
copy(root('static/apple-touch-icon.png'), 'apple-touch-icon.png');
copy(root('static/licenses/fonts-OFL.txt'), 'licenses/fonts-OFL.txt');
copy(root('docs/screenshots/phone-today.png'), 'img/phone-today.png');
copy(root('docs/screenshots/phone-quick-log.png'), 'img/phone-quick-log.png');
copy(root('docs/screenshots/desktop-stats.png'), 'img/desktop-stats.png');
for (const f of ['AtkinsonHyperlegibleNext-Regular', 'AtkinsonHyperlegibleNext-SemiBold', 'AtkinsonHyperlegibleNext-Bold', 'AtkinsonHyperlegibleMono-Regular', 'BricolageGrotesque-SemiBold'])
	copy(root(`src/lib/assets/fonts/${f}.woff2`), `fonts/${f}.woff2`);

console.log('Landing page built in landing/dist (en, de, pl)');
