<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import { t } from '#lib/i18n.svelte.ts';

	let {
		day: dayProp = 0,
		total: totalProp = 21,
		since,
		label,
		action
	}: { day?: number; total?: number; since?: string; label?: string; action?: Snippet } = $props();

	// Ring math copied from the design system bundle.
	const total = $derived(totalProp || 21);
	const day = $derived(Math.min(dayProp || 0, total));
	const r = 52, c = 2 * Math.PI * r;
	const left = $derived(total - day);
</script>

<div class="lh-break">
	<div class="lh-break-ring">
		<svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="{day} / {total}">
			<circle class="lh-break-track" cx="60" cy="60" {r} />
			<circle
				class="lh-break-fill"
				cx="60"
				cy="60"
				{r}
				stroke-dasharray={c.toFixed(2)}
				stroke-dashoffset={(c * (1 - day / total)).toFixed(2)}
				transform="rotate(-90 60 60)"
			/>
		</svg>
		<div class="lh-break-num" aria-hidden="true"><span>{day}</span><small>{t('ofTotal', { total })}</small></div>
	</div>
	<div class="lh-break-text">
		<span class="lh-overline">{label || t('breakLabel')}</span>
		<strong class="lh-break-title">{left > 0 ? t('daysToGo', { count: left }) : t('breakDone')}</strong>
		{#if since}<span class="lh-break-meta"><Icon name="calendar" size={16} />{since}</span>{/if}
		{@render action?.()}
	</div>
</div>
