// src/pages/alumno/PerfilAlumno.jsx

import React, { useState, useEffect } from 'react';
import './PerfilAlumno.css'; 

const alumnoService = {
  getAlumno: () => {
    return Promise.resolve({
      nombre: 'Juan',
      apellido: 'Pérez',
      curso: '3° Año "A"',
      dni: '1234567',
      email: 'juan.perez@example.com',
      telefono: '11-2233-4455',
      direccion: 'Av. Siempre Viva 742',
    });
  },
};

export default function PerfilAlumno() {
  const [alumno, setAlumno] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    alumnoService.getAlumno()
      .then(data => {
        console.log('Datos cargados:', data);
        setAlumno(data);
        setFormData(data);
      })
      .catch(err => {
        setError('No se pudieron cargar los datos del alumno.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    console.log('Botón editar presionado. Estado actual isEditing:', isEditing);
    setIsEditing(true);
    console.log('Estado cambiado a isEditing:', true);
  };

  const handleCancelClick = () => {
    console.log('Cancelar presionado');
    setFormData({ ...alumno }); // Restaurar datos originales
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Cambio en campo ${name}:`, value);
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado con datos:', formData);
    setAlumno({ ...formData });
    setIsEditing(false);
    alert('¡Datos guardados correctamente!');
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
            <span className="perfil-icon">👤</span>
            <p>Perfil</p>
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
                `${alumno?.nombre || ''} ${alumno?.apellido || ''}`
              )}
            </h2>
            <p>
              {isEditing ? (
                <input 
                  type="text" 
                  name="curso" 
                  value={formData.curso || ''} 
                  onChange={handleInputChange}
                  className="input-curso"
                  placeholder="Curso"
                />
              ) : (
                `Curso [${alumno?.curso || ''}]`
              )}
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
                />
              ) : (
                <span>{alumno?.dni || ''}</span>
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
                <span>{alumno?.email || ''}</span>
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
                <span>{alumno?.telefono || ''}</span>
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
                <span>{alumno?.direccion || ''}</span>
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