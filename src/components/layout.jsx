import { useEffect, useId, useRef, useState } from 'react';
import { navigation, site } from '../site.mjs';

const paths = {
  document: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 12h6m-6 4h6"/></>,
  route: <><circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M8 5h7a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h7"/></>,
  bank: <><path d="m3 8 9-5 9 5zM3 21h18M5 11v7m7-7v7m7-7v7"/></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  phone: <path d="m5 3 4 1 1 4-3 2a15 15 0 0 0 7 7l2-3 4 1 1 4c-1 5-9 1-13-3S0 4 5 3Z"/>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  box: <><path d="m3 7 9-4 9 4v11l-9 4-9-4zM3 7l9 4 9-4M12 11v11M7 5l9 4"/></>,
  whatsapp: <><path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-2 4 5 11 9 8l-3-2-1 1-3-3 1-1z"/></>,
};

export function Icon({ name, className = '' }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.document}</svg>;
}

export function Action({ href = 'contactenos.html', children = 'Solicitar cotización', className = '' }) {
  return <a className={`button ${className}`} href={href}>{children}<Icon name="arrow"/></a>;
}

export function Brand() {
  const filterId = useId();
  return <a className="brand" href="index.html" aria-label="Charlie Mensajería · Inicio"><span className="brand-crop"><svg className="brand-logo" viewBox="76 270 1165 257" aria-hidden="true">
    <defs><filter id={filterId} colorInterpolationFilters="sRGB">
      {/* Remove the light matte and adapt the original artwork for dark surfaces. */}
      <feColorMatrix type="matrix" values="0 0 0 0 1  -.6 0 0 0 1.05  -1.5 0 0 0 1.15  0 0 -8 0 6.2"/>
    </filter></defs>
    <image href="images/charlie-logo.jpg" width="1317" height="800" filter={`url(#${filterId})`}/>
  </svg></span></a>;
}

export function Header({ page }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const header = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    setReady(true);
    const query = window.matchMedia('(min-width: 961px)');
    const close = () => setOpen(false);
    query.addEventListener('change', close);
    return () => query.removeEventListener('change', close);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = event => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    const outside = event => { if (!header.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', outside);
    document.addEventListener('focusin', outside);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', outside);
      document.removeEventListener('focusin', outside);
    };
  }, [open]);
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><header ref={header} className={`site-header${ready ? ' nav-ready' : ''}${open ? ' menu-is-open' : ''}`}>
    <div className="container header-inner"><Brand/>
      <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(value => !value)}><span>{open ? 'Cerrar' : 'Menú'}</span><span className={`menu-lines${open ? ' menu-lines-open' : ''}`} aria-hidden="true"><span/><span/><span/></span></button>
      {open ? <button className="menu-backdrop" type="button" aria-label="Cerrar menú de navegación" tabIndex="-1" onClick={() => { setOpen(false); toggle.current?.focus(); }}/> : null}
      <nav id="main-nav" className={`main-nav${open ? ' is-open' : ''}`} aria-label="Navegación principal" onClick={event => { if (event.target.closest('a')) setOpen(false); }}>
        <div className="mobile-nav-intro"><span className="eyebrow">Charlie Mensajería</span><p>Una ruta directa a lo que necesita.</p></div>
        {navigation.map((item, index) => <a key={item.href} href={item.href} aria-current={page === item.href ? 'page' : undefined}><span className="nav-index" aria-hidden="true">0{index + 1}</span><span>{item.label}</span><Icon name="arrow" className="nav-arrow"/></a>)}
        <a href="contactenos.html" aria-current={page === 'contactenos.html' ? 'page' : undefined}><span className="nav-index" aria-hidden="true">05</span><span>Contacto</span><Icon name="arrow" className="nav-arrow"/></a>
        <div className="mobile-nav-contact"><a className="button" href="contactenos.html">Solicitar cotización<Icon name="arrow"/></a><a className="mobile-nav-phone" href={`tel:${site.phoneHref}`}><Icon name="phone"/>{site.phone}</a></div>
      </nav>
      <a className="header-phone" href={`tel:${site.phoneHref}`}><Icon name="phone"/><span>{site.phone}</span></a>
    </div>
  </header></>;
}

export function SectionHeading({ eyebrow, title, description, id, left = false }) {
  return <div className={`section-heading${left ? ' section-heading-left' : ''}`}>
    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
    <h2 id={id}>{title}</h2>{description ? <p className="section-description">{description}</p> : null}<span className="heading-rule" aria-hidden="true"/>
  </div>;
}

export function PageHero({ title, description, label }) {
  return <section className="page-hero"><div className="container"><nav className="breadcrumbs" aria-label="Ruta de navegación"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav><h1>{title}</h1><p>{description}</p></div></section>;
}

export function ContactBanner() {
  return <section className="contact-banner"><div className="container banner-inner"><div><p className="eyebrow">El siguiente paso es sencillo</p><h2>Su próxima entrega.<br/>Nuestro próximo compromiso.</h2><p>Convierta la mensajería en una ventaja competitiva para su empresa.</p></div><div className="banner-action"><Action>Solicitar cotización</Action><p>Queremos brindarle tranquilidad al saber que sus documentos están a salvo con nosotros.</p></div></div></section>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div className="footer-about"><Brand/><p>35 años conectando empresas con lo que importa. Mensajería y trámites empresariales en Costa Rica.</p><span className="footer-location">Costa Rica · Atención empresarial</span></div><nav aria-label="Navegación de pie de página"><h2>Explore</h2><a href="index.html">Inicio</a><a href="index.html#servicios">Servicios</a><a href="quienes-somos.html">Quiénes somos</a><a href="como-operamos.html">Cómo operamos</a></nav><div><h2>Conversemos</h2><a href={`tel:${site.phoneHref}`}><Icon name="phone"/>{site.phone}</a><a href={`mailto:${site.email}`}><Icon name="mail"/>{site.email}</a><a href={site.whatsapp} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp"/>Escribir por WhatsApp</a></div><div className="footer-proposal"><h2>Su empresa, en buenas manos.</h2><p>Cuéntenos qué necesita y definamos juntos la mejor ruta.</p><Action className="button-outline">Preparar solicitud</Action></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} {site.name} Todos los derechos reservados.</p><a href="#top">Volver arriba ↑</a></div></footer>;
}

export function WhatsAppLink() {
  return <a className="whatsapp-float" href={`${site.whatsapp}?text=Hola%20Charlie%20Mensajer%C3%ADa%2C%20quisiera%20informaci%C3%B3n%20sobre%20sus%20servicios.`} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"><Icon name="whatsapp"/><span className="whatsapp-tooltip" aria-hidden="true">¿Coordinamos su entrega?<strong>Hablemos por WhatsApp</strong></span></a>;
}
