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
