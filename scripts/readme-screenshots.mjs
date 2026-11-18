// Regenerates the README screenshots in docs/screenshots/ from sample data (never real data).
// Usage: npm run build && npx vite preview --port 4174 & node scripts/readme-screenshots.mjs ; then stop the preview.
import { chromium } from '@playwright/test';
const U = 'http://localhost:4174', OUT = new URL('../docs/screenshots/', import.meta.url).pathname;
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-GB', deviceScaleFactor: 2 });
const p = await ctx.newPage(); await p.setViewportSize({ width: 390, height: 844 });
await p.goto(U + '/welcome'); await p.getByRole('button', { name: 'Continue' }).waitFor();
await p.evaluate(async () => {
	const db = await new Promise((res, rej) => { const r = indexedDB.open('lighthead'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
	const now = Date.now(), H = 3600e3, D = 24 * H, day0 = new Date(); day0.setHours(0, 0, 0, 0);
	const strains = [
		{ id: 'nl', name: 'Northern Lights', type: 'indica', breeder: 'Sensi Seeds', thc: 18, cbd: 0.1, terpenes: ['Myrcene', 'Caryophyllene'], rating: 4, stashG: 3.2, note: 'Earthy and sweet. Best in the evening.' },
		{ id: 'lh', name: 'Lemon Haze', type: 'sativa', thc: 21, cbd: 0.2, terpenes: ['Limonene'], rating: 5, stashG: 1.4 },
		{ id: 'ac', name: 'ACDC', type: 'cbd', thc: 1, cbd: 16, terpenes: ['Myrcene', 'Pinene'], rating: 3 },
		{ id: 'ge', name: 'Gelato', type: 'hybrid', thc: 20, cbd: 0.1, terpenes: ['Caryophyllene', 'Limonene'] }
	].map((s) => ({ ...s, createdAt: now - 20 * D, updatedAt: now - 20 * D }));
	const by = Object.fromEntries(strains.map((s) => [s.id, s]));
	const mk = (i, id, dayBack, hour, method, amount, tempC, extra = {}) => {
		const s = by[id], unit = method === 'edible' ? 'mg' : 'g';
		return { id: 's' + i, at: day0.getTime() - dayBack * D + hour * H, strainId: id, strainName: s.name, strainType: s.type, thc: s.thc, cbd: s.cbd,
			mgThc: unit === 'mg' ? amount : Math.round(amount * s.thc * 10), method, amount, unit, tempC, effects: [], ...extra };
	};
	const sessions = [
		mk(1, 'nl', 0, 21.6, 'vape', 0.15, 190, { effects: ['calm', 'sleepy'], rating: 4, setting: 'home', note: 'Lower temperature felt smoother.' }),
		mk(2, 'lh', 1, 16, 'vape', 0.1, 200, { effects: ['creative', 'happy'], setting: 'outside' }),
		mk(3, 'ac', 1, 12.5, 'edible', 5, undefined, { effects: ['calm'] }),
		mk(4, 'nl', 2, 22, 'vape', 0.15, 185, { effects: ['sleepy'], rating: 4 }),
		mk(5, 'ge', 4, 20, 'joint', 0.3, undefined, { effects: ['happy'], setting: 'friends', rating: 5 }),
		mk(6, 'lh', 5, 15, 'vape', 0.1, 205, { effects: ['focused'] }),
		mk(7, 'nl', 6, 21, 'vape', 0.2, 190, { effects: ['calm'] })
	].filter((s) => s.at < now);
	const tx = db.transaction(['strains', 'sessions', 'settings'], 'readwrite');
	strains.forEach((s) => tx.objectStore('strains').put(s));
	sessions.forEach((s) => tx.objectStore('sessions').put(s));
	tx.objectStore('settings').put({ theme: 'light', locale: 'en', onboarded: true, lastStrainId: 'nl', lastMethod: 'vape', lastTempC: 190,
		amountByStrain: { nl: { amount: 0.15, unit: 'g', tempC: 190 }, lh: { amount: 0.1, unit: 'g', tempC: 200 } } }, 'app');
	await new Promise((r) => (tx.oncomplete = r));
});
const shot = async (path, name, prep) => { await p.goto(U + path); await p.waitForTimeout(600); if (prep) await prep(); await p.waitForTimeout(500); await p.screenshot({ path: OUT + name }); };
await shot('/', 'phone-today.png');
await shot('/log/new', 'phone-quick-log.png', async () => { await p.getByRole('button', { name: 'Continue' }).click(); });
await shot('/strains/nl', 'phone-strain.png');
await p.setViewportSize({ width: 1280, height: 800 });
await shot('/stats', 'desktop-stats.png');
await b.close();
