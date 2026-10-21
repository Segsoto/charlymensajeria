# Publicar Charlie en Hostinger

## Subida manual

Ejecute `npm run hostinger` en la carpeta del proyecto. Se generan:

- `HOSTINGER/public_html/`: solo archivos que necesita el sitio.
- `HOSTINGER/charlie-public_html.zip`: el mismo contenido, con `.htaccess` incluido.

En el Administrador de archivos de Hostinger, guarde una copia de la carpeta `public_html` actual fuera de la carpeta pública. Suba el ZIP y extraiga **su contenido directamente dentro de `public_html`**. `index.html`, `.htaccess` y los archivos `styles.<version>.css` y `script.<version>.js` deben quedar al mismo nivel; no dentro de otra carpeta `public_html`.

Suba el paquete completo. No copie la raíz del proyecto: contiene fuentes, herramientas y dependencias que no se publican. Después, use **Borrar caché** en el panel del sitio de Hostinger.

Los CSS y JavaScript compilados llevan nombres según su contenido. Cada HTML referencia exactamente su versión, para evitar cargar estilos antiguos junto al diseño nuevo. `.htaccess` mantiene las rutas limpias y la revalidación del HTML.

## Actualizaciones desde GitHub

Al subir cambios a `main`, el workflow **Preparar publicacion de Hostinger** compila, valida y actualiza la rama `codex/hostinger`. Esa rama contiene solo la web lista para servir, con `.htaccess` e imágenes; no requiere npm en el hosting.

Falta conectar esa rama al despliegue de Hostinger. En esta cuenta, Hostinger indica: **La implementación de Git está deshabilitada al administrar clientes**. El propietario debe entrar con su propia cuenta, abrir GIT y conectar:

- Repositorio: `https://github.com/Segsoto/charlymensajeria`
- Rama: `codex/hostinger`
- Directorio público: `public_html`, sin una subcarpeta adicional.
- Activar la implementación automática de la rama seleccionada.

Si Hostinger solicita una URL webhook, configúrela en GitHub para eventos push siguiendo el asistente. El directorio de instalación debe estar vacío al hacer la primera conexión: conserve la copia anterior fuera de `public_html` y use los archivos de la rama publicada.

El workflow actualiza GitHub; **hasta conectar Hostinger, el servidor no se actualiza automáticamente**. No se han creado usuarios FTP, contraseñas ni claves SSH.

## Dominio y comprobación

El dominio debe apuntar al servidor de Hostinger cuando sea el alojamiento principal. Use la IP exacta indicada en Detalles del plan para este sitio. Conserve los registros de correo.

Compruebe `https://charliemensajeria.com`, `https://www.charliemensajeria.com` y las páginas `/quienes-somos`, `/como-operamos` y `/contactenos`. `release.json` identifica los estilos y scripts de la versión publicada.
