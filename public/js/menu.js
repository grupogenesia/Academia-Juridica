// Abre y cierra el menú en el celular (lo usan todas las páginas)
const boton = document.querySelector('.boton-menu');
const menu = document.querySelector('.menu');

boton.addEventListener('click', function () {
  const abierto = menu.classList.toggle('abierto');   // pone o quita la clase "abierto"
  boton.setAttribute('aria-expanded', abierto);
  boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});
