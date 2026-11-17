<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '#lib/ds/Button.svelte';
	import Chip from '#lib/ds/Chip.svelte';
	import StrainCard from '#lib/ds/StrainCard.svelte';
	import { listSessions, listStrains } from '#lib/db.ts';
	import { STRAIN_TYPES, type Strain, type StrainType } from '#lib/model.ts';
	import { t } from '#lib/i18n.svelte.ts';
	import { grams } from './format.ts';

	let strains = $state.raw<Strain[]>([]);
	let counts = $state.raw(new Map<string, number>());
	let loaded = $state(false);
	let filter = $state<StrainType | 'all'>('all');

	$effect(() => {
		Promise.all([listStrains(), listSessions()]).then(([st, se]) => {
			const m = new Map<string, number>();
			for (const s of se) if (s.strainId) m.set(s.strainId, (m.get(s.strainId) ?? 0) + 1);
			strains = st;
			counts = m;
			loaded = true;
		});
	});

	const photos = $derived(new Map(strains.flatMap((s) => (s.photo ? [[s.id, URL.createObjectURL(s.photo)] as const] : []))));
	$effect(() => {
		const p = photos;
		return () => p.forEach((u) => URL.revokeObjectURL(u));
	});

	const shown = $derived(filter === 'all' ? strains : strains.filter((s) => s.type === filter));
	const inStash = $derived(strains.filter((s) => (s.stashG ?? 0) > 0).length);
	const add = () => goto(resolve('/strains/new'));
</script>

<main class="lh-page">
	<header class="lh-page-head-row">
		<div class="lh-page-head">
			<span class="lh-overline">{t('strainCount', { count: strains.length })} · {t('inStashCount', { count: inStash })}</span>
			<h1 class="lh-title">{t('strains')}</h1>
		</div>
		<Button variant="secondary" icon="plus" onclick={add}>{t('addStrain')}</Button>
	</header>

	{#if loaded && !strains.length}
		<div class="lh-empty empty">
			<p>{t('noStrains')}</p>
			<Button variant="primary" icon="plus" onclick={add}>{t('addStrain')}</Button>
		</div>
	{:else if loaded}
		<div class="filters" role="group" aria-label={t('filterByType')}>
			{#each ['all', ...STRAIN_TYPES] as const as k (k)}
				<Chip bind:selected={() => filter === k, (v) => { if (v) filter = k; }}>{t(k)}</Chip>
			{/each}
		</div>
		<div class="list">
			{#each shown as s (s.id)}
				<a class="card-link" href={resolve('/strains/[id]', { id: s.id })} aria-label={s.name}>
					<StrainCard
						name={s.name}
						type={s.type}
						breeder={s.breeder}
						thc={s.thc}
						cbd={s.cbd}
						sessions={counts.get(s.id) ?? 0}
						inStash={grams(s.stashG)}
						terpenes={s.terpenes}
						rating={s.rating}
						photo={photos.get(s.id)}
					/>
				</a>
			{:else}
				<p class="lh-meta">{t('noStrainsOfType')}</p>
			{/each}
		</div>
	{/if}
</main>

<style>
	.filters { display: flex; gap: var(--space-2); overflow-x: auto; margin-right: calc(-1 * var(--space-4)); padding: 4px var(--space-4) 4px 0; scrollbar-width: none; }
	.filters :global(.lh-chip) { flex-shrink: 0; }
	.list { display: flex; flex-direction: column; gap: var(--space-3); }
	.card-link { display: block; color: inherit; text-decoration: none; border-radius: var(--radius-lg) var(--radius-xs); }
	.card-link:focus-visible { outline: none; box-shadow: var(--focus-ring); }
	.empty { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
	.empty p { margin: 0; }
	@media (min-width: 960px) {
		.filters { flex-wrap: wrap; overflow: visible; margin-right: 0; padding-right: 0; }
		.list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); align-items: start; }
	}
</style>
