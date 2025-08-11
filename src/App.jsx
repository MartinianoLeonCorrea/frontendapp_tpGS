import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import DashboardAlumno from './pages/alumno/DashboardAlumno';
import DashboardDocente from './pages/docente/DashboardDocente';
import MateriasAlumno from './pages/alumno/MateriasAlumno';

// Componente Home sin el header
function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Header title="Gestión Tu Secundaria" />
      <div className="home-container">
        <h2>Home</h2>
        <p>Bienvenido a la aplicación de gestión "Tu secundaria".</p>
        <div className="button-row">
          <button onClick={() => navigate('/alumno/dashboard')}>
            Vista Alumno
          </button>
          <button onClick={() => navigate('/docente/dashboard')}>
            Vista Docente
          </button>
        </div>
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
