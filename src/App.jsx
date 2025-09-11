import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Outlet,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import DashboardAlumno from './pages/alumno/DashboardAlumno';
import DashboardDocente from './pages/docente/DashboardDocente';
import MateriasAlumno from './pages/alumno/MateriasAlumno';
import RegistrarAlumno from './pages/RegistrarAlumno';
import Sidebar from './components/Sidebar';
import CalendarioPage from './pages/CalendarioPage';
import PerfilAlumno from './pages/alumno/PerfilAlumno';
import MateriaPage from './pages/alumno/MateriaPage';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="button-row">
        <button onClick={() => navigate('/alumno/dashboard')}>
          Vista Alumno
        </button>
        <button onClick={() => navigate('/docente/dashboard')}>
          Vista Docente
        </button>
        <button onClick={() => navigate('/registrar')}>Registrar Alumno</button>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="alumno/dashboard" element={<DashboardAlumno />} />
          <Route path="alumno/materias" element={<MateriasAlumno />} />
          <Route path="docente/dashboard" element={<DashboardDocente />} />
          <Route path="registrar" element={<RegistrarAlumno />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="/alumno/perfil" element={<PerfilAlumno />} />
          <Route path="/alumno/materia" element={<MateriaPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
