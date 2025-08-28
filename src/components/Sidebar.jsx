// components/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAlumno = location.pathname.startsWith('/alumno');
  const isDocente = location.pathname.startsWith('/docente');

  const handleBack = () => {
    navigate(-1);
  };
  const handleCalendario = () => {
    navigate('/calendario');
  };
  return (
    <div className="sidebar">
      <div className="logo-box">
        <img src="/icono.svg" alt="Imagen Logo" className="logo-img" />
      </div>
      <h3>Opciones</h3>

      {/* Botones para Alumno */}
      {isAlumno && (
        <>
          <button onClick={() => navigate('/alumno/examenes')}>Exámenes</button>
          <button onClick={() => navigate('/alumno/asistencias')}>
            Asistencias
          </button>
          <button onClick={() => navigate('/alumno/notas')}>Notas</button>
        </>
      )}

      {/* Botones para Docente */}
      {isDocente && (
        <>
          <button onClick={() => navigate('/docente/dictado')}>Dictado</button>
        </>
      )}

      {/* Botones base */}
      <button onClick={handleCalendario}>Calendario</button>
      <button onClick={handleBack}>Atrás</button>
    </div>
  );
};

export default Sidebar;
