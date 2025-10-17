import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BorrarExamenPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const examenId = state?.examenId;

  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [eliminadoExitoso, setEliminadoExitoso] = useState(false);

  useEffect(() => {
    const fetchExamen = async () => {
      try {
        const response = await fetch(`/api/examenes/${examenId}`);

        if (!response.ok) {
          throw new Error('Error al cargar el examen');
        }

        const result = await response.json();
        setExamen(result.data);
      } catch (error) {
        console.error('Error al cargar el examen:', error);
        toast.error('Error al cargar los datos del examen');
        navigate('/docente/dictado', { state: { dictadoId } });
      } finally {
        setLoading(false);
      }
    };

    if (!examenId) {
      toast.error('No se especificó el examen a eliminar');
      navigate('/docente/dictado', { state: { dictadoId } });
      return;
    }

    fetchExamen();
  }, [examenId, dictadoId, navigate]);

  const handleEliminar = async () => {
    // Validar que el usuario escribió "ELIMINAR"
    if (confirmText.toUpperCase() !== 'ELIMINAR') {
      toast.error('Debe escribir "ELIMINAR" para confirmar');
      return;
    }

    setDeleting(true);
    const toastId = toast.loading('Eliminando examen...');

    try {
      const response = await fetch(`/api/examenes/${examenId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al eliminar el examen');
      }

      toast.update(toastId, {
        render: 'Examen eliminado exitosamente',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      // Bloquear toda la interfaz después de eliminar
      setEliminadoExitoso(true);

      // Esperar un momento antes de navegar
      setTimeout(() => {
        navigate('/docente/dictado', { state: { dictadoId } });
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el examen:', error);
      toast.update(toastId, {
        render: `${error.message || 'Error al eliminar el examen'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      setDeleting(false);
    }
  };

  const handleCancelar = () => {
    navigate('/docente/dictado', { state: { dictadoId } });
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="borrar-examen-page">
        <h2>Cargando datos del examen...</h2>
      </div>
    );
  }

  if (!examen) {
    return (
      <div className="borrar-examen-page">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Examen no encontrado</h2>
        <button onClick={handleCancelar}>Volver</button>
      </div>
    );
  }

  return (
    <div className="borrar-examen-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Eliminar Examen</h2>

      <div className="warning-message">
        <p>
          ⚠️ <strong>Advertencia:</strong> Está a punto de eliminar el siguiente
          examen:
        </p>
      </div>

      <div className="examen-details">
        <div className="detail-item">
          <strong>Fecha del examen:</strong>
          <span>{formatFecha(examen.fecha_examen)}</span>
        </div>

        <div className="detail-item">
          <strong>Temas:</strong>
          <span>{examen.temas}</span>
        </div>

        <div className="detail-item">
          <strong>Cantidad de copias:</strong>
          <span>{examen.copias}</span>
        </div>

        {examen.dictado && (
          <>
            <div className="detail-item">
              <strong>Materia:</strong>
              <span>{examen.dictado.materia?.nombre || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <strong>Docente:</strong>
              <span>
                {examen.dictado.docente
                  ? `${examen.dictado.docente.nombre} ${examen.dictado.docente.apellido}`
                  : 'N/A'}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="confirmation-message danger">
        <p>
          ⚠️ Esta acción eliminará <strong>permanentemente</strong> este examen
          y <strong>todas las notas asociadas</strong>. No se puede deshacer.
        </p>
      </div>

      <div className="confirmation-input">
        <label htmlFor="confirm-text">
          Para confirmar, escriba <strong>"ELIMINAR"</strong> en el campo:
        </label>
        <input
          id="confirm-text"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Escriba ELIMINAR"
          disabled={deleting || eliminadoExitoso}
          autoComplete="off"
          className="confirm-input"
        />
      </div>

      <div className="form-actions">
        <button
          onClick={handleEliminar}
          disabled={
            deleting ||
            eliminadoExitoso ||
            confirmText.toUpperCase() !== 'ELIMINAR'
          }
          className="btn-eliminar-confirm"
        >
          {eliminadoExitoso
            ? 'Eliminado ✓'
            : deleting
            ? 'Eliminando...'
            : 'Confirmar Eliminación'}
        </button>
        <button
          onClick={handleCancelar}
          disabled={deleting || eliminadoExitoso}
          className="btn-cancelar"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default BorrarExamenPage;
