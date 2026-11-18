// Serves landing/dist on http://localhost:4300 for a local look. No dependencies; ignores _headers.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('dist/', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };

createServer(async (req, res) => {
	let path;
	try { path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)); } catch { path = '/404.html'; }
	if (path.endsWith('/')) path += 'index.html';
	const full = join(dist, path);
	try {
		if (!full.startsWith(dist)) throw new Error('outside dist');
		const body = await readFile(full);
		res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' }).end(body);
	} catch {
		res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(await readFile(join(dist, '404.html')));
	}
}).listen(4300, () => console.log('Landing page on http://localhost:4300'));
