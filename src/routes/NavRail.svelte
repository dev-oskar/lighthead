<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Button from '#lib/ds/Button.svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import type { IconName } from '#lib/icons.ts';
	import { t } from '#lib/i18n.svelte.ts';

	// Desktop navigation (>= 960px); the TabBar does the same job on phones. app.css switches between them.
	let { tabs, current }: { tabs: readonly { value: string; path: '/' | '/log' | '/strains' | '/stats' | '/break'; icon: IconName }[]; current: string } = $props();

	// Privacy and help are Settings' sub-pages.
	const onSettings = $derived([resolve('/settings'), resolve('/privacy'), resolve('/help')].some((p) => page.url.pathname.startsWith(p)));
</script>

<nav class="lh-rail" aria-label={t('mainNav')}>
	<span class="lh-title lh-rail-brand">{t('appName')}</span>
	<Button variant="primary" size="lg" class="lh-btn-fab" icon="plus" block onclick={() => goto(resolve('/log/new'))}>{t('log.logSession')}</Button>
	<div class="lh-rail-links">
		{#each tabs as tab (tab.value)}
			{@const on = !onSettings && tab.value === current}
			<a class={['lh-rail-link', on && 'is-on']} href={resolve(tab.path)} aria-current={on ? 'page' : undefined}>
				<Icon name={tab.icon} size={24} />{t(tab.value)}
			</a>
		{/each}
	</div>
	<a class={['lh-rail-link', 'lh-rail-end', onSettings && 'is-on']} href={resolve('/settings')} aria-current={onSettings ? 'page' : undefined}>
		<Icon name="lock" size={24} />{t('settings')}
	</a>
</nav>
