// src/pages/alumno/DashboardAlumno.jsx
import { useEffect, useState } from 'react';
import { CardMateria } from '../../components/CardMateria';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function DashboardAlumno() {
  const [materias, setMaterias] = useState([]);
  const [proximoExamen, setProximoExamen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dni } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!dni) return;

    // Definimos una función asincrónica para centralizar toda la lógica de carga
    const fetchDashboardData = async () => {
      console.log('fetchDashboardData ejecutado');
      setIsLoading(true);

      try {
        // 1. Obtener curso del alumno para encontrar los dictados
        const alumnoRes = await fetch(`/api/personas/${dni}`);
        const alumnoData = await alumnoRes.json();
        const cursoId = alumnoData.data?.cursoId;

        if (!cursoId) {
          console.log(
            'No se encontró cursoId, no se buscarán datos de materias y exámenes.'
          );
          setMaterias([]);
          setProximoExamen(null);
          setIsLoading(false);
          return;
        }

        // 2. Obtener dictados del curso, que incluyen materias, docentes y exámenes
        const dictadosRes = await fetch(`/api/dictados?cursoId=${cursoId}`);
        const dictadosData = await dictadosRes.json();
        console.log('Dictados recibidos:', dictadosData);

        const todosDictados = Array.isArray(dictadosData) ? dictadosData : [];
        console.log(
          'Tipo de todosDictados:',
          Array.isArray(todosDictados),
          todosDictados
        );

        if (!todosDictados.length) {
          console.log('No hay dictados disponibles para el curso.');
          setMaterias([]);
          setProximoExamen(null);
          setIsLoading(false);
          return;
        }

        // 3. Extraer materias de los dictados
        const todasLasMaterias = todosDictados.map((dictado) => dictado.materia);
        const materiasUnicas = todasLasMaterias.filter((materia, index, array) => 
          materia && array.findIndex(m => m.id === materia.id) === index
        );
        setMaterias(materiasUnicas);
        console.log('Materias extraídas:', materiasUnicas);

        // 4. Extraer todos los exámenes de los dictados
        const todosExamenes = todosDictados.flatMap(
          (dictado) => dictado.examenes || []
        );
        console.log('Todos los exámenes extraídos:', todosExamenes);

        // 5. Filtrar el examen más próximo
        const hoy = new Date();
        const proximos = todosExamenes
          .filter((ex) => new Date(ex.fecha_examen) >= hoy)
          .sort((a, b) => new Date(a.fecha_examen) - new Date(b.fecha_examen));

        console.log('Exámenes próximos:', proximos);
        setProximoExamen(proximos[0] || null);
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

                {/* Agregamos la tarjeta del próximo examen dentro de Novedades */}
                <div className="exam-card">
                  <h4 className="sidebar-section-title">Próximo Examen</h4>
                  {proximoExamen ? (
                    <div className="exam-info">
                      <p className="info-placeholder">
                        <strong>
                          {proximoExamen.temas ||
                            proximoExamen.nombre ||
                            'Sin nombre'}
                        </strong>
                        <br />
                        {formatFecha(proximoExamen.fecha_examen)}
                      </p>
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
