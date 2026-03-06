// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import fondo from "../assets/pelotadefutbol.jpg";
import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="register-fullscreen">

      {/* Imagen de fondo */}
      <img src={fondo} alt="Fondo fútbol" className="background-image" />

      {/* Contenedor centrado */}
      <div className="register-center-panel">

        <div className="register-card">

          <h2 className="text-center mb-2">⚽ Complejo de Fútbol</h2>
          <p className="text-center mb-4">Registro de usuario</p>

          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Usuario */}
            <div className="mb-3 position-relative">
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
              <span className="input-icon">👤</span>
            </div>

            {/* Email */}
            <div className="mb-3 position-relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
              <span className="input-icon">📧</span>
            </div>

            {/* Nombre */}
            <div className="mb-3 position-relative">
              <input
                type="text"
                name="first_name"
                placeholder="Nombre"
                className="form-control"
                value={form.first_name}
                onChange={handleChange}
              />
              <span className="input-icon">📝</span>
            </div>

            {/* Apellido */}
            <div className="mb-3 position-relative">
              <input
                type="text"
                name="last_name"
                placeholder="Apellido"
                className="form-control"
                value={form.last_name}
                onChange={handleChange}
              />
              <span className="input-icon">📝</span>
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
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