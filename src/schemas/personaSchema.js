import * as Yup from 'yup';

export const alumnoSchema = Yup.object().shape({
  dni: Yup.number()
    .typeError('El DNI debe ser numérico.')
    .integer('El DNI debe ser numérico.')
    .min(1000000, 'El DNI debe tener al menos 7 dígitos.')
    .max(99999999, 'El DNI debe tener máximo 8 dígitos.')
    .required('El DNI es obligatorio.'),

  nombre: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(50, 'El nombre no puede superar los 50 caracteres.')
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'El nombre solo puede contener letras y espacios')
    .required('El nombre no puede estar vacío.'),

  apellido: Yup.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres.')
    .max(50, 'El apellido no puede superar los 50 caracteres.')
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'El apellido solo puede contener letras y espacios')
    .required('El apellido no puede estar vacío.'),

  telefono: Yup.string()
    .matches(/^[\d\s\-+()]*$/, 'El teléfono contiene caracteres no válidos.')
    .min(7, 'El teléfono debe tener al menos 7 caracteres.')
    .max(20, 'El teléfono no puede superar los 20 caracteres.')
    .required('El teléfono no puede estar vacío.'),

  direccion: Yup.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres.')
    .max(100, 'La dirección no puede superar los 100 caracteres.')
    .matches(/^[^<>]*$/, 'La dirección no puede contener < o >')
    .required('La dirección no puede estar vacía.'),

  email: Yup.string()
    .email('El email debe ser válido.')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'El email debe ser válido.')
    .max(254, 'El email no puede superar los 254 caracteres.')
    .required('El email no puede estar vacío.'),

  tipo: Yup.string()
    .oneOf(['alumno', 'docente', 'administrativo'], 'El tipo no es válido.')
    .required('El tipo es obligatorio.')
    .default('alumno'),

  cursoId: Yup.number()
    .typeError('El cursoId debe ser numérico.')
    .integer('El cursoId debe ser numérico.')
    .required('El cursoId es obligatorio para alumnos.'),
});
