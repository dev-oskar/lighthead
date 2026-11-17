<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconName } from '#lib/icons.ts';
	import Icon from '#lib/ds/Icon.svelte';

	type Tone = 'private' | 'backup' | 'info' | 'warn' | 'danger';
	interface Props { tone?: Tone; title?: string; icon?: IconName; children?: Snippet; action?: Snippet }
	let { tone = 'private', title, icon, children, action }: Props = $props();

	const TONE_ICON: Record<Tone, IconName> = { private: 'lock', info: 'check', warn: 'alert', danger: 'alert', backup: 'cloud' };
</script>

<div class={['lh-notice', `lh-notice-${tone}`]} role={tone === 'danger' ? 'alert' : 'status'}>
	<Icon name={icon ?? TONE_ICON[tone] ?? 'lock'} size={20} />
	<div class="lh-notice-body">
		{#if title}<strong>{title}</strong>{/if}
		{#if children}<p>{@render children()}</p>{/if}
	</div>
	{@render action?.()}
</div>
