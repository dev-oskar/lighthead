<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ActionBar from '#lib/ds/ActionBar.svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import Notice from '#lib/ds/Notice.svelte';
	import SegmentedControl from '#lib/ds/SegmentedControl.svelte';
	import Step from '#lib/ds/Step.svelte';
	import StepHeader from '#lib/ds/StepHeader.svelte';
	import StrainAvatar from '#lib/ds/StrainAvatar.svelte';
	import { app, updateSettings } from '#lib/app-state.svelte.ts';
	import { i18n, t, type Locale } from '#lib/i18n.svelte.ts';
	import { install, installKind } from '#lib/install.svelte.ts';
	import { MediaQuery } from 'svelte/reactivity';

	// Language names are endonyms: never translated.
	const LANGS = [{ value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'pl', label: 'Polski' }];
	const desktop = new MediaQuery('min-width: 960px');
	// No install step when installed already or the browser can't install (desktop Firefox).
	let kind = $state(installKind());
	// Chrome may fire beforeinstallprompt a moment after load: still in time while on the first step.
	$effect(() => {
		if (i === 0 && install.prompt && !kind) kind = 'prompt';
	});
	const STEPS = $derived(kind ? (['welcome', 'install', 'strain'] as const) : (['welcome', 'strain'] as const));
	// Desktop wording, except iPads, which install like a phone.
	const computer = $derived(desktop.current && kind !== 'ios');

	let i = $state(0);
	let dir = $state<'fwd' | 'back'>('fwd');
	let failed = $state(false);
	const step = $derived(STEPS[i]);

	function go(n: number) {
		dir = n > i ? 'fwd' : 'back';
		i = n;
	}

	async function setLocale(v: string) {
		try {
			await updateSettings({ locale: v as Locale });
			failed = false;
		} catch {
			failed = true;
		}
	}

	// Leaving by any way out (finish, Later, close) ends onboarding for good.
	async function finish(to: 'today' | 'strain') {
		try {
			await updateSettings({ onboarded: true });
		} catch { /* not saved: onboarding shows again next launch, nothing is lost */ }
		// replaceState: Back from Today (or the strain flow) must not reopen onboarding
		goto(to === 'strain' ? resolve('/strains/new') + '?from=onboarding' : resolve('/'), { replaceState: true });
	}

	async function promptInstall() {
		const p = install.prompt!;
		install.prompt = undefined; // one use per event
		try { await p.prompt(); } catch { /* dismissed or unsupported */ }
		go(i + 1);
	}

	// "Tap {b} …": the UI label in bold.
	const bold = (key: string) => t(key, { b: '\u0000' }).split('\u0000');
</script>

<!-- Desktop only, and only in the DOM there, so the phone has one privacy notice. -->
{#if desktop.current}
<aside class="brand">
	<div class="brand-top">
		<div class="mark mark-lg"><Icon name="leaf" size={48} /></div>
		<h1 class="lh-display">{t('appName')}</h1>
		<p class="lead lead-lg">{t('onboarding.tagline')}</p>
	</div>
	<Notice tone="private" icon="lock" title={t('storedOnDevice')}>{t('onboarding.privateBody')}</Notice>
</aside>
{/if}

<div class="lh-flow flow">
	<main>
		{#key step}
			<Step direction={dir}>
				<div class="step">
					{#if step === 'welcome'}
						<StepHeader
							step={i + 1}
							total={STEPS.length}
							title={desktop.current ? t('onboarding.languageTitle') : undefined}
							subtitle={desktop.current ? t('onboarding.languageSub') : undefined}
							onClose={() => finish('today')}
						/>
						<!-- Phone: the brand sits here; on desktop it is the left panel. -->
						<div class="intro">
							<div class="hero">
								<div class="mark"><Icon name="leaf" size={36} /></div>
								<h1 class="lh-display">{t('appName')}</h1>
								<p class="lead">{t('onboarding.tagline')}</p>
							</div>
							<Notice tone="private" icon="lock" title={t('storedOnDevice')}>{t('onboarding.privateBody')}</Notice>
						</div>
						{#if failed}<Notice tone="danger">{t('errors.saveFailed')}</Notice>{/if}
						<section class="lh-section tight">
							<h2 class="lh-overline overline">{t('language')}</h2>
							<SegmentedControl label={t('language')} value={app.settings.locale ?? i18n.locale} options={LANGS} onChange={setLocale} />
						</section>
					{:else if step === 'install'}
						<StepHeader
							step={i + 1}
							total={STEPS.length}
							title={t(computer ? 'onboarding.installTitleDesktop' : 'onboarding.installTitle')}
							subtitle={t(computer ? 'onboarding.installSubDesktop' : 'onboarding.installSub')}
							closeLabel={t('back')}
							onClose={() => go(i - 1)}
						/>
						{#if !install.prompt && kind !== 'prompt'}
							{@const k = kind === 'mac' ? 'onboarding.mac' : 'onboarding.install'}
							<ol class="steps">
								{#each [1, 2] as n (n)}
									{@const [a, z] = bold(`${k}${n}`)}
									<li class="lh-card"><span class="lh-data num">{n}</span><span>{a}<strong>{t(`${k}${n}b`)}</strong>{z}</span></li>
								{/each}
								<li class="lh-card"><span class="lh-data num">3</span><span>{t(`${k}3`)}</span></li>
							</ol>
						{/if}
						<p class="lh-meta offline"><Icon name="check" size={16} />{t('onboarding.offline')}</p>
					{:else}
						<StepHeader
							step={i + 1}
							total={STEPS.length}
							title={t('onboarding.strainTitle')}
							subtitle={t('onboarding.strainSub')}
							closeLabel={t('back')}
							onClose={() => go(i - 1)}
						/>
						<div class="card">
							<StrainAvatar name={t('onboarding.yourStrain')} type="hybrid" size="lg" />
							<div class="card-text">
								<span class="lh-heading">{t('onboarding.cardTitle')}</span>
								<span class="lh-meta">{t('onboarding.cardBody')}</span>
							</div>
						</div>
						<p class="lh-meta">{t('onboarding.laterHint')}</p>
					{/if}
				</div>
			</Step>
		{/key}
	</main>

	{#if step === 'welcome'}
		<ActionBar onPrimary={() => go(i + 1)} />
	{:else if step === 'install'}
		{#if install.prompt}
			<ActionBar primary={t('onboarding.install')} onPrimary={promptInstall} secondary onSecondary={() => go(i + 1)} />
		{:else}
			<ActionBar onPrimary={() => go(i + 1)} secondary onSecondary={() => go(i + 1)} />
		{/if}
	{:else}
		<ActionBar primary={t('onboarding.addStrain')} onPrimary={() => finish('strain')} secondary={t('onboarding.later')} onSecondary={() => finish('today')} />
	{/if}
</div>

<style>
	.step, .intro { display: flex; flex-direction: column; gap: var(--space-5); }
	.hero { display: flex; flex-direction: column; gap: var(--space-3); padding-top: var(--space-8); }
	.mark { width: 72px; height: 72px; border-radius: 22px 4px 22px 4px; background: var(--moss-soft); color: var(--moss); display: flex; align-items: center; justify-content: center; }
	.lead { margin: 0; font-size: 17px; line-height: 26px; color: var(--ink); }
	.tight { gap: var(--space-2); }
	h2.lh-overline { margin: 0; }
	.steps { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
	.steps li { display: flex; align-items: center; gap: var(--space-3); color: var(--ink); }
	.num { width: 32px; height: 32px; flex: none; border-radius: var(--radius-full); background: var(--surface-sunk); display: flex; align-items: center; justify-content: center; }
	.offline { margin: 0; display: flex; align-items: center; gap: var(--space-2); }
	.card { display: flex; align-items: center; gap: var(--space-3); padding: 20px; background: var(--surface-raised); border: 1px solid var(--line); border-radius: 22px 4px 22px 4px; }
	.card-text { display: flex; flex-direction: column; gap: var(--space-1); }
	.lh-meta { margin: 0; }

	/* Desktop: a fixed brand panel on the left, the step and its ActionBar centred in the rest. */
	@media (min-width: 960px) {
		.intro, .overline { display: none; }
		.brand { position: fixed; top: 0; bottom: 0; left: 0; width: 480px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; gap: var(--space-6); padding: 56px 48px; background: var(--surface-raised); border-right: 1px solid var(--line); overflow-y: auto; }
		.brand-top { display: flex; flex-direction: column; gap: var(--space-4); }
		.brand h1 { margin-top: var(--space-2); }
		.mark-lg { width: 96px; height: 96px; border-radius: 28px 6px 28px 6px; }
		.lead-lg { font-size: 19px; line-height: 28px; max-width: 340px; }
		.flow { width: auto; max-width: none; margin: 0 0 0 480px; padding: 48px; justify-content: center; align-items: center; }
		.flow > main, .flow > :global(.lh-actionbar) { width: 100%; max-width: 520px; }
		.flow > main { flex: none; }
		.step { gap: 28px; }
	}
</style>
