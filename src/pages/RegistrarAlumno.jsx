import { useEffect, useState } from 'react';
import Form from '../components/Form.jsx';
import Notification from '../components/Notification.jsx';
import { alumnoSchema } from '../schemas/personaSchema.js';

const camposBase = [
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'apellido', label: 'Apellido', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'dni', label: 'DNI', type: 'text' },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'direccion', label: 'Dirección', type: 'text' },
];

function RegistrarAlumno() {
  const [campos, setCampos] = useState(camposBase);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch('/api/cursos');
        const data = await res.json();
        const cursosOptions = (data.data || []).map((curso) => ({
          value: curso.id,
          label: `${curso.nro_letra} - ${curso.turno}`,
        }));

        setCampos([
          ...camposBase,
          { name: 'cursoId', label: 'Curso', type: 'select', options: cursosOptions },
        ]);
      } catch (err) {
        console.error('Error al cargar cursos:', err);
        setNotification({ message: 'Error al cargar los cursos', type: 'error' });
      }
    };

    fetchCursos();
  }, []);

  const handleRegistro = async (alumno) => {
    try {
      const res = await fetch('/api/personas/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...alumno, tipo: 'alumno' }),
      });

      const result = await res.json();

      if (res.ok) {
        setNotification({ message: 'Alumno registrado correctamente ✅', type: 'success' });
      } else {
        setNotification({
          message: result.message || 'Error al registrar alumno ❌',
          type: 'error',
        });
      }
    } catch (err) {
      setNotification({
        message: 'Error de conexión: ' + err.message,
        type: 'error',
      });
    }
  };

  return (
    <>
      <Form
        campos={campos}
        titulo="Nuevo Alumno"
        onSubmit={handleRegistro}
        textoBoton="Registrar"
        schema={alumnoSchema} // Schema específico de alumno
      />
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </>
  );
}

export default RegistrarAlumno;
