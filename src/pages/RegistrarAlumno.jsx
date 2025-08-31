import FormularioRegistro from "/home/joni/TrabajoPracticoDSW/frontendapp_tpGS/src/components/FormularioRegistro.jsx";

const camposAlumno = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "apellido", label: "Apellido", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "dni", label: "DNI", type: "text", required: true },
  { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date", required: true },
];

function RegistrarAlumno() {
  const handleRegistro = (datos) => {
    // Aquí puedes hacer la petición al backend
    console.log("Datos del alumno:", datos);
  };

  return (
    <FormularioRegistro
      campos={camposAlumno}
      titulo="Registrar Alumno"
      onSubmit={handleRegistro}
      textoBoton="Registrar"
    />
  );
}

export default RegistrarAlumno;