import { useState } from "react";

function FormularioRegistro({ campos, titulo, onSubmit, textoBoton = "Registrar" }) {
  // Estado inicial dinámico según los campos
  const estadoInicial = {};
  campos.forEach((campo) => {
    estadoInicial[campo.name] = campo.defaultValue || "";
  });

  const [form, setForm] = useState(estadoInicial);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(estadoInicial);
  };

  return (
    <div>
      <h2>{titulo}</h2>
      <form onSubmit={handleSubmit}>
        {campos.map((campo) => (
          <div key={campo.name}>
            <label>{campo.label}:</label>
            <input
              type={campo.type}
              name={campo.name}
              value={form[campo.name]}
              onChange={handleChange}
              required={campo.required}
            />
          </div>
        ))}
        <button type="submit">{textoBoton}</button>
      </form>
    </div>
  );
}

export default FormularioRegistro;