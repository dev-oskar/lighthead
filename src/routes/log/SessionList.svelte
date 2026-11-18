<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import SessionCard from '#lib/ds/SessionCard.svelte';
	import { listStrains } from '#lib/db.ts';
	import { date, t, time } from '#lib/i18n.svelte.ts';
	import { groupByDay, startOfDay, type Session } from '#lib/model.ts';
	import { amountText, dayLabel, methodText } from './format.ts';

	// Sessions grouped by day, each card opens the session for editing.
	// sideBySide (Today): on desktop the days sit next to each other instead of cards two across.
	let { sessions, sideBySide = false }: { sessions: Session[]; sideBySide?: boolean } = $props();

	const groups = $derived(groupByDay(sessions));
	const today = startOfDay(Date.now());
	let photos = $state<Record<string, string>>({});

	onMount(() => {
		let urls: string[] = [];
		listStrains().then((strains) => {
			const out: Record<string, string> = {};
			for (const s of strains) if (s.photo) urls.push((out[s.id] = URL.createObjectURL(s.photo)));
			photos = out;
		});
		return () => urls.forEach((u) => URL.revokeObjectURL(u));
	});
</script>

<section class={['lh-days', sideBySide && 'lh-days-side']}>
	{#each groups as g (g.day)}
		<div class="lh-day">
			<h2 class="lh-overline" style:margin="0">{dayLabel(g.day)}</h2>
			<div class="lh-day-cards">
				{#each g.sessions as s (s.id)}
					<a class="lh-session-link" href={resolve('/log/new') + '?edit=' + encodeURIComponent(s.id)} aria-label={`${time(s.at)} · ${s.strainName} · ${amountText(s.amount, s.unit)}`}>
						<SessionCard
							time={time(s.at)}
							ago={g.day === today ? t('today') : date(s.at, { weekday: 'short' })}
							strain={s.strainName}
							type={s.strainType}
							method={methodText(s)}
							amount={amountText(s.amount, s.unit)}
							setting={s.setting ? t(s.setting) : undefined}
							effects={s.effects.map((e) => t(e))}
							note={s.note}
							rating={s.rating}
							photo={s.strainId ? photos[s.strainId] : undefined}
						/>
					</a>
				{/each}
			</div>
		</div>
	{/each}
</section>

<style>
	.lh-session-link { display: block; color: inherit; text-decoration: none; border-radius: var(--radius-md); }
</style>
