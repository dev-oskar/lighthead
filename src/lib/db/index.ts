import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Strain, Session, ToleranceBreak } from './types';

interface LightHeadDB extends DBSchema {
	strains: {
		key: string;
		value: Strain;
		indexes: { 'by-name': string };
	};
	sessions: {
		key: string;
		value: Session;
		indexes: { 'by-loggedAt': number; 'by-strainId': string };
	};
	breaks: {
		key: string;
		value: ToleranceBreak;
		indexes: { 'by-startedAt': number };
	};
}

const DB_NAME = 'lighthead';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<LightHeadDB>> | undefined;

export function getDb() {
	if (!dbPromise) {
		dbPromise = openDB<LightHeadDB>(DB_NAME, DB_VERSION, {
			upgrade(db) {
				const strains = db.createObjectStore('strains', { keyPath: 'id' });
				strains.createIndex('by-name', 'name');

				const sessions = db.createObjectStore('sessions', { keyPath: 'id' });
				sessions.createIndex('by-loggedAt', 'loggedAt');
				sessions.createIndex('by-strainId', 'strainId');

				const breaks = db.createObjectStore('breaks', { keyPath: 'id' });
				breaks.createIndex('by-startedAt', 'startedAt');
			}
		});
	}
	return dbPromise;
}
