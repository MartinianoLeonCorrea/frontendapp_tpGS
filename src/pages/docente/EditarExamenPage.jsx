import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function EditarExamenPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const examenId = state?.examenId;

  const [formData, setFormData] = useState({
    fecha_examen: '',
    temas: '',
    copias: 1,
    dictadoId: dictadoId,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examenId) {
      alert('No se especificó el examen a editar');
      navigate('/docente/dictado', { state: { dictadoId } });
      return;
    }

    // Cargar datos del examen
    const fetchExamen = async () => {
      try {
        const response = await fetch(`/api/examenes/${examenId}`);
        if (response.ok) {
          const result = await response.json();
          const examen = result.data;

          // Formatear la fecha para el input date
          const fechaExamen = new Date(examen.fecha_examen);
          const fechaFormateada = fechaExamen.toISOString().split('T')[0];

          setFormData({
            fecha_examen: fechaFormateada,
            temas: examen.temas,
            copias: examen.copias,
            dictadoId: examen.dictadoId, // Asegurarse de incluir dictadoId
          });
        } else {
          alert('Error al cargar el examen');
          navigate('/docente/dictado', { state: { dictadoId } });
        }
      } catch (error) {
        console.error('Error al cargar el examen:', error);
        alert('Error de conexión al cargar el examen');
        navigate('/docente/dictado', { state: { dictadoId } });
      } finally {
        setLoading(false);
      }
    };

    fetchExamen();
  }, [examenId, dictadoId, navigate]);

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
    today.setHours(0, 0, 0, 0);

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
      const response = await fetch(`/api/examenes/${examenId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Examen actualizado exitosamente');
        navigate('/docente/dictado', { state: { dictadoId } });
      } else {
        const result = await response.json();
        alert(
          `Error al actualizar el examen: ${
            result.message || 'Error desconocido'
          }`
        );
      }
    } catch (error) {
      console.error('Error al actualizar el examen:', error);
      alert(`Error de conexión: ${error.message}`);
    }
  };

  const handleCancelar = () => {
    navigate('/docente/dictado', { state: { dictadoId } });
  };

  if (loading) {
    return (
      <div className="editar-examen-page">
        <h2>Cargando datos del examen...</h2>
      </div>
    );
  }

  return (
    <div className="editar-examen-page">
      <h2>Editar Examen</h2>
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

        <div className="editar-examen-temas">
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
        </div>

        <div className="form-actions">
          <button type="submit">Guardar Cambios</button>
          <button
            type="button"
            onClick={handleCancelar}
            className="btn-cancelar"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarExamenPage;
