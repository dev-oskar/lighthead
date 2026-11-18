<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
	import ActionBar from '#lib/ds/ActionBar.svelte';
	import Button from '#lib/ds/Button.svelte';
	import Chip from '#lib/ds/Chip.svelte';
	import Notice from '#lib/ds/Notice.svelte';
	import NumberField from '#lib/ds/NumberField.svelte';
	import OptionGrid from '#lib/ds/OptionGrid.svelte';
	import Step from '#lib/ds/Step.svelte';
	import StepHeader from '#lib/ds/StepHeader.svelte';
	import StrainAvatar from '#lib/ds/StrainAvatar.svelte';
	import TextField from '#lib/ds/TextField.svelte';
	import { getStrain, putStrain } from '#lib/db.ts';
	import { STRAIN_TYPES, TERPENES, uid, type Strain, type StrainType } from '#lib/model.ts';
	import { prepareStrainPhoto } from '#lib/photo.ts';
	import { t } from '#lib/i18n.svelte.ts';

	const editId = page.url.searchParams.get('edit');
	const fromLog = page.url.searchParams.get('from') === 'log';
	const fromOnboarding = page.url.searchParams.get('from') === 'onboarding'; // first run: back to Today, not the strain

	let original = $state.raw<Strain | undefined>();
	let step = $state(1);
	let dir = $state<'fwd' | 'back'>('fwd');
	let name = $state('');
	let type = $state<StrainType>('hybrid');
	let breeder = $state('');
	let thc = $state(18);
	let cbd = $state(0.5);
	let terpenes = $state<string[]>([]);
	let photo = $state.raw<Blob | undefined>();
	let nameError = $state(false);
	let confirmDiscard = $state(false);
	let saving = $state(false);
	let failed = $state(false); // the write threw: say so, keep the form

	if (editId)
		getStrain(editId).then((s) => {
			if (!s) return;
			original = s;
			({ name, type, thc, cbd, photo } = s);
			breeder = s.breeder ?? '';
			terpenes = [...s.terpenes];
		});

	const photoUrl = $derived(photo ? URL.createObjectURL(photo) : undefined);
	$effect(() => {
		const u = photoUrl;
		return () => { if (u) URL.revokeObjectURL(u); };
	});

	const dirty = $derived(
		original
			? name !== original.name || type !== original.type || breeder !== (original.breeder ?? '')
			: !!(name.trim() || breeder.trim())
	);

	function go(n: number) {
		dir = n > step ? 'fwd' : 'back';
		step = n;
	}

	function leave() {
		if (fromLog) history.back();
		else if (fromOnboarding) goto(resolve('/'), { replaceState: true });
		else if (editId) goto(resolve('/strains/[id]', { id: editId }));
		else goto(resolve('/strains'));
	}

	function close() {
		if (step > 1) go(step - 1);
		else if (dirty) confirmDiscard = true;
		else leave();
	}

	async function next() {
		if (step === 1 && !name.trim()) {
			nameError = true;
			await tick();
			document.getElementById('strain-name')?.focus();
			return;
		}
		go(step + 1);
	}

	async function pickPhoto(file: File) {
		photo = await prepareStrainPhoto(file);
	}

	async function save() {
		if (saving || (editId && !original)) return; // edit form not loaded yet: never create a duplicate
		saving = true;
		const now = Date.now();
		const strain: Strain = {
			...(original ?? { id: uid(), createdAt: now, updatedAt: now }),
			name: name.trim(),
			type,
			breeder: breeder.trim() || undefined,
			thc,
			cbd,
			terpenes: [...terpenes],
			photo
		};
		try {
			await putStrain(strain);
		} catch {
			failed = true;
			return;
		} finally {
			saving = false;
		}
		if (fromLog) goto(resolve('/log/new') + '?strain=' + encodeURIComponent(strain.id));
		else if (fromOnboarding) goto(resolve('/'), { replaceState: true });
		else goto(resolve('/strains/[id]', { id: strain.id }));
	}

	const typeOptions = $derived(STRAIN_TYPES.map((v) => ({ value: v, label: t(v), media: { indica, sativa, hybrid, cbd: cbdMedia }[v] })));
</script>

{#snippet indica()}<StrainAvatar {name} type="indica" size="sm" />{/snippet}
{#snippet sativa()}<StrainAvatar {name} type="sativa" size="sm" />{/snippet}
{#snippet hybrid()}<StrainAvatar {name} type="hybrid" size="sm" />{/snippet}
{#snippet cbdMedia()}<StrainAvatar {name} type="cbd" size="sm" />{/snippet}

<div class="lh-flow">
	{#if step === 1}
		<StepHeader step={1} total={3} title={t('qStrainName')} onClose={close} />
	{:else if step === 2}
		<StepHeader step={2} total={3} title={t('qStrainLabel')} subtitle={t('strainLabelSub')} onClose={close} closeLabel={t('back')} />
	{:else}
		<StepHeader step={3} total={3} title={t('qStrainPhoto')} subtitle={t('strainPhotoSub')} onClose={close} closeLabel={t('back')} />
	{/if}

	<main>
		{#if failed}<Notice tone="danger">{t('errors.saveFailed')}</Notice>{/if}
		{#if confirmDiscard}
			<div class="lh-confirm" role="alert">
				<p class="confirm-title">{t('discardStrain')}</p>
				<p class="confirm-text">{t('discardStrainBody')}</p>
				<div class="lh-confirm-row">
					<Button variant="danger" onclick={leave}>{t('discard')}</Button>
					<Button variant="quiet" onclick={() => (confirmDiscard = false)}>{t('keepEditing')}</Button>
				</div>
			</div>
		{/if}
		{#key step}
			<Step direction={dir}>
				<div class="step">
					{#if step === 1}
						<TextField
							id="strain-name"
							label={t('strainName')}
							placeholder={t('strainNamePh')}
							autocomplete="off"
							bind:value={name}
							hint={t('strainNameError')}
							error={nameError && !name.trim() ? t('strainNameError') : undefined}
						/>
						<OptionGrid label={t('strainType')} columns={2} options={typeOptions} bind:value={() => type, (v) => (type = v as StrainType)} />
						<TextField label={t('breederOptional')} placeholder={t('breederPh')} autocomplete="off" bind:value={breeder} />
					{:else if step === 2}
						<NumberField label={t('thc')} unit="%" step={0.5} decimals={1} min={0} max={100} bind:value={thc} />
						<NumberField label={t('cbd')} unit="%" step={0.5} decimals={1} min={0} max={100} bind:value={cbd} />
						<section class="lh-section">
							<h2 class="lh-overline">{t('terpenesOptional')}</h2>
							<div class="chips">
								{#each TERPENES as tp (tp)}
									<Chip bind:selected={() => terpenes.includes(tp), (v) => (terpenes = v ? [...terpenes, tp] : terpenes.filter((x) => x !== tp))}>{tp}</Chip>
								{/each}
							</div>
						</section>
					{:else}
						<div class="photo">
							<StrainAvatar name={name.trim()} {type} size={160} src={photoUrl} editable onPick={pickPhoto} />
							<p class="photo-hint">{t('strainPhotoHint')}</p>
							{#if photo}
								<Button variant="quiet" onclick={() => (photo = undefined)}>{t('removePhoto')}</Button>
							{/if}
						</div>
						<Notice tone="private" icon="lock" title={t('photoPrivateTitle')}>{t('photoPrivateBody')}</Notice>
					{/if}
				</div>
			</Step>
		{/key}
	</main>

	{#if step < 3}
		<ActionBar onPrimary={next} />
	{:else}
		<ActionBar primary={t('saveStrain')} secondary onPrimary={save} onSecondary={save} disabled={saving} />
	{/if}
</div>

<style>
	.step { display: flex; flex-direction: column; gap: var(--space-5); }
	.chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
	h2.lh-overline { margin: 0; }
	.photo { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); padding: var(--space-6) 0 var(--space-2); }
	.photo-hint { margin: var(--space-2) 0 0; font-size: 14px; line-height: 20px; color: var(--ink-muted); text-align: center; }
	.confirm-title { margin: 0; font-weight: 600; color: var(--ink); }
	.confirm-text { margin: 0; color: var(--ink); }
</style>
