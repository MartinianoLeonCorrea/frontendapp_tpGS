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
import Perfil from './components/Perfil';
import MateriaPage from './pages/alumno/MateriaPage';
import ExamenesPage from './pages/alumno/ExamenesPage';
import NotasPage from './pages/alumno/NotasPage';
import AsistenciasPage from './pages/alumno/AsistenciasPage';
import { UserProvider } from './context/UserProvider';
import DictadoPage from './pages/docente/DictadoPage';
import NuevoExamenPage from './pages/docente/NuevoExamenPage';
import EditarExamenPage from './pages/docente/EditarExamenPage';
import BorrarExamenPage from './pages/docente/BorrarExamenPage';
import SubirNotasPage from './pages/docente/SubirNotasPage';

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
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="alumno/dashboard" element={<DashboardAlumno />} />
            <Route path="alumno/materias" element={<MateriasAlumno />} />
            <Route path="docente/dashboard" element={<DashboardDocente />} />
            <Route path="registrar" element={<RegistrarAlumno />} />
            <Route path="calendario" element={<CalendarioPage />} />
            <Route path="/alumno/perfil" element={<Perfil userType="alumno" />} />
            <Route path="/docente/perfil" element={<Perfil userType="docente" />} />
            <Route path="/alumno/materia" element={<MateriaPage />} />
            <Route path="/alumno/examenes" element={<ExamenesPage />} />
            <Route path="/alumno/notas" element={<NotasPage />} />
            <Route path="/alumno/asistencias" element={<AsistenciasPage />} />
            <Route path="/docente/dictado" element={<DictadoPage />} />
            <Route
              path="docente/dictado/examen/nuevo"
              element={<NuevoExamenPage />}
            />
            <Route
              path="docente/dictado/examen/editar"
              element={<EditarExamenPage />}
            />
            <Route
              path="docente/dictado/examen/borrar"
              element={<BorrarExamenPage />}
            />
            <Route
              path="docente/dictado/notas/subir"
              element={<SubirNotasPage />}
            />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
