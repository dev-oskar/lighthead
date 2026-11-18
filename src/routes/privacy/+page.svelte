<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '#lib/ds/Button.svelte';
	import Notice from '#lib/ds/Notice.svelte';
	import { t } from '#lib/i18n.svelte.ts';

	// Every statement here must stay true of the code: see src/lib/messages/help.ts.
	const SECTIONS = [
		['whereTitle', ['where1', 'where2', 'where3']],
		['neverTitle', ['never1', 'never2', 'never3', 'never4']],
		['hostTitle', ['host1', 'host2']],
		['wrongTitle', ['wrong1', 'wrong2', 'wrong3', 'wrong4', 'wrong5']],
		['checkTitle', ['check1']]
	] as const;
</script>

<main class="lh-page doc">
	<div class="back"><Button variant="quiet" onclick={() => goto(resolve('/settings'))}>{t('settings')}</Button></div>
	<h1 class="lh-title">{t('privacy.title')}</h1>
	<Notice tone="private" title={t('storedOnDevice')}>{t('privacy.intro')}</Notice>

	{#each SECTIONS as [title, paras] (title)}
		<section class="lh-section">
			<h2 class="lh-overline">{t('privacy.' + title)}</h2>
			{#each paras as p (p)}<p>{t('privacy.' + p)}</p>{/each}
			{#if title === 'checkTitle'}
				<p><a href="https://github.com/dev-oskar/lighthead" rel="noreferrer">{t('privacy.source')}</a></p>
			{/if}
		</section>
	{/each}
</main>

<style>
	.doc { padding-top: var(--space-3); }
	.back { display: flex; align-items: center; margin-left: -12px; }
	@media (min-width: 960px) { .doc > :global(*) { max-width: 640px; } }
	h2, p { margin: 0; }
	a { color: var(--moss); font-weight: 600; }
</style>
