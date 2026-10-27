import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createSiteServer } from './serve.mjs';

const pages = { '/': 'index.html', '/quienes-somos': 'quienes-somos.html', '/como-operamos': 'como-operamos.html', '/contactenos': 'contactenos.html' };
const server = createSiteServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  for (const [path, file] of Object.entries(pages)) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(html.includes(`data-page="${file}"`), `${path}: diseño actual`);
    const header = html.match(/<nav id="main-nav"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(header, `${path}: navegación principal`);
    const links = [...header.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    for (const target of ['/', '/#servicios', '/quienes-somos', '/como-operamos', '/contactenos']) assert.ok(links.includes(target), `${path}: enlace directo a ${target}`);
    for (const target of links.filter(href => href.startsWith('/'))) {
      const destination = new URL(target, origin);
      const result = await fetch(destination);
      assert.equal(result.status, 200, `${path} → ${target}`);
      assert.equal(result.redirected, false, `${path}: el menú no depende de redirecciones antiguas`);
      assert.ok((await result.text()).includes(`data-page="${pages[destination.pathname]}"`), `${target}: página actual`);
    }
  }
  for (const [path, file] of Object.entries(pages)) {
    const response = await fetch(`${origin}/${file}?servicio=rutas`, { redirect: 'manual' });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), `${path}?servicio=rutas`);
  }
  assert.equal((await fetch(origin + '/src/App.jsx')).status, 404);
  console.log('OK navegación: menú desde las cuatro páginas, regreso a Inicio, alias antiguos y consultas');
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
