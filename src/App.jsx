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
import { useUser } from './context/UserContext';
import DictadoPage from './pages/docente/DictadoPage';
import NuevoExamenPage from './pages/docente/NuevoExamenPage';
import EditarExamenPage from './pages/docente/EditarExamenPage';
import BorrarExamenPage from './pages/docente/BorrarExamenPage';
import SubirNotasPage from './pages/docente/SubirNotasPage';
import React, { useState, useEffect } from 'react';

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
  const { login, userData } = useUser();

  const [alumnos, setAlumnos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar alumnos y docentes al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamar a la API para obtener todas las personas
        const response = await fetch('http://localhost:5173/api/personas');
        if (!response.ok) {
          throw new Error('Error al obtener las personas');
        }

        const data = await response.json();

        // Verificar si la respuesta contiene la propiedad `data` y si es un arreglo
        if (!data || !Array.isArray(data.data)) {
          throw new Error(
            'La respuesta de la API no contiene un arreglo válido en la propiedad `data`.'
          );
        }

        // Filtrar alumnos y docentes según el tipo
        const alumnosData = data.data.filter(
          (persona) => persona.tipo === 'alumno'
        );
        const docentesData = data.data.filter(
          (persona) => persona.tipo === 'docente'
        );

        setAlumnos(alumnosData);
        setDocentes(docentesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Si ya hay un usuario logueado, mostrarlo como seleccionado
  useEffect(() => {
    if (userData) {
      setSelectedUser(userData);
    }
  }, [userData]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    await login(user.dni); // Actualizar el contexto con el DNI seleccionado
  };

  const handleNavigateAlumno = () => {
    if (!selectedUser || selectedUser.tipo !== 'alumno') {
      alert('Por favor selecciona un alumno primero');
      return;
    }
    navigate('/alumno/dashboard');
  };

  const handleNavigateDocente = () => {
    if (!selectedUser || selectedUser.tipo !== 'docente') {
      alert('Por favor selecciona un docente primero');
      return;
    }
    navigate('/docente/dashboard');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-card')) {
        setSelectedUser(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="home-container">
        <h1>Cargando usuarios...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Información del usuario seleccionado */}
      {selectedUser && (
        <div className="selected-user-info">
          <h3>Usuario seleccionado:</h3>
          <div className="user-card selected">
            <p>
              <strong>
                {selectedUser.nombre} {selectedUser.apellido}
              </strong>
            </p>
            <p>DNI: {selectedUser.dni}</p>
            <p>
              Tipo:{' '}
              {selectedUser.tipo.charAt(0).toUpperCase() +
                selectedUser.tipo.slice(1)}
            </p>
            {selectedUser.email && <p>Email: {selectedUser.email}</p>}
            {selectedUser.curso && (
              <p>
                Curso: {selectedUser.curso.nro_letra} -{' '}
                {selectedUser.curso.turno}
              </p>
            )}
            {selectedUser.especialidad && (
              <p>Especialidad: {selectedUser.especialidad}</p>
            )}
          </div>
        </div>
      )}

      {/* Selectores de usuario */}
      <div className="user-selection">
        <div className="user-type-section">
          <h2>Seleccionar Alumno</h2>
          <div className="users-grid">
            {alumnos.length === 0 ? (
              <p>No hay alumnos disponibles</p>
            ) : (
              alumnos.map((alumno) => (
                <div
                  key={alumno.dni}
                  className={`user-card ${
                    selectedUser?.dni === alumno.dni ? 'selected' : ''
                  }`}
                  onClick={() => handleUserSelect(alumno)}
                >
                  <p>
                    <strong>
                      {alumno.nombre} {alumno.apellido}
                    </strong>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="user-type-section">
          <h2>Seleccionar Docente</h2>
          <div className="users-grid">
            {docentes.length === 0 ? (
              <p>No hay docentes disponibles</p>
            ) : (
              docentes.map((docente) => (
                <div
                  key={docente.dni}
                  className={`user-card ${
                    selectedUser?.dni === docente.dni ? 'selected' : ''
                  }`}
                  onClick={() => handleUserSelect(docente)}
                >
                  <p>
                    <strong>
                      {docente.nombre} {docente.apellido}
                    </strong>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="button-row">
        <button
          onClick={handleNavigateAlumno}
          className={selectedUser?.tipo === 'alumno' ? 'active' : 'disabled'}
          disabled={!selectedUser || selectedUser.tipo !== 'alumno'}
        >
          Ir a Vista Alumno
        </button>

        <button
          onClick={handleNavigateDocente}
          className={selectedUser?.tipo === 'docente' ? 'active' : 'disabled'}
          disabled={!selectedUser || selectedUser.tipo !== 'docente'}
        >
          Ir a Vista Docente
        </button>

        <button onClick={() => navigate('/registrar')}>Registrar Alumno</button>
      </div>
    </div>
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
            <Route
              path="/alumno/perfil"
              element={<Perfil userType="alumno" />}
            />
            <Route
              path="/docente/perfil"
              element={<Perfil userType="docente" />}
            />
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
