// src/pages/alumno/PerfilAlumno.jsx

import React, { useState, useEffect } from 'react';
import './PerfilAlumno.css'; 

const alumnoService = {
  getAlumno: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          nombre: 'Juan',
          apellido: 'Pérez',
          curso: '3° Año "A"',
          dni: '1234567',
          email: 'juan.perez@example.com',
          telefono: '11-2233-4455',
          direccion: 'Av. Siempre Viva 742',
        });
      }, 1500); // Simula un retraso de 1.5 segundos
    });
  },
};

export default function PerfilAlumno() {
  // Estado para almacenar los datos del alumno que no cambian (los originales)
  const [alumno, setAlumno] = useState(null);
  
  // Estado para los datos del formulario que sí se pueden editar
  const [formData, setFormData] = useState({});
  
  // Estado para controlar si estamos en modo "vista" o "edición"
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para manejar la carga inicial de datos
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para manejar posibles errores
  const [error, setError] = useState(null);

  // useEffect para cargar los datos del alumno cuando el componente se monta
  useEffect(() => {
    alumnoService.getAlumno()
      .then(data => {
        setAlumno(data);
        setFormData(data); // Inicializamos el formulario con los datos cargados
      })
      .catch(err => {
        setError('No se pudieron cargar los datos del alumno.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Cambia el estado de edición
    // Si cancelamos, restauramos los datos originales en el formulario
    if (isEditing) {
      setFormData(alumno);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenimos que el formulario recargue la página
    console.log('Datos a guardar:', formData);
    // Aquí iría la lógica para enviar los datos a un backend (ej: alumnoService.updateAlumno(formData))
    setAlumno(formData); // Actualizamos los datos principales con los del formulario
    setIsEditing(false); // Volvemos al modo de visualización
  };

  if (isLoading) {
    return <main className="perfil-container"><p>Cargando perfil...</p></main>;
  }

  if (error) {
    return <main className="perfil-container"><p className="error-message">{error}</p></main>;
  }

  return (
    <main className="perfil-container">
      <form className="perfil-card" onSubmit={handleSubmit}>
        
        <div className="perfil-header">
          <div className="perfil-avatar">
            <span className="perfil-icon">👤</span>
            <p>Perfil</p>
          </div>
          <div className="perfil-info-principal">
            <h2>{alumno.nombre} {alumno.apellido}</h2>
            <p>Curso [{alumno.curso}]</p>
          </div>
        </div>

        <div className="perfil-datos-personales">
          <h3>Datos personales</h3>
          <ul>
            <li><strong>DNI:</strong> {isEditing ? <input type="text" name="dni" value={formData.dni} onChange={handleInputChange} /> : alumno.dni}</li>
            <li><strong>Correo electrónico:</strong> {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleInputChange} /> : alumno.email}</li>
            <li><strong>Teléfono de contacto:</strong> {isEditing ? <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} /> : alumno.telefono}</li>
            <li><strong>Dirección:</strong> {isEditing ? <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} /> : alumno.direccion}</li>
          </ul>
        </div>
        
        <div className="perfil-acciones">
          {!isEditing ? (
            <button type="button" onClick={handleEditToggle} className="btn-editar">
              Editar Datos
            </button>
          ) : (
            <>
              <button type="submit" className="btn-confirmar">
                Confirmar Cambios
              </button>
              <button type="button" onClick={handleEditToggle} className="btn-cancelar">
                Cancelar
              </button>
            </>
          )}
        </div>
        
      </form>
    </main>
  );
}