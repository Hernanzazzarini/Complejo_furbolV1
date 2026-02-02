import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      if (!res.ok) throw new Error(
        data.username?.[0] || data.password?.[0] || JSON.stringify(data)
      );

      setSuccess("Usuario creado correctamente. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h3>Registro de usuario</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Usuario"
          className="form-control mb-2"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="first_name"
          placeholder="Nombre"
          className="form-control mb-2"
          value={form.first_name}
          onChange={handleChange}
        />
        <input
          name="last_name"
          placeholder="Apellido"
          className="form-control mb-2"
          value={form.last_name}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Contraseña"
          type="password"
          className="form-control mb-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
