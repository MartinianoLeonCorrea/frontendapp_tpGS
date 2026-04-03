import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [userType, setUserType] = useState("alumno");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("userRole");

    if (savedToken && savedRole) {
      navigate(savedRole === "alumno" ? "/alumno/dashboard" : "/docente/dashboard");
    }
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completá todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();


      if (!response.ok) {
        setError(data.message || "Credenciales incorrectas.");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", userType);
        console.log("logink ok", data);
        // Guardar token/usuario en contexto o localStorage según tu implementación
        // authContext.login(data.user);
        navigate(userType === "alumno" ? "/alumno/dashboard" : "/docente/dashboard");
      }
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="perfil-container">
      <div className="login-card">
        {/* Contenido central */}

        <div className="login-role-selector">
          <button
            type="button"
            className={`login-role-btn ${userType === "alumno" ? "login-role-btn--active" : ""}`}
            onClick={() => { setUserType("alumno"); setError(""); }}
          >
            Alumno
          </button>
          <button
            type="button"
            className={`login-role-btn ${userType === "docente" ? "login-role-btn--active" : ""}`}
            onClick={() => { setUserType("docente"); setError(""); }}
          >
            Docente
          </button>
        </div>

        <div className="login-divider" />

        <h2 className="login-card__title">Iniciar sesión</h2>
        <p className="login-card__desc">
          Ingresá como <strong>{userType}</strong> para continuar
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form__group">
            <label className="login-form__label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              className="login-form__input"
              type="email"
              placeholder="ejemplo@skola.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="login-form__group">
            <label className="login-form__label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className="login-form__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="login-form__error">{error}</p>
          )}

          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>

  );
}