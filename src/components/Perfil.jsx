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
  const [error, setError] = useState(null);
  const { dni } = useUser();

  // Configuración específica por tipo de usuario (solo para formateo)
  const config = useMemo(() => {
    const userConfig = {
      alumno: {
        icon: '🎓',
        formatAdditionalInfo: (info) => `[${info?.nro_letra || ''} - ${info?.turno || ''}]`
      },
      docente: {
        icon: '👨‍🏫',
        formatAdditionalInfo: (dictados) => {
          if (!Array.isArray(dictados) || dictados.length === 0) {
            return 'Sin dictados asignados';
          }
          return `${dictados.length} dictado${dictados.length > 1 ? 's' : ''} asignado${dictados.length > 1 ? 's' : ''}`;
        }
      }
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
        const apiEndpoint = userType === 'alumno' 
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
          // Para alumnos, usar los datos del curso ya incluidos
          additionalData = data.data?.curso;
        } else if (userType === 'docente') {
          // Para docentes, hacer llamada paralela para dictados (más eficiente)
          try {
            const dictadosRes = await fetch(`/api/dictados/persona/${dni}`);
            const dictadosData = await dictadosRes.json();
            additionalData = Array.isArray(dictadosData) ? dictadosData : [];
          } catch (dictadosError) {
            console.error('Error al cargar dictados:', dictadosError);
            additionalData = [];
          }
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
  }, [dni, userType]); // Dependencias mínimas

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
    
    try {
      // Aquí podrías agregar la lógica para enviar los datos al backend
      // const response = await fetch(`/api/personas/${dni}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Por ahora solo actualizamos el estado local
      setUserData({ ...formData });
      setIsEditing(false);
      alert('¡Datos guardados correctamente!');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Error al guardar los datos. Por favor, intenta de nuevo.');
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

  if (error) {
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
                  />
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido || ''}
                    onChange={handleInputChange}
                    className="input-apellido"
                    placeholder="Apellido"
                  />
                </div>
              ) : (
                `${userData?.nombre || ''} ${userData?.apellido || ''}`
              )}
            </h2>
            <p>
              {config.formatAdditionalInfo(additionalInfo)}
            </p>
          </div>
        </div>

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
                />
              ) : (
                <span>{userData?.direccion || ''}</span>
              )}
            </div>
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
              <button type="submit" className="btn-confirmar">
                Confirmar Cambios
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                className="btn-cancelar"
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