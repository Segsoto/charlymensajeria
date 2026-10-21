import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index.html', 'quienes-somos.html', 'como-operamos.html', 'contactenos.html'];
const htmlByFile = new Map(await Promise.all(pages.map(async file => [file, await readFile(resolve(root, file), 'utf8')])));
for (const [file, html] of htmlByFile) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: un solo h1`);
  assert.match(html, /<html lang="es-CR"/, `${file}: idioma`);
  assert.match(html, /name="description"/, `${file}: descripción`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: ids únicos`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
    const [target, hash] = href.split('#');
    const local = target.split('?')[0] || file;
    await stat(resolve(root, local));
    if (hash && htmlByFile.has(local)) assert.ok(htmlByFile.get(local).includes(`id="${hash}"`), `${file}: ancla ${href}`);
    if (/\.(?:png|gif|jpeg|jpg|svg|js|css)$/.test(local)) await readFile(resolve(root, local));
  }
  console.log(`OK ${file}: estructura, metadatos, enlaces y recursos legibles`);
}
console.log('Comprobación estática completada.');
