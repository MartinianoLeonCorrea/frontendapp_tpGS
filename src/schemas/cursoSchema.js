import * as Yup from 'yup';

// Schema para crear un curso
export const createCursoSchema = Yup.object().shape({
  nro_letra: Yup.string()
    .min(1, 'El nro y letra debe tener al menos 1 caracter.')
    .max(3, 'El nro y letra debe tener máximo 3 caracteres.')
    .required('El campo nro_letra es obligatorio.'),

  turno: Yup.string()
    .oneOf(['MAÑANA', 'TARDE', 'NOCHE'], 'El turno debe ser uno de los siguientes: MAÑANA, TARDE, NOCHE.')
    .required('El campo turno es obligatorio.'),
});

// Schema para actualizar un curso
export const updateCursoSchema = Yup.object().shape({
  nro_letra: Yup.string()
    .min(1, 'El nro y letra debe tener al menos 1 caracter.')
    .max(3, 'El nro y letra debe tener máximo 3 caracteres.')
    .optional(),

  turno: Yup.string()
    .oneOf(['MAÑANA', 'TARDE', 'NOCHE'], 'El turno debe ser uno de los siguientes: MAÑANA, TARDE, NOCHE.')
    .optional(),
}).test(
  'at-least-one',
  'Debe proporcionar al menos un campo para actualizar.',
  (value) => Object.keys(value).length > 0
);

// Schema para validar ID en params
export const cursoIdParamSchema = Yup.object().shape({
  id: Yup.number()
    .typeError('El ID debe ser un número.')
    .integer('El ID debe ser un número entero.')
    .positive('El ID debe ser un número positivo.')
    .required('El ID es obligatorio.'),
});