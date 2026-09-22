export type StrainType = 'indica' | 'sativa' | 'hybrid';

export interface Strain {
	id: string;
	name: string;
	producer?: string;
	type: StrainType;
	thcPercent: number;
	cbdPercent?: number;
	photoUrl?: string;
	favorite: boolean;
	createdAt: number;
}

export type SessionMethod = 'joint' | 'vape' | 'edible';

export type EffectTag = 'relaxed' | 'paranoid' | 'focused' | 'sleepy' | 'euphoric' | 'anxious';

export interface Session {
	id: string;
	strainId: string;
	method: SessionMethod;
	/** Always normalized to mg THC, regardless of input method. */
	thcMg: number;
	cbdMg?: number;
	moodBefore?: 1 | 2 | 3 | 4 | 5;
	moodAfter?: 1 | 2 | 3 | 4 | 5;
	effectTags?: EffectTag[];
	notes?: string;
	loggedAt: number;
}

export interface ToleranceBreak {
	id: string;
	startedAt: number;
	/** Set when the break is manually ended or interrupted by a logged session. */
	endedAt?: number;
	/** True if a session log interrupted the break, rather than the user ending it deliberately. */
	interrupted: boolean;
}
