// src/pages/docente/examen/NuevoExamenPage.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function NuevoExamenPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const cantidadAlumnos = state?.cantidadAlumnos || 0; // Obtener cantidad de alumnos desde el estado

  const [formData, setFormData] = useState({
    fecha_examen: '',
    temas: '',
    copias: 1,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'copias' ? Math.max(1, parseInt(value, 10)) : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha

    if (!formData.fecha_examen) {
      newErrors.fecha_examen = 'La fecha es obligatoria';
    } else {
      const examenDate = new Date(formData.fecha_examen);
      if (examenDate <= today) {
        newErrors.fecha_examen =
          'La fecha debe ser posterior a la fecha actual';
      }
    }

    if (!formData.temas.trim()) {
      newErrors.temas = 'Agregar temas es obligatorio';
    }

    if (formData.copias < 1) {
      newErrors.copias = 'Las copias deben ser al menos 1';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('/api/examenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, dictadoId }),
      });

      if (response.ok) {
        alert('Examen creado exitosamente');
        navigate('/docente/dictado', { state: { dictadoId } });
      } else {
        const result = await response.json();
        alert(
          `Error al crear el examen: ${result.message || 'Error desconocido'}`
        );
      }
    } catch (error) {
      console.error('Error al crear el examen:', error);
      alert(`Error de conexión: ${error.message}`);
    }
  };

  return (
    <div className="nuevo-examen-page">
      <h2>Crear Nuevo Examen</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fecha_examen">Fecha del Examen:</label>
          <input
            type="date"
            id="fecha_examen"
            name="fecha_examen"
            value={formData.fecha_examen}
            onChange={handleChange}
          />
          {errors.fecha_examen && (
            <p className="error-message">{errors.fecha_examen}</p>
          )}
        </div>

        <div className="nuevo-examen-temas">
          <label htmlFor="temas">Temas:</label>
          <textarea
            id="temas"
            name="temas"
            value={formData.temas}
            onChange={handleChange}
          />
          {errors.temas && <p className="error-message">{errors.temas}</p>}
        </div>

        <div>
          <label htmlFor="copias">Cantidad de Copias:</label>
          <input
            type="number"
            id="copias"
            name="copias"
            value={formData.copias}
            onChange={handleChange}
            min="1"
          />
          {errors.copias && <p className="error-message">{errors.copias}</p>}
          <p>Cantidad actual de alumnos del curso: {cantidadAlumnos}</p>
        </div>

        <button type="submit">Crear Examen</button>
      </form>
    </div>
  );
}

export default NuevoExamenPage;
