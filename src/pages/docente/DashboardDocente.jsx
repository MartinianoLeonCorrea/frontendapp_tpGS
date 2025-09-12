import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardDictado } from '../../components/CardDictado.jsx';
import { useUser } from '../../context/UserContext';

function DashboardDocente() {
  const [dictados, setDictados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dni } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!dni) return; // No ejecutar si el dni no está definido

    const fetchDictados = async () => {
      setIsLoading(true);

      try {
        // Obtener dictados asociados al docente
        const dictadosRes = await fetch(`/api/dictados/persona/${dni}`);
        const dictadosData = await dictadosRes.json();
        console.log('Dictados recibidos:', dictadosData);

        // Hacer que siempre sea un array para evitar errores
        const todosDictados = Array.isArray(dictadosData) ? dictadosData : [];
        console.log(
          'Tipo de todosDictados:',
          Array.isArray(todosDictados),
          todosDictados
        );

        setDictados(todosDictados);
      } catch (error) {
        setDictados([]);
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
            {/* Puedes agregar aquí novedades específicas del docente */}
            <div className="news-list">
              <div className="info-placeholder">
                Ejemplo de novedad para docentes.
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default DashboardDocente;
