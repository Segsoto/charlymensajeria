# Charlie Mensajería

Sitio corporativo en español, construido con React y generado como cuatro páginas HTML estáticas. Inspirado en la composición de [Logistics de Colorlib](https://preview.colorlib.com/#logistics), con contenido, marca y servicios de Charlie.

## Desarrollo

Requiere Node.js 20 o posterior.

```sh
npm ci
npm run build
npm run dev
```

Vista previa: http://127.0.0.1:4173. Después de editar componentes, ejecute `npm run build` y actualice el navegador. `npm run dev` sirve los archivos ya generados; no incorpora recarga automática.

```sh
npm run check
```

La comprobación valida estructura, idioma, metadatos, IDs, enlaces, anclas y recursos, además de 93 requisitos de conservación del contenido original. Los HTML y el JavaScript compilado se incluyen para hosting estático.

## Organización

- `src/App.jsx`: las cuatro páginas y su composición.
- `src/components/layout.jsx`: navegación, identidad, encabezados, acciones, pie y WhatsApp.
- `src/components/sections.jsx`: servicios, modalidades, clientes, proceso y preguntas frecuentes.
- `src/components/ContactForm.jsx`: selección de servicio, validación accesible, edición y revisión de la solicitud.
- `src/components/motion.jsx`: entrada de secciones y trazado adaptable de la ruta entre etapas.
- `src/site.mjs`: contacto, servicios, clientes, indicadores y metadatos publicados.
- `src/document.mjs`: documento HTML y SEO.
- `src/client.jsx`: hidratación de React sobre el HTML generado.
- `styles.css`: sistema visual y composiciones responsivas.
- `scripts/build.mjs`: genera HTML con React y compila el cliente con esbuild.
- `docs/design-notes.md`: recorrido, decisiones y alcance de validación.
- `docs/image-prompts.md`: origen y prompts de las imágenes ilustrativas.

## Publicación

Publique `index.html`, `quienes-somos.html`, `como-operamos.html`, `contactenos.html`, `styles.css`, `script.js`, `images/` y `assets/`. No se necesita un servidor de React, ni publicar `node_modules/`, `.build/`, `src/`, `scripts/`, `docs/` u `output/`.

Se conservan las URLs canónicas publicadas y el ancla `index.html#como-operamos`. Si el hosting sirve rutas limpias (`/quienes-somos`, `/como-operamos`, `/contactenos`), debe mantener sus redirecciones o reglas existentes hacia los HTML correspondientes.

## Diseño y recorrido

Portada fotográfica, navegación sobre la imagen, tres paneles de contacto, servicios con iconos, galería fotográfica, modalidades, confianza, proceso, clientes, preguntas frecuentes y cierre de cotización. La paleta usa naranja, blanco y gris oscuro. El logotipo conserva el arte original y se presenta sin recuadro crema, en blanco y naranja sobre fondos oscuros, mediante un filtro SVG; la fuente original permanece intacta. Poppins se carga desde Google Fonts con respaldo local.

Recorrido principal: comprender la oferta → seleccionar servicio → completar datos → corregir o revisar → abrir WhatsApp y confirmar allí. El formulario rápido solo transmite la elección del servicio mediante una URL local; no pide datos personales adicionales. La elección se conserva al pasar al formulario completo.

Los errores se vinculan a sus campos, se enfoca el primer campo inválido y se conservan los datos. La revisión permite volver a editar. Se distinguen solicitud preparada y mensaje enviado: el sitio nunca presenta una confirmación de envío. No hay backend, almacenamiento de solicitudes, analítica ni envíos automáticos.

La sección de clientes muestra los siete logotipos a color y con sus nombres, la experiencia existente de 35 años y los compromisos descritos en el sitio. Las tarjetas aparecen una sola vez al entrar en pantalla. Una línea SVG conecta las cuatro fases del proceso y se dibuja en 3,6 segundos al entrar en vista; los nodos se destacan en secuencia. En móvil, las fases se organizan verticalmente para conservar la continuidad de la ruta. Se respeta `prefers-reduced-motion`, sin dibujo animado ni punto en movimiento cuando está activado.

El menú responsive abre un panel con navegación, cotización y teléfono; cierra con Escape, al elegir un destino o al tocar fuera, y restaura el desplazamiento del documento al cerrar. En pantallas de poca altura, el panel permite desplazamiento interno. El selector rápido usa etiquetas breves y ancho completo y conserva el identificador del servicio al pasar al formulario. WhatsApp permanece fijo como acceso circular en la esquina inferior derecha y se oculta mientras está abierto el menú.

Sin JavaScript, el contenido, los enlaces, los desplegables nativos, la navegación y los canales directos siguen disponibles. El formulario de preparación requiere JavaScript; se ofrece un enlace directo alternativo a WhatsApp.

## Contenido y fotografías

Se conservan los cuatro servicios, seis modalidades, siete clientes con sus descripciones, misión, visión, valores, indicadores y datos de contacto. Los indicadores 35, 9, 100% y 24 provienen del contenido existente y no se calculan a partir del número de logotipos.

Las dos fotografías nuevas se generaron con imagegen y son ilustrativas: no documentan instalaciones, personal o vehículos reales de Charlie. Los logotipos de clientes, el logotipo de Charlie y el mapa se mantienen desde el proyecto original. No se añadieron testimonios, noticias o servicios ficticios para completar secciones de la referencia.
