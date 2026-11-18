<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '#lib/ds/Button.svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import { t } from '#lib/i18n.svelte.ts';

	const QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
</script>

<main class="lh-page doc">
	<div class="back"><Button variant="quiet" onclick={() => goto(resolve('/settings'))}>{t('settings')}</Button></div>
	<h1 class="lh-title">{t('help.title')}</h1>

	<div class="faq">
		{#each QUESTIONS as n (n)}
			<details>
				<summary>{t(`help.q${n}`)}<Icon name="chevron" size={20} /></summary>
				<p>{t(`help.a${n}`)}</p>
			</details>
		{/each}
	</div>

	<p><a href={resolve('/privacy')}>{t('privacy.title')}</a></p>
</main>

<style>
	.doc { padding-top: var(--space-3); }
	.back { display: flex; align-items: center; margin-left: -12px; }
	@media (min-width: 960px) { .doc > :global(*) { max-width: 640px; } }
	p { margin: 0; }
	a { color: var(--moss); font-weight: 600; }
	.faq { display: flex; flex-direction: column; background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-md); }
	details + details { border-top: 1px solid var(--line); }
	summary {
		display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
		min-height: 48px; padding: var(--space-3) var(--space-4); box-sizing: border-box;
		font-weight: 600; cursor: pointer; list-style: none; border-radius: var(--radius-md);
	}
	summary::-webkit-details-marker { display: none; }
	summary:focus-visible { outline: none; box-shadow: var(--focus-ring); }
	summary :global(.lh-icon) { flex: none; color: var(--ink-muted); transition: transform 0.15s; }
	details[open] summary :global(.lh-icon) { transform: rotate(90deg); }
	details p { padding: 0 var(--space-4) var(--space-4); }
	@media (prefers-reduced-motion: reduce) { summary :global(.lh-icon) { transition: none; } }
</style>
