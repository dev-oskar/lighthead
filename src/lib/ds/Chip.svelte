<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '#lib/ds/Icon.svelte';

	interface Props {
		selected?: boolean;
		defaultSelected?: boolean;
		onChange?: (selected: boolean) => void;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}
	let { defaultSelected = false, selected = $bindable(defaultSelected), onChange, disabled, class: className, children }: Props = $props();
</script>

<button
	type="button"
	class={['lh-chip', selected && 'is-selected', className]}
	aria-pressed={selected ? 'true' : 'false'}
	{disabled}
	onclick={() => { selected = !selected; onChange?.(selected); }}
>
	{#if selected}<Icon name="check" size={16} />{/if}
	<span>{@render children()}</span>
</button>
