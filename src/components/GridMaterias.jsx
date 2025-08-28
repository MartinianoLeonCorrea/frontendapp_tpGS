import { useHistory } from 'react-router-dom';

const materias = [
  { id: 1, nombre: 'Materia 1' },
  { id: 2, nombre: 'Materia 2' },
  { id: 3, nombre: 'Materia 3' },
  { id: 4, nombre: 'Materia 4' },
];

const GridMaterias = () => {
  const history = useHistory();

  const handleMateriaClick = (id) => {
    history.push(`/materia/${id}`); // Navega a la página de la materia
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
      }}
    >
      {materias.map((materia) => (
        <div
          key={materia.id}
          onClick={() => handleMateriaClick(materia.id)}
          style={{
            border: '1px solid black',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          {materia.nombre}
        </div>
      ))}
    </div>
  );
};

export default GridMaterias;
