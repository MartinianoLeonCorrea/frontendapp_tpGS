// src/pages/alumno/NotasPage.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

function NotasPage() {
  const { dni } = useUser();
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    async function fetchEvaluaciones() {
      if (!dni) {
        console.log('DNI no disponible, no se pueden cargar las evaluaciones.');
        return;
      }

      try {
        console.log('Obteniendo evaluaciones para el alumno con DNI:', dni);
        const response = await fetch(`/api/evaluaciones/alumno/${dni}`);
        const result = await response.json();
        console.log('Evaluaciones obtenidas:', result);

        if (result.data && Array.isArray(result.data)) {
          setEvaluaciones(result.data); // Asignar solo si es un array
        } else {
          console.error('Respuesta inesperada del backend:', result);
          setEvaluaciones([]); // Evitar errores si la respuesta no es válida
        }
      } catch (error) {
        console.error('Error al obtener las evaluaciones:', error);
        setEvaluaciones([]); // Evitar errores si la solicitud falla
      }
    }

    fetchEvaluaciones();
  }, [dni]);

  return (
    <div className="notas-page">
      <div className="notas-listado">
        {evaluaciones.length === 0 ? (
          <p>No hay evaluaciones disponibles.</p>
        ) : (
          <ul>
            {evaluaciones.map((evaluacion) => (
              <li key={evaluacion.id} className="evaluacion-item">
                <strong>Materia:</strong>{' '}
                {evaluacion.examen?.dictado?.materia?.nombre || 'Sin materia'}
                <br />
                <strong>Tema:</strong> {evaluacion.examen?.temas || 'Sin tema'}
                <br />
                <strong>Nota:</strong> {evaluacion.nota || 'Sin nota'}
                <br />
                {evaluacion.observacion && (
                  <>
                    <strong>Observaciones:</strong> {evaluacion.observacion}
                    <br />
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotasPage;
