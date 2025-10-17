import * as Yup from 'yup';

// Schema para examen
export const examenSchema = Yup.object().shape({
  fecha_examen: Yup.date()
    .typeError('La fecha del examen debe ser válida.')
    .required('La fecha del examen es obligatoria.'),

  temas: Yup.string()
    .min(5, 'Los temas deben tener al menos 5 caracteres.')
    .max(800, 'Los temas no pueden superar los 800 caracteres.')
    .matches(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()\s]+$/,
      'Los temas contienen caracteres no permitidos.'
    )
    .required('Los temas no pueden estar vacíos.'),

  copias: Yup.number()
    .typeError('El número de copias debe ser un número entero.')
    .integer('El número de copias debe ser un número entero.')
    .min(1, 'El número de copias debe ser al menos 1.')
    .required('El número de copias es obligatorio.'),

  dictadoId: Yup.number()
    .typeError('El dictadoId debe ser un número entero.')
    .integer('El dictadoId debe ser un número entero.')
    .required('El dictadoId es obligatorio.'),
});
