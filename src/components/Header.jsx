// src/components/Header.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserIcon } from './Icons';
import { useUser } from '../context/UserContext';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dni } = useUser();
  const [apellidoDocente, setApellidoDocente] = useState('');
  const [nombreAlumno, setNombreAlumno] = useState('');

  // Mapeo de rutas a títulos y subtítulos
  const pageInfo = {
    '/': {
      title: 'Gestión Tu Secundaria',
      subtitle: '',
    },
    '/alumno/dashboard': {
      title: 'Escuela Secundaria San Martín',
      subtitle: '',
    },
    '/docente/dashboard': {
      title: 'Escuela Secundaria San Martín',
      subtitle: '',
    },
    '/docente/dictado': {
      title: 'Panel del Dictado',
      subtitle: '',
    },
    '/docente/dictado/examen/nuevo': {
      title: 'Nuevo examen',
      subtitle: '',
    },
    '/docente/dictado/examen/editar': {
      title: 'Editar examen',
      subtitle: '',
    },
    '/docente/dictado/examen/borrar': {
      title: 'Borrar examen',
      subtitle: '',
    },
    '/docente/dictado/notas/subir': {
      title: 'Subir notas',
      subtitle: '',
    },
    '/calendario': {
      title: 'Calendario',
      subtitle: '',
    },
    '/registrar': {
      title: 'Registrar Alumno',
      subtitle: '',
    },
    '/alumno/perfil': {
      title: 'Escuela Secundaria San Martín',
      subtitle: 'Perfil del Alumno',
    },
    '/docente/perfil': {
      title: 'Escuela Secundaria San Martín',
      subtitle: 'Perfil del Docente',
    },
    '/alumno/examenes': {
      title: 'Mis Exámenes',
      subtitle: '',
    },
    '/alumno/notas': {
      title: 'Mis Notas',
      subtitle: '',
    },
    '/alumno/asistencias': {
      title: 'Mis Asistencias',
      subtitle: '',
    },
  };

  // Obtener el título y subtítulo según la ruta actual
  const currentPath = location.pathname;
  let title = pageInfo[currentPath]?.title || 'Página no encontrada';
  let subtitle = pageInfo[currentPath]?.subtitle || '';

  // Si estás en la página de materia, muestra el nombre desde el estado
  if (currentPath === '/alumno/materia' && location.state?.materiaNombre) {
    title = location.state.materiaNombre;
  }

  // Si es dashboard docente, obtener el apellido dinámicamente
  useEffect(() => {
    const fetchPersona = async () => {
      if (
        (currentPath === '/docente/dashboard' ||
          currentPath === '/alumno/dashboard') &&
        dni
      ) {
        try {
          const res = await fetch(`/api/personas/${dni}`);
          const data = await res.json();
          if (currentPath === '/docente/dashboard') {
            setApellidoDocente(data.data?.apellido || '');
          }
          if (currentPath === '/alumno/dashboard') {
            setNombreAlumno(data.data?.nombre || '');
          }
        } catch {
          setApellidoDocente('');
          setNombreAlumno('');
        }
      }
    };
    fetchPersona();
  }, [currentPath, dni]);

  if (currentPath === '/docente/dashboard' && apellidoDocente) {
    subtitle = `¡Bienvenido/a, Prof. ${apellidoDocente}!`;
  }
  if (currentPath === '/alumno/dashboard' && nombreAlumno) {
    subtitle = `¡Bienvenido/a, ${nombreAlumno}!`;
  }

  const showProfile =
    currentPath.startsWith('/alumno/') || currentPath.startsWith('/docente/');

  // Navegación inteligente del perfil según el tipo de usuario
  const handleProfileClick = () => {
    if (currentPath.startsWith('/docente/')) {
      navigate('/docente/perfil');
    } else if (currentPath.startsWith('/alumno/')) {
      navigate('/alumno/perfil');
    }
  };

  return (
    <header className="header-container">
      <div className="header-info-section">
        <h1 className="school-name-title">{title}</h1>
        {subtitle && <p className="welcome-message">{subtitle}</p>}
      </div>

      {showProfile && (
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