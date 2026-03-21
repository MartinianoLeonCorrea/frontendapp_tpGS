import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { evaluacionSchema } from '../../schemas/evaluacionSchema';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css';

// Utilidad para obtener la fecha del examen robusta
function getFechaExamen(examen) {
  return examen?.fecha_examen || examen?.fechaExamen || null;
}

function SubirNotasPage() {
  const { state } = useLocation();
  const examenId = state?.examenId?.id || state?.examenId;
  const dictadoId = state?.dictadoId;

  const [examen, setExamen] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [notas, setNotas] = useState({});
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [backupNotas, setBackupNotas] = useState({});
  const [evaluacionesExistentes, setEvaluacionesExistentes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let serverError = false;
    const fetchExamen = async () => {
      try {
        const response = await fetch(`/api/examenes/${examenId}`);
        if (!response.ok) throw new Error('Error al cargar el examen');
        const data = await response.json();
        const examenData = data.data ?? null;
        setExamen(examenData);
        return examenData;
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          serverError = true;
        }
        console.error('Error fetching examen:', error);
        throw error;
      }
    };

    const fetchDictado = async (resolvedDictadoId) => {
      if (!resolvedDictadoId) {
        setAlumnos([]);
        return;
      }
      try {
        const response = await fetch(`/api/dictados/${resolvedDictadoId}`);
        if (!response.ok) throw new Error('Error al cargar el dictado');
        const result = await response.json();
        const dictado = result.data ?? null;
      
        const alumnosCurso = dictado?.curso?.alumnos
          ? [...dictado.curso.alumnos].sort((a, b) =>
              a.apellido.localeCompare(b.apellido)
            )
          : [];
        setAlumnos(alumnosCurso);

        // Materia desde dictado.materia
        setExamen((prevExamen) => ({
          ...prevExamen,
          materia:
            dictado?.materia?.nombre ||
            prevExamen?.materia ||
            'Materia no especificada',
        }));
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          serverError = true;
        }
        console.error('Error fetching dictado:', error);
        throw error;
      }
    };

    const fetchEvaluaciones = async () => {
      try {
        const response = await fetch(`/api/evaluaciones/examen/${examenId}`);
        if (!response.ok) throw new Error('Error al cargar las evaluaciones');
        const data = await response.json();
        if (data.data) {
          const existingNotas = {};
          const existingEvaluaciones = {};
          data.data.forEach((evaluacion) => {
            const dniAlumno = Number(
              evaluacion.alumnoId ?? evaluacion.alumno?.dni
            );
            if (!Number.isInteger(dniAlumno) || dniAlumno <= 0) {
              return;
            }

            existingNotas[dniAlumno] = {
              nota: evaluacion.nota !== null ? evaluacion.nota : '',
              ausente:
                evaluacion.observacion === 'Ausente' ||
                evaluacion.observacion?.includes('Ausente'),
            };

            if (Number.isInteger(Number(evaluacion.id))) {
              existingEvaluaciones[dniAlumno] = Number(evaluacion.id);
            }
          });
          setNotas(existingNotas);
          setEvaluacionesExistentes(existingEvaluaciones);
        }
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          serverError = true;
        }
        console.error('Error fetching evaluaciones:', error);
        throw error;
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const [examenData] = await Promise.all([fetchExamen(), fetchEvaluaciones()]);
        const resolvedDictadoId =
          dictadoId || examenData?.dictado?.id || examenData?.dictadoId;
        await fetchDictado(resolvedDictadoId);
      } catch (error) {
        if (serverError) {
          setLoading(false);
          setExamen('SERVER_ERROR');
          return;
        }
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los datos del examen');
      } finally {
        setLoading(false);
      }
    };

    if (!examenId) {
      toast.error('No se seleccionó un examen');
      return;
    }
    fetchData();
  }, [examenId, dictadoId]);

  const validateNota = async (alumnoId, nota) => {
    try {
      await evaluacionSchema.validate(
        {
          nota: nota === '' ? null : nota,
          observacion: null,
          alumnoId,
          examenId,
        },
        { abortEarly: false }
      );
      return null;
    } catch (err) {
      return err.errors[0];
    }
  };

  const handleNotaChange = async (dni, value) => {
    const dniNumber = Number(dni);
    if (!Number.isInteger(dniNumber) || dniNumber <= 0) {
      return;
    }

    if (value === '') {
      setNotas((prev) => ({
        ...prev,
        [dniNumber]: {
          ...prev[dniNumber],
          nota: '',
        },
      }));
      setErrors((prev) => ({ ...prev, [dniNumber]: '' }));
      return;
    }

    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      setErrors((prev) => ({
        ...prev,
        [dniNumber]: 'La nota debe ser un número válido',
      }));
      return;
    }

    // Validar con el schema
    const error = await validateNota(dniNumber, numericValue);

    if (error) {
      setErrors((prev) => ({ ...prev, [dniNumber]: error }));
    } else {
      setNotas((prev) => ({
        ...prev,
        [dniNumber]: {
          ...prev[dniNumber],
          nota: numericValue,
        },
      }));
      setErrors((prev) => ({ ...prev, [dniNumber]: '' }));
    }
  };

  const handleStartEdit = () => {
    setBackupNotas({ ...notas });
    setEditMode(true);
    toast.info('Modo de edición activado');
  };

  const handleAusenteChange = (dni, isAusente) => {
    const dniNumber = Number(dni);
    if (!Number.isInteger(dniNumber) || dniNumber <= 0) {
      return;
    }

    setNotas((prev) => ({
      ...prev,
      [dniNumber]: {
        nota: prev[dniNumber]?.nota ?? '',
        ausente: isAusente,
      },
    }));
  };

  const handleConfirmChanges = async () => {
    // Validar que no haya errores
    const hasErrors = Object.values(errors).some((error) => error !== '');
    if (hasErrors) {
      toast.error('Por favor corrige los errores antes de continuar');
      return;
    }

    try {
      const evaluacionesParaCrear = [];
      const evaluacionesParaActualizar = [];

      alumnos
        .map((alumno) => {
          const dni = Number(alumno.dni);
          if (!Number.isInteger(dni) || dni <= 0) return null;

          const data = notas[dni] ?? { nota: '', ausente: false };
          const notaValue = data?.nota !== '' ? Number(data?.nota) : null;
          const isAusente = data?.ausente || false;
          const observacion = isAusente ? 'Ausente' : null;
          const evaluacionId = evaluacionesExistentes[dni];

          const payloadBase = {
            alumnoId: dni,
            examenId: Number(examenId),
            nota: Number.isNaN(notaValue) ? null : notaValue,
            observacion,
          };

          if (evaluacionId) {
            evaluacionesParaActualizar.push({
              id: Number(evaluacionId),
              ...payloadBase,
            });
            return payloadBase;
          }

          if (payloadBase.nota !== null || payloadBase.observacion !== null) {
            evaluacionesParaCrear.push(payloadBase);
          }

          return payloadBase;
        })
        .filter(Boolean);

      // Validar cada evaluación antes de enviar
      const validationPromises = [...evaluacionesParaCrear, ...evaluacionesParaActualizar].map((evaluacion) =>
        evaluacionSchema.validate(evaluacion)
      );

      await Promise.all(validationPromises);

      if (evaluacionesParaActualizar.length > 0) {
        const updateResponse = await fetch('/api/evaluaciones/batch-update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ evaluaciones: evaluacionesParaActualizar }),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.message || 'Error al actualizar las notas');
        }
      }

      if (evaluacionesParaCrear.length > 0) {
        const createResponse = await fetch('/api/evaluaciones/batch-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ evaluaciones: evaluacionesParaCrear }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(errorData.message || 'Error al registrar las notas');
        }
      }

      toast.success(' Notas publicadas correctamente');
      setEditMode(false);
      setBackupNotas({});

      // Recargar mapeo de evaluaciones para mantener ids actualizados y evitar duplicados en próximas ediciones
      const reloadResponse = await fetch(`/api/evaluaciones/examen/${examenId}`);
      if (reloadResponse.ok) {
        const reloadData = await reloadResponse.json();
        if (reloadData?.data) {
          const existingEvaluaciones = {};
          reloadData.data.forEach((evaluacion) => {
            const dniAlumno = Number(
              evaluacion.alumnoId ?? evaluacion.alumno?.dni
            );
            if (
              Number.isInteger(dniAlumno) &&
              dniAlumno > 0 &&
              Number.isInteger(Number(evaluacion.id))
            ) {
              existingEvaluaciones[dniAlumno] = Number(evaluacion.id);
            }
          });
          setEvaluacionesExistentes(existingEvaluaciones);
        }
      }
    } catch (error) {
      console.error('Error al confirmar los cambios:', error);
      toast.error(` ${error.message || 'Error al confirmar los cambios'}`);
    }
  };

  const handleCancelEdit = () => {
    setNotas({ ...backupNotas });
    setEditMode(false);
    setErrors({});
    toast.info('Cambios cancelados');
  };

  if (loading) {
    return (
      <div className="subir-notas-page">
        <p>Cargando datos del examen...</p>
      </div>
    );
  }

  if (!examenId) {
    return (
      <div className="subir-notas-page">
        <p>No se seleccionó un examen.</p>
      </div>
    );
  }

  if (examen === 'SERVER_ERROR') {
    return (
      <div className="subir-notas-page">
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ❌ No se pudo conectar con el servidor. Por favor, verifica la conexión o intenta más tarde.
        </p>
      </div>
    );
  }

  if (!examen) {
    return (
      <div className="subir-notas-page">
        <p>No se pudo cargar el examen.</p>
      </div>
    );
  }

  return (
    <div className="subir-notas-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="evaluacion-examen-card">
        <h2 className="examen-title">
          Examen de {examen?.materia || 'materia no especificada'}
        </h2>
        <div className="examen-details">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <p>
              <strong>Fecha:</strong>{' '}
              {(() => {
                const rawFecha = getFechaExamen(examen);
                if (!rawFecha) return 'Fecha no especificada';
                const fechaObj = new Date(rawFecha);
                if (Number.isNaN(fechaObj.getTime())) return 'Fecha inválida';
                return fechaObj.toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
              })()}
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
                {alumnos.map((alumno) => {
                  const alumnoData = {
                    nota: notas[alumno.dni]?.nota ?? '',
                    ausente: notas[alumno.dni]?.ausente ?? false,
                  };
                  return (
                    <li
                      key={alumno.dni}
                      className={`alumno-item ${
                        alumnoData.ausente ? 'alumno-ausente' : ''
                      }`}
                    >
                      <div className="cell alumno-info">
                        <strong>
                          {alumno.apellido}, {alumno.nombre}
                        </strong>
                      </div>
                      <div className="cell nota-display">
                        {editMode ? (
                          <>
                            <input
                              type="number"
                              className={`nota-input ${
                                errors[alumno.dni] ? 'error' : ''
                              }`}
                              value={alumnoData.nota ?? ''}
                              onChange={(e) =>
                                handleNotaChange(alumno.dni, e.target.value)
                              }
                              placeholder="0-10"
                              min="0"
                              max="10"
                              step="0.1"
                            />
                            {errors[alumno.dni] && (
                              <span className="form-error">
                                {errors[alumno.dni]}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="nota-value">
                            {alumnoData.nota !== ''
                              ? alumnoData.nota
                              : 'Sin calificar'}
                          </span>
                        )}
                      </div>
                      <div className="cell ausente-checkbox">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={alumnoData.ausente}
                            onChange={(e) =>
                              handleAusenteChange(alumno.dni, e.target.checked)
                            }
                            disabled={!editMode}
                          />
                          <span className="ausente-label">Ausente</span>
                        </label>
                      </div>
                    </li>
                  );
                })}
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
    </div>
  );
}

export default SubirNotasPage;
