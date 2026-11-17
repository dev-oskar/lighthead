<script lang="ts">
	import { onMount } from 'svelte';
	import BreakProgress from '#lib/ds/BreakProgress.svelte';
	import Button from '#lib/ds/Button.svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import OptionGrid from '#lib/ds/OptionGrid.svelte';
	import TextField from '#lib/ds/TextField.svelte';
	import { listBreaks, listSessions, putBreak } from '#lib/db.ts';
	import { t, date } from '#lib/i18n.svelte.ts';
	import { BREAK_LENGTHS, breakEnd, breakProgress, uid, type Break, type Session } from '#lib/model.ts';

	const short = { weekday: 'short', day: 'numeric', month: 'short' } as const;

	let breaks = $state<Break[]>([]);
	let sessions = $state<Session[]>([]);
	let now = $state(Date.now());
	let lengthStr = $state('21');
	let starting = $state(false); // "Start another break" after a complete one
	let confirmEnd = $state(false);
	let noteOpen = $state(false);
	let noteText = $state('');

	async function load() { [breaks, sessions] = await Promise.all([listBreaks(), listSessions()]); now = Date.now(); }
	onMount(load);

	// Newest break not ended by hand: running, or complete and still shown until another starts.
	const current = $derived(starting ? undefined : breaks.find((b) => !b.endedAt));
	const prog = $derived(current && breakProgress(current, now));
	const during = $derived(current && prog ? sessions.filter((s) => s.at >= current.start && s.at < prog.end).length : 0);
	const past = $derived(breaks.filter((b) => b !== current && (b.endedAt || breakProgress(b, now).complete)));

	async function save(b: Break) { await putBreak($state.snapshot(b)); await load(); }

	async function start() {
		starting = false;
		await save({ id: uid(), start: Date.now(), lengthDays: +lengthStr, notes: [] });
	}
	async function end() {
		confirmEnd = false;
		await save({ ...current!, endedAt: Date.now() });
	}
	async function addNote() {
		const text = noteText.trim();
		if (text) await save({ ...current!, notes: [...current!.notes, { at: Date.now(), text }] });
		noteText = '';
		noteOpen = false;
	}

	const pastLabel = (b: Break) => {
		const day = breakProgress(b, b.endedAt ?? now).day;
		return b.endedAt && day < b.lengthDays ? t('endedOf', { day, count: b.lengthDays }) : t('daysN', { count: b.lengthDays });
	};
</script>

<main class="lh-page">
	<header class="lh-page-head">
		<span class="lh-overline">{t('breakLabel')}</span>
		<h1 class="lh-title">{current && prog ? t('dayOf', { day: prog.day, total: current.lengthDays }) : t('takeBreak')}</h1>
	</header>

	{#if current && prog}
		<BreakProgress
			day={prog.complete ? current.lengthDays : prog.day}
			total={current.lengthDays}
			since={t('startedEnds', { start: date(current.start, short), end: date(prog.end - 1, short) })}
		>
			{#snippet action()}
				{#if prog.complete}
					<Button variant="quiet" onclick={() => (starting = true)}>{t('startAnother')}</Button>
				{:else if !confirmEnd}
					<Button variant="quiet" onclick={() => (confirmEnd = true)}>{t('endBreak')}</Button>
				{/if}
			{/snippet}
		</BreakProgress>
		{#if during}<p class="muted during">{t('breakAsk.logged', { count: during })}</p>{/if}

		{#if confirmEnd}
			<div class="lh-confirm lh-confirm-neutral">
				<strong class="lh-heading">{t('endBreakQ')}</strong>
				<p class="body">{t('endBreakBody')}</p>
				<div class="lh-confirm-row">
					<Button variant="primary" onclick={end}>{t('endBreak')}</Button>
					<Button variant="secondary" onclick={() => (confirmEnd = false)}>{t('cancel')}</Button>
				</div>
			</div>
		{/if}

		<section class="lh-section">
			<div class="lh-page-head-row">
				<h2 class="lh-overline">{t('breakNotes')}</h2>
				{#if !noteOpen}<Button variant="quiet" icon="plus" onclick={() => (noteOpen = true)}>{t('addNote')}</Button>{/if}
			</div>
			{#if noteOpen}
				<TextField label={t('note')} hint={t('noteHint')} multiline bind:value={noteText} />
				<div class="lh-confirm-row">
					<Button variant="primary" onclick={addNote}>{t('save')}</Button>
					<Button variant="quiet" onclick={() => { noteOpen = false; noteText = ''; }}>{t('cancel')}</Button>
				</div>
			{/if}
			{#each [...current.notes].reverse() as n (n.at)}
				<article class="lh-card note">
					<span class="lh-data muted">{t('noteDay', { day: breakProgress(current, n.at).day, weekday: date(n.at, { weekday: 'short' }) })}</span>
					<p class="lh-note">{n.text}</p>
				</article>
			{/each}
		</section>
	{:else}
		<p class="lead">{t('breakAsk.startLead')}</p>
		<OptionGrid label={t('length')} columns={3} bind:value={lengthStr} options={BREAK_LENGTHS.map((n) => ({ value: String(n), label: t('daysN', { count: n }) }))} />
		<div class="ends">
			<Icon name="calendar" size={16} />
			<span>{t('startsTodayEnds')} <span class="lh-data">{date(breakEnd({ id: '', start: Date.now(), lengthDays: +lengthStr, notes: [] }) - 1, short)}</span></span>
		</div>
		<Button variant="primary" size="lg" block onclick={start}>{t('startBreak')}</Button>
	{/if}

	{#if past.length}
		<section class="past">
			<h2 class="lh-overline">{t('pastBreaks')}</h2>
			{#each past as b (b.id)}
				<div class="past-row"><span>{date(b.start, { month: 'long', year: 'numeric' })}</span><span class="lh-data">{pastLabel(b)}</span></div>
			{/each}
		</section>
	{/if}
</main>

<style>
	h2 { margin: 0; }
	.body, .lead { margin: 0; }
	.lead { font-size: 17px; line-height: 26px; color: var(--ink); }
	.during { margin: calc(-1 * var(--space-2)) 0 0; }
	.note { display: flex; flex-direction: column; gap: var(--space-1); }
	.muted { font-size: 14px; color: var(--ink-muted); }
	.ends { display: flex; align-items: center; gap: var(--space-2); font-size: 14px; line-height: 20px; color: var(--ink-muted); }
	.ends .lh-data { font-size: 14px; color: var(--ink); }
	.past { display: flex; flex-direction: column; gap: var(--space-2); }
	.past-row { display: flex; justify-content: space-between; gap: var(--space-2); padding: var(--space-2) 0; }
	.past-row:not(:last-child) { border-bottom: 1px solid var(--line); }
</style>
