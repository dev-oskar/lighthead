<script lang="ts">
	import '#lib/styles/tokens.css';
	import '#lib/styles/components.css';
	import '#lib/styles/app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import TabBar from '#lib/ds/TabBar.svelte';
	import NavRail from './NavRail.svelte';
	import { app, applyTheme, loadSettings } from '#lib/app-state.svelte.ts';
	import { i18n, t } from '#lib/i18n.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const TABS = [
		{ value: 'today', path: '/', icon: 'home' },
		{ value: 'log', path: '/log', icon: 'session' },
		{ value: 'strains', path: '/strains', icon: 'leaf' },
		{ value: 'stats', path: '/stats', icon: 'stats' },
		{ value: 'break', path: '/break', icon: 'break' }
	] as const;

	// Flows (quick log, new strain) are full-screen: no tab bar.
	const inFlow = $derived(/\/(log|strains)\/new\/?$/.test(page.url.pathname));
	const current = $derived(
		[...TABS].reverse().find((tab) => page.url.pathname === resolve(tab.path) || page.url.pathname.startsWith(resolve(tab.path) + '/'))?.value ?? 'today'
	);

	onMount(() => {
		loadSettings();
		const mq = matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => applyTheme(app.settings.theme);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
	$effect(() => applyTheme(app.settings.theme));
	$effect(() => { document.documentElement.lang = i18n.locale; });
</script>

<div class={['lh-app', !inFlow && 'lh-with-nav']}>
	{#if app.ready}
		<!-- Rail first so keyboard and screen-reader order matches what desktop shows (hidden on phones). -->
		{#if !inFlow}<NavRail tabs={TABS} {current} />{/if}
		{@render children()}
		{#if !inFlow}
			<TabBar
				items={TABS.map((tab) => ({ value: tab.value, label: t(tab.value), icon: tab.icon }))}
				value={current}
				onChange={(v) => goto(resolve(TABS.find((tab) => tab.value === v)!.path))}
			/>
		{/if}
	{/if}
</div>
