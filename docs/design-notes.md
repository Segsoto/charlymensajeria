# Recorrido y decisiones de experiencia

## Contexto

Audiencia asumida a partir del contenido existente: responsables administrativos de empresas en Costa Rica que necesitan trasladar documentos o coordinar trámites. Llegan desde búsqueda, una recomendación o un enlace directo. Es un análisis heurístico; no se realizó investigación con usuarios ni se midió conversión.

## Recorrido

1. **Entrada y comprensión.** La portada identifica la mensajería empresarial en Costa Rica y da acceso directo a cotización y servicios.
2. **Selección.** Cuatro servicios con descripciones e inclusiones desplegables. Cada enlace lleva el servicio seleccionado al formulario. La portada incluye un selector compacto para visitantes que ya saben qué necesitan.
3. **Solicitud.** Nombre, empresa, correo corporativo, servicio y requerimiento general. Se conserva el requisito de correo del sitio existente y se permite solicitar orientación cuando la modalidad todavía no está clara.
4. **Corrección y revisión.** Errores junto a los campos, atributos `aria-invalid` y `aria-describedby`, resumen anunciado y foco en el primer error. Los datos permanecen disponibles. Al preparar una solicitud válida, el foco pasa al encabezado de revisión.
5. **Siguiente paso.** El visitante revisa el mensaje, puede editarlo y elige abrir WhatsApp. El envío se confirma en WhatsApp. El sitio muestra «El mensaje aún no se ha enviado» y no simula recepción, precio o disponibilidad.

## Estructura

Inicio organiza oferta, modalidades, confianza, proceso y preguntas. Quiénes somos desarrolla trayectoria y principios. Cómo operamos explica fases y preparación. Contacto concentra el formulario y los tres canales alternativos. Las cuatro páginas mantienen navegación y pie comunes, una acción principal explícita y la información original.

En Inicio, los clientes aparecen inmediatamente después de la portada y sus paneles de contacto, antes de los servicios. Esto acerca la evidencia de confianza al primer recorrido de lectura. El título de portada entra en dos líneas escalonadas, seguido de la descripción y las acciones; la secuencia termina en 1,2 segundos, sin bucles ni cambios de posición del resto del contenido. Se omite cuando se solicita movimiento reducido y los botones se muestran inmediatamente si reciben foco durante la animación.

## Accesibilidad y adaptación

HTML generado antes de ejecutar JavaScript, un h1 por página, landmarks, enlaces para navegación, botones para acciones, etiquetas persistentes, autocompletado, foco visible y movimiento reducido. Los detalles de servicios y preguntas usan desplegables nativos. El menú móvil expone su estado, cierra con Escape y devuelve el foco al control; también cierra al salir o elegir un enlace.

Las acciones de cotización usan texto oscuro sobre naranja para conservar contraste. Los enlaces naranjas sobre blanco usan una variante más oscura. Se dimensionan imágenes y se cargan de forma diferida las que están bajo la portada. Las imágenes decorativas tienen texto alternativo vacío; las informativas llevan descripción.

## Validación

`npm run build` y `npm run check` completados, incluidas 93 verificaciones del contenido original. Revisión de navegador en escritorio, 768 px, 390 px y 320 px: portada, páginas internas, anchos y recursos. Se comprobó selección de servicio, errores vacíos, conservación de datos, revisión válida, enlace de WhatsApp, edición y cierre del menú con Escape. No se envió el mensaje de prueba.

La revisión es parcial y no constituye una auditoría completa de conformidad WCAG. No se midieron métricas de rendimiento ni resultados de conversión. El entorno presenta un problema previo de acceso a metadatos de Git (`.git/info/exclude` y mmap); no se modificó `.git` para resolverlo.

## Refinamientos de confianza y movimiento

- Se aumenta el tamaño de los logos existentes, se mantienen sus colores y se muestran sus nombres. Las filas incompletas se centran sin alterar el orden de lectura. La experiencia de 35 años y los tres compromisos visibles proceden del contenido existente; no representan certificaciones o reseñas nuevas.
- El movimiento de las tarjetas se reproduce una sola vez cuando la sección entra en pantalla. El contenido sigue visible si JavaScript no se ejecuta. Las interacciones de puntero también tienen alternativas de foco cuando aportan información.
- La ruta operativa se mide sobre las posiciones reales de los nodos con ResizeObserver y se actualiza al cambiar el ancho. El dibujo conecta 01, 02, 03 y 04 en orden. En pantallas de hasta 960 px se utiliza una sola columna con línea vertical; en escritorio, una fila horizontal.
- El recorrido animado termina en 4,05 segundos, sin bucles. La línea tarda 3,6 segundos y el último nodo completa su transición 0,45 segundos después. La preferencia de movimiento reducido muestra la conexión completa de manera estática y omite el punto móvil.
- El menú añade un fondo oscuro con degradado, un panel con enlaces legibles y un acceso directo a cotización. No se presenta como diálogo modal: el foco puede salir y cerrar el panel, y Escape vuelve al botón. El panel admite desplazamiento interno en pantallas cortas.
- Se comprobó el selector a 320 px (225 px de ancho disponible para el control), la conservación de `servicio=legales` al abrir la cotización, cierre con Escape y restauración del desplazamiento, y menú de 498 × 549 px con panel contenido dentro del alto de la pantalla.
