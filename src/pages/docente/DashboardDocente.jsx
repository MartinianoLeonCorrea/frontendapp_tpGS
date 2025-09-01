import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardDocente() {
  const [dictados, setDictados] = useState([]);

  const recentNews = [
    'Nueva fecha de examen de Matemáticas: 15 de Septiembre',
    'Recordatorio: Entrega de trabajos prácticos hasta el viernes',
  ];
  const navigate = useNavigate();
  useEffect(() => {
    // Petición GET al backend
    fetch('/api/dictados')
      .then((res) => res.json())
      .then((data) => {
        // Si el backend devuelve un objeto con la propiedad 'data'
        if (data.data) {
          setDictados(data.data);
        } else {
          setDictados(data);
        }
      })
      .catch((err) => {
        console.error('Error al obtener dictados:', err);
      });
  }, []);
  const handleSubjectClick = (subjectId, subjectName) => {
    // Acá hay que agregar la lógica para navegar a la página de la materia
    console.log(`Navegando al dictado: ${subjectName} (ID: ${subjectId})`);
    // Ejemplo de navegación a una página de materia específica
    navigate(`/alumno/dictados/${subjectId}`);
  };

  return (
    <main className="dashboard-content">
      <div className="dashboard-layout">
        {/* Sección Principal - Dictados */}
        <section className="subjects-section">
          <div className="content-card">
            <h2 className="section-title">Mis Dictados</h2>
            <div className="subjects-grid">
              {dictados.length === 0 ? (
                <p>No hay materias disponibles.</p>
              ) : (
                dictados.map((dictado) => (
                  <CardMateria
                    key={dictado.id}
                    title={dictado.nombre}
                    description={dictado.descripcion}
                    onClick={() =>
                      handleSubjectClick(dictado.id, dictado.nombre)
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
        </aside>
      </div>
    </main>
  );
}

export default DashboardDocente;
