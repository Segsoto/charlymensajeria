import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedSEO } from '../src/site.mjs';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)), process.argv[2] || '.');
const pages = ['index.html', 'quienes-somos.html', 'como-operamos.html', 'contactenos.html'];
const htmlByFile = new Map(await Promise.all(pages.map(async file => [file, await readFile(resolve(root, file), 'utf8')])));
const routeFiles = new Map(Object.entries(publishedSEO).map(([file, seo]) => [seo.canonicalPath, file]));
for (const [file, html] of htmlByFile) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: un solo h1`);
  assert.match(html, /<html lang="es-CR"/, `${file}: idioma`);
  assert.match(html, /name="description"/, `${file}: descripción`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: ids únicos`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
    const url = new URL(href, `https://local.invalid${publishedSEO[file].canonicalPath}`);
    const hash = url.hash.slice(1);
    const local = routeFiles.get(url.pathname) || decodeURIComponent(url.pathname).replace(/^\//, '');
    await stat(resolve(root, local));
    if (hash && htmlByFile.has(local)) assert.ok(htmlByFile.get(local).includes(`id="${hash}"`), `${file}: ancla ${href}`);
    if (/\.(?:png|gif|jpeg|jpg|svg|js|css)$/.test(local)) await readFile(resolve(root, local));
  }
  for (const match of html.matchAll(/\b(?:href|action)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
    assert.ok(!/\.html(?:[?#]|$)/.test(href), `${file}: enlace antiguo ${href}`);
    const destination = new URL(href, `https://local.invalid${publishedSEO[file].canonicalPath}`);
    if (!href.startsWith('#') && routeFiles.has(destination.pathname)) assert.ok(href.startsWith('/'), `${file}: ruta interna absoluta ${href}`);
  }
  console.log(`OK ${file}: estructura, metadatos, enlaces y recursos legibles`);
}
if (process.argv[2]) {
  const release = JSON.parse(await readFile(resolve(root, 'release.json'), 'utf8'));
  for (const asset of Object.values(release.assets)) {
    const data = await readFile(resolve(root, asset));
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
    assert.ok(asset.includes(`.${hash}.`), `${asset}: versión acorde al contenido`);
    for (const [file, html] of htmlByFile) assert.ok(html.includes(`"${asset}"`), `${file}: recurso de la misma versión`);
  }
  const allowed = new Set([...pages, ...Object.values(release.assets), 'images', 'assets', '.htaccess', 'release.json']);
  for (const entry of await readdir(root)) assert.ok(allowed.has(entry), `Archivo ajeno a la publicación: ${entry}`);
  for (const match of (await readFile(resolve(root, release.assets.stylesheet), 'utf8')).matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (!/^(https?:|data:|#)/.test(match[1])) await readFile(resolve(root, match[1]));
  }
  assert.match(await readFile(resolve(root, '.htaccess'), 'utf8'), /DirectoryIndex index\.html/);
  console.log('OK paquete de publicación: versiones de recursos, imágenes CSS y archivos permitidos');
}
console.log('Comprobación estática completada.');
