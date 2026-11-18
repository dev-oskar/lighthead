<script lang="ts">
	import { onMount } from 'svelte';
	import SegmentedControl from '#lib/ds/SegmentedControl.svelte';
	import StatTile from '#lib/ds/StatTile.svelte';
	import { listSessions } from '#lib/db.ts';
	import { i18n, t, num, date, region } from '#lib/i18n.svelte.ts';
	import { periodRange, previousSpan, startOfDay, totals, vapeTemps, type Period, type Session } from '#lib/model.ts';
	import { useNow } from '#lib/now.svelte.ts';
	import { tempNum, tempSymbol, tempText } from '../log/format.ts';

	let sessions = $state<Session[]>([]);
	let period = $state<Period>('week');
	const clock = useNow();
	const now = $derived(clock.now);
	onMount(async () => { sessions = await listSessions(); });

	const range = $derived(periodRange(period, now, region()));
	const cur = $derived(totals(sessions, range.start, range.end, now));
	// Same elapsed span of the previous period (Mon–Wed vs Mon–Wed), not the whole of it.
	const prevSpan = $derived(previousSpan(period, now, region()));
	const prev = $derived(totals(sessions, prevSpan.start, prevSpan.end, now));
	const inRange = $derived(sessions.filter((s) => s.at >= range.start && s.at < range.end));

	const overline = $derived.by(() => {
		if (period === 'year') return date(range.start, { year: 'numeric' });
		if (period === 'month') return date(range.start, { month: 'long', year: 'numeric' });
		return new Intl.DateTimeFormat(region(), { day: 'numeric', month: 'long' }).formatRange(range.start, range.end - 1);
	});

	// Trend buckets: days for a week, 7-day chunks for a month, months for a year. Future buckets are left out.
	const buckets = $derived.by(() => {
		const out: [number, number][] = [];
		const d = new Date(range.start);
		while (d.getTime() < range.end && d.getTime() <= now) {
			const b0 = d.getTime();
			if (period === 'year') d.setMonth(d.getMonth() + 1);
			else d.setDate(d.getDate() + (period === 'week' ? 1 : 7));
			out.push([b0, Math.min(d.getTime(), range.end)]);
		}
		return out;
	});
	const gTrend = $derived(buckets.map(([a, b]) => +inRange.filter((s) => s.unit === 'g' && s.at >= a && s.at < b).reduce((x, s) => x + s.amount, 0).toFixed(2)));
	const sTrend = $derived(buckets.map(([a, b]) => inRange.filter((s) => s.at >= a && s.at < b).length));
	const elapsedDays = $derived(Math.round((startOfDay(now) - range.start) / 86_400_000) + 1); // the period always contains today

	const gramsNote = $derived.by(() => {
		const diff = +(cur.grams - prev.grams).toFixed(2);
		const p = t('prev_' + period);
		if (Math.abs(diff) < 0.01) return t('cmpSame', { prev: p });
		return t(diff < 0 ? 'cmpLess' : 'cmpMore', { amount: num(Math.abs(diff), 2) + ' ' + t('gUnit'), prev: p });
	});

	// Most common time of day: morning 5–12, afternoon 12–17, evening 17–22, night otherwise.
	const timeNote = $derived.by(() => {
		const counts = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
		for (const s of inRange) {
			const h = new Date(s.at).getHours();
			counts[h >= 5 && h < 12 ? 'Morning' : h >= 12 && h < 17 ? 'Afternoon' : h >= 17 && h < 22 ? 'Evening' : 'Night']++;
		}
		const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
		return top[1] ? t('mostly' + top[0]) : undefined;
	});

	const temps = $derived(vapeTemps(sessions, range.start, range.end));
	const tempNote = $derived(
		temps && [tempNum(temps.min) !== tempNum(temps.max) ? tempNum(temps.min) + '–' + tempText(temps.max) : '', t('units.nSessions', { count: temps.count })].filter(Boolean).join(' · ')
	);

	const maxStrain = $derived(cur.byStrain[0]?.grams || 1);
</script>

<main class="lh-page stats">
	<header class="lh-page-head">
		<span class="lh-overline">{overline}</span>
		<h1 class="lh-title">{t('stats')}</h1>
	</header>
	<SegmentedControl
		label={t('period')}
		value={period}
		options={(['week', 'month', 'year'] as const).map((p) => ({ value: p, label: t(p) }))}
		onChange={(v) => (period = v as Period)}
	/>
	{#if cur.sessions === 0}
		<p class="lh-empty">{t('statsEmpty')}</p>
	{:else}
		<section class="tiles">
			<StatTile label={t('amount')} value={num(cur.grams, 2)} unit={t('gUnit')} trend={gTrend} note={gramsNote} />
			<StatTile label={t('sessions')} value={num(cur.sessions)} tone="resin" trend={sTrend} note={timeNote} />
			<StatTile label={t('thcInMaterial')} value={'≈ ' + num(cur.mgThc)} unit={t('mgUnit')} note={t('thcNote')} />
			<StatTile label={t('daysClear')} value={num(cur.daysClear)} tone="tide" note={t('ofTotal', { total: elapsedDays })} />
			{#if cur.edibleMg > 0}
				<StatTile label={t('edibles')} value={num(cur.edibleMg)} unit={t('mgUnit')} />
			{/if}
		</section>
		{#if cur.byStrain.length}
			<section class="lh-card bars">
				<h2 class="lh-overline">{t('byStrain')}</h2>
				{#each cur.byStrain as s (s.name)}
					<div class="bar">
						<div class="bar-head"><span class="bar-name">{s.name}</span><span class="lh-data">{num(s.grams, 2)} {t('gUnit')}</span></div>
						<div class="bar-track"><div class="bar-fill" style:width="{(s.grams / maxStrain) * 100}%"></div></div>
					</div>
				{/each}
			</section>
		{/if}
		{#if temps}
			<section class="temp">
				<StatTile label={t('units.vapeTemp')} value={tempNum(temps.median)} unit={tempSymbol()} note={tempNote} />
				<section class="lh-card bars">
					<h2 class="lh-overline">{t('units.vapeTempByStrain')}</h2>
					{#each temps.byStrain as s (s.name)}
						<div class="bar-head">
							<span class="bar-name">{s.name}</span>
							<span class="lh-data">{tempText(s.median)} <span class="count">· {t('units.nSessions', { count: s.count })}</span></span>
						</div>
					{/each}
				</section>
			</section>
		{/if}
	{/if}
</main>

<style>
	.stats { gap: var(--space-5); }
	.tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
	@media (min-width: 960px) { .tiles { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-4); } }
	.bars { display: flex; flex-direction: column; gap: var(--space-3); }
	.bars h2 { margin: 0; }
	.bar { display: flex; flex-direction: column; gap: var(--space-1); }
	.bar-head { display: flex; justify-content: space-between; gap: var(--space-2); }
	.bar-name { font-size: 14px; line-height: 20px; font-weight: 600; }
	.bar-head .lh-data { font-size: 14px; }
	/* Own section, not a 5th tile: on desktop the tile sits in the first column of the 4-column tile grid above. */
	.temp { display: grid; gap: var(--space-3); }
	@media (min-width: 960px) { .temp { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-4); } .temp .bars { grid-column: span 3; } }
	.count { color: var(--ink-muted); }
	.bar-track { height: 8px; border-radius: var(--radius-full); background: var(--surface-sunk); }
	.bar-fill { height: 8px; border-radius: var(--radius-full); background: var(--moss); }
</style>
