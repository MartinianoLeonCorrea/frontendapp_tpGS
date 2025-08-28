// src/components/MainContent.jsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardAlumno from '../pages/alumno/DashboardAlumno';
import DashboardDocente from '../pages/docente/DashboardDocente';
import MateriasAlumno from '../pages/alumno/MateriasAlumno';
import RegistrarAlumno from '../pages/RegistrarAlumno';
import CalendarioPage from '../pages/CalendarioPage';

// El componente Home se mantiene igual
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

export default function MainContent() {
  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alumno/dashboard" element={<DashboardAlumno />} />
        <Route path="alumno/materias" element={<MateriasAlumno />} />
        <Route path="docente/dashboard" element={<DashboardDocente />} />
        <Route path="registrar" element={<RegistrarAlumno />} />
        <Route path="calendario" element={<CalendarioPage />} />
      </Routes>
    </div>
  );
}
