console.log('Este archivo va a ser interpretado por el navegador');

//Obtener elementos del HTML y guardarlos en constantes
const getBtn = document.querySelector('#get-task');
const createBtn = document.querySelector('#create-task');
const input = document.querySelector('#task-name');

//Nutrir de funcionalidad los botones
getBtn.addEventListener('click', function () {
  console.log('Get tareas');
  fetch('http://localhost:4000/api/tasks');
});

createBtn.addEventListener('click', function () {
  console.log('Crear tarea');
  console.log({ input });
  fetch('http://localhost:4000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value }),
  });
});
