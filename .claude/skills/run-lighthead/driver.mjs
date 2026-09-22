#!/usr/bin/env node
// Driver for the run-lighthead skill. Launches this skill's own local
// Playwright install (kept isolated from the app's package.json — see
// SKILL.md) against a running LightHead server and reports what it finds.
//
// Usage:
//   node driver.mjs <url> [--screenshot <path>] [--check-sw] [--wait-ms <n>]
//
// Exit code is non-zero if the heading never appeared or the page threw a
// console error / uncaught exception.

import { chromium } from 'playwright';

const args = process.argv.slice(2);
const url = args[0];
if (!url || url.startsWith('--')) {
	console.error('Usage: node driver.mjs <url> [--screenshot <path>] [--check-sw] [--wait-ms <n>]');
	process.exit(2);
}

function flagValue(name) {
	const i = args.indexOf(name);
	return i === -1 ? undefined : args[i + 1];
}

const screenshotPath = flagValue('--screenshot');
const checkSw = args.includes('--check-sw');
const waitMs = Number(flagValue('--wait-ms') ?? (checkSw ? 3000 : 500));

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleMessages = [];
page.on('console', (msg) => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => consoleMessages.push(`[pageerror] ${err.message}`));

let ok = true;
let heading = null;
let swState = 'not-checked';

try {
	await page.goto(url, { waitUntil: 'networkidle' });
	await page.waitForSelector('h1', { timeout: 10_000 });
	heading = await page.textContent('h1');
	await page.waitForTimeout(waitMs);

	if (checkSw) {
		swState = await page.evaluate(async () => {
			if (!('serviceWorker' in navigator)) return 'unsupported';
			const reg = await navigator.serviceWorker.getRegistration();
			return reg ? (reg.active?.state ?? 'registered-no-active') : 'not-registered';
		});
	}

	if (screenshotPath) {
		await page.screenshot({ path: screenshotPath });
	}
} catch (err) {
	ok = false;
	consoleMessages.push(`[driver-error] ${err.message}`);
}

const errorMessages = consoleMessages.filter(
	(m) => m.startsWith('[error]') || m.startsWith('[pageerror]') || m.startsWith('[driver-error]')
);
if (errorMessages.length > 0) ok = false;
if (!heading) ok = false;

console.log(
	JSON.stringify(
		{
			ok,
			url,
			heading,
			swState: checkSw ? swState : undefined,
			console: consoleMessages,
			screenshotPath
		},
		null,
		2
	)
);

await browser.close();
process.exit(ok ? 0 : 1);
