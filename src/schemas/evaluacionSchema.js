import * as Yup from 'yup';

// Schema para evaluación
export const evaluacionSchema = Yup.object().shape({
  nota: Yup.number()
    .typeError('La nota debe ser un número.')
    .min(0, 'La nota debe ser un número positivo.')
    .max(10, 'La nota no puede superar 10.')
    .nullable()
    .optional(),

  observaciones: Yup.string()
    .min(0, 'Las observaciones deben tener al menos 0 caracteres.')
    .max(500, 'Las observaciones no pueden superar los 500 caracteres.')
    .nullable()
    .optional(),

  alumnoId: Yup.number()
    .typeError('El ID del alumno debe ser un número entero.')
    .integer('El ID del alumno debe ser un número entero.')
    .required('El ID del alumno es obligatorio.'),

  examenId: Yup.number()
    .typeError('El ID del examen debe ser un número entero.')
    .integer('El ID del examen debe ser un número entero.')
    .required('El ID del examen es obligatorio.'),
});
