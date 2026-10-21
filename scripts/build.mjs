import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { document } from '../src/document.mjs';
import { publishedSEO } from '../src/site.mjs';

const root = new URL('../', import.meta.url);
const output = new URL('public/', root);
// This is a generated directory. Never remove a path outside this exact target.
if (fileURLToPath(output).replace(/[\\/]+$/, '') !== resolve(fileURLToPath(root), 'public')) throw new Error('Salida de build no válida');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(new URL('.build/', root), { recursive: true });
await build({ entryPoints: [fileURLToPath(new URL('src/App.jsx', root))], outfile: fileURLToPath(new URL('.build/app.mjs', root)), bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { App } = await import(new URL(`.build/app.mjs?build=${Date.now()}`, root));
await build({ entryPoints: [fileURLToPath(new URL('src/client.jsx', root))], outfile: fileURLToPath(new URL('script.js', root)), bundle: true, format: 'esm', target: ['es2020'], jsx: 'automatic', minify: true, legalComments: 'eof', define: { 'process.env.NODE_ENV': '"production"' } });
const stylesheet = await readFile(new URL('styles.css', root));
const script = await readFile(new URL('script.js', root));
const fingerprint = data => createHash('sha256').update(data).digest('hex').slice(0, 12);
const assets = { stylesheet: `styles.${fingerprint(stylesheet)}.css`, script: `script.${fingerprint(script)}.js` };
await writeFile(new URL(assets.stylesheet, output), stylesheet);
await writeFile(new URL(assets.script, output), script);
for (const file of Object.keys(publishedSEO)) {
  const markup = renderToString(createElement(App, { page: file }));
  await writeFile(new URL(file, root), document(file, markup), 'utf8');
  await writeFile(new URL(file, output), document(file, markup, assets), 'utf8');
  console.log(`Generado con React: ${file}`);
}
console.log('Interacciones React compiladas en script.js');

// Keep the root preview while packaging only browser-facing files for hosting.
for (const file of ['images', 'assets/charlie-mark.svg', 'assets/coverage.svg']) {
  await mkdir(new URL('./', new URL(file, output)), { recursive: true });
  await cp(new URL(file, root), new URL(file, output), { recursive: true });
}
await cp(new URL('hosting/hostinger.htaccess', root), new URL('.htaccess', output));
await writeFile(new URL('release.json', output), JSON.stringify({ commit: process.env.GITHUB_SHA || null, assets }, null, 2) + '\n');
console.log('Sitio listo para desplegar en public/');
