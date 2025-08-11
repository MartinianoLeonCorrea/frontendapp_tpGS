function Header({ title }) {
  return (
    <header className="main-header">
      <div className="logo-box">
        <img src="/icono.svg" alt="Imagen Logo" className="logo-img" />
      </div>
      <h1 className="header-title">{title}</h1>
    </header>
  );
}

export default Header;
