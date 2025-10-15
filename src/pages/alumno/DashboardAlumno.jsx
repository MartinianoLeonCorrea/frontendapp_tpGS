// src/pages/alumno/DashboardAlumno.jsx
import { useEffect, useState } from 'react';
import { CardMateria } from '../../components/CardMateria';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function DashboardAlumno() {
  const [materias, setMaterias] = useState([]);
  const [proximosExamenes, setProximosExamenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dni } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!dni) return;

    const fetchDashboardData = async () => {
      console.log('fetchDashboardData ejecutado');
      setIsLoading(true);

      try {
        // 1. Obtener curso del alumno
        const alumnoRes = await fetch(`/api/personas/${dni}`);
        const alumnoData = await alumnoRes.json();
        const cursoId = alumnoData.data?.cursoId;

        if (!cursoId) {
          console.log(
            'No se encontró cursoId, no se buscarán datos de materias y exámenes.'
          );
          setMaterias([]);
          setProximosExamenes([]);
          setIsLoading(false);
          return;
        }

        console.log('CursoId del alumno:', cursoId);

        // 2. Obtener SOLO los dictados del curso del alumno
        const dictadosRes = await fetch(`/api/dictados?cursoId=${cursoId}`);
        const dictadosData = await dictadosRes.json();
        console.log('Dictados recibidos para el curso:', dictadosData);

        const todosDictados = Array.isArray(dictadosData) ? dictadosData : [];

        if (!todosDictados.length) {
          console.log('No hay dictados disponibles para el curso.');
          setMaterias([]);
          setProximosExamenes([]);
          setIsLoading(false);
          return;
        }

        // 3. Filtrar dictados que pertenecen al curso del alumno (doble verificación)
        const dictadosDelCurso = todosDictados.filter(
          (dictado) => dictado.cursoId === cursoId
        );

        console.log('Dictados filtrados del curso del alumno:', dictadosDelCurso);

        // 4. Extraer materias de los dictados del curso
        const todasLasMaterias = dictadosDelCurso.map((dictado) => dictado.materia);
        const materiasUnicas = todasLasMaterias.filter((materia, index, array) => 
          materia && array.findIndex(m => m.id === materia.id) === index
        );
        setMaterias(materiasUnicas);
        console.log('Materias extraídas:', materiasUnicas);

        // 5. Procesar exámenes próximos SOLO de los dictados del curso del alumno
        const hoy = new Date();
        const examenesPorMateria = [];

        dictadosDelCurso.forEach((dictado) => {
          // Verificar que el dictado tenga exámenes
          if (!dictado.examenes || !Array.isArray(dictado.examenes)) return;

          // Filtrar exámenes futuros del dictado
          const examenesFuturos = dictado.examenes
            .filter((ex) => new Date(ex.fecha_examen) >= hoy)
            .sort((a, b) => new Date(a.fecha_examen) - new Date(b.fecha_examen));

          // Si hay exámenes futuros, tomar el más próximo
          if (examenesFuturos.length > 0) {
            const proximoExamen = examenesFuturos[0];
            examenesPorMateria.push({
              ...proximoExamen,
              materia: dictado.materia,
              docente: dictado.docente,
              cursoId: dictado.cursoId, // Guardar para verificación
            });
          }
        });

        // Ordenar todos los exámenes por fecha
        examenesPorMateria.sort(
          (a, b) => new Date(a.fecha_examen) - new Date(b.fecha_examen)
        );

        console.log('Exámenes próximos filtrados por curso:', examenesPorMateria);
        setProximosExamenes(examenesPorMateria);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dni]);

  const handleSubjectClick = (subjectId, subjectName) => {
    navigate('/alumno/materia', {
      state: { subjectId, dni, materiaNombre: subjectName },
    });
  };

  function formatFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  return (
    <main className="dashboard-content">
      <div className="dashboard-layout">
        {isLoading ? (
          <p className="loading-message">Cargando dashboard...</p>
        ) : (
          <>
            {/* Sección Principal - Materias */}
            <section className="subjects-section">
              <div className="content-card">
                <h2 className="section-title">Mis Materias</h2>
                <div className="subjects-grid">
                  {materias.length === 0 ? (
                    <p>No hay materias disponibles.</p>
                  ) : (
                    materias.map((materia) => (
                      <CardMateria
                        key={materia.id}
                        title={materia.nombre}
                        description={materia.descripcion}
                        onClick={() =>
                          handleSubjectClick(materia.id, materia.nombre)
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Sidebar Derecho */}
            <aside className="right-sidebar">
              {/* Sección de Novedades */}
              <section className="news-section">
                <div className="section-header">
                  <h3 className="sidebar-main-title">Novedades</h3>
                  <hr className="title-divider" />
                </div>

                {/* Lista de próximos exámenes */}
                <div className="proximos-examenes-container">
                  <h4 className="sidebar-section-title">Próximos Exámenes</h4>
                  {proximosExamenes.length > 0 ? (
                    <div className="examenes-scroll-list">
                      {proximosExamenes.map((examen) => (
                        <div key={examen.id} className="examen-preview-card">
                          <div className="examen-preview-materia">
                            {examen.materia?.nombre || 'Materia sin nombre'}
                          </div>
                          <div className="examen-preview-info">
                            <strong>{examen.temas}</strong>
                          </div>
                          <div className="examen-preview-fecha">
                            {formatFecha(examen.fecha_examen)}
                          </div>
                          {examen.docente && (
                            <div className="examen-preview-docente">
                              Prof. {examen.docente.nombre} {examen.docente.apellido}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="info-placeholder">
                      No hay exámenes programados
                    </p>
                  )}
                </div>
              </section>
            </aside>
          </>
        )}
      </div>
    </main>
  );
}