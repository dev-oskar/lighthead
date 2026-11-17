<script lang="ts">
	import Button from '#lib/ds/Button.svelte';
	import { t } from '#lib/i18n.svelte.ts';

	let {
		step: stepProp = 1,
		total: totalProp = 4,
		title,
		subtitle,
		onClose,
		closeLabel
	}: { step?: number; total?: number; title?: string; subtitle?: string; onClose?: () => void; closeLabel?: string } = $props();

	const total = $derived(totalProp || 4);
	const step = $derived(Math.min(stepProp || 1, total));
</script>

<header class="lh-stephead">
	<div class="lh-stephead-bar">
		<Button variant="quiet" icon="close" aria-label={closeLabel || t('close')} onclick={onClose} />
		<div
			class="lh-progress"
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={total}
			aria-valuenow={step}
			aria-label={t('stepOf', { step, total })}
		>
			<span class="lh-progress-fill" style:width="{(step / total) * 100}%"></span>
		</div>
		<span class="lh-stephead-count">{step + '/' + total}</span>
	</div>
	{#if title}<h2 class="lh-stephead-title">{title}</h2>{/if}
	{#if subtitle}<p class="lh-stephead-sub">{subtitle}</p>{/if}
</header>
