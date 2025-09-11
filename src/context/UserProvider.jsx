// src/contexts/UserProvider.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from './UserContext'; // Importamos el contexto desde su propio archivo

export const UserProvider = ({ children }) => {
  const [dni, setDni] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Detecta la vista por la ruta y asigna el dni correspondiente
    if (location.pathname.startsWith('/docente')) {
      setDni(1000001); // Docente
    } else if (location.pathname.startsWith('/alumno')) {
      setDni(20000001); // Alumno
    } else {
      setDni(null); // Ningún usuario logueado
    }
  }, [location.pathname]);

  const login = (userDni) => setDni(userDni);
  const logout = () => setDni(null);

  return (
    <UserContext.Provider value={{ dni, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
