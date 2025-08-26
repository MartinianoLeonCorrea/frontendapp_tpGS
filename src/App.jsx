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
import RegistrarAlumno from './pages/docente/RegistrarAlumno';
import Sidebar from './components/Sidebar';

// Componente Home sin el header
function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="app-container">
        <Sidebar />

        <div className="perfil-box">
          <p>Perfil</p>
        </div>
        <div className="main-content">
          <Header title="Tu Secundaria" />
          <div className="body">
            <div className="button-row">
              <button onClick={() => navigate('/alumno/dashboard')}>
                Vista Alumno
              </button>
              <button onClick={() => navigate('/docente/dashboard')}>
                Vista Docente
              </button>
              <button onClick={() => navigate('/docente/registrar')}>
                Registrar Alumno
              </button>
            </div>
          </div>
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
        <Route path="/docente/registrar" element={<RegistrarAlumno />} />
        <Route path="/alumno/materias" element={<MateriasAlumno />} />
      </Routes>
    </Router>
  );
}

export default App;
