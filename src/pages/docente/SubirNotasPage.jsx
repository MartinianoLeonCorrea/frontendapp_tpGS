import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { evaluacionSchema } from '../../schemas/evaluacionSchema';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examenId) {
      toast.error('No se seleccionó un examen');
      return;
    }
    fetchData();
  }, [examenId, dictadoId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchExamen(),
        fetchDictado(),
        fetchEvaluaciones(),
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos del examen');
    } finally {
      setLoading(false);
    }
  };

  const fetchExamen = async () => {
    try {
      const response = await fetch(`/api/examenes/${examenId}`);
      if (!response.ok) throw new Error('Error al cargar el examen');
      
      const data = await response.json();
      setExamen(data.data);
      
      if (data.data.alumnos) {
        const sortedAlumnos = [...data.data.alumnos].sort((a, b) =>
          a.apellido.localeCompare(b.apellido)
        );
        setAlumnos(sortedAlumnos);
      }
    } catch (error) {
      console.error('Error fetching examen:', error);
      throw error;
    }
  };

  const fetchDictado = async () => {
    if (!dictadoId) return;
    
    try {
      const response = await fetch(`/api/dictados/${dictadoId}`);
      if (!response.ok) throw new Error('Error al cargar el dictado');
      
      const result = await response.json();
      
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
      }
    } catch (error) {
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
        data.data.forEach((evaluacion) => {
          existingNotas[evaluacion.alumnoId] = {
            nota: evaluacion.nota !== null ? evaluacion.nota : '',
            ausente:
              evaluacion.observaciones === 'Ausente' ||
              evaluacion.observaciones?.includes('Ausente'),
          };
        });
        setNotas(existingNotas);
      }
    } catch (error) {
      console.error('Error fetching evaluaciones:', error);
      throw error;
    }
  };

  const validateNota = async (alumnoId, nota) => {
    try {
      await evaluacionSchema.validate(
        {
          nota: nota === '' ? null : nota,
          observaciones: null,
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
    if (value === '') {
      setNotas((prev) => ({
        ...prev,
        [dni]: {
          ...prev[dni],
          nota: '',
        },
      }));
      setErrors((prev) => ({ ...prev, [dni]: '' }));
      return;
    }

    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) {
      setErrors((prev) => ({
        ...prev,
        [dni]: 'La nota debe ser un número válido',
      }));
      return;
    }

    // Validar con el schema
    const error = await validateNota(dni, numericValue);
    
    if (error) {
      setErrors((prev) => ({ ...prev, [dni]: error }));
    } else {
      setNotas((prev) => ({
        ...prev,
        [dni]: {
          ...prev[dni],
          nota: numericValue,
        },
      }));
      setErrors((prev) => ({ ...prev, [dni]: '' }));
    }
  };

  const handleStartEdit = () => {
    setBackupNotas({ ...notas });
    setEditMode(true);
    toast.info('Modo de edición activado');
  };

  const handleAusenteChange = (dni, isAusente) => {
    setNotas((prev) => ({
      ...prev,
      [dni]: {
        nota: prev[dni]?.nota || '',
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
      const evaluaciones = Object.entries(notas).map(([dni, data]) => {
        const notaValue = data?.nota !== '' ? Number(data?.nota) : null;
        const isAusente = data?.ausente || false;

        return {
          alumnoId: Number(dni),
          examenId: Number(examenId),
          nota: notaValue,
          observaciones: isAusente ? 'Ausente' : null,
        };
      });

      // Validar cada evaluación antes de enviar
      const validationPromises = evaluaciones.map((evaluacion) =>
        evaluacionSchema.validate(evaluacion)
      );

      await Promise.all(validationPromises);

      const response = await fetch('/api/evaluaciones/batch-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ evaluaciones }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar las notas');
      }

      toast.success('✅ Notas publicadas correctamente');
      setEditMode(false);
      setBackupNotas({});
    } catch (error) {
      console.error('Error al confirmar los cambios:', error);
      toast.error(`❌ ${error.message || 'Error al confirmar los cambios'}`);
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
                  const alumnoData = notas[alumno.dni] || {
                    nota: '',
                    ausente: false,
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
                              value={
                                alumnoData.nota !== undefined
                                  ? alumnoData.nota
                                  : ''
                              }
                              onChange={(e) =>
                                handleNotaChange(alumno.dni, e.target.value)
                              }
                              placeholder="0-10"
                              min="0"
                              max="10"
                              step="0.1"
                              disabled={alumnoData.ausente}
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
              ❌ Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SubirNotasPage;