<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconName } from '#lib/icons.ts';
	import Icon from '#lib/ds/Icon.svelte';

	interface Option { value: string; label: string; icon?: IconName; media?: Snippet; hint?: string }
	type Value = string | string[] | null;
	interface Props {
		options: Option[];
		value?: Value;
		defaultValue?: Value;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- string in single mode, string[] in multiple (as index.d.ts)
		onChange?: (value: any) => void;
		multiple?: boolean;
		columns?: 1 | 2 | 3;
		label: string;
	}
	let { options, multiple = false, defaultValue, value = $bindable(defaultValue ?? (multiple ? [] : null)), onChange, columns = 2, label }: Props = $props();

	const isOn = (v: string) => (multiple ? Array.isArray(value) && value.includes(v) : value === v);
	const focusable = $derived(options.some((o) => o.value === value) ? value : options[0]?.value);

	function pick(v: string) {
		if (multiple) {
			const cur = Array.isArray(value) ? value : [];
			value = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
		} else value = v;
		onChange?.(value);
	}

	// Roving tabindex for the single-select radiogroup.
	function onkeydown(e: KeyboardEvent) {
		if (multiple) return;
		const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
		if (!d) return;
		e.preventDefault();
		const btns = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role=radio]')];
		const b = btns[(btns.indexOf(document.activeElement as HTMLButtonElement) + d + btns.length) % btns.length];
		b.focus();
		b.click();
	}
</script>

<div class={['lh-options', `lh-cols-${columns}`]} role={multiple ? 'group' : 'radiogroup'} aria-label={label} tabindex="-1" {onkeydown}>
	{#each options as o (o.value)}
		{@const on = isOn(o.value)}
		<button
			type="button"
			role={multiple ? 'checkbox' : 'radio'}
			aria-checked={on ? 'true' : 'false'}
			tabindex={multiple || o.value === focusable ? 0 : -1}
			class={['lh-option', on && 'is-on']}
			onclick={() => pick(o.value)}
		>
			{#if o.media}
				<span class="lh-option-media">{@render o.media()}</span>
			{:else if o.icon}
				<span class="lh-option-icon"><Icon name={o.icon} size={28} /></span>
			{/if}
			<span class="lh-option-label">{o.label}</span>
			{#if o.hint}<span class="lh-option-hint">{o.hint}</span>{/if}
			<span class="lh-option-check" aria-hidden="true">{#if on}<Icon name="check" size={16} />{/if}</span>
		</button>
	{/each}
</div>
