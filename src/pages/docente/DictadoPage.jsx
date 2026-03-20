import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Foro from '../../components/Foro';
import '../../App.css';

function DictadoPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const [dictado, setDictado] = useState(null);
  const [examenes, setExamenes] = useState([]);
  const [loadingExamenes, setLoadingExamenes] = useState(true);

  const getFechaExamen = (examen) => examen?.fecha_examen || examen?.fechaExamen;

  const fetchExamenes = useCallback(async () => {
    setLoadingExamenes(true);
    try {
      const response = await fetch(`/api/examenes?dictadoId=${dictadoId}`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar los examenes');
      }
      const result = await response.json();
      setExamenes(result.data || []);
    } catch (error) {
      console.error('Error al cargar exámenes:', error);
      setExamenes([]);
    } finally {
      setLoadingExamenes(false);
    }
  }, [dictadoId]);

  useEffect(() => {
    if (dictadoId) {
      // Cargar datos del dictado
      fetch(`/api/dictados/${dictadoId}`)
        .then((res) => {
          if (!res.ok) throw new Error('No se pudo cargar el dictado');
          return res.json();
        })
        .then((data) => setDictado(data.data ?? null))
        .catch((err) => console.error('Error en fetch dictado:', err));

      // Cargar exámenes del dictado
      fetchExamenes();
    }
  }, [dictadoId, fetchExamenes]);

  if (!dictadoId) return <p>No se seleccionó dictado.</p>;
  if (!dictado) return <p>Cargando dictado...</p>;

  const curso = dictado.curso;
  const materia = dictado.materia;
  const alumnos = curso?.alumnos
    ? [...curso.alumnos].sort((a, b) => a.apellido.localeCompare(b.apellido))
    : [];

  // Handlers para los botones
  const handleNuevoExamen = () => {
    const cantidadAlumnos = alumnos.length;
    navigate('/docente/dictado/examen/nuevo', {
      state: { dictadoId, cantidadAlumnos },
    });
  };

  const handleEditarExamen = (examenId) => {
    navigate('/docente/dictado/examen/editar', {
      state: { dictadoId, examenId },
    });
  };

  const handleBorrarExamen = (examenId) => {
    navigate('/docente/dictado/examen/borrar', {
      state: { dictadoId, examenId },
    });
  };

  const handleSubirNotas = (examenId) => {
    navigate('/docente/dictado/notas/subir', {
      state: { dictadoId, examenId },
    });
  };

  const formatFecha = (fecha) => {
    const parsedDate = new Date(fecha);
    if (Number.isNaN(parsedDate.getTime())) return 'Fecha invalida';
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="dictado-page">
      <div className="dictado-content">
        <h2 className="section-title">{materia?.nombre}</h2>
        <p className="section-description">{materia?.descripcion}</p>
        <span className="dictado-info">
          <h3 className="subtitle">Curso</h3>
          <p>
            <strong>Año y división:</strong> {curso?.nroLetra}{' '}
            <strong>Turno:</strong> {curso?.turno}
          </p>
        </span>

        {/* Sección de Exámenes */}
        <div className="examenes-section">
          <div className="examenes-header">
            <h3 className="subtitle">Exámenes</h3>
            <button className="btn-nuevo-examen" onClick={handleNuevoExamen}>
              + Nuevo Examen
            </button>
          </div>

          {loadingExamenes ? (
            <p>Cargando exámenes...</p>
          ) : examenes.length === 0 ? (
            <p className="no-data">
              No hay exámenes registrados para este dictado.
            </p>
          ) : (
            <div className="examenes-list">
              {examenes.map((examen) => (
                <div key={examen.id} className="examen-card">
                  <button
                    className="btn-eliminar-cruz"
                    onClick={() => handleBorrarExamen(examen.id)}
                  >
                    ✖
                  </button>
                  <div className="examen-info">
                    <h4 className="examen-fecha">
                      📅 {formatFecha(getFechaExamen(examen))}
                    </h4>
                    <p className="examen-temas">
                      <strong>Temas:</strong> {examen.temas}
                    </p>
                    <p className="examen-copias">
                      <strong>Copias:</strong> {examen.copias}
                    </p>
                  </div>
                  <div className="examen-actions">
                    <button
                      className="btn-editar"
                      onClick={() => handleEditarExamen(examen.id)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-subir-notas"
                      onClick={() => handleSubirNotas(examen)}
                    >
                      📤 Subir Notas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="alumnos-section">
          <h3 className="subtitle">Alumnos del curso</h3>
          {alumnos.length === 0 ? (
            <p>No hay alumnos en este curso.</p>
          ) : (
            <ul className="alumnos-list">
              {alumnos.map((alumno) => (
                <li key={alumno.dni} className="alumno-item">
                  {alumno.apellido}, {alumno.nombre} ({alumno.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Foro - Sidebar derecho */}
      <div className="foro-sidebar">
        <Foro />
      </div>
    </div>
  );
}

export default DictadoPage;
