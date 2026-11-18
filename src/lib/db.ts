// IndexedDB access. Everything stays on the device.
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { applyStash, DEFAULT_SETTINGS, type Break, type Session, type Settings, type Strain } from './model.ts';

interface LightHeadDB extends DBSchema {
	strains: { key: string; value: Strain };
	sessions: { key: string; value: Session; indexes: { at: number; strainId: string } };
	breaks: { key: string; value: Break };
	settings: { key: string; value: Settings };
}

let dbp: Promise<IDBPDatabase<LightHeadDB>> | undefined;
export function db() {
	return (dbp ??= openDB<LightHeadDB>('lighthead', 1, {
		upgrade(d) {
			d.createObjectStore('strains', { keyPath: 'id' });
			const s = d.createObjectStore('sessions', { keyPath: 'id' });
			s.createIndex('at', 'at');
			s.createIndex('strainId', 'strainId');
			d.createObjectStore('breaks', { keyPath: 'id' });
			d.createObjectStore('settings');
		}
	}));
}

/** Anything logged yet (an existing user): first-run onboarding is skipped. */
export async function hasData() {
	const d = await db();
	const counts = await Promise.all([d.count('strains'), d.count('sessions'), d.count('breaks')]);
	return counts.some(Boolean);
}

// Strains
export const listStrains = async () => (await (await db()).getAll('strains')).sort((a, b) => a.name.localeCompare(b.name));
export const getStrain = async (id: string) => (await db()).get('strains', id);
export const putStrain = async (s: Strain) => { await (await db()).put('strains', { ...s, updatedAt: Date.now() }); };
/** Deleting a strain keeps its sessions (they hold a snapshot). */
export const deleteStrain = async (id: string) => (await db()).delete('strains', id);

// Sessions — newest first
export const listSessions = async () => (await (await db()).getAllFromIndex('sessions', 'at')).reverse();
export const getSession = async (id: string) => (await db()).get('sessions', id);
export const sessionsForStrain = async (strainId: string) =>
	(await (await db()).getAllFromIndex('sessions', 'strainId', strainId)).sort((a, b) => b.at - a.at);

/** Save (create or edit) a session, keep the stash in step and remember the defaults for next time. */
export async function saveSession(s: Session) {
	const d = await db();
	const tx = d.transaction(['sessions', 'strains', 'settings'], 'readwrite');
	const old = await tx.objectStore('sessions').get(s.id);
	const strains = tx.objectStore('strains');
	if (old?.strainId) {
		const st = await strains.get(old.strainId);
		if (st) await strains.put({ ...st, stashG: applyStash(st.stashG, old.amount, old.unit, 1) });
	}
	if (s.strainId) {
		const st = await strains.get(s.strainId);
		if (st) await strains.put({ ...st, stashG: applyStash(st.stashG, s.amount, s.unit, -1) });
	}
	await tx.objectStore('sessions').put(s);
	if (!old) {
		const set = (await tx.objectStore('settings').get('app')) ?? structuredClone(DEFAULT_SETTINGS);
		set.lastMethod = s.method;
		if (s.tempC != null) set.lastTempC = s.tempC;
		if (s.strainId) {
			set.lastStrainId = s.strainId;
			const prev = set.amountByStrain[s.strainId];
			set.amountByStrain[s.strainId] = { amount: s.amount, unit: s.unit, tempC: s.tempC ?? prev?.tempC };
		}
		await tx.objectStore('settings').put(set, 'app');
	}
	await tx.done;
	requestPersistence();
}

/** Delete a session and give its amount back to the stash. */
export async function deleteSession(id: string) {
	const d = await db();
	const tx = d.transaction(['sessions', 'strains'], 'readwrite');
	const old = await tx.objectStore('sessions').get(id);
	if (old?.strainId) {
		const st = await tx.objectStore('strains').get(old.strainId);
		if (st) await tx.objectStore('strains').put({ ...st, stashG: applyStash(st.stashG, old.amount, old.unit, 1) });
	}
	await tx.objectStore('sessions').delete(id);
	await tx.done;
}

// Breaks
export const listBreaks = async () => (await (await db()).getAll('breaks')).sort((a, b) => b.start - a.start);
export const putBreak = async (b: Break) => { await (await db()).put('breaks', b); };

// Settings
export const getSettings = async (): Promise<Settings> =>
	({ ...DEFAULT_SETTINGS, ...((await (await db()).get('settings', 'app')) ?? {}) });
export const putSettings = async (s: Settings) => { await (await db()).put('settings', plain(s), 'app'); };
// Plain-object copy so Svelte $state proxies can be stored.
function plain<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }

/** Ask the browser not to evict our data (iOS especially). Safe to call repeatedly. */
export async function requestPersistence(): Promise<boolean> {
	try { return (await navigator.storage?.persisted?.()) || ((await navigator.storage?.persist?.()) ?? false); }
	catch { return false; }
}

// Export / import: one JSON file, photos as data URLs.
export interface ExportFile { app: 'lighthead'; version: 1; exportedAt: string; strains: (Omit<Strain, 'photo'> & { photo?: string })[]; sessions: Session[]; breaks: Break[]; settings: Settings }

const toDataURL = (b: Blob) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(b); });

export async function exportAll(): Promise<ExportFile> {
	const d = await db();
	const strains = await Promise.all((await d.getAll('strains')).map(async (s) => ({ ...s, photo: s.photo ? await toDataURL(s.photo) : undefined })));
	return { app: 'lighthead', version: 1, exportedAt: new Date().toISOString(), strains, sessions: await d.getAll('sessions'), breaks: await d.getAll('breaks'), settings: await getSettings() };
}

/** Replace everything with the file's contents. Throws on a file that is not a LightHead export. */
export async function importAll(file: ExportFile) {
	if (file?.app !== 'lighthead' || file.version !== 1 || !Array.isArray(file.strains) || !Array.isArray(file.sessions)) throw new Error('not-lighthead');
	const strains: Strain[] = await Promise.all(file.strains.map(async (s) => ({ ...s, photo: s.photo ? await (await fetch(s.photo)).blob() : undefined })));
	const d = await db();
	const tx = d.transaction(['strains', 'sessions', 'breaks', 'settings'], 'readwrite');
	await Promise.all([tx.objectStore('strains').clear(), tx.objectStore('sessions').clear(), tx.objectStore('breaks').clear()]);
	for (const s of strains) await tx.objectStore('strains').put(s);
	for (const s of file.sessions) await tx.objectStore('sessions').put(s);
	for (const b of file.breaks ?? []) await tx.objectStore('breaks').put(b);
	await tx.objectStore('settings').put({ ...DEFAULT_SETTINGS, ...file.settings }, 'app');
	await tx.done;
}
