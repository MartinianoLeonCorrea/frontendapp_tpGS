import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DictadoPage() {
  const { state } = useLocation();
  const dictadoId = state?.dictadoId;
  const [dictado, setDictado] = useState(null);

  useEffect(() => {
    if (dictadoId) {
      fetch(`/api/dictados/${dictadoId}`)
        .then((res) => res.json())
        .then((data) => setDictado(data.data));
    }
  }, [dictadoId]);

  if (!dictadoId) return <p>No se seleccionó dictado.</p>;
  if (!dictado) return <p>Cargando dictado...</p>;

  return (
    <div>
      <h2>{dictado.nombre}</h2>
      <p>{dictado.descripcion}</p>
      {/* Otros datos del dictado */}
    </div>
  );
}

export default DictadoPage;
