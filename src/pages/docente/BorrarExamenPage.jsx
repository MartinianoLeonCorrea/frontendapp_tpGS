import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function BorrarExamenPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const examenId = state?.examenId;

  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!examenId) {
      alert('No se especificó el examen a eliminar');
      navigate('/docente/dictado', { state: { dictadoId } });
      return;
    }

    // Cargar datos del examen
    const fetchExamen = async () => {
      try {
        const response = await fetch(`/api/examenes/${examenId}`);
        if (response.ok) {
          const result = await response.json();
          setExamen(result.data);
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

  const handleEliminar = async () => {
    if (!window.confirm('¿Está seguro que desea eliminar este examen? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/examenes/${examenId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Examen eliminado exitosamente');
        navigate('/docente/dictado', { state: { dictadoId } });
      } else {
        const result = await response.json();
        alert(
          `Error al eliminar el examen: ${result.message || 'Error desconocido'}`
        );
        setDeleting(false);
      }
    } catch (error) {
      console.error('Error al eliminar el examen:', error);
      alert(`Error de conexión: ${error.message}`);
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
        <h2>Examen no encontrado</h2>
        <button onClick={handleCancelar}>Volver</button>
      </div>
    );
  }

  return (
    <div className="borrar-examen-page">
      <h2>Eliminar Examen</h2>
      
      <div className="warning-message">
        <p>⚠️ <strong>Advertencia:</strong> Está a punto de eliminar el siguiente examen:</p>
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

      <div className="confirmation-message">
        <p>Esta acción eliminará permanentemente este examen y no se puede deshacer.</p>
      </div>

      <div className="form-actions">
        <button
          onClick={handleEliminar}
          disabled={deleting}
          className="btn-eliminar-confirm"
        >
          {deleting ? 'Eliminando...' : 'Confirmar Eliminación'}
        </button>
        <button
          onClick={handleCancelar}
          disabled={deleting}
          className="btn-cancelar"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default BorrarExamenPage;