<script lang="ts">
	import type { Snippet } from 'svelte';

	// The entrance animation is pure CSS and only runs on mount. React re-mounted via `key={stepKey}`;
	// in Svelte the consumer must re-mount it: {#key stepKey}<Step direction={dir}>…</Step>{/key}.
	// `stepKey` is accepted for API parity only.
	let { direction = 'fwd', stepKey, children }: { direction?: 'fwd' | 'back'; stepKey?: string | number; children: Snippet } = $props();
</script>

<section class={['lh-step', direction === 'back' ? 'lh-step-back' : 'lh-step-fwd']}>
	{@render children()}
</section>
