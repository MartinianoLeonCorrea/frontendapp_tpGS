// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1>Home</h1>
      <p>Bienvenido a la aplicación de gestión "Tu secundaria".</p>
      <button onClick={() => navigate('/materias')}>
        Ver listado materias
      </button>
    </div>
  );
}

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [materiaBuscada, setMateriaBuscada] = useState('');
  const [materiaEncontrada, setMateriaEncontrada] = useState(null);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch('/api/materias');
        if (!response.ok) {
          throw new Error('Error al obtener las materias');
        }
        const data = await response.json();
        setMaterias(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchMaterias();
  }, []);

  const handleSearch = async () => {
    if (!materiaBuscada) {
      setMateriaEncontrada(null);
      return;
    }

    try {
      const response = await fetch(`/api/materias/${materiaBuscada}`);
      if (!response.ok) {
        setMateriaEncontrada(null);
        throw new Error('Materia no encontrada');
      }
      const data = await response.json();
      setMateriaEncontrada(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Gestión TU SECUNDARIA</h1>
      <h2> Listado Materias </h2>
      <div className="search-section">
        <input
          type="text"
          value={materiaBuscada}
          onChange={(e) => setMateriaBuscada(e.target.value)}
          placeholder="Buscar materia por ID"
        />
        <button onClick={handleSearch}>Buscar Materia</button>
      </div>

      {materiaEncontrada && (
        <div className="found-materia">
          <h3>Materia Encontrada:</h3>
          <p>ID: {materiaEncontrada.id}</p>
          <p>Nombre: {materiaEncontrada.nombre}</p>
          <p>Descripción: {materiaEncontrada.descripcion}</p>
        </div>
      )}

      <hr />

      <h2>Listado de Materias</h2>
      {materias.length > 0 ? (
        <ul>
          {materias.map((materia) => (
            <li key={materia.id}>
              ID: {materia.id} - Nombre: {materia.nombre}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay materias disponibles.</p>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materias" element={<Materias />} />
      </Routes>
    </Router>
  );
}

export default App;
