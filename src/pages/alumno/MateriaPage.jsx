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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!subjectId || !dni) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Obtener el alumno y su curso
        const alumnoRes = await fetch(`/api/personas/${dni}`);
        const alumnoData = await alumnoRes.json();
        const cursoId = alumnoData.data?.cursoId;
        
        if (!cursoId) {
          console.error('No se encontró cursoId para el alumno');
          setIsLoading(false);
          return;
        }

        // 2. Buscar el dictado de la materia para el curso del alumno
        const dictadoRes = await fetch(
          `/api/dictados/by-curso-materia?cursoId=${cursoId}&materiaId=${subjectId}`
        );
        const dictadoData = await dictadoRes.json();
        const dictadoEncontrado = dictadoData.data?.[0];

        if (!dictadoEncontrado) {
          console.error('No se encontró dictado para esta materia y curso');
          setIsLoading(false);
          return;
        }

        setDictado(dictadoEncontrado);

        // 3. Obtener la materia
        const materiaRes = await fetch(`/api/materias/${subjectId}`);
        const materiaData = await materiaRes.json();
        setMateria(materiaData.data);

        // 4. Los exámenes ya vienen incluidos en el dictado
        console.log('Dictado completo:', dictadoEncontrado);
        console.log('Exámenes del dictado:', dictadoEncontrado.examenes);
        
        // Si los exámenes vienen en el dictado, usarlos directamente
        if (dictadoEncontrado.examenes && Array.isArray(dictadoEncontrado.examenes)) {
          setExamenes(dictadoEncontrado.examenes);
        } else {
          // Si no vienen, hacer petición adicional
          console.log('Buscando exámenes para dictadoId:', dictadoEncontrado.id);
          const examenesRes = await fetch(`/api/examenes?dictadoId=${dictadoEncontrado.id}`);
          const examenesData = await examenesRes.json();
          
          console.log('Respuesta de exámenes:', examenesData);
          setExamenes(examenesData.data || []);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subjectId, dni]);

  if (!subjectId || !dni) {
    return <div>No se seleccionó materia o alumno.</div>;
  }

  if (isLoading) {
    return <div>Cargando materia...</div>;
  }

  if (!materia || !dictado) {
    return <div>No se encontró información de la materia.</div>;
  }

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