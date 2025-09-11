import { useState } from 'react';
//TODO: - Que los mensajes del foro queden guardados
//      - Que el foro sea el mismo para todos los usuarios
// Simula el usuario logueado
const USUARIO_LOGUEADO = {
  id: 2000001,
  nombre: 'Juan',
  apellido: 'Pérez',
};

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

  const handlePublicar = () => {
    if (mensaje.trim()) {
      const nuevoMensaje = {
        texto: mensaje,
        usuario: `${USUARIO_LOGUEADO.nombre} ${USUARIO_LOGUEADO.apellido}`,
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
