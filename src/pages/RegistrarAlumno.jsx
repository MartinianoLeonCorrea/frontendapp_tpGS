import { useEffect, useState } from 'react';
import Form from '../components/Form.jsx';
import { alumnoSchema } from '../schemas/personaSchema.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.error('Error al cargar los cursos');
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
      if (!res.ok) throw new Error(result.message || 'Error al registrar alumno ❌');
      toast.success('Alumno registrado correctamente ✅');
      return result;
    } catch (err) {
      toast.error(err.message || 'Ocurrió un error ❌');
      throw err;
    }
  };

  return (
    <>
      <Form
        campos={campos}
        titulo="Nuevo Alumno"
        onSubmit={handleRegistro}
        textoBoton="Registrar"
        schema={alumnoSchema}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default RegistrarAlumno;
