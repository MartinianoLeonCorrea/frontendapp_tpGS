import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

function formatHora(fecha) {
  const d = new Date(fecha);
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export default function Foro({ className = '' }) {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const { dni } = useUser();
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '' });

  useEffect(() => {
    if (dni) {
      fetch(`/api/personas/${dni}`)
        .then((res) => res.json())
        .then((data) => {
          setUsuario({
            nombre: data.data?.nombre || '',
            apellido: data.data?.apellido || '',
          });
        })
        .catch(() => setUsuario({ nombre: '', apellido: '' }));
    }
  }, [dni]);

  const handlePublicar = () => {
    if (mensaje.trim()) {
      const nuevoMensaje = {
        texto: mensaje,
        usuario: `${usuario.nombre} ${usuario.apellido}`,
        hora: formatHora(new Date()),
      };
      setMensajes([nuevoMensaje, ...mensajes]);
      setMensaje('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePublicar();
    }
  };

  return (
    <div className={`foro-container ${className}`}>
      <div className="foro-header">
        <h3>Foro</h3>
      </div>

      <div className="foro-content">
        <div className="foro-messages">
          {mensajes.length === 0 ? (
            <div className="no-messages">
              <p>No hay mensajes aún. ¡Sé el primero en participar!</p>
            </div>
          ) : (
            mensajes.map((msg, idx) => (
              <div key={idx} className="foro-message">
                <span className="foro-time">[{msg.hora}hs]</span>
                <span className="foro-user"> {msg.usuario}:</span>
                <span className="foro-text"> {msg.texto}</span>
              </div>
            ))
          )}
        </div>

        <div className="foro-input-section">
          <textarea
            className="foro-textarea"
            placeholder="Escribir..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={3}
          />
          <button
            className="foro-publish-button"
            onClick={handlePublicar}
            disabled={!mensaje.trim()}
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
