<script lang="ts">
	import { t } from '#lib/i18n.svelte.ts';
	import Icon from '#lib/ds/Icon.svelte';

	interface Props {
		value?: number;
		defaultValue?: number;
		onChange?: (value: number) => void;
		max?: number;
		readOnly?: boolean;
		size?: number;
		label?: string;
	}
	let { defaultValue = 0, value = $bindable(defaultValue), onChange, max = 5, readOnly = false, size, label }: Props = $props();

	const leaves = $derived(Array.from({ length: max }, (_, i) => i + 1));

	function pick(n: number) { value = n === value ? 0 : n; onChange?.(value); }

	// Roving tabindex: arrows move focus and selection between leaves.
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

{#if readOnly}
	<div class="lh-rating is-readonly" role="img" aria-label={t('rated', { n: value, max })}>
		{#each leaves as n (n)}
			<span class={['lh-rate-leaf', n <= value && 'is-on']}><Icon name="leaf" size={size ?? 20} filled={n <= value} /></span>
		{/each}
	</div>
{:else}
	<div class="lh-rating" role="radiogroup" aria-label={label ?? t('rating')} tabindex="-1" {onkeydown}>
		{#each leaves as n (n)}
			<button
				type="button"
				role="radio"
				aria-checked={n === value ? 'true' : 'false'}
				aria-label={t('ratingOf', { n, max })}
				tabindex={n === (value || 1) ? 0 : -1}
				class={['lh-rate-leaf', n <= value && 'is-on']}
				onclick={() => pick(n)}
			>
				<Icon name="leaf" size={size ?? 28} filled={n <= value} />
			</button>
		{/each}
	</div>
{/if}
