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
	import { install, installed } from '#lib/install.svelte.ts';

	// Language names are endonyms: never translated.
	const LANGS = [{ value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'pl', label: 'Polski' }];
	// Already on the home screen: no install step.
	const STEPS = installed() ? (['welcome', 'strain'] as const) : (['welcome', 'install', 'strain'] as const);

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

<div class="lh-flow">
	<main>
		{#key step}
			<Step direction={dir}>
				<div class="step">
					{#if step === 'welcome'}
						<StepHeader step={i + 1} total={STEPS.length} onClose={() => finish('today')} />
						<div class="hero">
							<div class="mark"><Icon name="leaf" size={36} /></div>
							<h1 class="lh-display">{t('appName')}</h1>
							<p class="lead">{t('onboarding.tagline')}</p>
						</div>
						<Notice tone="private" icon="lock" title={t('storedOnDevice')}>{t('onboarding.privateBody')}</Notice>
						{#if failed}<Notice tone="danger">{t('errors.saveFailed')}</Notice>{/if}
						<section class="lh-section tight">
							<h2 class="lh-overline">{t('language')}</h2>
							<SegmentedControl label={t('language')} value={app.settings.locale ?? i18n.locale} options={LANGS} onChange={setLocale} />
						</section>
					{:else if step === 'install'}
						<StepHeader
							step={i + 1}
							total={STEPS.length}
							title={t('onboarding.installTitle')}
							subtitle={t('onboarding.installSub')}
							closeLabel={t('back')}
							onClose={() => go(i - 1)}
						/>
						{#if !install.prompt}
							<ol class="steps">
								{#each [1, 2] as n (n)}
									{@const [a, z] = bold(`onboarding.install${n}`)}
									<li class="lh-card"><span class="lh-data num">{n}</span><span>{a}<strong>{t(`onboarding.install${n}b`)}</strong>{z}</span></li>
								{/each}
								<li class="lh-card"><span class="lh-data num">3</span><span>{t('onboarding.install3')}</span></li>
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
	.step { display: flex; flex-direction: column; gap: var(--space-5); }
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
</style>
