import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedSEO } from '../src/site.mjs';

const output = fileURLToPath(new URL('../public/', import.meta.url));
const routes = new Map(Object.entries(publishedSEO).map(([file, seo]) => [seo.canonicalPath, file]));
const legacyPaths = new Map(Object.entries(publishedSEO).map(([file, seo]) => [`/${file}`, seo.canonicalPath]));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.json': 'application/json; charset=utf-8' };
export function createSiteServer(root = output) {
  return createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const canonical = legacyPaths.get(pathname) ?? (pathname !== '/' && routes.has(pathname.replace(/\/$/, '')) ? pathname.replace(/\/$/, '') : null);
    if (canonical !== null && canonical !== pathname) {
      response.writeHead(302, { Location: canonical + url.search, 'Cache-Control': 'no-store' }).end();
      return;
    }
    const file = resolve(root, routes.get(pathname) || pathname.replace(/^\//, ''));
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep) || !types[extname(file)]) {
      response.writeHead(404, { 'Cache-Control': 'no-store' }).end('No encontrado');
      return;
    }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)], 'Cache-Control': 'no-store' }).end(data);
  } catch {
    response.writeHead(404, { 'Cache-Control': 'no-store' }).end('No encontrado. Ejecute npm run build antes de abrir la vista previa.');
  }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createSiteServer().listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
}
