<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import Button from '#lib/ds/Button.svelte';
	import Icon from '#lib/ds/Icon.svelte';
	import Notice from '#lib/ds/Notice.svelte';
	import SegmentedControl from '#lib/ds/SegmentedControl.svelte';
	import { exportAll, importAll, type ExportFile } from '#lib/db.ts';
	import { app, loadSettings, updateSettings } from '#lib/app-state.svelte.ts';
	import { i18n, t, num, type Locale } from '#lib/i18n.svelte.ts';
	import type { Settings } from '#lib/model.ts';
	import pkg from '../../../package.json';

	// Language names are endonyms: never translated.
	const LANGS = [{ value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'pl', label: 'Polski' }];

	let persisted = $state(false);
	let usedMb = $state<number>();
	let pending = $state<{ name: string; data: ExportFile }>();
	let result = $state<{ ok: boolean; count?: number }>();
	let fileInput = $state<HTMLInputElement>();

	onMount(async () => {
		try {
			persisted = (await navigator.storage?.persisted?.()) ?? false;
			const est = await navigator.storage?.estimate?.();
			if (est?.usage != null) usedMb = est.usage / 1e6;
		} catch { /* storage API missing: show the hint */ }
	});

	const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

	async function backup() {
		const url = URL.createObjectURL(new Blob([JSON.stringify(await exportAll())], { type: 'application/json' }));
		const a = Object.assign(document.createElement('a'), { href: url, download: `lighthead-${today()}.json` });
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	async function pick(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = ''; // same file can be picked again
		if (!file) return;
		result = undefined;
		try {
			const data = JSON.parse(await file.text());
			if (data?.app !== 'lighthead' || !Array.isArray(data.strains) || !Array.isArray(data.sessions)) throw new Error('not-lighthead');
			pending = { name: file.name, data };
		} catch {
			result = { ok: false };
		}
	}

	async function replace() {
		const { data } = pending!;
		pending = undefined;
		try {
			await importAll($state.snapshot(data) as ExportFile);
			await loadSettings();
			result = { ok: true, count: data.sessions.length };
		} catch {
			result = { ok: false };
		}
	}
</script>

<main class="lh-page settings">
	<div class="back"><Button variant="quiet" onclick={() => goto(resolve('/'))}>{t('today')}</Button></div>
	<h1 class="lh-title">{t('settings')}</h1>

	<section class="lh-section tight">
		<h2 class="lh-overline">{t('language')}</h2>
		<SegmentedControl label={t('language')} value={app.settings.locale ?? i18n.locale} options={LANGS} onChange={(v) => updateSettings({ locale: v as Locale })} />
	</section>

	<section class="lh-section tight">
		<h2 class="lh-overline">{t('theme')}</h2>
		<SegmentedControl
			label={t('theme')}
			value={app.settings.theme}
			options={[{ value: 'system', label: t('themeSystem') }, { value: 'light', label: t('themeLight') }, { value: 'dark', label: t('themeDark') }]}
			onChange={(v) => updateSettings({ theme: v as Settings['theme'] })}
		/>
	</section>

	<section class="lh-section">
		<h2 class="lh-overline">{t('yourData')}</h2>
		{#if pending}
			<div class="lh-confirm">
				<strong class="lh-heading">{t('replaceQ')}</strong>
				<p class="body">
					{t('replaceBody', {
						file: pending.name,
						strains: t('nStrains', { count: pending.data.strains.length }),
						sessions: t('nSessions', { count: pending.data.sessions.length })
					})}
				</p>
				<div class="lh-confirm-row">
					<Button variant="danger" onclick={replace}>{t('replace')}</Button>
					<Button variant="secondary" onclick={() => (pending = undefined)}>{t('keepMine')}</Button>
				</div>
			</div>
			<Notice tone="info" title={t('backupFirst')}>
				{t('backupFirstBody')}
				{#snippet action()}<Button variant="quiet" icon="cloud" onclick={backup}>{t('saveBackup')}</Button>{/snippet}
			</Notice>
		{:else}
			<Notice tone="private" icon="lock" title={t('storedOnDevice')}>{t('dataBody')}</Notice>
			{#if result?.ok}
				<Notice tone="info">{t('restored', { count: result.count ?? 0 })}</Notice>
			{:else if result}
				<Notice tone="danger" title={t('badFileTitle')}>{t('badFileBody')}</Notice>
			{/if}
			<p class="lh-meta storage">
				{#if persisted}<Icon name="check" size={16} />{t('persisted')}{:else}{t('persistHint')}{/if}
				{#if usedMb != null} · <span class="lh-data">{t('used', { size: num(usedMb, 1) + ' MB' })}</span>{/if}
			</p>
			<div class="lh-confirm-row">
				<Button variant="secondary" icon="cloud" onclick={backup}>{t('saveBackup')}</Button>
				<Button variant="quiet" onclick={() => fileInput?.click()}>{t('restoreFile')}</Button>
				<input bind:this={fileInput} type="file" accept="application/json,.json" hidden onchange={pick} />
			</div>
		{/if}
	</section>

	<footer class="lh-meta">{t('version', { v: pkg.version })} · <a href={asset('licenses/fonts-OFL.txt')}>{t('fontLicences')}</a></footer>
</main>

<style>
	.settings { padding-top: var(--space-3); }
	.back { display: flex; align-items: center; margin-left: -12px; }
	@media (min-width: 960px) { .settings > * { max-width: 640px; } }
	.tight { gap: var(--space-2); }
	h2 { margin: 0; }
	.body { margin: 0; }
	.storage { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2); }
	.storage .lh-data { font-size: 14px; }
	footer a { color: var(--moss); }
</style>
