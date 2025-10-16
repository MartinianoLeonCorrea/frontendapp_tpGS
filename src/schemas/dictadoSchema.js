import * as Yup from 'yup';

// Schema para crear un dictado
export const createDictadoSchema = Yup.object().shape({
  anio: Yup.number()
    .typeError('El año debe ser un número')
    .integer('El año debe ser un número entero')
    .min(2000, 'El año debe ser mayor o igual a 2000')
    .max(2100, 'El año debe ser menor o igual a 2100')
    .required('El año es obligatorio'),

  dias_cursado: Yup.string()
    .min(3, 'Los días de cursado deben tener al menos 3 caracteres')
    .max(100, 'Los días de cursado no pueden exceder los 100 caracteres')
    .trim()
    .required('Los días de cursado son obligatorios'),

  cursoId: Yup.number()
    .typeError('El ID del curso debe ser un número')
    .integer('El ID del curso debe ser un número entero')
    .min(1, 'El ID del curso debe ser mayor a 0')
    .required('El ID del curso es obligatorio'),

  materiaId: Yup.number()
    .typeError('El ID de la materia debe ser un número')
    .integer('El ID de la materia debe ser un número entero')
    .min(1, 'El ID de la materia debe ser mayor a 0')
    .required('El ID de la materia es obligatorio'),

  docenteId: Yup.number()
    .typeError('El ID del docente debe ser un número')
    .integer('El ID del docente debe ser un número entero')
    .min(1, 'El ID del docente debe ser mayor a 0')
    .required('El ID del docente es obligatorio'),

  // Arrays opcionales para crear con relaciones múltiples
  docentesIds: Yup.array()
    .of(Yup.number().integer().min(1))
    .min(1, 'Debe proporcionar al menos un ID de docente')
    .optional(),

  materiasIds: Yup.array()
    .of(Yup.number().integer().min(1))
    .min(1, 'Debe proporcionar al menos un ID de materia')
    .optional(),
});

// Schema para actualizar un dictado
export const updateDictadoSchema = Yup.object().shape({
  anio: Yup.number()
    .typeError('El año debe ser un número')
    .integer('El año debe ser un número entero')
    .min(2000, 'El año debe ser mayor o igual a 2000')
    .max(2100, 'El año debe ser menor o igual a 2100')
    .optional(),

  dias_cursado: Yup.string()
    .min(3, 'Los días de cursado deben tener al menos 3 caracteres')
    .max(100, 'Los días de cursado no pueden exceder los 100 caracteres')
    .trim()
    .optional(),

  cursoId: Yup.number()
    .typeError('El ID del curso debe ser un número')
    .integer('El ID del curso debe ser un número entero')
    .min(1, 'El ID del curso debe ser mayor a 0')
    .optional(),

  materiaId: Yup.number()
    .typeError('El ID de la materia debe ser un número')
    .integer('El ID de la materia debe ser un número entero')
    .min(1, 'El ID de la materia debe ser mayor a 0')
    .optional(),

  docenteId: Yup.number()
    .typeError('El ID del docente debe ser un número')
    .integer('El ID del docente debe ser un número entero')
    .min(1, 'El ID del docente debe ser mayor a 0')
    .optional(),

  // Arrays opcionales para actualizar relaciones
  docentesIds: Yup.array()
    .of(Yup.number().integer().min(1))
    .min(1, 'Debe proporcionar al menos un ID de docente')
    .optional(),

  materiasIds: Yup.array()
    .of(Yup.number().integer().min(1))
    .min(1, 'Debe proporcionar al menos un ID de materia')
    .optional(),
}).test(
  'at-least-one',
  'Debe proporcionar al menos un campo para actualizar',
  (value) => Object.keys(value).length > 0
);

// Schema para validar ID de dictado en params
export const dictadoIdParamSchema = Yup.object().shape({
  id: Yup.number()
    .typeError('El ID debe ser un número')
    .integer('El ID debe ser un número entero')
    .min(1, 'El ID debe ser mayor a 0')
    .required('El ID es obligatorio'),
});

// Schema para validar ID de curso en params
export const dictadoCursoIdParamSchema = Yup.object().shape({
  cursoId: Yup.number()
    .typeError('El ID del curso debe ser un número')
    .integer('El ID del curso debe ser un número entero')
    .min(1, 'El ID del curso debe ser mayor a 0')
    .required('El ID del curso es obligatorio'),
});

// Schema para validar ID de persona en params
export const dictadoPersonaIdParamSchema = Yup.object().shape({
  personaId: Yup.number()
    .typeError('El ID de la persona debe ser un número')
    .integer('El ID de la persona debe ser un número entero')
    .min(1, 'El ID de la persona debe ser mayor a 0')
    .required('El ID de la persona es obligatorio'),
});

// Schema para validar ID de materia en params
export const dictadoMateriaIdParamSchema = Yup.object().shape({
  materiaId: Yup.number()
    .typeError('El ID de la materia debe ser un número')
    .integer('El ID de la materia debe ser un número entero')
    .min(1, 'El ID de la materia debe ser mayor a 0')
    .required('El ID de la materia es obligatorio'),
});

// Schema para agregar/remover docente de dictado
export const dictadoDocenteParamSchema = Yup.object().shape({
  dictadoId: Yup.number()
    .typeError('El ID del dictado debe ser un número')
    .integer('El ID del dictado debe ser un número entero')
    .min(1, 'El ID del dictado debe ser mayor a 0')
    .required('El ID del dictado es obligatorio'),

  docenteId: Yup.number()
    .typeError('El ID del docente debe ser un número')
    .integer('El ID del docente debe ser un número entero')
    .min(1, 'El ID del docente debe ser mayor a 0')
    .required('El ID del docente es obligatorio'),
});

// Schema para agregar/remover materia de dictado
export const dictadoMateriaParamSchema = Yup.object().shape({
  dictadoId: Yup.number()
    .typeError('El ID del dictado debe ser un número')
    .integer('El ID del dictado debe ser un número entero')
    .min(1, 'El ID del dictado debe ser mayor a 0')
    .required('El ID del dictado es obligatorio'),

  materiaId: Yup.number()
    .typeError('El ID de la materia debe ser un número')
    .integer('El ID de la materia debe ser un número entero')
    .min(1, 'El ID de la materia debe ser mayor a 0')
    .required('El ID de la materia es obligatorio'),
});

// Schema para query con cursoId y materiaId
export const dictadoQueryCursoMateriaSchema = Yup.object().shape({
  cursoId: Yup.number()
    .typeError('El ID del curso debe ser un número')
    .integer('El ID del curso debe ser un número entero')
    .min(1, 'El ID del curso debe ser mayor a 0')
    .required('El ID del curso es obligatorio'),

  materiaId: Yup.number()
    .typeError('El ID de la materia debe ser un número')
    .integer('El ID de la materia debe ser un número entero')
    .min(1, 'El ID de la materia debe ser mayor a 0')
    .required('El ID de la materia es obligatorio'),
});