function DashboardDocente() {
  return (
    <>
      <h2 id="titulo">Dashboard Docente</h2>
      <h3 id="subtitulo">Bienvenido Prof. Rodriguez</h3>
      <div id="cajas">
        <div id="columna">
          <div id="caja">
            <p>Dictado 1</p>
          </div>
          <div id="caja">
            <p>Dictado 2</p>
          </div>
        </div>
        <div id="columna">
          <div id="caja">
            <p>Dictado 3</p>
          </div>
          <div id="caja">
            <p>Dictado 4</p>
          </div>
        </div>
      </div>
      <div className="novedades">
        <h3>Novedades</h3>
        <p>No hay novedades por el momento.</p>
      </div>
    </>
  );
}

export default DashboardDocente;
