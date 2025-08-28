export function CardMateria({ title, onClick, description }) {
  return (
    <button
      onClick={onClick}
      className="card-materia"
      aria-label={`Acceder a la materia ${title}`}
    >
      <div>
        <h3 className="card-materia-title">{title}</h3>
        {description && (
          <p className="card-materia-description">{description}</p>
        )}
      </div>
    </button>
  );
}
