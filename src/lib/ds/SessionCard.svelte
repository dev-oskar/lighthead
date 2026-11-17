<script lang="ts">
	import Rating from '#lib/ds/Rating.svelte';
	import StrainAvatar from '#lib/ds/StrainAvatar.svelte';
	import StrainBadge from '#lib/ds/StrainBadge.svelte';
	import type { StrainType } from '#lib/model.ts';

	let {
		time,
		ago,
		strain,
		type,
		method,
		amount,
		setting,
		effects,
		note,
		rating,
		photo
	}: {
		time: string;
		ago?: string;
		strain: string;
		type?: StrainType;
		method?: string;
		amount?: string;
		setting?: string;
		effects?: string[];
		note?: string;
		rating?: number;
		photo?: string;
	} = $props();
</script>

<article class="lh-card lh-session">
	<div class="lh-session-time"><span class="lh-data">{time}</span>{#if ago}<small>{ago}</small>{/if}</div>
	<div class="lh-session-body">
		<div class="lh-row">
			<StrainAvatar name={strain} {type} src={photo} size="sm" />
			<h3 class="lh-card-title">{strain}</h3>
			{#if type}<StrainBadge {type} />{/if}
		</div>
		<p class="lh-meta">{[method, amount, setting].filter(Boolean).join(' · ')}</p>
		{#if effects?.length}
			<div class="lh-tags">
				{#each effects as e (e)}<span class="lh-tag">{e}</span>{/each}
			</div>
		{/if}
		{#if note}<p class="lh-note">{note}</p>{/if}
		{#if rating}<Rating value={rating} readOnly size={16} />{/if}
	</div>
</article>
