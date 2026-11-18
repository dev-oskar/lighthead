# Security

## Reporting a vulnerability

Please report it privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**. Don't open a public issue for a security problem.

Say what you found, how to reproduce it and what it could expose. Reports are answered as soon as possible.

## In scope

- The app itself (everything under `src/`), including backup export and import
- The service worker (`src/service-worker.ts`) and what it caches
- The HTTP headers in `static/_headers`, including the Content-Security-Policy
- Anything that makes the app contact another origin, or lets journal data leave the device

## How LightHead is built

LightHead has no server code and no accounts. Cloudflare serves the static files in `build/`; everything you log is stored in the browser's IndexedDB on your device and is never sent anywhere. So there is no user database to breach, but bugs in the app, the service worker or the headers can still matter: for example script injection through imported backup files or strain names.
