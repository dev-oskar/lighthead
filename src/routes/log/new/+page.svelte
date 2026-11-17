<script lang="ts">
	import { createRawSnippet, mount, onMount, unmount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ActionBar from '#lib/ds/ActionBar.svelte';
	import Button from '#lib/ds/Button.svelte';
	import Chip from '#lib/ds/Chip.svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import NumberField from '#lib/ds/NumberField.svelte';
	import OptionGrid from '#lib/ds/OptionGrid.svelte';
	import Rating from '#lib/ds/Rating.svelte';
	import Step from '#lib/ds/Step.svelte';
	import StepHeader from '#lib/ds/StepHeader.svelte';
	import StrainAvatar from '#lib/ds/StrainAvatar.svelte';
	import TextField from '#lib/ds/TextField.svelte';
	import { app, loadSettings } from '#lib/app-state.svelte.ts';
	import { deleteSession, getSession, listSessions, listStrains, saveSession } from '#lib/db.ts';
	import { date, num, pct, t, time } from '#lib/i18n.svelte.ts';
	import {
		EFFECTS, METHODS, SETTINGS_PLACES, mgThc, prefill, snapshot, uid, unitFor,
		type Method, type Session, type Strain, type StrainType, type Unit
	} from '#lib/model.ts';
	import { amountText } from '../format.ts';

	type StepN = 1 | 2 | 3 | 4; // 4 = saved
	const SNAP = '__snapshot'; // an edited session whose strain was deleted keeps its snapshot
	const ICONS = { joint: 'session', vape: 'cloud', bong: 'stash', edible: 'leaf' } as const;

	let ready = $state(false);
	let strains = $state<Strain[]>([]);
	let recentIds = $state<string[]>([]);
	let photos: Record<string, string> = {};
	let editing = $state<Session>();
	let saved = $state<Session>();

	let step = $state<StepN>(1);
	let dir = $state<'fwd' | 'back'>('fwd');
	let confirm = $state<'discard' | 'delete' | null>(null);

	let at = $state(Date.now());
	let timeSet = $state(false);
	let timeOpen = $state(false);
	let strainKey = $state<string | null>(null);
	let showAll = $state(false);
	let method = $state<Method>('vape');
	let amount = $state(0.15);
	let effects = $state<string[]>([]);
	let place = $state<string | null>(null);
	let rating = $state(0);
	let note = $state('');

	let initial = '';
	const snapshotState = () => JSON.stringify([at, strainKey, method, amount, effects, place, rating, note]);
	const dirty = $derived(ready && snapshotState() !== initial);

	const unit = $derived(unitFor(method));
	const origKey = $derived(editing ? (editing.strainId && strains.some((s) => s.id === editing!.strainId) ? editing.strainId : SNAP) : null);
	const keepSnap = $derived(!!editing && strainKey === origKey);
	const strain = $derived(strains.find((s) => s.id === strainKey));
	const info = $derived(keepSnap && editing ? { name: editing.strainName, thc: editing.thc } : strain ? { name: strain.name, thc: strain.thc } : null);
	const pf = $derived(prefill(app.settings, strains, strainKey ?? undefined));
	const prefilled = $derived(!editing && pf.amountIsLast && method === pf.method && amount === pf.amount);

	// StrainAvatar as an OptionGrid media snippet.
	const avatar = (name: string, type: StrainType, src?: string) =>
		createRawSnippet(() => ({
			render: () => '<span></span>',
			setup(el) {
				const c = mount(StrainAvatar, { target: el, props: { name, type, src, size: 'md' } });
				return () => { unmount(c); };
			}
		}));
	const strainOpt = (s: Strain) => ({
		value: s.id,
		label: s.name,
		hint: !editing && s.id === app.settings.lastStrainId ? t('lastTime') : undefined,
		media: avatar(s.name, s.type, photos[s.id])
	});
	const strainOptions = $derived.by(() => {
		const snap = editing && origKey === SNAP ? [{ value: SNAP, label: editing.strainName, media: avatar(editing.strainName, editing.strainType) }] : [];
		if (showAll || !strains.length)
			return [...snap, ...strains.map(strainOpt), { value: 'new', label: t('log.newStrain'), icon: 'plus' as const }];
		// Up to five, most recently used first, always including the selected one.
		let ids = recentIds.slice(0, 5);
		if (strainKey && strainKey !== SNAP && !ids.includes(strainKey)) ids = [strainKey, ...ids].slice(0, 5);
		for (const s of strains) if (ids.length < 5 && !ids.includes(s.id)) ids.push(s.id);
		return [...snap, ...ids.map((id) => strainOpt(strains.find((s) => s.id === id)!)), { value: 'other', label: t('somethingElse'), icon: 'plus' as const }];
	});
	const methodOptions = $derived(
		METHODS.map((m) => ({ value: m, label: t(m), icon: ICONS[m], hint: !editing && m === app.settings.lastMethod ? t('lastTime') : undefined }))
	);

	onMount(() => {
		const q = page.url.searchParams;
		(async () => {
			const [ss, sessions] = await Promise.all([listStrains(), listSessions()]);
			strains = ss;
			for (const s of ss) if (s.photo) photos[s.id] = URL.createObjectURL(s.photo);
			const known = (id?: string | null) => !!id && ss.some((s) => s.id === id);
			recentIds = [...new Set(sessions.map((s) => s.strainId).filter(known))] as string[];
			const edit = q.get('edit') ? await getSession(q.get('edit')!) : undefined;
			if (edit) load(edit);
			else {
				const fromNew = q.get('strain');
				const p = prefill(app.settings, ss, known(fromNew) ? fromNew! : undefined);
				strainKey = p.strainId ?? null;
				method = p.method;
				amount = p.amount;
				if (known(fromNew)) step = 2;
			}
			initial = snapshotState();
			ready = true;
		})();
		return () => Object.values(photos).forEach((u) => URL.revokeObjectURL(u));
	});

	function load(s: Session) {
		editing = s;
		at = s.at;
		timeSet = true;
		strainKey = s.strainId && strains.some((x) => x.id === s.strainId) ? s.strainId : SNAP;
		method = s.method;
		amount = s.amount;
		effects = [...s.effects];
		place = s.setting ?? null;
		rating = s.rating ?? 0;
		note = s.note ?? '';
	}

	function go(n: StepN) {
		dir = n > step ? 'fwd' : 'back';
		step = n;
		confirm = null;
	}

	function leave() {
		if (page.url.searchParams.has('strain') || history.length <= 1) goto(resolve('/'));
		else history.back();
	}

	function close() {
		if (step === 2 || step === 3) go((step - 1) as StepN);
		else if (dirty) confirm = 'discard';
		else leave();
	}

	function pickStrain(v: string) {
		if (v === 'other') showAll = true;
		else if (v === 'new') goto(resolve('/strains/new') + '?from=log');
		else {
			strainKey = v;
			if (!editing) {
				const p = prefill(app.settings, strains, v);
				method = p.method;
				amount = p.amount;
			}
		}
	}

	function defaultAmount(u: Unit) {
		const last = strainKey ? app.settings.amountByStrain[strainKey] : undefined;
		return last?.unit === u ? last.amount : u === 'mg' ? 5 : 0.15;
	}

	function pickMethod(m: Method) {
		if (unitFor(m) !== unit) amount = defaultAmount(unitFor(m));
		method = m;
	}

	// datetime-local wants local time without a zone.
	const local = (ms: number) => new Date(ms - new Date(ms).getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
	function setTime(v: string) {
		const ms = new Date(v).getTime();
		if (Number.isNaN(ms)) return;
		at = Math.min(ms, Date.now());
		timeSet = true;
	}

	let busy = false; // a double tap must not save twice
	async function save() {
		if (busy) return;
		busy = true;
		const ed = editing;
		const snap =
			ed && keepSnap
				? { strainId: ed.strainId, strainName: ed.strainName, strainType: ed.strainType, thc: ed.thc, cbd: ed.cbd, mgThc: mgThc(amount, unit, ed.thc) }
				: snapshot(strain!, { method, amount, unit });
		const session: Session = {
			id: ed?.id ?? uid(),
			at: timeSet ? at : Date.now(),
			...snap,
			method,
			amount,
			unit,
			setting: place ?? undefined,
			effects: [...effects],
			rating: rating || undefined,
			note: note.trim() || undefined
		};
		try {
			await saveSession(session);
			await loadSettings();
		} finally {
			busy = false;
		}
		saved = session;
		go(4);
	}

	function editSaved() {
		load(saved!);
		initial = snapshotState();
		go(1);
	}

	async function del() {
		await deleteSession(editing!.id);
		goto(resolve('/log'));
	}
</script>

<div class="lh-flow">
	{#if ready}
		<main>
			{#key step}
				<Step direction={dir}>
					{#if step === 1}
						<StepHeader step={1} total={3} title={t('qStrain')} onClose={close} />
						{#if confirm === 'discard'}
							<div class="lh-confirm" role="alert">
								<p class="lh-confirm-text">{t('log.discardTitle')}</p>
								<div class="lh-confirm-row">
									<Button variant="danger" onclick={leave}>{t('log.discard')}</Button>
									<Button onclick={() => (confirm = null)}>{t('log.keepLogging')}</Button>
								</div>
							</div>
						{/if}
						<div class="lh-row lh-row-between">
							<span class="when">
								<Icon name="clock" size={16} />
								<span>{timeSet ? date(at, { weekday: 'short', day: 'numeric', month: 'short' }) : t('now')}, <span class="lh-data when-time">{time(at)}</span></span>
							</span>
							<Button variant="quiet" aria-expanded={timeOpen} onclick={() => (timeOpen = !timeOpen)}>{t('log.changeTime')}</Button>
						</div>
						{#if timeOpen}
							<TextField label={t('log.time')} type="datetime-local" value={local(at)} max={local(Date.now())} onchange={(e) => setTime(e.currentTarget.value)} />
						{/if}
						{#if !strains.length}<p class="muted">{t('log.noStrains')}</p>{/if}
						{#key showAll}
							<OptionGrid label={t('strain')} columns={1} value={strainKey} options={strainOptions} onChange={pickStrain} />
						{/key}
					{:else if step === 2}
						<StepHeader step={2} total={3} title={t('qAmount')} subtitle={prefilled ? t('prefilledSub') : undefined} closeLabel={t('back')} onClose={close} />
						<OptionGrid label={t('method')} columns={2} value={method} options={methodOptions} onChange={pickMethod} />
						<NumberField
							bind:value={amount}
							label={t('amount')}
							size="lg"
							unit={t(unit === 'g' ? 'gUnit' : 'mgUnit')}
							step={unit === 'g' ? 0.05 : 2.5}
							decimals={unit === 'g' ? 2 : 1}
							min={0}
							max={unit === 'g' ? 10 : 200}
							{prefilled}
						/>
						{#if unit === 'g' && info}
							<p class="muted derived">
								<span class="lh-data derived-mg">{t('thcDerived', { mg: num(mgThc(amount, unit, info.thc)) })}</span>
								{t('thcIn', { amount: amountText(amount, unit), strain: info.name, pct: pct(info.thc) })}
							</p>
						{/if}
					{:else if step === 3}
						<StepHeader step={3} total={3} title={t('qFeel')} subtitle={t('optionalSub')} closeLabel={t('back')} onClose={close} />
						<section class="lh-section">
							<h2 class="lh-overline">{t('effects')}</h2>
							<div class="lh-row">
								{#each EFFECTS as e (e)}
									<Chip selected={effects.includes(e)} onChange={(on) => (effects = on ? [...effects, e] : effects.filter((x) => x !== e))}>{t(e)}</Chip>
								{/each}
							</div>
						</section>
						<section class="lh-section">
							<h2 class="lh-overline">{t('setting')}</h2>
							<div class="lh-row">
								{#each SETTINGS_PLACES as p (p)}
									<Chip selected={place === p} onChange={(on) => (place = on ? p : null)}>{t(p)}</Chip>
								{/each}
							</div>
						</section>
						<section class="lh-section tight">
							<h2 class="lh-overline">{t('rating')}</h2>
							<Rating bind:value={rating} size={36} label={t('rating')} />
						</section>
						<TextField label={t('note')} multiline placeholder={t('log.notePh')} bind:value={note} />
						{#if editing}
							{#if confirm === 'delete'}
								<div class="lh-confirm" role="alert">
									<p class="lh-confirm-text">{t('deleteForGood')}</p>
									<div class="lh-confirm-row">
										<Button variant="danger" onclick={del}>{t('delete')}</Button>
										<Button onclick={() => (confirm = null)}>{t('cancel')}</Button>
									</div>
								</div>
							{:else}
								<div><Button variant="danger" onclick={() => (confirm = 'delete')}>{t('log.deleteSession')}</Button></div>
							{/if}
						{/if}
					{:else if saved}
						<div class="saved">
							<div class="saved-mark"><Icon name="check" size={36} /></div>
							<h1 class="lh-title">{t('sessionSaved')}</h1>
							<p class="lh-data saved-line">{[time(saved.at), saved.strainName, amountText(saved.amount, saved.unit)].join(' · ')}</p>
							<p class="muted">
								{[saved.unit === 'g' && saved.mgThc != null ? t('thcDerived', { mg: num(saved.mgThc) }) : '', saved.effects.map((e) => t(e)).join(', ')]
									.filter(Boolean)
									.join(' · ')}
							</p>
							<div class="saved-edit"><Button variant="quiet" onclick={editSaved}>{t('log.editSession')}</Button></div>
						</div>
					{/if}
				</Step>
			{/key}
		</main>
		{#if step === 1}
			<ActionBar disabled={!strainKey} onPrimary={() => go(2)} />
		{:else if step === 2}
			<ActionBar disabled={!(amount > 0)} onPrimary={() => go(3)} />
		{:else if step === 3}
			<ActionBar primary={t('saveSession')} onPrimary={save} secondary onSecondary={save} />
		{:else}
			<ActionBar primary={t('done')} onPrimary={() => goto(resolve('/'))} />
		{/if}
	{/if}
</div>

<style>
	.when { display: flex; align-items: center; gap: var(--space-2); font-size: 14px; line-height: 20px; color: var(--ink-muted); }
	.when-time { color: var(--ink); }
	.muted { margin: 0; font-size: 14px; line-height: 20px; color: var(--ink-muted); }
	.derived { margin-top: calc(-1 * var(--space-2)); }
	.derived-mg { font-size: 14px; color: var(--ink); }
	.lh-overline { margin: 0; }
	.tight { gap: var(--space-2); }
	.lh-confirm-text { margin: 0; color: var(--ink); }
	.saved { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-3); padding: 144px var(--space-2) 0; }
	.saved-mark { width: 72px; height: 72px; border-radius: 22px 4px 22px 4px; background: var(--tide-soft); color: var(--tide); display: flex; align-items: center; justify-content: center; }
	.saved .lh-title { margin-top: var(--space-2); }
	.saved-line { margin: 0; color: var(--ink); }
	.saved-edit { margin-top: var(--space-4); }
</style>
