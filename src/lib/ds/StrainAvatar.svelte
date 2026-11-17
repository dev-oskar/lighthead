<script lang="ts">
	import Icon from '#lib/ds/Icon.svelte';
	import { STRAIN_TYPES, type StrainType } from '#lib/model.ts';
	import { initials } from '#lib/photo.ts';
	import { t } from '#lib/i18n.svelte.ts';

	const SIZES = { sm: 32, md: 48, lg: 72, xl: 112 };

	let {
		name,
		type,
		src,
		size = 'md',
		editable = false,
		onPick,
		class: className
	}: {
		name: string;
		type?: StrainType;
		src?: string;
		size?: keyof typeof SIZES | number;
		editable?: boolean;
		onPick?: (file: File) => void;
		class?: string;
	} = $props();

	const kind = $derived(type && STRAIN_TYPES.includes(type) ? type : 'hybrid');
	const px = $derived(typeof size === 'number' ? size : SIZES[size] || SIZES.md);
	let input: HTMLInputElement | undefined = $state();

	function pick(e: Event & { currentTarget: HTMLInputElement }) {
		const f = e.currentTarget.files?.[0];
		if (f && onPick) onPick(f);
		e.currentTarget.value = '';
	}
</script>

{#snippet body()}
	<span class={['lh-avatar', 'lh-avatar-' + kind, className]} style:width="{px}px" style:height="{px}px">
		{#if src}
			<img class="lh-avatar-img" {src} alt={name || ''} width={px} height={px} draggable="false" />
		{:else}
			<span class="lh-avatar-initials" aria-hidden={name ? 'true' : undefined} style:font-size="{Math.round(px * 0.38)}px"
				>{initials(name)}</span
			>
			<span class="lh-visually-hidden">{name}</span>
		{/if}
	</span>
{/snippet}

{#if editable}
	<span class="lh-avatar-edit">
		<button type="button" class="lh-avatar-btn" onclick={() => input?.click()} aria-label={t(src ? 'changePhoto' : 'addPhoto')}>
			{@render body()}
			<span class="lh-avatar-badge" aria-hidden="true"><Icon name="camera" size={px >= 72 ? 18 : 14} /></span>
		</button>
		<input bind:this={input} type="file" accept="image/*" hidden onchange={pick} />
	</span>
{:else}
	{@render body()}
{/if}
