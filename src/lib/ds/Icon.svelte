<script lang="ts">
	import { PATHS, type IconName } from '#lib/icons.ts';

	interface Props { name: IconName; size?: number; filled?: boolean; title?: string; class?: string }
	let { name, size = 24, filled = false, title, class: className }: Props = $props();
</script>

<svg
	class={['lh-icon', className]}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={filled ? 'currentColor' : 'none'}
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	focusable="false"
	role={title ? 'img' : undefined}
	aria-label={title}
	aria-hidden={title ? undefined : 'true'}
><path d={PATHS[name] ?? PATHS.leaf} /></svg>
