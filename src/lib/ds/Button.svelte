<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { IconName } from '#lib/icons.ts';
	import Icon from '#lib/ds/Icon.svelte';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
		size?: 'md' | 'lg';
		icon?: IconName;
		block?: boolean;
	}
	let { variant = 'secondary', size = 'md', icon, block = false, class: className, children, type = 'button', ...rest }: Props = $props();
</script>

<button
	{type}
	{...rest}
	class={['lh-btn', `lh-btn-${variant}`, `lh-btn-${size}`, icon && !children && 'lh-btn-icon', block && 'lh-btn-block', className]}
>
	{#if icon}<Icon name={icon} size={size === 'lg' ? 22 : 20} />{/if}
	{#if children}<span>{@render children()}</span>{/if}
</button>
