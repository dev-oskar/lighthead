<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '#lib/ds/Button.svelte';
	import { listSessions } from '#lib/db.ts';
	import { t } from '#lib/i18n.svelte.ts';
	import type { Session } from '#lib/model.ts';
	import SessionList from './SessionList.svelte';

	let sessions = $state<Session[] | null>(null);
	onMount(async () => { sessions = await listSessions(); });
</script>

<main class="lh-page">
	<header class="lh-page-head-row">
		<div class="lh-page-head">
			<span class="lh-overline">{sessions ? t('log.sessionCount', { count: sessions.length }) : ''}</span>
			<h1 class="lh-title">{t('log.journal')}</h1>
		</div>
		<Button icon="plus" onclick={() => goto(resolve('/log/new'))}>{t('log.logSession')}</Button>
	</header>
	{#if sessions?.length}
		<SessionList {sessions} />
	{:else if sessions}
		<p class="lh-empty">{t('log.emptyJournal')}</p>
	{/if}
</main>
