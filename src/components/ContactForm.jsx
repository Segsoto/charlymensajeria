import { useEffect, useRef, useState } from 'react';
import { services, site } from '../site.mjs';
import { Icon } from './layout.jsx';

const empty = { nombre: '', empresa: '', correo: '', servicio: '', mensaje: '' };

export function validateRequest(values) {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = 'Indique su nombre para que podamos atenderle.';
  if (!values.empresa.trim()) errors.empresa = 'Indique el nombre de su empresa.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo.trim())) errors.correo = 'Ingrese un correo válido, por ejemplo: usted@empresa.com.';
  if (![...services.map(item => item.id), 'otro'].includes(values.servicio)) errors.servicio = 'Seleccione un servicio o solicite orientación.';
  if (!values.mensaje.trim()) errors.mensaje = 'Cuéntenos qué necesita trasladar o gestionar.';
  return errors;
}

export function requestMessage(values) {
  const title = services.find(item => item.id === values.servicio)?.title || 'Quiero orientación para mi empresa';
  return ['Hola, Charlie Mensajería. Quisiera coordinar un servicio para mi empresa.', '', `Nombre: ${values.nombre.trim()}`, `Empresa: ${values.empresa.trim()}`, `Correo: ${values.correo.trim()}`, `Servicio: ${title}`, '', values.mensaje.trim()].join('\n');
}

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [prepared, setPrepared] = useState(false);
  const [ready, setReady] = useState(false);
  const heading = useRef(null);
  const form = useRef(null);
  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get('servicio');
    if (services.some(item => item.id === requestedService) || requestedService === 'otro') setValues(previous => ({ ...previous, servicio: requestedService }));
    setReady(true);
  }, []);
  useEffect(() => { if (prepared) heading.current?.focus(); }, [prepared]);
  const update = event => {
    const { name, value } = event.target;
    setValues(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined }));
    setPrepared(false);
  };
  const submit = event => {
    event.preventDefault();
    const nextErrors = validateRequest(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setPrepared(false);
      form.current.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setPrepared(true);
  };
  const common = name => ({ id: name, name, value: values[name], onChange: update, required: true, 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': [name === 'mensaje' ? 'message-help' : '', errors[name] ? `${name}-error` : ''].filter(Boolean).join(' ') || undefined });
  const error = name => errors[name] ? <p className="field-error" id={`${name}-error`}>{errors[name]}</p> : null;
  const message = prepared ? requestMessage(values) : '';
  return <><form ref={form} className="contact-form" hidden={!ready} onSubmit={submit} noValidate>
    <p className="form-required">Todos los campos son obligatorios.</p>
    <div className="form-grid"><div className="field"><label htmlFor="nombre">Nombre del responsable</label><input {...common('nombre')} autoComplete="name" maxLength="100" placeholder="Nombre y apellido"/>{error('nombre')}</div><div className="field"><label htmlFor="empresa">Empresa</label><input {...common('empresa')} autoComplete="organization" maxLength="150" placeholder="Nombre de su empresa"/>{error('empresa')}</div></div>
    <div className="field"><label htmlFor="correo">Correo corporativo</label><input {...common('correo')} type="email" autoComplete="email" maxLength="150" placeholder="usted@empresa.com"/>{error('correo')}</div>
    <div className="field"><label htmlFor="servicio">¿En qué podemos ayudarle?</label><select {...common('servicio')}><option value="">Seleccione un servicio</option>{services.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}<option value="otro">Quiero orientación para mi empresa</option></select>{error('servicio')}</div>
    <div className="field"><label htmlFor="mensaje">Requerimiento</label><textarea {...common('mensaje')} rows="4" maxLength="1500" placeholder="Punto de retiro, destino, tipo de gestión y frecuencia aproximada…"/><p className="field-help" id="message-help">Una descripción general es suficiente. Coordinaremos los detalles con usted.</p>{error('mensaje')}</div>
    {Object.values(errors).some(Boolean) ? <p className="form-error-summary" role="alert">Revise los campos señalados. Sus datos se conservan.</p> : null}
    <button className="button form-submit" type="submit">Revisar mi solicitud<Icon name="arrow"/></button><p className="form-footnote"><Icon name="shield"/>Podrá revisar el mensaje antes de abrir WhatsApp. La solicitud se envía cuando usted la confirma allí.</p>
  </form><noscript><p>Puede coordinar su solicitud directamente con nuestro equipo.</p><a className="button" href={site.whatsapp} target="_blank" rel="noopener noreferrer">Continuar en WhatsApp</a></noscript>
  {prepared ? <section className="prepared-request" aria-labelledby="request-heading"><p className="eyebrow">Paso 2 de 2 · Revise y continúe</p><h3 ref={heading} id="request-heading" tabIndex="-1">Su solicitud está preparada.</h3><p>Revise el mensaje y continúe a WhatsApp para enviarlo a nuestro equipo.</p><pre className="request-preview">{message}</pre><div className="request-actions"><a className="button request-link" href={`${site.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Continuar en WhatsApp<Icon name="whatsapp"/></a><button className="text-button" type="button" onClick={() => { setPrepared(false); form.current.elements.namedItem('nombre')?.focus(); }}>Editar datos</button></div><p className="form-footnote" role="status">El mensaje aún no se ha enviado.</p></section> : null}</>;
}
