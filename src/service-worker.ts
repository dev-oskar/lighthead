/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
// Precache the whole app (build output + static files + the SPA shell) and serve it cache-first,
// so LightHead works fully offline and never needs the network after install.
import { self } from '$app/service-worker';
import { version } from '$app/env';
import { immutable, assets } from '$app/manifest';

const CACHE = `lighthead-${version}`;
const SHELL = 'index.html'; // adapter-static fallback page
const url = (p: string) => new URL(p, self.registration.scope).href;
const FILES = [...immutable, ...assets].map((f) => url(f.path)).concat(url(SHELL));

self.addEventListener('install', (e) => {
	e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (e) => {
	const req = e.request;
	if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
	e.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);
			if (req.mode === 'navigate') return (await cache.match(url(SHELL))) ?? fetch(req);
			return (await cache.match(req)) ?? fetch(req);
		})()
	);
});
