import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import '../App.css';

function Form({ campos, titulo, onSubmit, textoBoton = 'Registrar', schema }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // ya no context
  });

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
            <label className="form-label" htmlFor={campo.name}>
              {campo.label}:
            </label>
            {campo.type === 'select' ? (
              <select
                id={campo.name}
                {...register(campo.name)}
                className={`form-input${errors[campo.name] ? ' error' : ''}`}
                defaultValue=""
              >
                <option value="" disabled>Seleccione una opción</option>
                {campo.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                id={campo.name}
                type={campo.type}
                autoComplete="off"
                {...register(campo.name)}
                className={`form-input${errors[campo.name] ? ' error' : ''}`}
              />
            )}
            {errors[campo.name] && (
              <span className="form-error">{errors[campo.name].message}</span>
            )}
          </div>
        ))}
        <button type="submit" className="form-button">{textoBoton}</button>
      </form>
    </div>
  );
}

export default Form;
