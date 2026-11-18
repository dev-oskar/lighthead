// App updates: a new service worker waits (no skipWaiting on install) until the person taps Reload,
// so an open page never runs old JS against a new worker's cache. `update.ready` drives the notice.
import { browser, dev } from '$app/env';

export const update = $state({ ready: false });

const CHECK_EVERY = 5 * 60_000; // installed iOS PWAs resume without re-checking: check on return, at most this often
let reg: ServiceWorkerRegistration | undefined;
let reloading = false;

if (browser && !dev && 'serviceWorker' in navigator) {
	const sw = navigator.serviceWorker;
	// Kit registers the worker on 'load'; `ready` waits for that (and for a first install, which needs no notice).
	sw.ready.then((r) => {
		reg = r;
		if (r.waiting && sw.controller) update.ready = true;
		r.addEventListener('updatefound', () => {
			const next = r.installing;
			next?.addEventListener('statechange', () => {
				if (next.state === 'installed' && sw.controller) update.ready = true;
			});
		});
	});
	const hadController = !!sw.controller;
	sw.addEventListener('controllerchange', () => {
		if (reloading) location.reload();
		// Another tab applied the update: this page still runs the old build, so offer the reload here too.
		else if (hadController) update.ready = true;
	});
	let lastCheck = Date.now();
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState !== 'visible' || !reg || Date.now() - lastCheck < CHECK_EVERY) return;
		lastCheck = Date.now();
		reg.update().catch(() => {}); // offline: try again next time
	});
}

export function applyUpdate() {
	if (reloading) return;
	reloading = true;
	if (reg?.waiting) {
		reg.waiting.postMessage({ type: 'skip-waiting' });
		setTimeout(() => location.reload(), 3000); // the waiting worker was replaced by a newer one: reload anyway
	} else location.reload(); // another tab already activated it: this page just needs the new JS
}
