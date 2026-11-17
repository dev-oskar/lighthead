<script lang="ts">
	import Button from '#lib/ds/Button.svelte';
	import { t } from '#lib/i18n.svelte.ts';

	let {
		primary,
		onPrimary,
		disabled = false,
		secondary,
		onSecondary,
		class: className
	}: {
		primary?: string;
		onPrimary?: () => void;
		disabled?: boolean;
		secondary?: string | true;
		onSecondary?: () => void;
		class?: string;
	} = $props();
</script>

<div class={['lh-actionbar', className]}>
	{#if secondary}
		<Button variant="quiet" size="lg" onclick={onSecondary}>{secondary === true ? t('skip') : secondary}</Button>
	{/if}
	<Button variant="primary" size="lg" block {disabled} onclick={onPrimary}>{primary || t('continue')}</Button>
</div>
