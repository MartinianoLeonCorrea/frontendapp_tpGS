import * as Yup from 'yup';

export const alumnoSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellido: Yup.string().required('El apellido es obligatorio'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),
  dni: Yup.string()
    .matches(/^\d{7,9}$/, 'El DNI debe tener entre 7 y 9 números')
    .required('El DNI es obligatorio'),
  telefono: Yup.string().matches(
    /^[\d\s\-+()]*$/,
    'El teléfono contiene caracteres no válidos'
  ),
  direccion: Yup.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .required('La dirección es obligatoria'),
  cursoId: Yup.string().required('El curso es obligatorio'),
});
