<script lang="ts">
	import { t, num, parseNumber } from '#lib/i18n.svelte.ts';
	import { clamp, nudge } from '#lib/model.ts';
	import Icon from '#lib/ds/Icon.svelte';

	interface Props {
		label?: string;
		value?: number;
		defaultValue?: number;
		onChange?: (value: number) => void;
		step?: number;
		min?: number;
		max?: number;
		decimals?: number;
		unit?: string;
		size?: 'md' | 'lg';
		hint?: string;
		prefilled?: boolean;
		id?: string;
		class?: string;
	}
	let {
		label, step = 1, min = 0, max = 100, defaultValue, value = $bindable(defaultValue ?? min), onChange,
		decimals = 0, unit, size = 'md', hint, prefilled = false, id, class: className
	}: Props = $props();

	const uid = $props.id();
	const fid = $derived(id ?? uid);
	const lbl = $derived(label ?? t('amount'));
	const hintText = $derived(hint ?? (prefilled ? t('sameAsLast') : undefined));
	const iconSize = $derived(size === 'lg' ? 28 : 22);
	let draft = $state<string | null>(null);

	function set(v: number) { value = v; onChange?.(v); }
	function step1(dir: 1 | -1) { draft = null; set(nudge(value, dir, step, min, max)); }
</script>

<div class={['lh-num', `lh-num-${size}`, className]}>
	<label class="lh-field-label" for={fid}>{lbl}</label>
	<div class="lh-num-track">
		<button type="button" class="lh-num-btn" aria-label={t('decrease', { label: lbl })} disabled={value <= min} onclick={() => step1(-1)}>
			<Icon name="minus" size={iconSize} />
		</button>
		<div class="lh-num-center">
			<input
				id={fid}
				class="lh-num-input"
				inputmode="decimal"
				autocomplete="off"
				aria-describedby={hintText ? `${fid}-h` : undefined}
				value={draft ?? num(value, decimals)}
				onfocus={(e) => e.currentTarget.select()}
				oninput={(e) => {
					draft = e.currentTarget.value;
					const n = parseNumber(draft);
					if (n != null && n >= min && n <= max) set(n);
				}}
				onblur={() => {
					const n = draft == null ? null : parseNumber(draft);
					draft = null;
					if (n != null) set(clamp(n, min, max));
				}}
			/>
			{#if unit}<span class="lh-num-unit" aria-hidden="true">{unit}</span>{/if}
		</div>
		<button type="button" class="lh-num-btn" aria-label={t('increase', { label: lbl })} disabled={value >= max} onclick={() => step1(1)}>
			<Icon name="plus" size={iconSize} />
		</button>
	</div>
	{#if hintText}
		<p id="{fid}-h" class="lh-field-hint">
			{#if prefilled}<Icon name="clock" size={16} />{/if}{hintText}
		</p>
	{/if}
</div>
