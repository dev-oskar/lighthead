<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '#lib/ds/Button.svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import Notice from '#lib/ds/Notice.svelte';
	import NumberField from '#lib/ds/NumberField.svelte';
	import Rating from '#lib/ds/Rating.svelte';
	import SessionCard from '#lib/ds/SessionCard.svelte';
	import StrainAvatar from '#lib/ds/StrainAvatar.svelte';
	import StrainBadge from '#lib/ds/StrainBadge.svelte';
	import TextField from '#lib/ds/TextField.svelte';
	import { deleteStrain, getStrain, putStrain, sessionsForStrain } from '#lib/db.ts';
	import type { Session, Strain } from '#lib/model.ts';
	import { prepareStrainPhoto } from '#lib/photo.ts';
	import { date, num, pct, t, time } from '#lib/i18n.svelte.ts';
	import { grams } from '../format.ts';
	import { methodText } from '../../log/format.ts';

	const id = $derived(page.params.id ?? '');
	let strain = $state.raw<Strain | undefined>();
	let sessions = $state.raw<Session[]>([]);
	let loaded = $state(false);
	let stashDraft = $state<number | null>(null); // non-null while editing the stash
	let noteDraft = $state<string | null>(null); // non-null while editing the note
	let confirmDelete = $state(false);
	let failed = $state(false); // a write threw: say so, keep what was typed

	async function load(sid: string) {
		[strain, sessions] = await Promise.all([getStrain(sid), sessionsForStrain(sid)]);
		loaded = true;
	}
	$effect(() => { load(id); });

	/** false when the write failed; the page keeps showing what was there. */
	async function save(next: Strain) {
		try {
			await putStrain(next);
		} catch {
			failed = true;
			return false;
		}
		failed = false;
		await load(next.id);
		return true;
	}

	const photo = $derived(strain?.photo ? URL.createObjectURL(strain.photo) : undefined);
	$effect(() => {
		const u = photo;
		return () => { if (u) URL.revokeObjectURL(u); };
	});

	async function pickPhoto(file: File) {
		if (strain) await save({ ...strain, photo: await prepareStrainPhoto(file) });
	}

	async function saveStash() {
		if (!strain || stashDraft == null) return;
		if (await save({ ...strain, stashG: stashDraft })) stashDraft = null;
	}

	async function saveNote() {
		if (!strain || noteDraft == null) return;
		if (await save({ ...strain, note: noteDraft.trim() || undefined })) noteDraft = null;
	}

	async function remove() {
		try {
			await deleteStrain(id);
		} catch {
			failed = true;
			return;
		}
		goto(resolve('/strains'));
	}

	const amount = (s: Session) => (s.unit === 'g' ? grams(s.amount) : `${num(s.amount)} ${t('mgUnit')}`);
</script>

<main class="lh-page detail">
	<div class="topbar">
		<Button variant="quiet" onclick={() => goto(resolve('/strains'))}>{t('allStrains')}</Button>
		{#if strain}
			<Button variant="quiet" onclick={() => goto(resolve('/strains/new') + '?edit=' + encodeURIComponent(id))}>{t('edit')}</Button>
		{/if}
	</div>

	{#if failed}<Notice tone="danger">{t('errors.saveFailed')}</Notice>{/if}
	{#if strain}
		<div class="split">
			<div class="col">
				<section class="panel lh-leafcorner">
					<div class="head">
						<StrainAvatar name={strain.name} type={strain.type} size="xl" src={photo} editable onPick={pickPhoto} />
						<div class="title">
							<StrainBadge type={strain.type} />
							<h1 class="lh-title">{strain.name}</h1>
							{#if strain.breeder}<p class="lh-meta">{strain.breeder}</p>{/if}
							<Rating
								value={strain.rating ?? 0}
								size={18}
								label={t('yourRating')}
								onChange={(v) => strain && save({ ...strain, rating: v || undefined })}
							/>
						</div>
					</div>
					<dl class="lh-cannab">
						<div><dt>{t('thc')}</dt><dd class="lh-data">{pct(strain.thc)}</dd></div>
						<div><dt>{t('cbd')}</dt><dd class="lh-data">{pct(strain.cbd)}</dd></div>
						<div><dt>{t('sessions')}</dt><dd class="lh-data">{sessions.length}</dd></div>
					</dl>
					{#if strain.terpenes.length}
						<div class="lh-tags">
							{#each strain.terpenes as tp (tp)}<span class="lh-tag">{tp}</span>{/each}
						</div>
					{/if}
				</section>

				<section class="stash">
					{#if stashDraft == null}
						<span class="stash-icon"><Icon name="stash" size={20} /></span>
						<div class="stash-text">
							<span class="stash-label">{t('inStash')}</span>
							<span class="lh-data">{grams(strain.stashG)}</span>
						</div>
						<Button variant="secondary" onclick={() => (stashDraft = strain?.stashG ?? 0)}>{t('update')}</Button>
					{:else}
						<div class="stash-edit">
							<NumberField label={t('inStash')} unit={t('gUnit')} step={0.1} decimals={2} max={1000} bind:value={stashDraft} />
							<div class="lh-confirm-row">
								<Button variant="primary" onclick={saveStash}>{t('save')}</Button>
								<Button variant="quiet" onclick={() => (stashDraft = null)}>{t('cancel')}</Button>
							</div>
						</div>
					{/if}
				</section>

				<section class="note">
					{#if noteDraft != null}
						<TextField label={t('note')} hint={t('noteHint')} placeholder={t('strainNotePh')} multiline bind:value={noteDraft} />
						<div class="lh-confirm-row">
							<Button variant="primary" onclick={saveNote}>{t('save')}</Button>
							<Button variant="quiet" onclick={() => (noteDraft = null)}>{t('cancel')}</Button>
						</div>
					{:else if strain.note}
						<div class="note-head">
							<h2 class="lh-overline">{t('note')}</h2>
							<Button variant="quiet" aria-label={t('editNote')} onclick={() => (noteDraft = strain?.note ?? '')}>{t('edit')}</Button>
						</div>
						<p class="note-text">{strain.note}</p>
					{:else}
						<div><Button variant="secondary" onclick={() => (noteDraft = '')}>{t('addNote')}</Button></div>
					{/if}
				</section>
			</div>
			<section class="lh-section">
				<h2 class="lh-overline">{t('yourSessions')}</h2>
				{#each sessions as s (s.id)}
					<SessionCard
						time={time(s.at)}
						ago={date(s.at, { weekday: 'short', day: 'numeric', month: 'short' })}
						strain={s.strainName}
						type={s.strainType}
						method={methodText(s)}
						amount={amount(s)}
						setting={s.setting ? t(s.setting) : undefined}
						effects={s.effects.map((e) => t(e))}
						note={s.note}
						rating={s.rating}
						{photo}
					/>
				{:else}
					<p class="lh-meta">{t('noStrainSessions')}</p>
				{/each}
			</section>
		</div>

		{#if confirmDelete}
			<div class="lh-confirm" role="alert">
				<p class="confirm-text">{t('deleteStrainBody')}</p>
				<div class="lh-confirm-row">
					<Button variant="danger" onclick={remove}>{t('deleteStrain')}</Button>
					<Button variant="quiet" onclick={() => (confirmDelete = false)}>{t('cancel')}</Button>
				</div>
			</div>
		{:else}
			<div><Button variant="danger" onclick={() => (confirmDelete = true)}>{t('deleteStrain')}</Button></div>
		{/if}
	{:else if loaded}
		<div class="lh-empty">
			<p>{t('strainNotFound')}</p>
			<a href={resolve('/strains')}>{t('allStrains')}</a>
		</div>
	{/if}
</main>

<style>
	.detail { padding-top: var(--space-3); gap: var(--space-5); }
	.topbar { display: flex; align-items: center; justify-content: space-between; margin-left: calc(-1 * var(--space-3)); }
	.panel { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5); background: var(--surface-raised); border: 1px solid var(--line); }
	.head { display: flex; align-items: center; gap: var(--space-4); }
	.title { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
	.title p { margin: 0; }
	.stash { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-md); }
	.stash-icon { color: var(--ink-muted); display: flex; }
	.stash-text { flex: 1; display: flex; flex-direction: column; }
	.stash-label { font-size: 14px; line-height: 18px; font-weight: 600; }
	.stash-edit { flex: 1; display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-1) 0; }
	.note { display: flex; flex-direction: column; gap: var(--space-3); }
	.note-head { display: flex; align-items: center; justify-content: space-between; margin-right: calc(-1 * var(--space-3)); }
	.note-text { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
	h2.lh-overline { margin: 0; }
	.confirm-text { margin: 0; color: var(--ink); }
	/* Phone: one column, as if the wrappers were not there. Desktop: panel + stash left, sessions right. */
	.split, .col { display: contents; }
	@media (min-width: 960px) {
		.split { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-6); align-items: start; }
		.col { display: flex; flex-direction: column; gap: var(--space-5); }
	}
</style>
