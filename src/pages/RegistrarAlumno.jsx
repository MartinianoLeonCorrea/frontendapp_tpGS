import Form from "/home/joni/TrabajoPracticoDSW/frontendapp_tpGS/src/components/Form.jsx";

const camposAlumno = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "apellido", label: "Apellido", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "dni", label: "DNI", type: "text", required: true },
  { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date", required: true },
];

function CreateAlumno() {
  const handleRegistro = (datos) => {
    // Aquí puedes hacer la petición al backend
    console.log("Datos del alumno:", datos);
  };

  return (
    <Form
      campos={camposAlumno}
      titulo="Registrar Alumno"
      onSubmit={handleRegistro}
      textoBoton="Registrar"
    />
  );
}

export default CreateAlumno;