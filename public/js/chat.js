// =====================================================================
// ASISTENTE DE CHAT DE GRUPO GENESIA
// Un cuadrito flotante con respuestas preparadas. "Hablar con una persona"
// abre WhatsApp con el número del área. Lo usan todas las páginas.
//
// Para cambiar una respuesta: busca su texto en RESPUESTAS y edítalo.
// Para agregar un tema: copia un bloque de RESPUESTAS y agrégale un botón.
// =====================================================================
(function () {
  // ---------- Números de WhatsApp de cada área ----------
  const WHATSAPP = {
    academia: '50237964043',
    general: '50241077030'      // Abogados, Visas y consultas generales
  };

  // ---------- Horario de atención (hora de Guatemala) ----------
  // Días: 0 = domingo, 1 = lunes ... 6 = sábado. [abre, cierra] en horas.
  const HORARIO = { 1: [8, 22], 2: [8, 22], 3: [8, 22], 4: [8, 22], 5: [8, 22], 6: [8, 13] };
  const HORARIO_TEXTO = 'Lunes a viernes de 8:00 a 22:00 · Sábado de 8:00 a 13:00 · Domingo cerrado';

  // ---------- Respuestas ----------
  // Cada respuesta tiene: texto, opciones (botones) y, si aplica, un enlace a la página.
  // "area" decide a qué WhatsApp va el botón "Hablar con una persona".
  const RESPUESTAS = {
    inicio: {
      texto: '¡Hola! 👋 Soy el asistente de Grupo Genesia. ¿En qué te ayudamos?',
      opciones: ['academia', 'visas', 'abogados', 'ubicacion', 'persona']
    },

    // ----- Academia Jurídica -----
    academia: {
      boton: '🎓 Academia Jurídica',
      area: 'academia',
      texto: 'Preparamos para la Fase Privada y la Fase Pública, en modalidad presencial o virtual. ¿Qué quieres saber?',
      opciones: ['academia_fechas', 'academia_precios', 'academia_cursos', 'academia_inscripcion', 'persona', 'inicio']
    },
    academia_fechas: {
      boton: 'Fechas y horarios',
      area: 'academia',
      texto: 'El curso va de <b>enero a junio de 2027</b>.<br><br><b>Presencial:</b> sábados de 8:00 a 17:00 (almuerzo de 13:00 a 14:00) en San Jerónimo, Baja Verapaz. Domingo a requerimiento.<br><br><b>Virtual:</b> martes y jueves de 18:30 a 21:00 por Google Meet.',
      opciones: ['academia_precios', 'academia_inscripcion', 'persona', 'academia']
    },
    academia_precios: {
      boton: 'Planes y precios',
      area: 'academia',
      texto: '<b>Presencial:</b> Q 1,800 pago único o Q 350 mensuales.<br><b>Virtual:</b> Q 1,300 pago único o Q 300 mensuales.<br><br>Puedes pagar por depósito o transferencia a la cuenta oficial.',
      enlace: ['Ver planes y costos', '/academia/#planes'],
      opciones: ['academia_inscripcion', 'persona', 'academia']
    },
    academia_cursos: {
      boton: 'Materias de cada fase',
      area: 'academia',
      texto: '<b>Fase Privada:</b> Derecho Constitucional, Mercantil, Notarial, Civil y Procesal Civil, y leyes especiales.<br><br><b>Fase Pública:</b> Derecho Constitucional, Administrativo, Penal, Laboral y leyes especiales.',
      enlace: ['Ver los cursos', '/academia/#cursos'],
      opciones: ['academia_precios', 'persona', 'academia']
    },
    academia_inscripcion: {
      boton: '¿Cómo me inscribo?',
      area: 'academia',
      texto: 'Necesitas tu <b>DPI escaneado</b> y el <b>comprobante de pago</b>. Puedes llenar el formulario de inscripción en la página o escribirnos por WhatsApp.',
      enlace: ['Ir al formulario', '/academia/#inscripcion'],
      opciones: ['persona', 'academia']
    },

    // ----- Visas y pasaportes -----
    visas: {
      boton: '🛂 Visas y pasaportes',
      area: 'general',
      texto: '¿Qué trámite te interesa?',
      opciones: ['visa_americana', 'visa_mexicana', 'pasaporte', 'residencias', 'persona', 'inicio']
    },
    visa_americana: {
      boton: 'Visa americana',
      area: 'general',
      texto: 'Te acompañamos en 3 fases: preparación de tu expediente (DS-160), programación de tu cita en la Embajada y preparación para tu entrevista.<br><br><b>Inversión:</b> Q 3,000 en 3 pagos de Q 1,000, o <b>Q 2,800</b> al contado.<br><br><b>Requisitos:</b> pasaporte vigente, DPI, formulario DS-160 y fotografía digital.',
      enlace: ['Ver visa americana', '/visas/americana/'],
      opciones: ['persona', 'visas']
    },
    visa_mexicana: {
      boton: 'Visa mexicana',
      area: 'general',
      texto: 'Visa de visitante para <b>turismo, tránsito o negocios</b>, por hasta 180 días.<br><br><b>Requisitos básicos:</b> cita en MiConsulado, pasaporte vigente, fotografía, solicitud llenada y comprobar solvencia económica.<br><br><b>Nuestro acompañamiento:</b> Q 700.',
      enlace: ['Ver visa mexicana', '/visas/mexicana/'],
      opciones: ['persona', 'visas']
    },
    pasaporte: {
      boton: 'Pasaporte guatemalteco',
      area: 'general',
      texto: 'Te ayudamos con tu trámite de pasaporte guatemalteco. Escríbenos y te explicamos los requisitos, costos y tiempos según tu caso.',
      enlace: ['Ver pasaporte', '/visas/pasaporte/'],
      opciones: ['persona', 'visas']
    },
    residencias: {
      boton: 'Residencias en Guatemala',
      area: 'general',
      texto: 'Te asesoramos en tu trámite de residencia temporal o permanente en Guatemala. Escríbenos y te explicamos los requisitos, costos y tiempos según tu caso.',
      enlace: ['Ver residencias', '/visas/residencias/'],
      opciones: ['persona', 'visas']
    },

    // ----- Abogados y Notarios -----
    abogados: {
      boton: '⚖️ Abogados y notarios',
      area: 'general',
      texto: 'Atendemos derecho <b>civil, penal, familiar, notarial, migratorio, mercantil, administrativo y laboral</b>.',
      enlace: ['Ver todos los servicios', '/abogados/#servicios'],
      opciones: ['abogados_consulta', 'abogados_proceso', 'persona', 'inicio']
    },
    abogados_consulta: {
      boton: 'Consulta gratuita',
      area: 'general',
      texto: 'La <b>primera consulta es gratuita</b>. Llena el formulario con tu caso y un abogado de nuestro equipo te contactará.',
      enlace: ['Solicitar consulta', '/abogados/consulta/'],
      opciones: ['persona', 'abogados']
    },
    abogados_proceso: {
      boton: '¿Cómo trabajan mi caso?',
      area: 'general',
      texto: '1. Primera consulta y evaluación del caso.<br>2. Recolección de documentos y pruebas.<br>3. Estrategia legal y presentación de la demanda o defensa.<br>4. Seguimiento y representación legal.<br>5. Resolución y cierre del caso.',
      opciones: ['persona', 'abogados']
    },

    // ----- Ubicación y horario -----
    ubicacion: {
      boton: '📍 Ubicación y horario',
      area: 'general',
      texto: '<b>Oficinas:</b><br>• San Jerónimo, Baja Verapaz, a 2 cuadras de Panadería Doña Lucía.<br>• Edificio Santo Domingo, 11 calle 10-56, zona 1, Ciudad de Guatemala.<br><br><b>Horario:</b> lunes a viernes de 8:00 a 22:00, sábado de 8:00 a 13:00. Domingo cerrado.<br><br><b>WhatsApp:</b> +502 4107 7030 (Abogados y Visas) · +502 3796 4043 (Academia).',
      opciones: ['persona', 'inicio']
    },

    // ----- Hablar con una persona (abre WhatsApp) -----
    persona: { boton: '💬 Hablar con una persona', especial: 'persona' },
    persona_academia: { boton: '🎓 Academia Jurídica', especial: 'whatsapp', area: 'academia', tema: 'la Academia Jurídica' },
    persona_general: { boton: '🛂⚖️ Visas o Abogados', especial: 'whatsapp', area: 'general', tema: 'Visas o Abogados' }
  };

  // ---------- Íconos ----------
  const ICONO_CHAT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4v-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M8 10h8M8 13h5"/></svg>';
  const ICONO_CERRAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const ICONO_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z"/></svg>';

  // ---------- ¿Estamos en horario? (hora de Guatemala) ----------
  function enHorario() {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Guatemala', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    const dato = t => partes.find(p => p.type === t).value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dato('weekday'));
    const hora = (+dato('hour') % 24) + (+dato('minute')) / 60;
    const rango = HORARIO[dia];
    return !!rango && hora >= rango[0] && hora < rango[1];
  }

  // En las páginas de la Academia, "Hablar con una persona" va directo al número de la Academia
  const areaDePagina = location.pathname.startsWith('/academia') ? 'academia' : null;

  // ---------- Construir el chat en la página ----------
  const raiz = document.createElement('div');
  raiz.className = 'chat';
  raiz.innerHTML = `
    <div class="chat-aviso" hidden>
      <button class="chat-aviso-cerrar" type="button" aria-label="Cerrar aviso">${ICONO_CERRAR}</button>
      <p>¿Tienes dudas? <b>Pregúntanos aquí</b> 👋</p>
    </div>
    <section class="chat-panel" id="chat-panel" role="dialog" aria-label="Asistente de Grupo Genesia" hidden>
      <header class="chat-cabecera">
        <img src="/img/logo.png" alt="" width="746" height="505">
        <div>
          <p class="chat-nombre">Asistente Genesia</p>
          <p class="chat-estado"></p>
        </div>
        <button class="chat-cerrar" type="button" aria-label="Cerrar chat">${ICONO_CERRAR}</button>
      </header>
      <div class="chat-mensajes" aria-live="polite"></div>
      <p class="chat-legal">Información general. No constituye asesoría legal.</p>
    </section>
    <button class="chat-boton" type="button" aria-controls="chat-panel" aria-expanded="false" aria-label="Abrir chat">
      <span class="chat-icono-abrir">${ICONO_CHAT}</span>
      <span class="chat-icono-cerrar">${ICONO_CERRAR}</span>
    </button>`;
  document.body.appendChild(raiz);

  const boton = raiz.querySelector('.chat-boton');
  const panel = raiz.querySelector('.chat-panel');
  const mensajes = raiz.querySelector('.chat-mensajes');
  const aviso = raiz.querySelector('.chat-aviso');
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let iniciado = false;

  function actualizarEstado() {
    const abierto = enHorario();
    raiz.querySelector('.chat-estado').innerHTML = abierto
      ? '<span class="punto en-linea"></span>En horario de atención'
      : '<span class="punto"></span>Fuera de horario';
  }

  // Agrega un mensaje del asistente (con una pequeña pausa de "escribiendo...")
  function mensajeBot(html, alTerminar) {
    const escribiendo = document.createElement('div');
    escribiendo.className = 'chat-msg bot escribiendo';
    escribiendo.innerHTML = '<span></span><span></span><span></span>';
    mensajes.appendChild(escribiendo);
    bajar();
    setTimeout(function () {
      escribiendo.remove();
      const m = document.createElement('div');
      m.className = 'chat-msg bot';
      m.innerHTML = html;
      mensajes.appendChild(m);
      if (alTerminar) alTerminar();
      bajar();
    }, sinMovimiento ? 0 : 550);
  }

  function mensajeCliente(texto) {
    const m = document.createElement('div');
    m.className = 'chat-msg cliente';
    m.textContent = texto.replace(/^[^\p{L}¿]+/u, '');   // sin el emoji del inicio
    mensajes.appendChild(m);
    bajar();
  }

  function bajar() { mensajes.scrollTop = mensajes.scrollHeight; }

  // Quita los botones anteriores para que solo se pueda elegir en la última respuesta
  function quitarOpciones() { mensajes.querySelectorAll('.chat-opciones').forEach(o => o.remove()); }

  function mostrarOpciones(claves, area) {
    const caja = document.createElement('div');
    caja.className = 'chat-opciones';
    claves.forEach(function (clave) {
      const r = RESPUESTAS[clave];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat-opcion' + (clave === 'persona' ? ' persona' : '');
      b.textContent = clave === 'inicio' ? '↩ Menú principal' : (r.boton || '');
      if (['academia', 'visas', 'abogados'].includes(clave) && area) b.textContent = '↩ Volver';
      b.addEventListener('click', function () { elegir(clave, area, b.textContent); });
      caja.appendChild(b);
    });
    mensajes.appendChild(caja);
  }

  function enlaceWhatsApp(area, tema) {
    const texto = 'Hola, vengo del chat de la página web. Tengo una consulta sobre ' + tema + '.';
    return 'https://wa.me/' + WHATSAPP[area] + '?text=' + encodeURIComponent(texto);
  }

  function respuestaPersona(area, tema) {
    const fuera = enHorario() ? '' : '<p class="chat-fuera">Ahora estamos fuera de horario. Déjanos tu mensaje y te respondemos en cuanto abramos.<br><small>' + HORARIO_TEXTO + '</small></p>';
    mensajeBot('Te comunico con nuestro equipo por WhatsApp. 👇' + fuera +
      '<a class="chat-wa" href="' + enlaceWhatsApp(area, tema) + '" target="_blank" rel="noopener">' + ICONO_WA + 'Abrir WhatsApp</a>',
      function () { mostrarOpciones(['inicio']); });
  }

  // Qué pasa al tocar un botón
  function elegir(clave, areaActual, textoBoton) {
    quitarOpciones();
    if (textoBoton) mensajeCliente(textoBoton);
    const r = RESPUESTAS[clave];

    if (r.especial === 'persona') {
      const area = areaActual || areaDePagina;
      if (area) return respuestaPersona(area, area === 'academia' ? 'la Academia Jurídica' : 'Visas o Abogados');
      return mensajeBot('¿Sobre qué tema quieres hablar?', function () { mostrarOpciones(['persona_academia', 'persona_general', 'inicio']); });
    }
    if (r.especial === 'whatsapp') return respuestaPersona(r.area, r.tema);

    let html = r.texto;
    if (r.enlace) html += '<a class="chat-enlace" href="' + r.enlace[1] + '">' + r.enlace[0] + ' →</a>';
    mensajeBot(html, function () { mostrarOpciones(r.opciones, r.area); });
  }

  // ---------- Abrir y cerrar ----------
  function abrir() {
    panel.hidden = false;
    aviso.hidden = true;
    boton.setAttribute('aria-expanded', 'true');
    boton.setAttribute('aria-label', 'Cerrar chat');
    raiz.classList.add('abierto');
    actualizarEstado();
    if (!iniciado) { iniciado = true; elegir('inicio'); }
    setTimeout(function () { const b = mensajes.querySelector('.chat-opcion'); (b || panel.querySelector('.chat-cerrar')).focus(); }, sinMovimiento ? 0 : 650);
  }
  function cerrar() {
    panel.hidden = true;
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir chat');
    raiz.classList.remove('abierto');
    boton.focus();
  }
  boton.addEventListener('click', function () { panel.hidden ? abrir() : cerrar(); });
  raiz.querySelector('.chat-cerrar').addEventListener('click', cerrar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) cerrar(); });

  // ---------- Aviso "¿Tienes dudas?" (aparece una vez por visita, a los 5 segundos) ----------
  let yaVisto = false;
  try { yaVisto = sessionStorage.getItem('chat-aviso') === '1'; } catch (e) {}
  if (!yaVisto) {
    setTimeout(function () { if (panel.hidden) aviso.hidden = false; }, 5000);
  }
  function cerrarAviso() { aviso.hidden = true; try { sessionStorage.setItem('chat-aviso', '1'); } catch (e) {} }
  raiz.querySelector('.chat-aviso-cerrar').addEventListener('click', cerrarAviso);
  aviso.querySelector('p').addEventListener('click', function () { cerrarAviso(); abrir(); });
})();
