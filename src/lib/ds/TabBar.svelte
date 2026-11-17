<script lang="ts">
	import Icon from '#lib/ds/Icon.svelte';
	import type { IconName } from '#lib/icons.ts';
	import { t } from '#lib/i18n.svelte.ts';

	type Item = { value: string; label?: string; icon: IconName };
	const DEFAULT_TABS: Item[] = [
		{ value: 'today', icon: 'home' },
		{ value: 'log', icon: 'session' },
		{ value: 'strains', icon: 'leaf' },
		{ value: 'stats', icon: 'stats' },
		{ value: 'break', icon: 'break' }
	];

	let {
		items = DEFAULT_TABS,
		defaultValue,
		value = $bindable(defaultValue ?? items[0]?.value),
		onChange
	}: { items?: readonly Item[]; value?: string; defaultValue?: string; onChange?: (value: string) => void } = $props();

	function select(v: string) {
		value = v;
		onChange?.(v);
	}
</script>

<nav class="lh-tabbar" aria-label={t('mainNav')}>
	{#each items as tab (tab.value)}
		{@const on = tab.value === value}
		<button type="button" class={['lh-tab', on && 'is-on']} aria-current={on ? 'page' : undefined} onclick={() => select(tab.value)}>
			<span class="lh-tab-pill"><Icon name={tab.icon} size={22} /></span><span class="lh-tab-label">{tab.label || t(tab.value)}</span>
		</button>
	{/each}
</nav>
