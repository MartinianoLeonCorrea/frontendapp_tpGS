// src/pages/alumno/DashboardAlumno.jsx
import { useEffect, useState } from 'react';
import { CardMateria } from '../../components/CardMAteria';
import { Routes, Route, useNavigate } from 'react-router-dom';

export default function DashboardAlumno() {
  const [materias, setMaterias] = useState([]);

  // Datos de ejemplo para novedades y exámenes
  const recentNews = [
    'Nueva fecha de examen de Matemáticas: 15 de Septiembre',
    'Recordatorio: Entrega de trabajos prácticos hasta el viernes',
  ];

  const upcomingExam = {
    subject: 'Lengua y Literatura',
    date: '20 de Septiembre',
    time: '14:00 hs',
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Petición GET al backend
    fetch('/api/materias')
      .then((res) => res.json())
      .then((data) => {
        // Si el backend devuelve un objeto con la propiedad 'data'
        if (data.data) {
          setMaterias(data.data);
        } else {
          setMaterias(data);
        }
      })
      .catch((err) => {
        console.error('Error al obtener materias:', err);
      });
  }, []);

  const handleSubjectClick = (subjectId, subjectName) => {
    // Acá hay que agregar la lógica para navegar a la página de la materia
    console.log(`Navegando a la materia: ${subjectName} (ID: ${subjectId})`);
    // Ejemplo de navegación a una página de materia específica
    navigate(`/alumno/materias/${subjectId}`);
  };

  return (
    <main className="dashboard-content">
      <div className="dashboard-layout">
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
            <h3 className="sidebar-section-title">Novedades</h3>
            <p className="sidebar-subtitle">(Publicaciones recientes)</p>

            {recentNews.length > 0 ? (
              <div className="news-list">
                {recentNews.map((news, index) => (
                  <div key={index} className="info-placeholder">
                    {news}
                  </div>
                ))}
              </div>
            ) : (
              <p className="info-placeholder">No hay novedades recientes</p>
            )}
          </section>

          {/* Sección de Próximos Exámenes */}
          <section className="exam-section">
            <h3 className="sidebar-section-title">Próximo Examen</h3>

            {upcomingExam ? (
              <div className="exam-info">
                <p className="info-placeholder">
                  <strong>{upcomingExam.subject}</strong>
                  <br />
                  {upcomingExam.date} - {upcomingExam.time}
                </p>
              </div>
            ) : (
              <p className="info-placeholder">No hay exámenes programados</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
