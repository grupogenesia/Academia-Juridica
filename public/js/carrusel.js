// Carrusel de la portada (página principal): cambia de diapositiva cada 5 segundos.
// Se pausa al pasar el mouse o al usar el teclado, y se puede deslizar con el dedo.
(function () {
  const carrusel = document.querySelector('.carrusel');
  if (!carrusel) return;
  const diapositivas = carrusel.querySelectorAll('.diapositiva');
  const puntos = carrusel.querySelectorAll('.carrusel-punto');
  const INTERVALO = 5000;   // milisegundos: 5000 = 5 segundos
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let actual = 0;
  let temporizador = null;

  function mostrar(n) {
    actual = (n + diapositivas.length) % diapositivas.length;
    diapositivas.forEach(function (d, i) {
      const activa = i === actual;
      d.classList.toggle('activa', activa);
      // Las diapositivas ocultas no se leen ni se pueden tocar con el teclado
      if (activa) { d.removeAttribute('aria-hidden'); d.inert = false; }
      else { d.setAttribute('aria-hidden', 'true'); d.inert = true; }
    });
    puntos.forEach(function (p, i) { p.setAttribute('aria-current', i === actual ? 'true' : 'false'); });
  }

  function iniciar() {
    if (sinMovimiento) return;            // quien pidió menos movimiento: no cambia solo
    detener();
    temporizador = setInterval(function () { mostrar(actual + 1); }, INTERVALO);
  }
  function detener() { clearInterval(temporizador); }

  carrusel.querySelector('.anterior').addEventListener('click', function () { mostrar(actual - 1); iniciar(); });
  carrusel.querySelector('.siguiente').addEventListener('click', function () { mostrar(actual + 1); iniciar(); });
  puntos.forEach(function (p, i) { p.addEventListener('click', function () { mostrar(i); iniciar(); }); });

  // Pausa mientras el mouse está encima o el teclado está dentro del carrusel
  carrusel.addEventListener('mouseenter', detener);
  carrusel.addEventListener('mouseleave', iniciar);
  carrusel.addEventListener('focusin', detener);
  carrusel.addEventListener('focusout', iniciar);

  // Deslizar con el dedo en el celular
  let inicioX = null;
  carrusel.addEventListener('touchstart', function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
  carrusel.addEventListener('touchend', function (e) {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) { mostrar(actual + (dx < 0 ? 1 : -1)); iniciar(); }
    inicioX = null;
  });

  mostrar(0);
  iniciar();
})();
