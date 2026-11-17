<script lang="ts">
	import type { IconName } from '#lib/icons.ts';
	import Icon from '#lib/ds/Icon.svelte';

	interface Props {
		options: { value: string; label: string; icon?: IconName }[];
		value?: string;
		defaultValue?: string;
		onChange?: (value: string) => void;
		label: string;
	}
	let { options, defaultValue, value = $bindable(defaultValue ?? options[0]?.value), onChange, label }: Props = $props();

	const focusable = $derived(options.some((o) => o.value === value) ? value : options[0]?.value);

	function pick(v: string) { value = v; onChange?.(v); }

	// Roving tabindex: arrows move focus and selection between radios.
	function onkeydown(e: KeyboardEvent) {
		const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
		if (!d) return;
		e.preventDefault();
		const btns = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role=radio]')];
		const b = btns[(btns.indexOf(document.activeElement as HTMLButtonElement) + d + btns.length) % btns.length];
		b.focus();
		b.click();
	}
</script>

<div class="lh-seg" role="radiogroup" aria-label={label} tabindex="-1" {onkeydown}>
	{#each options as o (o.value)}
		{@const on = o.value === value}
		<button
			type="button"
			role="radio"
			aria-checked={on ? 'true' : 'false'}
			tabindex={o.value === focusable ? 0 : -1}
			class={['lh-seg-item', on && 'is-on']}
			onclick={() => pick(o.value)}
		>
			{#if o.icon}<Icon name={o.icon} size={18} />{/if}
			<span>{o.label}</span>
		</button>
	{/each}
</div>
