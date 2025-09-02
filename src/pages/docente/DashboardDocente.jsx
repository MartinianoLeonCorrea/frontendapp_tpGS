import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardDictado } from '../../components/CardDictado.jsx';

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
        // Si la respuesta tiene 'data' y es un array, úsala. Si no, usa []
        if (Array.isArray(data.data)) {
          setDictados(data.data);
        } else if (Array.isArray(data)) {
          setDictados(data);
        } else {
          setDictados([]);
        }
      })
      .catch((err) => {
        console.error('Error al obtener dictados:', err);
        setDictados([]);
      });
  }, []);
  const handleDictadoClick = (dictadoId) => {
    // Acá hay que agregar la lógica para navegar a la página del dictado
    console.log(`Navegando al dictado: ${dictadoId}`);
    // Ejemplo de navegación a una página de dictado específica
    navigate(`/docente/dictado/`, { state: { dictadoId } });
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
