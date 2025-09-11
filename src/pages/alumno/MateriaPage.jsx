import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Foro from '../../components/Foro';
import '../../App.css';

function MateriaPage() {
  const { state } = useLocation();
  const subjectId = state?.subjectId;
  const dni = state?.dni;
  const [materia, setMateria] = useState(null);
  const [dictado, setDictado] = useState(null);
  const [examenes, setExamenes] = useState([]);

  useEffect(() => {
    if (subjectId && dni) {
      // 1. Obtener el alumno y su curso
      fetch(`/api/personas/${dni}`)
        .then((res) => res.json())
        .then((alumnoData) => {
          const cursoId = alumnoData.data?.cursoId;
          if (!cursoId) return;

          // 2. Buscar el dictado de la materia para el curso del alumno
          fetch(
            `/api/dictados/by-curso-materia?cursoId=${cursoId}&materiaId=${subjectId}`
          )
            .then((res) => res.json())
            .then((dictadoData) => {
              const dictado = dictadoData.data?.[0];
              setDictado(dictado);

              // 3. Obtener la materia
              fetch(`/api/materias/${subjectId}`)
                .then((res) => res.json())
                .then((materiaData) => {
                  setMateria(materiaData.data);
                });

              // 4. Obtener los exámenes asociados al dictado
              if (dictado) {
                fetch(`/api/examenes?dictadoId=${dictado.id}`)
                  .then((res) => res.json())
                  .then((examenData) => {
                    setExamenes(examenData.data || []);
                    console.log('Examenes recibidos: ', examenData.data);
                  });
              }
            });
        });
    }
  }, [subjectId, dni]);

  if (!subjectId || !dni) return <div>No se seleccionó materia o alumno.</div>;
  if (!materia || !dictado) return <div>Cargando materia...</div>;

  function formatFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  return (
    <div className="materia-page">
      <div className="materia-content">
        {/* Información básica */}

        <div className="card profesor-info">
          <span className="profesor-label">Profesor: </span>
          <span className="profesor-name">
            {dictado.docente
              ? `${dictado.docente.nombre} ${dictado.docente.apellido}`
              : 'Sin docente asignado'}
          </span>
        </div>

        <div className="card descripcion-section">
          <label className="descripcion-label">Descripción:</label>
          <div className="descripcion-text">
            {materia.descripcion || 'Sin descripción'}
          </div>
        </div>
        {/* Exámenes */}
        {/*TODO: agregar la funcion filtrar el listado de examenes */}
        <div className="card examenes-section">
          <h3 className="examenes-title">Exámenes:</h3>
          <ul className="examenes-list">
            {Array.isArray(examenes) && examenes.length > 0 ? (
              (() => {
                const proximos = examenes
                  .filter((ex) => new Date(ex.fecha_examen) >= new Date())
                  .sort(
                    (a, b) =>
                      new Date(a.fecha_examen) - new Date(b.fecha_examen)
                  );
                if (proximos.length === 0) {
                  return (
                    <li className="examen-item">
                      No hay exámenes programados.
                    </li>
                  );
                }
                const examen = proximos[0];
                return (
                  <li key={examen.id} className="examen-item">
                    {examen.temas} - {formatFecha(examen.fecha_examen)}
                  </li>
                );
              })()
            ) : (
              <li className="examen-item">No hay exámenes programados.</li>
            )}
          </ul>
        </div>

        {/* Material */}
        <div className="card material-section">
          <h3 className="material-title">Material:</h3>
          <div className="material-placeholder">
            <p>Feature no desarrollada</p>
          </div>
        </div>
      </div>

      {/* Foro - Sidebar derecho */}
      <div className="foro-sidebar">
        <Foro />
      </div>
    </div>
  );
}

export default MateriaPage;
