<script lang="ts">
	import Icon from '#lib/ds/Icon.svelte';
	import Rating from '#lib/ds/Rating.svelte';
	import StrainAvatar from '#lib/ds/StrainAvatar.svelte';
	import StrainBadge from '#lib/ds/StrainBadge.svelte';
	import type { StrainType } from '#lib/model.ts';
	import { pct, t } from '#lib/i18n.svelte.ts';

	let {
		name,
		type,
		breeder,
		thc,
		cbd,
		sessions,
		inStash,
		terpenes,
		rating,
		photo
	}: {
		name: string;
		type: StrainType;
		breeder?: string;
		thc?: number;
		cbd?: number;
		sessions?: number;
		inStash?: string;
		terpenes?: string[];
		rating?: number;
		photo?: string;
	} = $props();
</script>

<article class="lh-card lh-strain lh-leafcorner">
	<div class="lh-row lh-row-between">
		<StrainBadge {type} />
		{#if inStash != null}
			<span class="lh-stash"><Icon name="stash" size={16} /><span class="lh-data">{inStash}</span></span>
		{/if}
	</div>
	<div class="lh-strain-head">
		<StrainAvatar {name} {type} src={photo} size="lg" />
		<div class="lh-strain-title">
			<h3 class="lh-strain-name">{name}</h3>
			{#if breeder}<p class="lh-meta">{breeder}</p>{/if}
		</div>
	</div>
	<dl class="lh-cannab">
		{#if thc != null}<div><dt>{t('thc')}</dt><dd class="lh-data">{pct(thc)}</dd></div>{/if}
		{#if cbd != null}<div><dt>{t('cbd')}</dt><dd class="lh-data">{pct(cbd)}</dd></div>{/if}
		{#if sessions != null}<div><dt>{t('sessions')}</dt><dd class="lh-data">{sessions}</dd></div>{/if}
	</dl>
	{#if terpenes?.length}
		<div class="lh-tags">
			{#each terpenes as tp (tp)}<span class="lh-tag">{tp}</span>{/each}
		</div>
	{/if}
	{#if rating}<Rating value={rating} readOnly size={16} />{/if}
</article>
