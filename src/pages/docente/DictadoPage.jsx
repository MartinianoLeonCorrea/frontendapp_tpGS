import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Foro from '../../components/Foro';
import '../../App.css';

function DictadoPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dictadoId = state?.dictadoId;
  const [dictado, setDictado] = useState(null);

  useEffect(() => {
    if (dictadoId) {
      fetch(`/api/dictados/${dictadoId}`)
        .then((res) => res.json())
        .then((data) => setDictado(data))
        .catch((err) => console.error('Error en fetch dictado:', err));
    }
  }, [dictadoId]);

  if (!dictadoId) return <p>No se seleccionó dictado.</p>;
  if (!dictado) return <p>Cargando dictado...</p>;

  const curso = dictado.curso;
  const materia = dictado.materia;
  const alumnos = curso?.alumnos
    ? [...curso.alumnos].sort((a, b) => a.apellido.localeCompare(b.apellido))
    : [];
  // Handlers para los botones
  const handleNuevoExamen = () => {
    navigate('/docente/dictado/examen/nuevo', { state: { dictadoId } });
  };
  const handleEditarExamen = () => {
    navigate('/docente/dictado/examen/editar', { state: { dictadoId } });
  };
  const handleBorrarExamen = () => {
    navigate('/docente/dictado/examen/borrar', { state: { dictadoId } });
  };
  const handleSubirNotas = () => {
    navigate('/docente/dictado/notas/subir', { state: { dictadoId } });
  };

  return (
    <div className="dictado-page">
      <div className="dictado-content">
        <h2 className="section-title">{materia?.nombre}</h2>
        <p className="section-description">{materia?.descripcion}</p>
        <span className="dictado-info">
          <h3 className="subtitle">Curso</h3>
          <p>
            <strong>Año y división:</strong> {curso?.nro_letra}
            <strong>Turno:</strong> {curso?.turno}
          </p>
        </span>
        {/* Botones de acciones */}
        <div className="dictado-actions">
          <button onClick={handleNuevoExamen}>Nuevo examen</button>
          <button onClick={handleEditarExamen}>Editar examen</button>
          <button onClick={handleBorrarExamen}>Borrar examen</button>
          <button onClick={handleSubirNotas}>Subir notas</button>
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
