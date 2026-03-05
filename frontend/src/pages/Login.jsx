// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import canchaVideo from "../assets/cancha.mp4";
import { loginUser } from "../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await loginUser({ username, password });

    if (res.error) {
      setError(res.error);
      return;
    }

    navigate("/");
  };

  return (
    <div className="login-fullscreen">

      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-bg"
      >
        <source src={canchaVideo} type="video/mp4" />
        Tu navegador no soporta videos.
      </video>

      <div className="overlay-content">
        <div className="overlay-text professional-text">
          <h1>Complejo de Fútbol</h1>
          <p>Gestión y reservas de canchas de manera sencilla y profesional</p>
        </div>

        <div className="login-card w-100">
          <h3 className="text-center mb-4">Iniciar sesión</h3>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <input
                className="form-control"
                placeholder="Ingresá tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="input-icon">👤</span>
            </div>

            <div className="mb-4 position-relative">
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-icon">🔑</span>
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" className="btn btn-success w-100 py-2">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;