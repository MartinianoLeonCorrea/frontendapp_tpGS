// src/pages/alumno/ExamenPage.jsx
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

function ExamenesPage() {
  const [examenes, setExamenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('proximos');
  const [orden, setOrden] = useState('asc');
  const [fade, setFade] = useState(false);
  const { dni } = useUser();

  useEffect(() => {
    if (!dni) return;
    
    const fetchExamenes = async () => {
      setIsLoading(true);
      try {
        // 1. Obtener curso del alumno
        const alumnoRes = await fetch(`/api/personas/${dni}`);
        const alumnoData = await alumnoRes.json();
        const cursoId = alumnoData.data?.cursoId;
        
        if (!cursoId) {
          console.error('No se encontró cursoId para el alumno');
          setExamenes([]);
          setIsLoading(false);
          return;
        }

        console.log('CursoId del alumno:', cursoId);

        // 2. Obtener dictados del curso usando la ruta correcta
        const dictadosRes = await fetch(`/api/dictados/curso/${cursoId}`);
        const dictadosData = await dictadosRes.json();
        
        console.log('Respuesta de dictados:', dictadosData);
        
        // La respuesta puede venir directamente como array o dentro de .data
        const dictados = Array.isArray(dictadosData) 
          ? dictadosData 
          : (dictadosData.data || []);

        console.log('Dictados encontrados:', dictados);

        if (dictados.length === 0) {
          console.log('No hay dictados para este curso');
          setExamenes([]);
          setIsLoading(false);
          return;
        }

        // 3. Obtener exámenes para cada dictado
        const examenesPromises = dictados.map(async (dictado) => {
          try {
            const examenesRes = await fetch(`/api/examenes?dictadoId=${dictado.id}`);
            const examenesData = await examenesRes.json();
            const examenesDictado = examenesData.data || [];
            
            // Agregar información del dictado a cada examen
            return examenesDictado.map((examen) => ({
              ...examen,
              materia: dictado.materia || examen.dictado?.materia,
              docente: dictado.docente || examen.dictado?.docente,
            }));
          } catch (error) {
            console.error(`Error al obtener exámenes del dictado ${dictado.id}:`, error);
            return [];
          }
        });

        const examenesArrays = await Promise.all(examenesPromises);
        const todosExamenes = examenesArrays.flat();

        console.log('Total de exámenes encontrados:', todosExamenes.length);
        setExamenes(todosExamenes);
      } catch (error) {
        console.error('Error al cargar los exámenes:', error);
        setExamenes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamenes();
  }, [dni]);

  function formatFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  // Filtrado de exámenes
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let examenesFiltrados = examenes.filter((examen) => {
    const fechaExamen = new Date(examen.fecha_examen);
    fechaExamen.setHours(0, 0, 0, 0);
    if (filtro === 'proximos') return fechaExamen >= hoy;
    if (filtro === 'pasados') return fechaExamen < hoy;
    return true; // todos
  });

  examenesFiltrados = [...examenesFiltrados].sort((a, b) => {
    const fechaA = new Date(a.fecha_examen);
    const fechaB = new Date(b.fecha_examen);
    return orden === 'asc' ? fechaA - fechaB : fechaB - fechaA;
  });

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => setFade(false), 350);
    return () => clearTimeout(timeout);
  }, [filtro, orden]);

  return (
    <div className="examenes-page">
      <div className="examenes-filtros">
        <span>Filtrar: </span>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="examenes-select"
        >
          <option value="todos">Todos</option>
          <option value="proximos">Próximos</option>
          <option value="pasados">Pasados</option>
        </select>
        <span style={{ marginLeft: '16px' }}>Ordenar: </span>
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="examenes-select"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
      <div className={`examenes-listado${fade ? ' fade' : ''}`}>
        {isLoading ? (
          <p>Cargando exámenes...</p>
        ) : examenesFiltrados.length === 0 ? (
          <p>No hay exámenes asignados.</p>
        ) : (
          <ul className="examenes-list">
            {examenesFiltrados.map((examen) => (
              <li key={examen.id} className="examen-card">
                <div className="examen-header">
                  <span className="examen-materia">
                    <strong>{examen.materia?.nombre || 'Materia'}</strong>
                  </span>
                  <span className="examen-fecha">
                    {formatFecha(examen.fecha_examen)}
                  </span>
                </div>
                <div className="examen-docente">
                  <span>
                    <strong>Docente:</strong>{' '}
                    {examen.docente
                      ? `${examen.docente.nombre} ${examen.docente.apellido}`
                      : 'Sin docente asignado'}
                  </span>
                </div>
                <div className="examen-temas">
                  <span>
                    <strong>Temas:</strong> {examen.temas}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExamenesPage;