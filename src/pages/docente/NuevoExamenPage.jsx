import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { examenSchema } from '../../schemas/examenSchema';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NuevoExamenPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const cantidadAlumnos = state?.cantidadAlumnos || 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(examenSchema),
    defaultValues: {
      fecha_examen: '',
      temas: '',
      copias: cantidadAlumnos || 1,
      dictadoId: dictadoId,
    },
  });

  // Validar que tengamos dictadoId
  useEffect(() => {
    if (!dictadoId) {
      toast.error('No se encontró el ID del dictado');
      navigate(-1);
    }
  }, [dictadoId, navigate]);

  const onSubmit = async (data) => {
    try {
      // Validar que la fecha sea futura
      const fechaExamen = new Date(data.fecha_examen);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaExamen <= hoy) {
        toast.error('La fecha del examen debe ser posterior a hoy');
        return;
      }

      const response = await fetch('/api/examenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear el examen');
      }

      toast.success('✅ Examen creado exitosamente');
      
      // Esperar un momento para que se vea el toast antes de navegar
      setTimeout(() => {
        navigate('/docente/dictado', { state: { dictadoId } });
      }, 3000);
    } catch (error) {
      console.error('Error al crear el examen:', error);
      toast.error(`❌ ${error.message || 'Error al crear el examen'}`);
    }
  };

  return (
    <div className="nuevo-examen-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2>Crear Nuevo Examen</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="fecha_examen">Fecha del Examen:</label>
          <input
            type="date"
            id="fecha_examen"
            {...register('fecha_examen')}
            className={errors.fecha_examen ? 'error' : ''}
          />
          {errors.fecha_examen && (
            <span className="form-error">{errors.fecha_examen.message}</span>
          )}
        </div>

        <div className="form-group nuevo-examen-temas">
          <label htmlFor="temas">Temas:</label>
          <textarea
            id="temas"
            {...register('temas')}
            className={errors.temas ? 'error' : ''}
            rows="5"
            placeholder="Ingrese los temas del examen..."
          />
          {errors.temas && (
            <span className="form-error">{errors.temas.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="copias">Cantidad de Copias:</label>
          <input
            type="number"
            id="copias"
            {...register('copias')}
            className={errors.copias ? 'error' : ''}
            min="1"
          />
          {errors.copias && (
            <span className="form-error">{errors.copias.message}</span>
          )}
          <p className="info-text">
            Cantidad actual de alumnos del curso: {cantidadAlumnos}
          </p>
        </div>

        <input type="hidden" {...register('dictadoId')} />

        <div className="button-group">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Examen'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoExamenPage;