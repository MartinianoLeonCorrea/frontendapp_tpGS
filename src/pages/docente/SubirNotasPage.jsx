// src/pages/docente/notas/SubirNotasPage.jsx
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../App.css';

function SubirNotasPage() {
  const { state } = useLocation();
  console.log('State received from navigation:', state);
  const examenId = state?.examenId?.id || state?.examenId;
  console.log('Examen ID extracted from state:', examenId);
  const dictadoId = state?.dictadoId;
  console.log('Dictado ID extracted from state:', dictadoId);
  const [examen, setExamen] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [notas, setNotas] = useState({});
  const [errors, setErrors] = useState({}); // Corregido: Definición de errors
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false); // Cambiado a un estado global para el modo edición
  const [backupNotas, setBackupNotas] = useState({}); // Para almacenar las notas originales

  useEffect(() => {
    const fetchExamen = async () => {
      try {
        const response = await fetch(`/api/examenes/${examenId}`);
        const data = await response.json();
        setExamen(data.data);
        console.log('Fetched examen data:', data.data);
        if (data.data.alumnos) {
          const sortedAlumnos = [...data.data.alumnos].sort((a, b) =>
            a.apellido.localeCompare(b.apellido)
          );
          setAlumnos(sortedAlumnos);
          console.log('Sorted alumnos:', sortedAlumnos);
        } else {
          console.log('No alumnos found in fetched examen data.');
        }
      } catch (error) {
        console.error('Error fetching examen:', error);
      }
    };

    const fetchDictado = async () => {
      try {
        const response = await fetch(`/api/dictados/${dictadoId}`);
        const result = await response.json();
        console.log('Fetched dictado data:', result);
        if (result) {
          setAlumnos(
            result.curso?.alumnos?.sort((a, b) =>
              a.apellido.localeCompare(b.apellido)
            ) || []
          );
          setExamen((prevExamen) => ({
            ...prevExamen,
            materia: result.materia?.nombre,
          }));
        } else {
          console.log('No dictado data found.');
        }
      } catch (error) {
        console.error('Error fetching dictado:', error);
      }
    };

    const fetchEvaluaciones = async () => {
      try {
        const response = await fetch(`/api/evaluaciones/examen/${examenId}`);
        const data = await response.json();
        console.log('Fetched evaluaciones data:', data.data);

        if (data.data) {
          const existingNotas = {};
          data.data.forEach((evaluacion) => {
            existingNotas[evaluacion.alumnoId] =
              evaluacion.nota === null ? 'ausente' : evaluacion.nota;
          });
          setNotas(existingNotas);
          console.log('Existing notas:', existingNotas);
        }
      } catch (error) {
        console.error('Error fetching evaluaciones:', error);
      }
    };

    if (examenId) {
      fetchExamen();
      fetchEvaluaciones(); // Fetch evaluaciones existentes
    } else {
      console.log('No examen ID available in state.');
    }

    if (dictadoId) {
      fetchDictado();
    } else {
      console.log('No dictado ID available in state.');
    }
  }, [examenId, dictadoId]);

  const handleNotaChange = (dni, value) => {
    const numericValue = parseFloat(value);
    if (value === '') {
      setNotas((prev) => ({ ...prev, [dni]: 'ausente' }));
      setErrors((prev) => ({ ...prev, [dni]: '' }));
    } else if (isNaN(numericValue) || numericValue < 0 || numericValue > 10) {
      setErrors((prev) => ({
        ...prev,
        [dni]: 'La nota debe ser un número entre 0 y 10.',
      }));
    } else {
      setNotas((prev) => ({ ...prev, [dni]: numericValue }));
      setErrors((prev) => ({ ...prev, [dni]: '' }));
    }
  };

  const handleStartEdit = () => {
    setBackupNotas(notas); // Guardar una copia de las notas actuales
    setEditMode(true); // Activar el modo edición
  };

  const handleConfirmChanges = async () => {
    try {
      const evaluaciones = Object.entries(notas).map(([dni, nota]) => ({
        alumnoId: dni,
        examenId,
        nota: nota === 'ausente' ? null : Number(nota), // Asegurar que la nota sea un número
        observacion: nota === 'ausente' ? 'Ausente' : null, // Observación para ausentes
      }));

      console.log('Datos preparados para enviar al backend:', evaluaciones); // Log para verificar los datos

      const response = await fetch('/api/evaluaciones/batch-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ evaluaciones }),
      });

      if (response.ok) {
        console.log('Notas registradas correctamente.');
        setSubmissionSuccess(true);
        setEditMode(false); // Salir del modo edición
      } else {
        const errorData = await response.json();
        console.error('Error al registrar las notas:', errorData);
        alert(`Hubo un error al confirmar los cambios: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al confirmar los cambios:', error);
      alert('Hubo un error al confirmar los cambios.');
    }
  };

  const handleCancelEdit = () => {
    setNotas(backupNotas); // Restaurar las notas originales
    setEditMode(false); // Salir del modo edición
  };

  const handleAusenteChange = (dni, isAusente) => {
    if (isAusente) {
      setNotas((prev) => ({ ...prev, [dni]: 'ausente' }));
      setEditMode((prev) => ({ ...prev, [dni]: false })); // Desactivar edición si está ausente
    } else {
      setNotas((prev) => ({ ...prev, [dni]: '' })); // Limpiar la nota
    }
  };

  if (!examenId) return <p>No se seleccionó un examen.</p>;
  if (!examen) return <p>Cargando examen...</p>;

  return (
    <div className="subir-notas-page">
      <div className="evaluacion-examen-card">
        <h2 className="examen-title">
          Examen de {examen?.materia || 'Materia no especificada'}
        </h2>
        <div className="examen-details">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(examen.fecha_examen).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📚</span>
            <p>
              <strong>Temas:</strong> {examen.temas}
            </p>
          </div>
        </div>
      </div>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <div className="alumnos-section">
        <h2 className="section-title">Lista de Alumnos</h2>
        {alumnos.length === 0 ? (
          <div className="no-data-card">
            <p>No hay alumnos registrados para este examen.</p>
          </div>
        ) : (
          <div className="alumnos-table-wrapper">
            <div className="alumnos-table">
              <div className="alumnos-header">
                <div className="header-cell">Alumno</div>
                <div className="header-cell">Nota</div>
                <div className="header-cell">Ausente</div>
              </div>
              <ul className="alumnos-list" role="list">
                {alumnos.map((alumno) => (
                  <li
                    key={alumno.dni}
                    className={`alumno-item ${
                      notas[alumno.dni] === 'ausente' ? 'alumno-ausente' : ''
                    }`}
                  >
                    <div className="cell alumno-info">
                      <strong>
                        {alumno.apellido}, {alumno.nombre}
                      </strong>
                    </div>
                    <div className="cell nota-display">
                      {editMode ? (
                        <input
                          type="number"
                          className={`nota-input ${
                            errors[alumno.dni] ? 'error' : ''
                          }`}
                          value={notas[alumno.dni] || ''}
                          onChange={(e) =>
                            handleNotaChange(alumno.dni, e.target.value)
                          }
                          placeholder="0-10"
                          min="0"
                          max="10"
                          step="0.1"
                        />
                      ) : (
                        <span
                          className={`nota-value ${
                            notas[alumno.dni] === 'ausente'
                              ? 'ausente-text'
                              : ''
                          }`}
                        >
                          {notas[alumno.dni] || 'Sin calificar'}
                        </span>
                      )}
                    </div>
                    <div className="cell ausente-checkbox">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={notas[alumno.dni] === 'ausente'}
                          onChange={(e) =>
                            handleAusenteChange(alumno.dni, e.target.checked)
                          }
                          disabled={!editMode} // Deshabilitar si no está en modo edición
                        />
                        <span className="ausente-label">Ausente</span>
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="submit-section">
        {!editMode ? (
          <button className="btn-modificar-notas" onClick={handleStartEdit}>
            ✏️ Modificar Notas
          </button>
        ) : (
          <>
            <button
              className="btn-confirmar-cambios"
              onClick={handleConfirmChanges}
            >
              💾 Publicar Cambios
            </button>
            <button className="btn-cancelar" onClick={handleCancelEdit}>
              Cancelar
            </button>
          </>
        )}
      </div>

      {submissionSuccess && (
        <div className="success-message">
          ✅ Las notas se han subido correctamente.
        </div>
      )}
    </div>
  );
}

export default SubirNotasPage;
