import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Baseline independiente de los módulos de presentación: información del sitio
// publicado que debe sobrevivir a los cambios de diseño.
const baseline = {
  'index.html': [
    'Mensajería empresarial y trámites corporativos de alta privacidad',
    'Integramos mensajería empresarial con documentación y trámites empresariales',
    'años de experiencia 35',
    'empresas colaboradoras vigentes 9',
    'entregas realizadas correctamente 100%',
    'Pisesa', 'Cliente corporativo para gestión documental y trámites de operación',
    'Arte en Luz de Costa Rica', 'Soporte de mensajería empresarial para flujo administrativo',
    'Guidy Estructurales S.A.', 'Cobertura de entregas y recolecciones seguras para documentación crítica',
    'Consurbanes S.A.', 'Aliado activo en trámites y entregas para equipos corporativos',
    'Fragomen Costa Rica', 'Atención de alta confidencialidad para documentación sensible',
    'E.E.B. Ingeniería', 'Servicio empresarial continuo para trámites y control de entregas',
    'Agio Gestoría y Negocios', 'Recolecciones por ruta y entregas en puntos clave de operación',
    'Entrega de paquetes y documentos de alta privacidad',
    'Custodia y traslado seguro para paquetes y documentación empresarial sensible',
    'Recolección por ruta', 'Rutas programadas de retiro y entrega para operaciones con volumen constante',
    'Trámites bancarios', 'Gestión ágil de depósitos, entregas y diligencias bancarias para su empresa',
    'Trámites privados en instituciones de gobierno',
    'Acompañamiento y ejecución de gestiones formales ante entidades gubernamentales',
    'Entrega de mensajería mediante ruta', 'Entrega individual',
    'Trámites legales de alta privacidad',
    'Recolección de documentos legales en oficinas de clientes',
    'Entrega directa a tribunales, notarías y entidades jurídicas',
    'Seguimiento de entregas con confirmación de recepción',
    'Nuestra metodología reduce riesgo, mejora tiempos de respuesta y asegura trazabilidad total',
    'Solicitud', 'Canales directos para activar servicio urgente o programado',
    'Asignación', 'Despacho por prioridad, distancia y criticidad del documento',
    'Seguimiento', 'Actualizaciones de estado y alertas de avance para su equipo',
    'Cierre', 'Evidencia de entrega con registro digital para auditoría',
    'Comunicación clara y profesional', 'Manejo con discreción sobre los documentos',
    'Protocolo para documentos confidenciales y sensibles',
    'Respuesta inmediata ante incidencias operativas',
    'Convierta la mensajería en una ventaja competitiva para su empresa',
    'Queremos brindarle tranquilidad al saber que sus documentos están a salvo con nosotros',
  ],
  'quienes-somos.html': [
    'Somos una empresa costarricense especializada en mensajería empresarial, documentación y trámites empresariales, con 35 años de experiencia',
    'Diseñamos un servicio para organizaciones que requieren confiabilidad total en el movimiento de documentos, paquetes y trámites empresariales',
    'Entrega de paquetes y documentos de alta privacidad',
    'Recolección por ruta para operaciones programadas',
    'Trámites bancarios para departamentos administrativos',
    'Trámites privados en instituciones de gobierno',
    'Misión', 'Garantizar movilidad documental segura y puntual para empresas en Costa Rica',
    'Visión', 'Ser el aliado logístico de referencia para corporativos de alto desempeño',
    'Valores', 'Confidencialidad, responsabilidad, disciplina operativa y orientación al cliente',
    'años de experiencia 35', 'empresas colaboradoras vigentes 9', 'monitoreo operativo 24',
  ],
  'como-operamos.html': [
    'Nuestra metodología reduce riesgo, mejora tiempos de respuesta y asegura trazabilidad total para la documentación de su empresa',
    'Proceso estándar en cuatro fases',
    'Solicitud', 'Canales directos para activar servicio urgente o programado',
    'Asignación', 'Despacho por prioridad, distancia y criticidad del documento',
    'Seguimiento', 'Actualizaciones de estado y alertas de avance para su equipo',
    'Cierre', 'Evidencia de entrega con registro digital para auditoría',
    'Identificación de responsable por punto de custodia',
    'Bitácora de tiempos de retiro, trayecto y entrega',
    'Protocolo para documentos confidenciales y sensibles',
    'Respuesta inmediata ante incidencias operativas',
  ],
  'contactenos.html': [
    'Estamos acá para poder brindarle una atención personalizada y definir juntos la mejor solución de mensajería para su empresa',
    'Teléfono corporativo', '+506 8914-6755',
    'Correo empresarial', 'carloshv66@gmail.com', 'Atención profesional',
    'Atención por WhatsApp', 'Iniciar conversación',
    'Solicite una propuesta personalizada',
    'Empresa', 'Nombre del responsable', 'Correo corporativo', 'Requerimiento',
    'Sea parte de nuestras rutas',
    'En Charlie Mensajería S.A. trabajamos para ser el aliado logístico de confianza para su empresa',
    'Nuestro equipo está listo para diseñar una propuesta de servicio que se ajuste a sus necesidades específicas y garantice la seguridad y eficiencia en cada envío',
  ],
};

const normalize = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const canonicalPaths = {
  'index.html': '/',
  'quienes-somos.html': '/quienes-somos',
  'como-operamos.html': '/como-operamos',
  'contactenos.html': '/contactenos',
};
let checked = 0;
for (const [file, requirements] of Object.entries(baseline)) {
  const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  const text = normalize(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' '));
  for (const requirement of requirements) {
    assert.ok(text.includes(normalize(requirement)), `${file}: falta contenido publicado: ${requirement}`);
    checked++;
  }
  assert.match(html, /aria-label="Contactar por WhatsApp"/, `${file}: acceso directo a WhatsApp`);
  assert.ok(html.includes(`rel="canonical" href="https://charliemensajeria.com${canonicalPaths[file]}"`), `${file}: URL canónica publicada`);
  if (file === 'index.html') assert.match(html, /id="como-operamos"/, 'Conservar ancla publicada #como-operamos');
  if (file === 'contactenos.html') {
    assert.match(html, /id="correo"[^>]*required/, 'Conservar correo corporativo obligatorio');
    assert.match(html, /alt="Mapa de cobertura en Costa Rica"/, 'Conservar gráfico de cobertura');
  }
  console.log(`OK ${file}: ${requirements.length} comprobaciones de contenido original`);
}
console.log(`Contenido publicado conservado: ${checked} comprobaciones.`);
