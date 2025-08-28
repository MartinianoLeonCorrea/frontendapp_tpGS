function DashboardAlumno() {
  return (
    <>
      <h2 id="titulo">Dashboard Alumno</h2>
      <h3 id="subtitulo">Bienvenido Alumno</h3>
      <div id="cajas">
        <div id="columna">
          <div id="caja">
            <p>Materia 1</p>
          </div>
          <div id="caja">
            <p>Materia 2</p>
          </div>
        </div>
        <div id="columna">
          <div id="caja">
            <p>Materia 3</p>
          </div>
          <div id="caja">
            <p>Materia 4</p>
          </div>
        </div>
      </div>
      <div className="novedades">
        <h3>Novedades</h3>
        <p>No hay novedades por el momento.</p>
      </div>
      <div className="proximo-examen">
        <h3>Próximo Exámen</h3>
        <p>No hay exámenes programados.</p>
      </div>
    </>
  );
}

export default DashboardAlumno;
