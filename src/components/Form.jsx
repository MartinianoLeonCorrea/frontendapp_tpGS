import { useForm } from "react-hook-form";
import "/home/joni/TrabajoPracticoDSW/frontendapp_tpGS/src/App.css";

function Form({ campos, titulo, onSubmit, textoBoton = "Registrar" }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{titulo}</h2>
      <form onSubmit={handleSubmit(submitHandler)}>
        {campos.map((campo) => (
          <div key={campo.name} className="form-group">
            <label className="form-label">{campo.label}:</label>
            <input
              type={campo.type}
              {...register(campo.name, { required: campo.required })}
              className={`form-input${errors[campo.name] ? " error" : ""}`}
            />
            {errors[campo.name] && (
              <span className="form-error">
                Este campo es obligatorio
              </span>
            )}
          </div>
        ))}
        <button type="submit" className="form-button">
          {textoBoton}
        </button>
      </form>
    </div>
  );
}

export default Form;