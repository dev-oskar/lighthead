<script lang="ts">
	let {
		label,
		value,
		unit,
		trend,
		note,
		tone
	}: { label: string; value: string; unit?: string; trend?: number[]; note?: string; tone?: 'moss' | 'resin' | 'tide' } = $props();

	// Sparkline geometry copied from the design system bundle.
	const W = 120, HT = 36, PAD = 3;
	const spark = $derived.by(() => {
		const pts = trend ?? [];
		if (pts.length < 2) return null;
		const mx = Math.max(...pts), mn = Math.min(...pts);
		const span = mx - mn || 1;
		const xy = pts.map((v, i) => [PAD + (i * (W - PAD * 2)) / (pts.length - 1), PAD + (HT - PAD * 2) * (1 - (v - mn) / span)]);
		const line = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('');
		const area = line + 'L' + xy[xy.length - 1][0].toFixed(1) + ' ' + HT + 'L' + xy[0][0].toFixed(1) + ' ' + HT + 'Z';
		return { line, area, last: xy[xy.length - 1] };
	});
</script>

<div class={['lh-stat', tone && 'lh-tone-' + tone]}>
	<span class="lh-stat-label">{label}</span>
	<span class="lh-stat-value">{value}{#if unit}<span class="lh-unit">{' ' + unit}</span>{/if}</span>
	{#if spark}
		<svg class="lh-spark" viewBox="0 0 {W} {HT}" width={W} height={HT} aria-hidden="true">
			<path class="lh-spark-area" d={spark.area} />
			<path class="lh-spark-line" d={spark.line} />
			<circle class="lh-spark-dot" cx={spark.last[0]} cy={spark.last[1]} r={3} />
		</svg>
	{/if}
	{#if note}<span class="lh-stat-note">{note}</span>{/if}
</div>
