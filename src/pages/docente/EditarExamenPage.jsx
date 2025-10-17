import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { examenSchema } from '../../schemas/examenSchema';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditarExamenPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const examenId = state?.examenId;

  const [loading, setLoading] = useState(true);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(examenSchema),
    defaultValues: {
      fecha_examen: '',
      temas: '',
      copias: 1,
      dictadoId: dictadoId,
    },
  });

  useEffect(() => {
    const fetchExamen = async () => {
      try {
        const response = await fetch(`/api/examenes/${examenId}`);

        if (!response.ok) {
          throw new Error('Error al cargar el examen');
        }

        const result = await response.json();
        const examen = result.data;

        // Formatear la fecha para el input date
        const fechaExamen = new Date(examen.fecha_examen);
        const fechaFormateada = fechaExamen.toISOString().split('T')[0];

        // Usar reset para cargar los datos en el formulario
        reset({
          fecha_examen: fechaFormateada,
          temas: examen.temas,
          copias: examen.copias,
          dictadoId: examen.dictadoId,
        });
      } catch (error) {
        console.error('Error al cargar el examen:', error);
        toast.error('Error al cargar los datos del examen');
        navigate('/docente/dictado', { state: { dictadoId } });
      } finally {
        setLoading(false);
      }
    };

    if (!examenId) {
      toast.error('No se especificó el examen a editar');
      navigate('/docente/dictado', { state: { dictadoId } });
      return;
    }

    fetchExamen();
  }, [examenId, dictadoId, navigate, reset]);

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

      const toastId = toast.loading('Actualizando examen...');

      const response = await fetch(`/api/examenes/${examenId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar el examen');
      }

      toast.update(toastId, {
        render: 'Examen actualizado exitosamente',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      // Bloquear el formulario después de guardar
      setGuardadoExitoso(true);

      // Esperar un momento antes de navegar
      setTimeout(() => {
        navigate('/docente/dictado', { state: { dictadoId } });
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar el examen:', error);
      toast.error(`❌ ${error.message || 'Error al actualizar el examen'}`);
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
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Editar Examen</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="fecha_examen">Fecha del Examen:</label>
          <input
            type="date"
            id="fecha_examen"
            {...register('fecha_examen')}
            className={errors.fecha_examen ? 'error' : ''}
            disabled={isSubmitting || guardadoExitoso}
          />
          {errors.fecha_examen && (
            <span className="form-error">{errors.fecha_examen.message}</span>
          )}
        </div>

        <div className="form-group editar-examen-temas">
          <label htmlFor="temas">Temas:</label>
          <textarea
            id="temas"
            {...register('temas')}
            className={errors.temas ? 'error' : ''}
            rows="5"
            placeholder="Ingrese los temas del examen..."
            disabled={isSubmitting || guardadoExitoso}
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
            disabled={isSubmitting || guardadoExitoso}
          />
          {errors.copias && (
            <span className="form-error">{errors.copias.message}</span>
          )}
        </div>

        <input type="hidden" {...register('dictadoId')} />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || guardadoExitoso}
          >
            {guardadoExitoso
              ? 'Guardado ✓'
              : isSubmitting
              ? 'Guardando...'
              : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="btn-cancelar"
            disabled={isSubmitting || guardadoExitoso}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarExamenPage;
