import { company, companyIndicators, process, processIntroduction, custodyControls, contactCopy, site } from './site.mjs';
import { Header, Footer, WhatsAppLink, Action, Icon, PageHero, ContactBanner, SectionHeading } from './components/layout.jsx';
import { ContactStrip, Services, ServiceGallery, ServiceOptions, CompanyCare, ProcessSteps, Clients, FAQ, Indicators, CompanyPrinciples, ContactInvitation } from './components/sections.jsx';
import { ContactForm } from './components/ContactForm.jsx';

function Home() {
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src="images/courier-hero.jpg" width="1672" height="941" alt="" fetchPriority="high"/>
      <div className="hero-shade"/>
      <div className="container hero-content">
        <p className="hero-eyebrow"><span/>Mensajería empresarial en Costa Rica</p>
        <h1 id="hero-title"><span className="hero-title-line">Lo importante,</span>{' '}<span className="hero-title-line">en buenas manos.</span></h1>
        <p className="hero-description">Conectamos su empresa con lo que importa.<br/>{' '}Documentos, entregas y trámites con el cuidado de siempre.</p>
        <div className="hero-actions"><Action>Solicitar cotización</Action><a className="hero-secondary" href="#servicios">Conocer servicios<span aria-hidden="true">↓</span></a></div>
      </div>
      <div className="hero-caption" aria-hidden="true">Cada entrega, un compromiso.</div>
    </section>
    <ContactStrip/>
    <Clients/>
    <Services/>
    <ServiceGallery/>
    <ServiceOptions/>
    <CompanyCare/>
    <section className="stats-section" aria-label="Nuestra trayectoria"><div className="container"><Indicators/></div></section>
    <ProcessSteps introduction={processIntroduction}/>
    <FAQ/>
    <ContactBanner/>
  </>;
}

function About() {
  return <><PageHero label="Quiénes somos" title="La confianza se entrega." description={company.introduction}/><section className="section container about-grid"><figure className="about-photo"><img src="images/document-handoff.jpg" width="1536" height="1024" alt="Imagen ilustrativa del cuidado en la entrega de documentos" loading="lazy"/><figcaption><strong>35</strong> años de experiencia</figcaption></figure><div><SectionHeading eyebrow="Somos Charlie Mensajería" title="Pequeños detalles. Grandes compromisos." left/><p>{company.value}</p><ul className="check-list">{company.offerings.map(text => <li key={text}><Icon name="check"/>{text}</li>)}</ul><Action>Cuéntenos sobre su empresa</Action></div></section><section className="statement-section"><div className="container"><p className="eyebrow">Nuestro compromiso</p><h2>Que su empresa siga adelante<br/>con una preocupación menos.</h2><p>Nuestra misión es facilitar una movilidad documental segura y puntual. Nuestra visión es ser un aliado de confianza que acompaña a sus clientes en cada nueva etapa.</p></div></section><CompanyPrinciples/><section className="stats-section" aria-label="Indicadores corporativos"><div className="container"><Indicators items={companyIndicators}/></div></section><Clients/><ContactBanner/></>;
}

function ProcessPage() {
  return <><PageHero label="Cómo operamos" title="Una ruta clara. De principio a fin." description={processIntroduction}/><section className="section container"><SectionHeading eyebrow="Cómo cuidamos su entrega" title="Proceso estándar en cuatro fases"/><ol className="process-timeline">{process.map(item => <li key={item.number}><span className="timeline-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><Icon name={item.number === '04' ? 'check' : 'arrow'}/></li>)}</ol></section><section className="section options-section"><div className="container preparation-grid"><div><SectionHeading eyebrow="Antes de empezar" title="Los detalles correctos. Desde el inicio." left/><p>Esta información nos ayuda a preparar una propuesta y confirmar las condiciones de su servicio.</p><Action>Preparar mi solicitud</Action></div><ul className="preparation-list">{[{ title: 'Punto de retiro y destino', text: 'Las ubicaciones y la persona de contacto en cada punto.' }, { title: 'Tipo de documento o gestión', text: 'Lo que necesita trasladar y cualquier condición especial.' }, { title: 'Frecuencia y fecha requerida', text: 'Una entrega individual o una ruta para su operación diaria.' }].map((item, index) => <li key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ul></div></section><section className="section container safety-grid"><SectionHeading eyebrow="Custodia documental" title="Seguridad en cada punto del camino" left/><ul className="check-list">{custodyControls.map(text => <li key={text}><Icon name="shield"/>{text}</li>)}</ul></section><ContactBanner/></>;
}

function Contact() {
  return <><PageHero label="Contacto" title="Hablemos de su próxima entrega." description={contactCopy.introduction}/><section className="section container contact-layout"><div className="form-panel"><div className="form-heading"><p className="eyebrow">Paso 1 de 2 · Cuéntenos qué necesita</p><h2>Solicite una propuesta personalizada.</h2><p>Complete los detalles y prepare su solicitud para continuar por WhatsApp.</p></div><ContactForm/></div><aside className="contact-aside"><div className="contact-aside-heading"><p className="eyebrow">Usted elige cómo</p><h2>También estamos<br/>a una llamada.</h2><p>Si prefiere conversar directamente, nuestro equipo le ayudará a definir su servicio.</p></div><a className="contact-channel" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp"/><div><span>Atención por WhatsApp</span><strong>Iniciar conversación</strong><p>Contáctenos directamente por WhatsApp para tener una atención más rápida.</p></div><Icon name="arrow"/></a><a className="contact-channel" href={`tel:${site.phoneHref}`}><Icon name="phone"/><div><span>Teléfono corporativo</span><strong>{site.phone}</strong></div><Icon name="arrow"/></a><a className="contact-channel" href={`mailto:${site.email}`}><Icon name="mail"/><div><span>Correo empresarial</span><strong>{site.email}</strong><p>Atención profesional</p></div><Icon name="arrow"/></a><div className="contact-aside-note"><Icon name="shield"/><p>Para el primer contacto, basta una descripción general. Evite adjuntar documentación confidencial hasta coordinar su manejo con el equipo.</p></div></aside></section><ContactInvitation/></>;
}

const pages = { 'index.html': Home, 'quienes-somos.html': About, 'como-operamos.html': ProcessPage, 'contactenos.html': Contact };
export function App({ page = 'index.html' }) {
  const Content = pages[page] || Home;
  return <><Header page={page}/><main id="contenido" tabIndex="-1"><Content/></main><Footer/><WhatsAppLink/></>;
}
