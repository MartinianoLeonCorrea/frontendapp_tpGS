import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

function DashboardAlumno() {
  const navigate = useNavigate();
  return (
    <>
      <Sidebar />
      <div className="home-container">
        <h2>Dashboard Alumno</h2>
        <button onClick={() => navigate('/alumno/materias')}>
          Ver listado materias
        </button>
      </div>
    </>
  );
}

export default DashboardAlumno;
