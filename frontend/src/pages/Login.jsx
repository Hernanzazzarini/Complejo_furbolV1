import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Credenciales incorrectas");

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    /* fuerza ancho real del viewport */
    <div className="vw-100 min-vh-100 p-0 m-0">
      <div className="row g-0 min-vh-100">

        <div className="col-12">
          <div className="card w-100 min-vh-100 border-0 rounded-0">

            <div className="row g-0 h-100">

              {/* Panel izquierdo */}
              <div className="col-12 col-md-6 d-none d-md-flex bg-success text-white align-items-center justify-content-center">
                <div className="text-center px-4">
                  <h2 className="fw-bold mb-3">Complejo de fútbol</h2>
                  <p className="mb-0">
                    Accedé al sistema de reservas y gestión
                  </p>
                </div>
              </div>

              {/* Formulario */}
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="w-100" style={{ maxWidth: 420 }}>

                  <h3 className="mb-4 text-center fw-bold">
                    Iniciar sesión
                  </h3>

                  {error && (
                    <div className="alert alert-danger text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                      <label className="form-label">Usuario</label>
                      <input
                        className="form-control"
                        placeholder="Ingresá tu usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Contraseña</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Ingresá tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100 py-2 fw-semibold"
                    >
                      Entrar
                    </button>

                  </form>

                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

