<script lang="ts">
	import type { Snippet } from 'svelte';
	import { STRAIN_TYPES, type StrainType } from '#lib/model.ts';
	import { t } from '#lib/i18n.svelte.ts';

	let { type, children }: { type?: StrainType; children?: Snippet } = $props();
	const kind = $derived(type && STRAIN_TYPES.includes(type) ? type : 'hybrid');
</script>

<span class={['lh-badge', 'lh-badge-' + kind]}
	><span class="lh-badge-dot" aria-hidden="true"></span>{#if children}{@render children()}{:else}{t(kind)}{/if}</span
>
