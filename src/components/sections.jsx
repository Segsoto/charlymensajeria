import { useRef, useState } from 'react';
import { clients, company, homeIndicators, serviceOptions, services, process, homeStandards, contactCopy, site } from '../site.mjs';
import { Action, Icon, SectionHeading } from './layout.jsx';
import { JourneyLine, useEntrance } from './motion.jsx';

const shortServices = { documentos: 'Documentos y paquetes', rutas: 'Rutas de recolección', bancarios: 'Trámites bancarios', legales: 'Trámites de gobierno' };

function QuickQuote() {
  const [service, setService] = useState('documentos');
  return <form action="contactenos.html" method="get"><label htmlFor="quick-service">¿Qué servicio necesita?</label><select id="quick-service" name="servicio" value={service} onChange={event => setService(event.target.value)}>{services.map(item => <option key={item.id} value={item.id}>{shortServices[item.id]}</option>)}<option value="otro">Necesito orientación</option></select><button className="button" type="submit">Preparar mi solicitud<Icon name="arrow"/></button></form>;
}

export function Indicators({ items = homeIndicators }) {
  return <dl className="indicator-strip">{items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;
}

export function ContactStrip() {
  return <section className="container contact-strip" aria-label="Cómo podemos ayudarle">
    <div className="strip-panel strip-experience"><span className="strip-icon"><Icon name="shield"/></span><h2>Su confianza nos mueve</h2><p>35 años de experiencia cuidando documentos, entregas y relaciones de largo plazo.</p><a className="text-link" href="quienes-somos.html">Conozca a Charlie<Icon name="arrow"/></a></div>
    <div className="strip-panel strip-quote"><p className="eyebrow">Una solución para su empresa</p><h2>Solicite una cotización</h2><QuickQuote/><p className="strip-note">Le ayudamos a definir la ruta y las condiciones.</p></div>
    <div className="strip-panel strip-contact"><span className="strip-icon"><Icon name="phone"/></span><h2>Hablemos directamente</h2><p>¿Tiene una entrega pendiente? Confirme la cobertura y disponibilidad con nuestro equipo.</p><a className="strip-phone" href={`tel:${site.phoneHref}`}>{site.phone}</a><a className="text-link" href={site.whatsapp} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp<Icon name="arrow"/></a></div>
  </section>;
}

export function Services() {
  return <section className="section container" id="servicios" aria-labelledby="services-title"><SectionHeading eyebrow="Soluciones empresariales" title="Lo que hacemos por su empresa" id="services-title" description="Mensajería empresarial y trámites corporativos de alta privacidad."/>
    <div className="service-grid">{services.map(item => <article className="service-card" key={item.id}><Icon name={item.icon}/><div><h3>{item.title}</h3><p>{item.description}</p><details><summary>Qué incluye<span aria-hidden="true">+</span></summary><p>{item.detail}</p></details><a className="text-link" href={`contactenos.html?servicio=${item.id}`}>Consultar servicio<Icon name="arrow"/></a></div></article>)}</div>
    <p className="services-note">Integramos mensajería empresarial con documentación y trámites empresariales para su empresa.</p>
  </section>;
}

export function ServiceGallery() {
  const items = [
    { href: 'contactenos.html?servicio=documentos', title: 'Documentos en buenas manos', label: 'Custodia y discreción', image: 'images/document-handoff.jpg', className: 'gallery-documents' },
    { href: 'contactenos.html?servicio=rutas', title: 'Rutas que conectan', label: 'Su operación, en movimiento', image: 'images/courier-hero.jpg', className: 'gallery-routes' },
    { href: 'contactenos.html?servicio=legales', title: 'Gestiones que avanzan', label: 'Trámites empresariales', image: 'images/document-handoff.jpg', className: 'gallery-business' },
  ];
  return <section className="service-gallery" aria-label="Encuentre su solución">{items.map(item => <a href={item.href} className={`gallery-item ${item.className}`} key={item.title}><img src={item.image} width="1000" height="650" alt="" loading="lazy"/><div className="gallery-copy"><span>{item.label}</span><h2>{item.title}</h2><span className="gallery-arrow"><Icon name="arrow"/></span></div></a>)}</section>;
}

export function ServiceOptions() {
  const icons = ['route', 'box', 'shield', 'document', 'bank', 'check'];
  return <section className="section options-section" aria-labelledby="options-title"><div className="container"><SectionHeading eyebrow="La modalidad que necesita" title="Un servicio a su medida" id="options-title" description="Una entrega puntual o una ruta recurrente. Coordinamos la solución que acompaña su operación."/><ul className="options-grid">{serviceOptions.map((item, index) => <li key={item}><Icon name={icons[index]}/><h3>{item}</h3></li>)}</ul><div className="section-center"><Action>Encontrar mi solución</Action></div></div></section>;
}

export function CompanyCare() {
  return <section className="company-care"><div className="care-photo"><img src="images/document-handoff.jpg" width="1536" height="1024" alt="Imagen ilustrativa de una entrega de documentación empresarial" loading="lazy"/><span className="experience-stamp"><strong>35</strong><span>años de<br/>experiencia</span></span></div><div className="care-copy"><p className="eyebrow">El cuidado está en los detalles</p><h2>Detrás de cada documento,<br/>hay alguien que confía.</h2><span className="heading-rule" aria-hidden="true"/><p>Un contrato, una gestión, una entrega pendiente. Sabemos que lo que transportamos forma parte del trabajo de su equipo. Por eso, cada servicio merece atención personal.</p><h3>Estándares de seguridad y cumplimiento</h3><ul className="check-list">{homeStandards.map(text => <li key={text}><Icon name="check"/>{text}</li>)}</ul><a className="text-link" href="quienes-somos.html">Conozca nuestra empresa<Icon name="arrow"/></a></div></section>;
}

export function ProcessSteps({ introduction }) {
  const journey = useRef(null);
  const [, visible] = useEntrance(journey);
  return <section className={`section container process-section${visible ? ' is-visible' : ''}`} id="como-operamos" aria-labelledby="process-title"><SectionHeading eyebrow="Un proceso claro" title="De su solicitud a la entrega" id="process-title" description={introduction}/><div className="process-journey" ref={journey}><JourneyLine container={journey} visible={visible}/><ol className="process-grid">{process.map((item, index) => <li key={item.number} style={{ '--step': index }}><span className="step-number">{item.number}</span><div className="step-copy"><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol></div><div className="section-center"><a className="text-link" href="como-operamos.html">Conozca cómo operamos<Icon name="arrow"/></a></div></section>;
}

export function Clients() {
  const [section, visible] = useEntrance();
  return <section ref={section} className={`section clients-section${visible ? ' is-visible' : ''}`} id="clientes" aria-labelledby="clients-title"><div className="container"><div className="trust-heading"><div><p className="eyebrow">Relaciones que construyen confianza</p><h2 id="clients-title">Empresas que nos acompañan.</h2><p>Estas son algunas de las empresas que día a día confían en nuestros servicios de mensajería empresarial y gestión de documentación y trámites empresariales para sus operaciones críticas.</p><span className="heading-rule" aria-hidden="true"/></div><div className="trust-experience"><Icon name="shield"/><div><strong>35 años</strong><span>de experiencia en cada entrega</span></div></div></div><ul className="client-list">{clients.map((item, index) => <li className="client-card" key={item.name} style={{ '--client': index }}><div className="client-logo"><img src={item.image} alt={item.name} width="160" height="70" loading="lazy"/></div><span className="client-name">{item.name}</span></li>)}</ul><div className="trust-commitments"><div><Icon name="shield"/><span>Manejo confidencial</span></div><div><Icon name="phone"/><span>Coordinación directa</span></div><div><Icon name="check"/><span>Confirmación de recepción</span></div></div><details className="client-directory"><summary>Conozca a nuestros clientes empresariales<span aria-hidden="true">+</span></summary><div className="client-directory-grid">{clients.map(item => <article key={item.name}><h3>{item.name}</h3><p>{item.description}</p></article>)}</div></details></div></section>;
}

const faqs = [
  ['¿Qué tipo de documentos pueden gestionar?', 'Documentación empresarial, contratos y documentos legales, además de paquetes y diligencias bancarias o institucionales. Cuéntenos su requerimiento para confirmar las condiciones de manejo.'],
  ['¿Puedo coordinar una ruta recurrente?', 'Sí. Coordinamos rutas de recolección y entrega de acuerdo con los puntos y la frecuencia de su operación. Solicite una propuesta para definir juntos el recorrido.'],
  ['¿Cómo se define el precio del servicio?', 'La propuesta se prepara según el recorrido, el tipo de gestión y la frecuencia. Envíenos esos detalles y coordinaremos una cotización para su empresa.'],
  ['¿Cómo confirmo la cobertura de mi entrega?', 'Comparta el punto de retiro y el destino por WhatsApp o teléfono. Nuestro equipo confirmará la disponibilidad y las condiciones antes de coordinar el servicio.'],
];
export function FAQ() {
  return <section className="section container faq-section"><div><SectionHeading eyebrow="Resolvamos sus dudas" title="En claro, desde el principio" left/><p>La información que necesita para dar el siguiente paso con tranquilidad.</p><a className="text-link" href="contactenos.html">Hacer otra consulta<Icon name="arrow"/></a></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>;
}

export function CompanyPrinciples() {
  return <section className="section container"><SectionHeading eyebrow="Lo que nos guía" title="Principios que sostienen nuestra operación"/><div className="values-grid">{[{ title: 'Misión', text: company.mission, icon: 'route' }, { title: 'Visión', text: company.vision, icon: 'document' }, { title: 'Valores', text: company.values, icon: 'shield' }].map(item => <article key={item.title}><Icon name={item.icon}/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>;
}

export function ContactInvitation() {
  return <section className="section options-section"><div className="container contact-invitation"><div><p className="eyebrow">Costa Rica · Mensajería empresarial</p><h2>{contactCopy.invitation}</h2><span className="heading-rule" aria-hidden="true"/><p>{contactCopy.proposal}</p><p>Comparta el origen y el destino para confirmar cobertura y disponibilidad.</p></div><figure><img src="assets/coverage.svg" width="800" height="500" alt="Mapa de cobertura en Costa Rica" loading="lazy"/></figure></div></section>;
}
