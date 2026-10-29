// =====================================================================
// SERVIDOR DEL SITIO (Cloudflare Worker)
// - Las páginas (HTML, CSS, imágenes) las sirve Cloudflare desde /public.
// - Este código solo atiende /api/consulta: recibe el formulario de
//   "Habla con un Abogado y Notario" y lo envía por correo.
//
// Configuración (en wrangler.jsonc):
//   send_email → CORREO: el correo verificado que recibe las consultas.
// Opcional (en el panel de Cloudflare, como "secreto"):
//   TURNSTILE_SECRET → si existe, se exige la verificación anti-robots.
// =====================================================================
import { EmailMessage } from 'cloudflare:email';

const CORREO_DESTINO = 'grupogenesia@gmail.com';
const AREAS = ['Civil', 'Penal', 'Familiar', 'Notarial', 'Migratorio', 'Mercantil', 'Administrativo', 'Laboral', 'No estoy seguro'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/consulta') {
      if (request.method !== 'POST') return respuesta({ ok: false, error: 'Método no permitido.' }, 405);
      return recibirConsulta(request, env, url);
    }
    // Cualquier otra dirección: la página correspondiente (o "no encontrada")
    return env.ASSETS.fetch(request);
  }
};

async function recibirConsulta(request, env, url) {
  // 1. Leer los datos (máximo 20 KB, para evitar abusos)
  if (Number(request.headers.get('content-length') || 0) > 20000) {
    return respuesta({ ok: false, error: 'El mensaje es demasiado largo.' }, 413);
  }
  let datos;
  try { datos = await request.json(); } catch { return respuesta({ ok: false, error: 'Datos no válidos.' }, 400); }

  // 2. Trampa para robots: el campo "sitio_web" está oculto; una persona nunca lo llena.
  //    También se descartan envíos hechos en menos de 3 segundos.
  const segundos = (Date.now() - Number(datos.inicio || 0)) / 1000;
  if (datos.sitio_web || segundos < 3) return respuesta({ ok: true });   // se ignora en silencio

  // 3. Verificación anti-robots de Cloudflare (solo si está configurada)
  if (env.TURNSTILE_SECRET) {
    const valido = await verificarTurnstile(datos.turnstile, env.TURNSTILE_SECRET, request.headers.get('CF-Connecting-IP'));
    if (!valido) return respuesta({ ok: false, error: 'No pudimos verificar que eres una persona. Recarga la página e intenta de nuevo.' }, 400);
  }

  // 4. Revisar los campos
  const limpio = (v, max) => String(v || '').trim().slice(0, max);
  const c = {
    nombre: limpio(datos.nombre, 120),
    telefono: limpio(datos.telefono, 40),
    correo: limpio(datos.correo, 160),
    ubicacion: limpio(datos.ubicacion, 120),
    area: limpio(datos.area, 40),
    caso: limpio(datos.caso, 4000)
  };
  const faltan = [];
  if (!c.nombre) faltan.push('nombre');
  if (!/^[+\d\s()-]{8,}$/.test(c.telefono)) faltan.push('teléfono');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo)) faltan.push('correo');
  if (!AREAS.includes(c.area)) faltan.push('área del derecho');
  if (c.caso.length < 10) faltan.push('descripción del caso');
  if (datos.acepta !== true) faltan.push('autorización de datos');
  if (faltan.length) return respuesta({ ok: false, error: 'Revisa estos datos: ' + faltan.join(', ') + '.' }, 400);

  // 5. Armar y enviar el correo
  const dominio = url.hostname.replace(/^www\./, '');
  const remitente = env.CORREO_REMITENTE || 'formulario@' + dominio;
  const fecha = new Intl.DateTimeFormat('es-GT', { timeZone: 'America/Guatemala', dateStyle: 'full', timeStyle: 'short' }).format(new Date());
  const asunto = `Nueva consulta: ${c.area} — ${c.nombre}`;
  const cuerpo = [
    'Nueva solicitud de consulta gratuita desde la página web.',
    '',
    `Nombre:     ${c.nombre}`,
    `Teléfono:   ${c.telefono}`,
    `Correo:     ${c.correo}`,
    `Ubicación:  ${c.ubicacion || '(no indicó)'}`,
    `Área:       ${c.area}`,
    '',
    'Caso:',
    c.caso,
    '',
    '—',
    `Recibido: ${fecha} (hora de Guatemala)`,
    'Para responder, contesta este correo: la respuesta le llega directo al cliente.'
  ].join('\r\n');

  try {
    const mensaje = new EmailMessage(remitente, CORREO_DESTINO, armarCorreo({
      de: remitente, para: CORREO_DESTINO, responderA: c.correo, asunto, cuerpo, dominio
    }));
    await env.CORREO.send(mensaje);
  } catch (error) {
    console.error('No se pudo enviar el correo:', error && error.message);
    return respuesta({ ok: false, error: 'No pudimos enviar tu consulta en este momento.' }, 502);
  }
  return respuesta({ ok: true });
}

async function verificarTurnstile(token, secreto, ip) {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secreto);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    return (await r.json()).success === true;
  } catch { return false; }
}

// Arma un correo de texto en formato MIME, con tildes y eñes bien codificadas
function armarCorreo({ de, para, responderA, asunto, cuerpo, dominio }) {
  const sinSaltos = v => String(v).replace(/[\r\n]+/g, ' ');     // evita que se inyecten encabezados
  const base64 = texto => {
    const bytes = new TextEncoder().encode(texto);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  return [
    `From: "Formulario Grupo Genesia" <${de}>`,
    `To: ${para}`,
    `Reply-To: ${sinSaltos(responderA)}`,
    `Subject: =?UTF-8?B?${base64(sinSaltos(asunto))}?=`,
    `Message-ID: <${crypto.randomUUID()}@${dominio}>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64(cuerpo).replace(/.{1,76}/g, '$&\r\n')
  ].join('\r\n');
}

function respuesta(objeto, estado = 200) {
  return new Response(JSON.stringify(objeto), {
    status: estado,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
