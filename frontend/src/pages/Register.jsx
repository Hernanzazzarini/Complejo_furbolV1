// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import canchaVideo from "../assets/cancha.mp4"; // video de fondo
import { registerUser } from "../services/api"; // función de registro

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await registerUser(form);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess("Usuario creado correctamente. Redirigiendo al login...");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="register-fullscreen">
      {/* Video de fondo */}
      <video autoPlay loop muted playsInline className="video-bg">
        <source src={canchaVideo} type="video/mp4" />
        Tu navegador no soporta videos.
      </video>

      {/* Formulario centrado */}
      <div className="register-center-panel">
        <div className="register-card">
          <h2 className="text-center mb-3">Complejo de Fútbol</h2>
          <p className="text-center mb-4">Registro de usuario</p>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {success && <div className="alert alert-success text-center">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <input
                name="username"
                placeholder="Usuario"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
              <span className="input-icon">👤</span>
            </div>

            <div className="mb-3 position-relative">
              <input
                name="email"
                placeholder="Email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
              <span className="input-icon">📧</span>
            </div>

            <div className="mb-3 position-relative">
              <input
                name="first_name"
                placeholder="Nombre"
                className="form-control"
                value={form.first_name}
                onChange={handleChange}
              />
              <span className="input-icon">📝</span>
            </div>

            <div className="mb-3 position-relative">
              <input
                name="last_name"
                placeholder="Apellido"
                className="form-control"
                value={form.last_name}
                onChange={handleChange}
              />
              <span className="input-icon">📝</span>
            </div>

            <div className="mb-3 position-relative">
              <input
                name="password"
                placeholder="Contraseña"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span className="input-icon">🔑</span>
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;