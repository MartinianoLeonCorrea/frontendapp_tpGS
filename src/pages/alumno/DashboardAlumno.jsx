import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function DashboardAlumno() {
  const navigate = useNavigate();
  return (
    <>
      <Header title="Dashboard Alumno" />
      <div className="logo-box">
        <img src={''} alt="imagen logo" className="logo-img" />
      </div>
      <h1 className="header-title">Gestión Tu Secundaria</h1>
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
