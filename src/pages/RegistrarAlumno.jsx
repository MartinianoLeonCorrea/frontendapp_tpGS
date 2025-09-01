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
        // Podrías manejar el error aquí (ej. mostrar un mensaje al usuario)
      }
    };

    fetchCursos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const handleRegistro = async (datos) => {
    const alumno = { ...datos, tipo: 'alumno' };
    try {
      const res = await fetch('/api/personas/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumno),
      });
      const result = await res.json();
      if (res.ok) {
        alert('Alumno registrado correctamente');
      } else {
        alert(result.error || 'Error al registrar alumno');
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
    />
  );
}

export default RegistrarAlumno;
