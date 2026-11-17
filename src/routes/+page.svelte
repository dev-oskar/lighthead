<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '#lib/ds/Button.svelte';
	import StatTile from '#lib/ds/StatTile.svelte';
	import { listSessions } from '#lib/db.ts';
	import { date, i18n, num, region, t, time } from '#lib/i18n.svelte.ts';
	import { dailyGrams, periodRange, startOfDay, totals, type Session } from '#lib/model.ts';
	import SessionList from './log/SessionList.svelte';

	let sessions = $state<Session[] | null>(null);
	const now = Date.now();
	onMount(async () => { sessions = await listSessions(); });

	const week = $derived.by(() => {
		const r = periodRange('week', now, region());
		return totals(sessions ?? [], r.start, r.end, now);
	});
	const weekDays = $derived(Math.round((startOfDay(now) - periodRange('week', now, region()).start) / 86_400_000) + 1); // days of this week so far
	const trend = $derived(dailyGrams(sessions ?? [], now));
	const last = $derived(sessions?.[0]);
	const ago = $derived.by(() => {
		if (!last) return null;
		const min = Math.max(0, Math.round((now - last.at) / 60_000));
		const [n, unit] = min < 60 ? [min, 'minute'] : min < 48 * 60 ? [Math.floor(min / 60), 'hour'] : [Math.floor(min / 1440), 'day'];
		// Localised short unit name from Intl (min / Std. / godz.), shown next to the numeral.
		const label = new Intl.NumberFormat(region(), { style: 'unit', unit, unitDisplay: 'short' })
			.formatToParts(n).filter((p) => p.type === 'unit').map((p) => p.value).join('');
		return { value: num(n), unit: label };
	});
	// Today and yesterday only; the Journal has the rest.
	const recent = $derived((sessions ?? []).filter((s) => s.at >= startOfDay(startOfDay(now) - 1)));
</script>

<main class="lh-page">
	<header class="lh-page-head-row">
		<div class="lh-page-head">
			<span class="lh-overline">{date(now)}</span>
			<h1 class="lh-title">{t('today')}</h1>
		</div>
		<Button variant="quiet" class="lh-phone-only" onclick={() => goto(resolve('/settings'))}>{t('settings')}</Button>
	</header>
	{#if sessions}
		<section class="lh-tiles">
			<StatTile
				label={t('log.thisWeek')}
				value={num(week.grams, 2)}
				unit={t('gUnit')}
				{trend}
				note={t('log.sessionCount', { count: week.sessions })}
			/>
			<StatTile
				label={t('log.lastSession')}
				value={ago?.value ?? '–'}
				unit={ago?.unit}
				tone="tide"
				note={last ? t('log.agoAt', { time: time(last.at) }) : t('log.none')}
			/>
			<div class="lh-desktop-only">
				<StatTile label={t('thcInMaterial')} value={'≈ ' + num(week.mgThc)} unit={t('mgUnit')} note={t('log.thisWeek')} />
				<StatTile label={t('daysClear')} value={num(week.daysClear)} tone="tide" note={t('ofTotal', { total: weekDays })} />
			</div>
		</section>
		{#if recent.length}
			<SessionList sessions={recent} sideBySide />
		{:else}
			<p class="lh-empty">{t('log.emptyToday')}</p>
		{/if}
	{/if}
	<div class="lh-fab-wrap">
		<Button variant="primary" size="lg" class="lh-btn-fab" icon="plus" onclick={() => goto(resolve('/log/new'))}>{t('log.logSession')}</Button>
	</div>
</main>
