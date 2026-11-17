<script lang="ts">
	// Dev gallery for the form/feedback design-system components. Not linked from the app.
	import { t, i18n, LOCALES, type Locale } from '#lib/i18n.svelte.ts';
	import { PATHS, type IconName } from '#lib/icons.ts';
	import { METHODS, EFFECTS } from '#lib/model.ts';
	import Icon from '#lib/ds/Icon.svelte';
	import Button from '#lib/ds/Button.svelte';
	import Chip from '#lib/ds/Chip.svelte';
	import SegmentedControl from '#lib/ds/SegmentedControl.svelte';
	import TextField from '#lib/ds/TextField.svelte';
	import NumberField from '#lib/ds/NumberField.svelte';
	import OptionGrid from '#lib/ds/OptionGrid.svelte';
	import Rating from '#lib/ds/Rating.svelte';
	import Notice from '#lib/ds/Notice.svelte';

	const ICONS = Object.keys(PATHS) as IconName[];
	const METHOD_ICON: Record<string, IconName> = { joint: 'session', vape: 'cloud', bong: 'stash', edible: 'leaf' };

	let period = $state('week');
	let amount = $state(0.15);
	let method = $state<string | string[] | null>('joint');
	let effects = $state<string | string[] | null>(['calm']);
	let rating = $state(4);
	let name = $state('');
</script>

<main style="padding:16px;display:grid;gap:24px;max-width:480px;margin:auto">
	<SegmentedControl label={t('language')} options={LOCALES.map((l) => ({ value: l, label: l.toUpperCase() }))} value={i18n.locale} onChange={(l) => (i18n.locale = l as Locale)} />

	<section>
		<h2>Icon</h2>
		<div style="display:flex;flex-wrap:wrap;gap:12px">
			{#each ICONS as n (n)}<Icon name={n} title={n} />{/each}
			<Icon name="leaf" filled />
		</div>
	</section>

	<section style="display:grid;gap:8px">
		<h2>Button</h2>
		<Button variant="primary" size="lg" block>{t('continue')}</Button>
		<Button>{t('back')}</Button>
		<Button variant="quiet">{t('skip')}</Button>
		<Button variant="danger">{t('delete')}</Button>
		<Button variant="primary" icon="plus">{t('saveSession')}</Button>
		<Button variant="quiet" icon="close" aria-label={t('close')} />
		<Button variant="primary" disabled>{t('continue')}</Button>
	</section>

	<section>
		<h2>Chip</h2>
		<div style="display:flex;flex-wrap:wrap;gap:8px">
			{#each EFFECTS as e, i (e)}<Chip defaultSelected={i < 2}>{t(e)}</Chip>{/each}
			<Chip disabled>{t('somethingElse')}</Chip>
		</div>
	</section>

	<section>
		<h2>SegmentedControl</h2>
		<SegmentedControl label={t('period')} bind:value={period} options={[{ value: 'week', label: t('week') }, { value: 'month', label: t('month') }, { value: 'year', label: t('year'), icon: 'calendar' }]} />
		<p>{period}</p>
	</section>

	<section style="display:grid;gap:12px">
		<h2>TextField</h2>
		<TextField label={t('strainName')} placeholder={t('strainNamePh')} bind:value={name} error={name ? undefined : t('strainNameError')} />
		<TextField label={t('breeder')} />
		<TextField label={t('thc')} suffix="%" inputmode="decimal" />
		<TextField label={t('note')} hint={t('noteHint')} multiline />
	</section>

	<section style="display:grid;gap:12px">
		<h2>NumberField</h2>
		<NumberField size="lg" bind:value={amount} step={0.05} min={0} max={10} decimals={2} unit={t('gUnit')} prefilled />
		<p>{t('thcDerived', { mg: Math.round(amount * 18 * 10) })}</p>
		<NumberField label={t('thc')} defaultValue={18} step={0.5} max={40} decimals={1} unit="%" />
		<NumberField label={t('edible')} defaultValue={10} step={2.5} max={500} decimals={1} unit={t('mgUnit')} hint={t('fromLabel')} />
	</section>

	<section style="display:grid;gap:12px">
		<h2>OptionGrid</h2>
		<OptionGrid
			label={t('method')}
			bind:value={method}
			options={METHODS.map((m) => ({ value: m, label: t(m), icon: METHOD_ICON[m], hint: m === 'joint' ? t('lastTime') : undefined }))}
		/>
		<OptionGrid label={t('effects')} multiple columns={3} bind:value={effects} options={EFFECTS.map((e) => ({ value: e, label: t(e) }))} />
		<OptionGrid label={t('strain')} columns={1} defaultValue="nl" options={[
			{ value: 'nl', label: 'Northern Lights', hint: t('lastTime'), media: avatar },
			{ value: 'ss', label: 'Super Silver Haze', icon: 'leaf' }
		]} />
		{#snippet avatar()}<Icon name="leaf" size={28} filled />{/snippet}
	</section>

	<section>
		<h2>Rating</h2>
		<Rating bind:value={rating} />
		<Rating value={rating} readOnly />
		<Rating value={3} readOnly size={16} />
	</section>

	<section style="display:grid;gap:12px">
		<h2>Notice</h2>
		<Notice title={t('privateTitle')}>{t('privateBody')}</Notice>
		<Notice tone="backup" title={t('backupTitle')}>
			{t('backupBody')}
			{#snippet action()}<Button variant="quiet">{t('learnMore')}</Button>{/snippet}
		</Notice>
		<Notice tone="info" title={t('sessionSaved')} />
		<Notice tone="warn">{t('stashLow')}</Notice>
		<Notice tone="danger">{t('deleteForGood')}</Notice>
	</section>
</main>
