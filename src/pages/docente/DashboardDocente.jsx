import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardDictado } from '../../components/CardDictado.jsx';
import { useUser } from '../../context/UserContext';

function DashboardDocente() {
  const [dictados, setDictados] = useState([]);
  const [proximosExamenes, setProximosExamenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dni } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!dni) return;

    const fetchDictados = async () => {
      setIsLoading(true);

      try {
        // Obtener dictados asociados al docente
        const dictadosRes = await fetch(`/api/dictados/persona/${dni}`);
        const dictadosData = await dictadosRes.json();
        console.log('Dictados recibidos:', dictadosData);

        const todosDictados = Array.isArray(dictadosData) ? dictadosData : [];
        console.log(
          'Tipo de todosDictados:',
          Array.isArray(todosDictados),
          todosDictados
        );

        setDictados(todosDictados);

        // Procesar exámenes próximos por dictado
        const hoy = new Date();
        const examenesPorDictado = [];

        todosDictados.forEach((dictado) => {
          // Verificar que el dictado tenga exámenes
          if (!dictado.examenes || !Array.isArray(dictado.examenes)) return;

          // Filtrar exámenes futuros del dictado
          const examenesFuturos = dictado.examenes
            .filter((ex) => new Date(ex.fecha_examen) >= hoy)
            .sort((a, b) => new Date(a.fecha_examen) - new Date(b.fecha_examen));

          // Si hay exámenes futuros, tomar el más próximo
          if (examenesFuturos.length > 0) {
            const proximoExamen = examenesFuturos[0];
            examenesPorDictado.push({
              ...proximoExamen,
              materia: dictado.materia,
              curso: dictado.curso,
              dictadoId: dictado.id,
            });
          }
        });

        // Ordenar todos los exámenes por fecha
        examenesPorDictado.sort(
          (a, b) => new Date(a.fecha_examen) - new Date(b.fecha_examen)
        );

        console.log('Exámenes próximos por dictado:', examenesPorDictado);
        setProximosExamenes(examenesPorDictado);

      } catch (error) {
        setDictados([]);
        setProximosExamenes([]);
        console.error('Error al cargar dictados del dashboard docente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDictados();
  }, [dni]);

  const handleDictadoClick = (dictadoId) => {
    navigate(`/docente/dictado`, { state: { dictadoId } });
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
        {/* Sección Principal - Dictados */}
        <section className="subjects-section">
          <div className="content-card">
            <h2 className="section-title">Mis Dictados</h2>
            <div className="subjects-grid">
              {isLoading ? (
                <p className="loading-message">Cargando dictados...</p>
              ) : dictados.length === 0 ? (
                <p>No hay dictados disponibles.</p>
              ) : (
                dictados.map((dictado) => (
                  <CardDictado
                    key={dictado.id}
                    materiaNombre={dictado.materia?.nombre || 'Sin materia'}
                    docenteNombre={
                      dictado.docente
                        ? `${dictado.docente.nombre} ${dictado.docente.apellido}`
                        : 'Sin docente'
                    }
                    cursoNroLetra={dictado.curso?.nro_letra || 'Sin curso'}
                    onClick={() => handleDictadoClick(dictado.id)}
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
              {isLoading ? (
                <p className="info-placeholder">Cargando exámenes...</p>
              ) : proximosExamenes.length > 0 ? (
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
                      {examen.curso && (
                        <div className="examen-preview-docente">
                          Curso: {examen.curso.nro_letra}
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
      </div>
    </main>
  );
}

export default DashboardDocente;