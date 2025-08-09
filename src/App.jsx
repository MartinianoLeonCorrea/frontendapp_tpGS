import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import DashboardAlumno from './pages/alumno/DashboardAlumno';
import DashboardDocente from './pages/docente/DashboardDocente';
import MateriasAlumno from './pages/alumno/MateriasAlumno';

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <header className="main-header">
        <div className="logo-box">
          <img src={''} alt="Imagen Logo" className="logo-img" />
        </div>
        <h1 className="header-title">Gestión Tu Secundaria</h1>
      </header>
      <div className="home-container">
        <h2>Home</h2>
        <p>Bienvenido a la aplicación de gestión "Tu secundaria".</p>
        <button onClick={() => navigate('/alumno/dashboard')}>
          Vista Alumno
        </button>
        <button
          onClick={() => navigate('/docente/dashboard')}
          style={{ marginLeft: '16px' }}
        >
          Vista Docente
        </button>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alumno/dashboard" element={<DashboardAlumno />} />
        <Route path="/docente/dashboard" element={<DashboardDocente />} />
        <Route path="/alumno/materias" element={<MateriasAlumno />} />
      </Routes>
    </Router>
  );
}

export default App;
