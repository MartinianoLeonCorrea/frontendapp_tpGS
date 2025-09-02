export function CardDictado({
  materiaNombre,
  docenteNombre,
  cursoNroLetra,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="card-materia"
      aria-label={`Acceder al dictado de ${materiaNombre}`}
    >
      <div>
        <h3 className="card-materia-title">{materiaNombre}</h3>
        <p className="card-materia-description">Docente: {docenteNombre}</p>
        <p className="card-materia-description">Curso: {cursoNroLetra}</p>
      </div>
    </button>
  );
}
