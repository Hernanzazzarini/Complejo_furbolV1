// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

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

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.username?.[0] || data.password?.[0] || JSON.stringify(data)
        );

      setSuccess("Usuario creado correctamente. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-fullscreen">

      <div className="register-form-panel">
        <div className="register-card">
          <h3 className="text-center mb-4">Registro de usuario</h3>

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