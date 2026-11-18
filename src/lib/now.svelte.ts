import { onMount } from 'svelte';

/** Reactive clock for a page: `clock.now` refreshes once a minute while the tab is visible and when it becomes visible
 *  again, so "today" moves on after midnight. Call during component init. */
export function useNow() {
	const clock = $state({ now: Date.now() });
	onMount(() => {
		const tick = () => { if (document.visibilityState === 'visible') clock.now = Date.now(); };
		const id = setInterval(tick, 60_000);
		document.addEventListener('visibilitychange', tick);
		return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); };
	});
	return clock;
}
