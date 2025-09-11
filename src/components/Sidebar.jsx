// src/components/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';
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
      path: '/docente/dictados',
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: CalendarIcon,
      path: '/calendario',
    },
  ];

  const handleMenuClick = (path) => {
    if (path === 'atras') {
      navigate(-1);
    } else {
      navigate(path);
    }
  };

  // Verifica el rol del usuario (Alumno/Docente) y filtra el menú
  const isAlumno = location.pathname.startsWith('/alumno');
  const isDocente = location.pathname.startsWith('/docente');

  // Maneja el click en el logo
  const handleLogoClick = () => {
    if (isAlumno) {
      navigate('/alumno/dashboard');
    } else if (isDocente) {
      navigate('/docente/dashboard');
    } else {
      navigate('/'); // O ruta por defecto
    }
  };

  // Verifica el rol del usuario (Alumno/Docente) y filtra el menú
  const filteredItems = menuItems.filter((item) => {
    if (isAlumno) {
      return ['examenes', 'notas', 'asistencias', 'calendario'].includes(
        item.id
      );
    }
    if (isDocente) {
      return ['dictados', 'calendario'].includes(item.id);
    }
    // Por defecto, muestra solo las opciones básicas si no está en una ruta específica
    return ['calendario'].includes(item.id);
  });

  const backButton = {
    id: 'atras',
    label: 'Atrás',
    icon: ArrowLeftIcon,
    path: 'atras',
  };
  filteredItems.push(backButton);

  // Botón cerrar sesión
  const handleLogout = () => {
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

      {/* Botón cerrar sesión al final */}
      <div className="sidebar-logout-section">
        <button
          className="sidebar-menu-item logout"
          onClick={handleLogout}
        >
          <div className="sidebar-icon">
            <LogOutIcon size={18} />
          </div>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
