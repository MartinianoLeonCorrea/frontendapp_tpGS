import * as Yup from 'yup';

// Schema para crear una materia
export const createMateriaSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim()
    .required('El nombre es obligatorio'),

  descripcion: Yup.string()
    .max(1000, 'La descripción no puede exceder los 1000 caracteres')
    .trim()
    .nullable()
    .optional(),
});

// Schema para actualizar una materia
export const updateMateriaSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim()
    .optional(),

  descripcion: Yup.string()
    .max(1000, 'La descripción no puede exceder los 1000 caracteres')
    .trim()
    .nullable()
    .optional(),
}).test(
  'at-least-one',
  'Debe proporcionar al menos un campo para actualizar',
  (value) => Object.keys(value).length > 0
);

// Schema para validar ID en params
export const materiaIdParamSchema = Yup.object().shape({
  id: Yup.number()
    .typeError('El ID debe ser un número')
    .integer('El ID debe ser un número entero')
    .min(1, 'El ID debe ser mayor a 0')
    .required('El ID es obligatorio'),
});

// Schema para query parameters de materia
export const queryMateriaSchema = Yup.object().shape({
  page: Yup.number()
    .typeError('El número de página debe ser un número')
    .integer('El número de página debe ser un número entero')
    .min(1, 'El número de página debe ser al menos 1')
    .default(1)
    .optional(),

  limit: Yup.number()
    .typeError('El límite debe ser un número')
    .integer('El límite debe ser un número entero')
    .min(1, 'El límite debe ser al menos 1')
    .max(100, 'El límite no puede exceder 100')
    .default(10)
    .optional(),

  search: Yup.string()
    .trim()
    .optional(),

  include: Yup.string()
    .oneOf(['relations'], 'El parámetro include solo puede ser: relations')
    .optional(),
});