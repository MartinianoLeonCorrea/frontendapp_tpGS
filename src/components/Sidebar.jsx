// src/components/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  CalendarIcon,
  FileTextIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  ArrowLeftIcon,
  LogOutIcon,
} from './Icons';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  // Define los items del menú con sus rutas
  const menuItems = [
    {
      id: 'examenes',
      label: 'Exámenes',
      icon: GraduationCapIcon,
      path: '/alumno/examenes',
    },
    { id: 'notas', label: 'Notas', icon: FileTextIcon, path: '/alumno/notas' },
    {
      id: 'asistencias',
      label: 'Asistencias',
      icon: ClipboardListIcon,
      path: '/alumno/asistencias',
    },
    {
      id: 'dictados',
      label: 'Dictados',
      icon: GraduationCapIcon,
      path: '/docente/dictado',
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: CalendarIcon,
      path: '/calendario',
    },
  ];

    // ==== RUTAS ARREGLADAS ====

  const getContextualBackPath = () => {
    const path = location.pathname;
    const state = location.state;

    // ==== RUTAS DE DOCENTE ====
    
    // Operaciones de exámenes --> siempre volver a DictadoPage
    if (path === '/docente/dictado/examen/nuevo') {
      return { path: '/docente/dictado', state: { dictadoId: state?.dictadoId } };
    }
    
    if (path === '/docente/dictado/examen/editar') {
      return { path: '/docente/dictado', state: { dictadoId: state?.dictadoId } };
    }
    
    if (path === '/docente/dictado/examen/borrar') {
      return { path: '/docente/dictado', state: { dictadoId: state?.dictadoId } };
    }

    // Subir notas --> volver a DictadoPage
    if (path === '/docente/dictado/notas/subir') {
      return { path: '/docente/dictado', state: { dictadoId: state?.dictadoId } };
    }

    // DictadoPage específico --> volver al dashboard docente
    if (path === '/docente/dictado') {
      return { path: '/docente/dashboard' };
    }

    // Perfil docente --> volver al dashboard docente
    if (path === '/docente/perfil') {
      return { path: '/docente/dashboard' };
    }

    // Dashboard docente --> volver a home
    if (path === '/docente/dashboard') {
      return { path: '/' };
    }

    // ==== RUTAS DE ALUMNO ====
    
    // Materia específica --> volver al dashboard alumno
    if (path === '/alumno/materia') {
      return { path: '/alumno/dashboard' };
    }

    // Secciones de alumno (exámenes, notas, asistencias) --> volver al dashboard
    if (path === '/alumno/examenes' || 
        path === '/alumno/notas' || 
        path === '/alumno/asistencias') {
      return { path: '/alumno/dashboard' };
    }

    // Perfil alumno --> volver al dashboard alumno
    if (path === '/alumno/perfil') {
      return { path: '/alumno/dashboard' };
    }

    // Dashboard alumno --> volver a home
    if (path === '/alumno/dashboard') {
      return { path: '/' };
    }

    // ==== RUTAS PARA AMBOS ====
    
    // Calendario --> volver al dashboard correspondiente
    if (path === '/calendario') {
      if (location.pathname.includes('/docente/')) {
        return { path: '/docente/dashboard' };
      }
      if (location.pathname.includes('/alumno/')) {
        return { path: '/alumno/dashboard' };
      }
      // Si no hay contexto volver a home
      return { path: '/' };
    }

    // Registro de alumno --> volver a home
    if (path === '/registrar') {
      return { path: '/' };
    }

    // ==== FALLBACK ====
    // Osea, si no coincide con ninguna ruta específica, inferir por el prefijo
    if (path.startsWith('/docente/')) {
      return { path: '/docente/dashboard' };
    }
    
    if (path.startsWith('/alumno/')) {
      return { path: '/alumno/dashboard' };
    }

    // Por defecto volver a home
    return { path: '/' };
  };

  const handleMenuClick = (itemPath) => {
    if (itemPath === 'atras') {
      const backNavigation = getContextualBackPath();
      
      // Si hay state para pasar usarlo: si no, navegar sin state
      if (backNavigation.state) {
        navigate(backNavigation.path, { state: backNavigation.state });
      } else {
        navigate(backNavigation.path);
      }
    } else {
      navigate(itemPath);
    }
  };

  // Verifica el rol del usuario (Alumno o Docente)
  const isAlumno = location.pathname.startsWith('/alumno');
  const isDocente = location.pathname.startsWith('/docente');
  const isRegistro = location.pathname.startsWith('/registrar');
  const showLogout = (isAlumno || isDocente) && !isRegistro;

  // Maneja el click en el logo
  const handleLogoClick = () => {
    if (isAlumno) {
      navigate('/alumno/dashboard');
    } else if (isDocente) {
      navigate('/docente/dashboard');
    } else {
      navigate('/');
    }
  };

  // Filtra los items del menú según el rol
  const filteredItems = menuItems.filter((item) => {
    if (isAlumno) {
      return ['examenes', 'notas', 'asistencias', 'calendario'].includes(
        item.id
      );
    }
    if (isDocente) {
      return ['dictados', 'calendario'].includes(item.id);
    }
    return ['calendario'].includes(item.id);
  });

  // Agregar botón "Atrás"
  const backButton = {
    id: 'atras',
    label: 'Atrás',
    icon: ArrowLeftIcon,
    path: 'atras',
  };
  filteredItems.push(backButton);

  // Botón cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sidebar-container">
      <div
        className="sidebar-logo-section"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="sidebar-logo-box">
          <div className="sidebar-logo-text">Logo</div>
          <div className="sidebar-logo-text">App</div>
        </div>
      </div>

      <nav className="sidebar-navigation">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.path)}
              aria-label={`Ir a ${item.label}`}
            >
              <div className="sidebar-icon">
                <Icon size={18} />
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {showLogout && (
        <div className="sidebar-logout-section">
          <button className="sidebar-menu-item logout" onClick={handleLogout}>
            <div className="sidebar-icon">
              <LogOutIcon size={18} />
            </div>
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;