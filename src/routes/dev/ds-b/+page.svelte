<script lang="ts">
	// Dev-only gallery for the second batch of design-system components. Section headings are developer labels.
	import ActionBar from '#lib/ds/ActionBar.svelte';
	import BreakProgress from '#lib/ds/BreakProgress.svelte';
	import Button from '#lib/ds/Button.svelte';
	import SessionCard from '#lib/ds/SessionCard.svelte';
	import StatTile from '#lib/ds/StatTile.svelte';
	import Step from '#lib/ds/Step.svelte';
	import StepHeader from '#lib/ds/StepHeader.svelte';
	import StrainAvatar from '#lib/ds/StrainAvatar.svelte';
	import StrainBadge from '#lib/ds/StrainBadge.svelte';
	import StrainCard from '#lib/ds/StrainCard.svelte';
	import TabBar from '#lib/ds/TabBar.svelte';
	import { t } from '#lib/i18n.svelte.ts';

	let step = $state(2);
	let dir = $state<'fwd' | 'back'>('fwd');
	let photo = $state<string | undefined>();
	let tab = $state('today');

	function go(d: 1 | -1) {
		dir = d > 0 ? 'fwd' : 'back';
		step = Math.min(4, Math.max(1, step + d));
	}
</script>

<main class="lh-screen" style="padding: 16px; display: grid; gap: 24px; padding-bottom: 120px">
	<section>
		<h2>StepHeader + Step + ActionBar</h2>
		<StepHeader {step} total={4} title={t('qAmount')} subtitle={t('prefilledSub')} onClose={() => (step = 1)} />
		{#key step}
			<Step stepKey={step} direction={dir}><p>{t('stepOf', { step, total: 4 })}</p></Step>
		{/key}
		<ActionBar secondary onSecondary={() => go(-1)} onPrimary={() => go(1)} disabled={step === 4} />
	</section>

	<section>
		<h2>StrainBadge</h2>
		<div class="lh-row">
			<StrainBadge type="indica" /><StrainBadge type="sativa" /><StrainBadge type="hybrid" /><StrainBadge type="cbd" />
		</div>
	</section>

	<section>
		<h2>StrainAvatar</h2>
		<div class="lh-row">
			<StrainAvatar name="Northern Lights" type="indica" size="sm" />
			<StrainAvatar name="Sour Diesel" type="sativa" />
			<StrainAvatar name="Gelato #41" type="hybrid" size="lg" />
			<StrainAvatar name="ACDC" type="cbd" size="xl" editable src={photo} onPick={(f) => (photo = URL.createObjectURL(f))} />
			<StrainAvatar name="Łódzka Mgła" size={56} />
		</div>
	</section>

	<section>
		<h2>StatTile</h2>
		<div class="lh-row">
			<StatTile label={t('sessions')} value="12" trend={[3, 2, 4, 1, 2, 0, 3]} note="7 d" tone="moss" />
			<StatTile label={t('thc')} value="184" unit="mg" trend={[30, 22, 41, 18, 25, 12, 36]} tone="resin" />
			<StatTile label={t('amount')} value="1.6" unit="g" tone="tide" />
		</div>
	</section>

	<section>
		<h2>BreakProgress</h2>
		<BreakProgress day={8} total={21} since="3 Nov">
			{#snippet action()}<Button variant="quiet">{t('done')}</Button>{/snippet}
		</BreakProgress>
		<BreakProgress day={21} total={21} />
	</section>

	<section>
		<h2>SessionCard</h2>
		<SessionCard
			time="21:40"
			ago="2 h"
			strain="Northern Lights"
			type="indica"
			method={t('vape')}
			amount="0.2 g"
			effects={[t('calm'), t('sleepy')]}
			note="Couch, film."
			rating={4}
		/>
		<SessionCard time="14:05" strain="Sour Diesel" type="sativa" method={t('joint')} rating={3} />
	</section>

	<section>
		<h2>StrainCard</h2>
		<StrainCard
			name="Gelato #41"
			type="hybrid"
			breeder="Seed Junky Genetics"
			thc={24.5}
			cbd={0.1}
			sessions={7}
			inStash="3.5 g"
			terpenes={['Limonene', 'Caryophyllene']}
			rating={5}
		/>
		<StrainCard name="ACDC" type="cbd" thc={1} cbd={18} />
	</section>

	<section>
		<h2>TabBar ({tab})</h2>
		<div style="position: relative">
			<TabBar bind:value={tab} />
		</div>
	</section>
</main>
