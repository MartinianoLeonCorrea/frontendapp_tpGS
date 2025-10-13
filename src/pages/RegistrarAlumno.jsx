import { useEffect, useState } from 'react';
import Form from '../components/Form.jsx';

const camposBase = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
  { name: 'apellido', label: 'Apellido', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'dni', label: 'DNI', type: 'text', required: true },
  { name: 'telefono', label: 'Teléfono', type: 'text', required: true },
  { name: 'direccion', label: 'Dirección', type: 'text', required: true },
];

function RegistrarAlumno() {
  const [campos, setCampos] = useState(camposBase);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch('/api/cursos');
        const data = await res.json();
        const cursosOptions = (data.data || []).map((curso) => ({
          value: curso.id,
          label: `${curso.nro_letra} - ${curso.turno}`, //
        }));

        setCampos([
          ...camposBase,
          {
            name: 'cursoId',
            label: 'Curso',
            type: 'select',
            required: true,
            options: cursosOptions,
          },
        ]);
      } catch (err) {
        console.error('Error al cargar cursos:', err);
      }
    };

    fetchCursos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const handleRegistro = async (datos) => {
    const alumno = { ...datos, tipo: 'alumno' };

    // Validaciones
    const errores = {};
    if (!/^[\d]{7,9}$/.test(alumno.dni)) {
      errores.dni = 'El DNI debe ser un número entre 1,000,000 y 999,999,999';
    }
    if (!alumno.email || alumno.email.length < 6) {
      errores.email = 'El email debe tener al menos 6 caracteres';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(alumno.email)) {
      errores.email = 'El email debe tener un formato válido';
    }
    if (!/^[\d\s\-+()]*$/.test(alumno.telefono)) {
      errores.telefono = 'El teléfono contiene caracteres no válidos';
    }
    if (!alumno.direccion || alumno.direccion.length < 5) {
      errores.direccion = 'La dirección debe tener al menos 5 caracteres';
    }

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const res = await fetch('/api/personas/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumno),
      });
      const result = await res.json();
      if (res.ok) {
        alert('Alumno registrado correctamente');
        setErrores({}); // Limpiar errores

      } else {
        if (result.errors) {
          const backendErrors = {};
          result.errors.forEach(err => {
            backendErrors[err.field] = err.message;
          });
          setErrores(backendErrors);
        } else {
          alert(result.message || 'Error al registrar alumno');
        }
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    }
  };

  return (
    <Form
      campos={campos}
      titulo="Nuevo Alumno"
      onSubmit={handleRegistro}
      textoBoton="Registrar"
      errores={errores} // Pasar errores al componente Form
    />
  );
}

export default RegistrarAlumno;
