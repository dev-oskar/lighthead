<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.scss';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		// Dynamic import: virtual:pwa-register only exists client-side, and this
		// keeps it out of the SSR/prerender bundle entirely.
		import('virtual:pwa-register').then(({ registerSW }) => {
			registerSW({ immediate: true });
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
