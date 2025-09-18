// src/context/UserProvider.jsx
import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [dni, setDni] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para hacer login con un DNI específico
  const login = async (userDni) => {
    if (!userDni) return;
    
    setLoading(true);
    try {
      // Obtener datos del usuario desde la API
      const response = await fetch(`/api/personas/${userDni}?includeCurso=true`);
      if (response.ok) {
        const result = await response.json();
        setDni(userDni);
        setUserData(result.data);
        
        // Guardar en localStorage para persistencia (opcional)
        localStorage.setItem('userDni', userDni.toString());
        localStorage.setItem('userData', JSON.stringify(result.data));
      } else {
        console.error('Usuario no encontrado');
        logout();
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Función para hacer logout
  const logout = () => {
    setDni(null);
    setUserData(null);
    localStorage.removeItem('userDni');
    localStorage.removeItem('userData');
  };

  // Verificar si hay un usuario guardado al cargar la aplicación
  useEffect(() => {
    const savedDni = localStorage.getItem('userDni');
    const savedUserData = localStorage.getItem('userData');
    
    if (savedDni && savedUserData) {
      setDni(parseInt(savedDni));
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const value = {
    dni,
    userData,
    loading,
    login,
    logout,
    isLoggedIn: !!dni,
    isAlumno: userData?.tipo === 'alumno',
    isDocente: userData?.tipo === 'docente'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};