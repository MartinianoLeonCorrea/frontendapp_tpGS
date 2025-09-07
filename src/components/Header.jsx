// src/components/Header.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { UserIcon } from './Icons';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  // Mapeo de rutas a títulos y subtítulos
  const pageInfo = {
    '/': {
      title: 'Gestión Tu Secundaria',
      subtitle: '',
    },
    '/alumno/dashboard': {
      title: 'Escuela Secundaria San Martín',
      subtitle: '¡Bienvenido, Juan!',
    },
    '/docente/dashboard': {
      title: 'Escuela Secundaria San Martín',
      subtitle: '¡Bienvenido, Prof. Rodríguez!',
    },
    '/calendario': {
      title: 'Calendario',
      subtitle: '',
    },
    '/alumno/materias': {
      title: 'Escuela Secundaria San Martín',
      subtitle: 'Matemáticas', // Esto será dinámico
    },
    '/registrar': {
      title: 'Registrar Alumno',
      subtitle: '',
    },
    '/alumno/perfil': {
      title: 'Escuela Secundaria San Martín',
      subtitle: 'Perfil del Alumno',
    },
  };

  // Obtener el título y subtítulo según la ruta actual
  const currentPath = location.pathname;
  let title = pageInfo[currentPath]?.title || 'Página no encontrada';
  let subtitle = pageInfo[currentPath]?.subtitle || '';

  // Lógica para manejar rutas dinámicas como 'alumno/materias/:id'
  if (currentPath.startsWith('/alumno/materias/')) {
    // Aquí podrías obtener el nombre de la materia de la URL o un estado global
    // Por ahora, usamos un ejemplo estático
    const materiaId = currentPath.split('/').pop();
    const materiaNombre =
      materiaId.charAt(0).toUpperCase() + materiaId.slice(1);
    title = 'Escuela Secundaria San Martín';
    subtitle = materiaNombre;
  }

  // Puedes expandir esta lógica para manejar otros títulos dinámicos si es necesario

  const handleProfileClick = () => {
    navigate('/alumno/perfil');
  };

  return (
    <header className="header-container">
      <div className="header-info-section">
        <h1 className="school-name-title">{title}</h1>
        {subtitle && <p className="welcome-message">{subtitle}</p>}
      </div>

      {location.pathname === '/alumno/dashboard' && (
        <button
          className="header-profile-section"
          onClick={handleProfileClick}
          aria-label="Abrir perfil de usuario"
        >
          <div className="profile-icon">
            <UserIcon size={24} />
          </div>
          <p className="profile-label">Perfil</p>
        </button>
         )}
    </header>
  );
}

export default Header;
