// src/components/Perfil.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import '../App.css';

export default function Perfil() {
  const { userData, isAlumno, isDocente } = useUser(); // Obtener datos del contexto
  const userType = isAlumno ? 'alumno' : isDocente ? 'docente' : null; // Determinar el tipo de usuario dinámicamente

  const [userDataState, setUserDataState] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Configuración específica por tipo de usuario (solo para formateo)
  const config = useMemo(() => {
    const userConfig = {
      alumno: {
        icon: '🎓',
        title: 'Alumno',
        formatAdditionalInfo: (info) =>
          `[${info?.nro_letra || ''} - ${info?.turno || ''}]`,
      },
      docente: {
        icon: '👨‍🏫',
        title: 'Docente',
        formatAdditionalInfo: () => '', // No mostrar dictados asignados
      },
    };

    return userConfig[userType] || {};
  }, [userType]);

  useEffect(() => {
    if (!userData) return;

    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Determinar endpoint según el tipo de usuario
        const apiEndpoint =
          userType === 'alumno'
            ? `/api/personas/${userData.dni}?includeCurso=true`
            : `/api/personas/${userData.dni}`;

        // Cargar datos básicos del usuario
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar datos');
        }

        console.log('Datos cargados:', data);
        setUserDataState(data.data);
        setFormData(data.data);

        // Cargar información adicional específica por tipo de usuario
        let additionalData = null;
        if (userType === 'alumno') {
          additionalData = data.data?.curso;
        }
        setAdditionalInfo(additionalData);
      } catch (err) {
        setError(`No se pudieron cargar los datos del ${userType}.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userData, userType]);

  const handleEditClick = () => {
    console.log('Botón editar presionado. Estado actual isEditing:', isEditing);
    setIsEditing(true);
    console.log('Estado cambiado a isEditing:', true);
  };

  const handleCancelClick = () => {
    console.log('Cancelar presionado');
    setFormData({ ...userDataState }); // Restaurar datos originales
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Cambio en campo ${name}:`, value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulario enviado con datos:', formData);

    setIsSaving(true);
    setError(null);
    setFieldErrors({}); // Reset field errors before submission

    try {
      // Preparar datos para enviar (excluir campos que no deben actualizarse)
      const dataToUpdate = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
      };

      // Si es docente, incluir especialidad si existe
      if (userType === 'docente' && formData.especialidad !== undefined) {
        dataToUpdate.especialidad = formData.especialidad;
      }

      console.log('Enviando datos al servidor:', dataToUpdate);

      const response = await fetch(`/api/personas/${userData.dni}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const newFieldErrors = {};
          result.errors.forEach((err) => {
            newFieldErrors[err.field] = err.message;
          });
          setFieldErrors(newFieldErrors);
        }
        throw new Error(result.message || 'Error al actualizar los datos');
      }

      console.log('Respuesta del servidor:', result);

      // Actualizar el estado local con los datos guardados
      setUserDataState(result.data);
      setFormData(result.data);
      setIsEditing(false);

      // Mostrar mensaje de éxito
      alert('¡Datos guardados correctamente!');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setError(`Error al guardar los datos: ${error.message}`);
      alert(`Error al guardar los datos: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="perfil-container">
        <div className="perfil-card">
          <p>Cargando perfil...</p>
        </div>
      </main>
    );
  }

  if (error && !userDataState) {
    return (
      <main className="perfil-container">
        <div className="perfil-card">
          <p className="error-message">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            <span className="perfil-icon">{config.icon}</span>
            <p>{config.title}</p>
          </div>
          <div className="perfil-info-principal">
            <h2>
              {isEditing ? (
                <div className="nombre-editing">
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre || ''}
                    onChange={handleInputChange}
                    className={`input-nombre ${
                      fieldErrors.nombre ? 'input-error' : ''
                    }`}
                    placeholder="Nombre"
                    required
                  />
                  {fieldErrors.nombre && (
                    <span className="error-text">{fieldErrors.nombre}</span>
                  )}
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido || ''}
                    onChange={handleInputChange}
                    className={`input-apellido ${
                      fieldErrors.apellido ? 'input-error' : ''
                    }`}
                    placeholder="Apellido"
                    required
                  />
                  {fieldErrors.apellido && (
                    <span className="error-text">{fieldErrors.apellido}</span>
                  )}
                </div>
              ) : (
                `${userDataState?.nombre || ''} ${
                  userDataState?.apellido || ''
                }`
              )}
            </h2>
            {userType === 'alumno' && (
              <p>{config.formatAdditionalInfo(additionalInfo)}</p>
            )}
          </div>
        </div>

        {error && userDataState && (
          <div
            className="error-message"
            style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
            }}
          >
            {error}
          </div>
        )}

        <div className="perfil-datos-personales">
          <h3>Datos personales</h3>
          <div className="datos-lista">
            <div className="dato-item">
              <strong>DNI:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="dni"
                  value={formData.dni || ''}
                  onChange={handleInputChange}
                  className="input-dato"
                  disabled // DNI no debería ser editable
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
              ) : (
                <span>{userDataState?.dni || ''}</span>
              )}
            </div>

            <div className="dato-item">
              <strong>Correo electrónico:</strong>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className={`input-dato ${
                    fieldErrors.email ? 'input-error' : ''
                  }`}
                  required
                />
              ) : (
                <span>{userDataState?.email || ''}</span>
              )}
              {fieldErrors.email && (
                <span className="error-text">{fieldErrors.email}</span>
              )}
            </div>

            <div className="dato-item">
              <strong>Teléfono de contacto:</strong>
              {isEditing ? (
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleInputChange}
                  className={`input-dato ${
                    fieldErrors.telefono ? 'input-error' : ''
                  }`}
                  required
                />
              ) : (
                <span>{userDataState?.telefono || ''}</span>
              )}
              {fieldErrors.telefono && (
                <span className="error-text">{fieldErrors.telefono}</span>
              )}
            </div>

            <div className="dato-item">
              <strong>Dirección:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleInputChange}
                  className={`input-dato ${
                    fieldErrors.direccion ? 'input-error' : ''
                  }`}
                  required
                />
              ) : (
                <span>{userDataState?.direccion || ''}</span>
              )}
              {fieldErrors.direccion && (
                <span className="error-text">{fieldErrors.direccion}</span>
              )}
            </div>

            {/* Mostrar especialidad solo para docentes */}
            {userType === 'docente' && (
              <div className="dato-item">
                <strong>Especialidad:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="especialidad"
                    value={formData.especialidad || ''}
                    onChange={handleInputChange}
                    className={`input-dato ${
                      fieldErrors.especialidad ? 'input-error' : ''
                    }`}
                    placeholder="Especialidad del docente"
                  />
                ) : (
                  <span>
                    {userDataState?.especialidad || 'No especificada'}
                  </span>
                )}
                {fieldErrors.especialidad && (
                  <span className="error-text">{fieldErrors.especialidad}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="perfil-acciones">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEditClick}
              className="btn-editar"
            >
              Editar Datos
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="form-botones">
              <button
                type="submit"
                className="btn-confirmar"
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Confirmar Cambios'}
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                className="btn-cancelar"
                disabled={isSaving}
              >
                Cancelar
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
