import { useNavigate } from 'react-router-dom';

function DashboardAlumno() {
  const navigate = useNavigate();
  return (
    <>
      <header className="main-header">
        <div className="logo-box">
          <img src={''} alt="imagen logo" className="logo-img" />
        </div>
        <h1 className="header-title">Gestión Tu Secundaria</h1>
      </header>
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
