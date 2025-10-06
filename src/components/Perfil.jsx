// src/components/Perfil.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import '../App.css';

export default function Perfil({ userType = 'alumno' }) {
  const [userData, setUserData] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { dni } = useUser();

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

    return userConfig[userType] || userConfig.alumno;
  }, [userType]);

  useEffect(() => {
    if (!dni) return;

    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Determinar endpoint según el tipo de usuario
        const apiEndpoint =
          userType === 'alumno'
            ? `/api/personas/${dni}?includeCurso=true`
            : `/api/personas/${dni}`;

        // Cargar datos básicos del usuario
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar datos');
        }

        console.log('Datos cargados:', data);
        setUserData(data.data);
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
  }, [dni, userType]);

  const handleEditClick = () => {
    console.log('Botón editar presionado. Estado actual isEditing:', isEditing);
    setIsEditing(true);
    console.log('Estado cambiado a isEditing:', true);
  };

  const handleCancelClick = () => {
    console.log('Cancelar presionado');
    setFormData({ ...userData }); // Restaurar datos originales
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

      const response = await fetch(`/api/personas/${dni}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar los datos');
      }

      console.log('Respuesta del servidor:', result);

      // Actualizar el estado local con los datos guardados
      setUserData(result.data);
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

  if (error && !userData) {
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
                    className="input-nombre"
                    placeholder="Nombre"
                    required
                  />
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido || ''}
                    onChange={handleInputChange}
                    className="input-apellido"
                    placeholder="Apellido"
                    required
                  />
                </div>
              ) : (
                `${userData?.nombre || ''} ${userData?.apellido || ''}`
              )}
            </h2>
            {userType === 'alumno' && (
              <p>{config.formatAdditionalInfo(additionalInfo)}</p>
            )}
          </div>
        </div>

        {error && userData && (
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
                <span>{userData?.dni || ''}</span>
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
                  className="input-dato"
                  required
                />
              ) : (
                <span>{userData?.email || ''}</span>
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
                  className="input-dato"
                  required
                />
              ) : (
                <span>{userData?.telefono || ''}</span>
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
                  className="input-dato"
                  required
                />
              ) : (
                <span>{userData?.direccion || ''}</span>
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
                    className="input-dato"
                    placeholder="Especialidad del docente"
                  />
                ) : (
                  <span>{userData?.especialidad || 'No especificada'}</span>
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
