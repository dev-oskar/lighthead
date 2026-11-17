// Copied from the LightHead design system bundle.

/** Strain initials: Northern Lights → NL, ACDC → AC, Gelato #41 → G4, Łódzka Mgła → ŁM. */
export function initials(name: string): string {
	const words = String(name || '').replace(/[^\p{L}\p{N}\s-]/gu, ' ').split(/[\s-]+/).filter(Boolean);
	if (!words.length) return '?';
	const out = words.length === 1 ? Array.from(words[0]).slice(0, 2).join('') : Array.from(words[0])[0] + Array.from(words[1])[0];
	return out.toLocaleUpperCase();
}

/** Square WebP, max 512 px. Redrawing through a canvas drops EXIF, including GPS location. */
export function prepareStrainPhoto(file: Blob, size = 512): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const side = Math.min(img.naturalWidth, img.naturalHeight);
			const c = document.createElement('canvas');
			c.width = c.height = Math.min(size, side);
			c.getContext('2d')!.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, c.width, c.height);
			URL.revokeObjectURL(url);
			c.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/webp', 0.82);
		};
		img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
		img.src = url;
	});
}
