<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
	import Icon from '#lib/ds/Icon.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		label: string;
		hint?: string;
		error?: string;
		suffix?: string;
		multiline?: boolean;
		value?: string | number | null;
	}
	let { label, hint, error, suffix, multiline = false, class: className, id, value = $bindable(), ...rest }: Props = $props();

	const uid = $props.id();
	const fid = $derived(id ?? uid);
	const describedBy = $derived(error || hint ? `${fid}-d` : undefined);
</script>

<div class={['lh-field', error && 'has-error', className]}>
	<label class="lh-field-label" for={fid}>{label}</label>
	<div class="lh-field-box">
		{#if multiline}
			<textarea
				id={fid}
				class="lh-field-input"
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={describedBy}
				rows={3}
				bind:value
				{...rest as HTMLTextareaAttributes}
			></textarea>
		{:else}
			<input
				id={fid}
				class="lh-field-input"
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={describedBy}
				bind:value
				{...rest}
			/>
		{/if}
		{#if suffix}<span class="lh-field-suffix">{suffix}</span>{/if}
	</div>
	{#if error || hint}
		<p id={describedBy} class="lh-field-hint">
			{#if error}<Icon name="alert" size={16} />{/if}{error || hint}
		</p>
	{/if}
</div>
