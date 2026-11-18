<script lang="ts">
	import '#lib/styles/tokens.css';
	import '#lib/styles/components.css';
	import '#lib/styles/app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import TabBar from '#lib/ds/TabBar.svelte';
	import Notice from '#lib/ds/Notice.svelte';
	import Button from '#lib/ds/Button.svelte';
	import NavRail from './NavRail.svelte';
	import { app, applyTheme, loadSettings, updateSettings } from '#lib/app-state.svelte.ts';
	import { hasData } from '#lib/db.ts';
	import '#lib/install.svelte.ts'; // catches beforeinstallprompt early, for onboarding
	import { i18n, t } from '#lib/i18n.svelte.ts';
	import { update, applyUpdate } from '#lib/update.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const TABS = [
		{ value: 'today', path: '/', icon: 'home' },
		{ value: 'log', path: '/log', icon: 'session' },
		{ value: 'strains', path: '/strains', icon: 'leaf' },
		{ value: 'stats', path: '/stats', icon: 'stats' },
		{ value: 'break', path: '/break', icon: 'break' }
	] as const;

	// Flows (quick log, new strain, onboarding) are full-screen: no tab bar.
	const inFlow = $derived(/\/((log|strains)\/new|welcome)\/?$/.test(page.url.pathname));
	let checked = $state(false); // first-run check done: nothing renders before a possible redirect
	const current = $derived(
		[...TABS].reverse().find((tab) => page.url.pathname === resolve(tab.path) || page.url.pathname.startsWith(resolve(tab.path) + '/'))?.value ?? 'today'
	);

	// First launch only: onboarding. Someone with data already (from before onboarding existed) never sees it.
	async function start() {
		try {
			await loadSettings();
			if (!app.settings.onboarded) {
				if (await hasData()) updateSettings({ onboarded: true }).catch(() => {});
				// Pages the landing page links to open directly; onboarding waits for the app itself.
				else if (!([resolve('/welcome'), resolve('/privacy'), resolve('/help')] as string[]).includes(page.url.pathname)) await goto(resolve('/welcome'), { replaceState: true });
			}
		} finally {
			checked = true; // storage unavailable: still render the app rather than a blank screen
		}
	}

	onMount(() => {
		start();
		const mq = matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => applyTheme(app.settings.theme);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
	$effect(() => applyTheme(app.settings.theme));
	$effect(() => { document.documentElement.lang = i18n.locale; });
</script>

<div class={['lh-app', !inFlow && 'lh-with-nav']}>
	{#if app.ready && checked}
		<!-- Rail first so keyboard and screen-reader order matches what desktop shows (hidden on phones). -->
		{#if !inFlow}<NavRail tabs={TABS} {current} />{/if}
		{@render children()}
		{#if update.ready && !inFlow}
			<!-- Not inside flows: the person is mid-input there. Also applies by itself on next launch. -->
			<div class="update">
				<Notice tone="info" title={t('update.ready')}>
					{#snippet action()}<Button variant="quiet" onclick={applyUpdate}>{t('update.reload')}</Button>{/snippet}
				</Notice>
			</div>
		{/if}
		{#if !inFlow}
			<TabBar
				items={TABS.map((tab) => ({ value: tab.value, label: t(tab.value), icon: tab.icon }))}
				value={current}
				onChange={(v) => goto(resolve(TABS.find((tab) => tab.value === v)!.path))}
			/>
		{/if}
	{/if}
</div>

<style>
	/* Floats at the top on phones: the bottom has the TabBar and the FAB. */
	.update {
		position: fixed; z-index: 20; left: 0; right: 0; max-width: 520px; margin: 0 auto; box-sizing: border-box;
		top: calc(env(safe-area-inset-top) + var(--space-3)); padding: 0 var(--space-3);
	}
	.update :global(.lh-notice) { align-items: center; box-shadow: var(--shadow-lg); }
	/* Desktop: top-right of the content area, beside the rail. */
	@media (min-width: 960px) {
		.update { left: auto; right: 40px; top: var(--space-6); width: 400px; padding: 0; }
	}
</style>
