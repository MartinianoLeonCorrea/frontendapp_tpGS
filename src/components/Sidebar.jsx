// components/Sidebar.jsx

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-box">
        <img src="/icono.svg" alt="Imagen Logo" className="logo-img" />
      </div>
      <h3>Opciones</h3>
      <button>Calendario</button>
      <button>Atrás</button>
    </div>
  );
};

export default Sidebar;
