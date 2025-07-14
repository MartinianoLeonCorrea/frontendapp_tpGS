console.log('Este archivo va a ser interpretado por el navegador');

//Obtener elementos del HTML y guardarlos en constantes
const button = document.querySelector('button');
console.log({ button });

//Nutrir de funcionalidad los botones
button.addEventListener('click', () => {
  console.log('CLick');
  fetch('http://localhost:4000/users');
});
