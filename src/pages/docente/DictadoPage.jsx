import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Foro from '../../components/Foro';
import '../../App.css';

function MaterialDocente({ dictadoId }) {
  const [materiales, setMateriales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ titulo: '', descripcion: '', url: '', tipo: 'pdf' });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const fetchMateriales = useCallback(async () => {
    try {
      const res = await fetch(`/api/materiales/dictado/${dictadoId}`);
      const data = await res.json();
      setMateriales(data.data || []);
    } catch (error) {
      console.error('Error al cargar materiales:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dictadoId]);

  useEffect(() => {
    if (dictadoId) fetchMateriales();
  }, [dictadoId, fetchMateriales]);

  const handleSubmit = async () => {
    if (!form.titulo || !form.url) {
      setError('El título y la URL son obligatorios');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      const res = await fetch('/api/materiales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dictadoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar');
      setForm({ titulo: '', descripcion: '', url: '', tipo: 'pdf' });
      setMostrarForm(false);
      fetchMateriales();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este material?')) return;
    try {
      await fetch(`/api/materiales/${id}`, { method: 'DELETE' });
      fetchMateriales();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const iconoTipo = (tipo) =>
    ({ pdf: '📄', video: '🎥', link: '🔗', otro: '📎' })[tipo] || '📎';

  return (
    <div className="examenes-section">
      <div className="examenes-header">
        <h3 className="subtitle">Materiales</h3>
        <button
          className="btn-nuevo-examen"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Material'}
        </button>
      </div>

      {mostrarForm && (
        <div className="examen-card" style={{ flexDirection: 'column', gap: '8px' }}>
          {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
          <input
            placeholder="Título *"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
          />
          <input
            placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
          />
          <input
            placeholder="URL del material *"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
          />
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="pdf">📄 PDF</option>
            <option value="video">🎥 Video</option>
            <option value="link">🔗 Link</option>
            <option value="otro">📎 Otro</option>
          </select>
          <button
            className="btn-nuevo-examen"
            onClick={handleSubmit}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Material'}
          </button>
        </div>
      )}

      {isLoading ? (
        <p>Cargando materiales...</p>
      ) : materiales.length === 0 ? (
        <p className="no-data">No hay materiales cargados.</p>
      ) : (
        <div className="examenes-list">
          {materiales.map((material) => (
            <div key={material.id} className="examen-card">
              <button
                className="btn-eliminar-cruz"
                onClick={() => handleEliminar(material.id)}
              >
                ✖
              </button>
              <div className="examen-info">
                <h4 className="examen-fecha">
                  {iconoTipo(material.tipo)} {material.titulo}
                </h4>
                {material.descripcion && (
                  <p className="examen-temas">{material.descripcion}</p>
                )}
                <a
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editar"
                  style={{ display: 'inline-block', marginTop: '6px' }}
                >
                  🔗 Ver material
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

        {/* Sección de Materiales */}
        <MaterialDocente dictadoId={dictadoId} />

        {/* Alumnos del curso */}
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
