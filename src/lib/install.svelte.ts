// Home-screen install. Chrome/Android/desktop fire `beforeinstallprompt` once, early: this module is imported by the
// root layout so the event is kept for the onboarding Install button. Safari never fires it (steps are shown instead).
type InstallPrompt = Event & { prompt: () => Promise<unknown> };

export const install = $state<{ prompt?: InstallPrompt }>({});

addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault(); // no mini-infobar: onboarding offers it
	install.prompt = e as InstallPrompt;
});
addEventListener('appinstalled', () => (install.prompt = undefined));

/** Running from the home screen already. */
export const installed = () =>
	matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/**
 * Which install step to show, decided once when onboarding opens. `undefined`: no step (installed already, or a
 * browser that can't install or hasn't offered yet, e.g. Firefox). Decided by platform, never by window width.
 */
export function installKind(): 'prompt' | 'ios' | 'mac' | undefined {
	if (installed()) return;
	if (install.prompt) return 'prompt';
	const ua = navigator.userAgent;
	// iPadOS Safari says "Macintosh" but has touch.
	if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
	// Safari 17+ on a Mac (File > Add to Dock): Chrome, Edge and Firefox carry no "Version/… Safari".
	const mac = /Macintosh.*Version\/(\d+)[\d.]*.*Safari/.exec(ua);
	if (mac && +mac[1] >= 17) return 'mac';
}
