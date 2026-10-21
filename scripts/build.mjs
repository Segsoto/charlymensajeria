import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { document } from '../src/document.mjs';
import { publishedSEO } from '../src/site.mjs';

const root = new URL('../', import.meta.url);
await mkdir(new URL('.build/', root), { recursive: true });
await build({ entryPoints: [fileURLToPath(new URL('src/App.jsx', root))], outfile: fileURLToPath(new URL('.build/app.mjs', root)), bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { App } = await import(new URL(`.build/app.mjs?build=${Date.now()}`, root));
for (const file of Object.keys(publishedSEO)) {
  await writeFile(new URL(file, root), document(file, renderToString(createElement(App, { page: file }))), 'utf8');
  console.log(`Generado con React: ${file}`);
}
await build({ entryPoints: [fileURLToPath(new URL('src/client.jsx', root))], outfile: fileURLToPath(new URL('script.js', root)), bundle: true, format: 'esm', target: ['es2020'], jsx: 'automatic', minify: true, legalComments: 'eof', define: { 'process.env.NODE_ENV': '"production"' } });
console.log('Interacciones React compiladas en script.js');
