import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username"); // <-- NUEVO: nombre del usuario

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username"); // <-- eliminamos nombre al cerrar sesión
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, #2ecc71, #27ae60)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        padding: "10px 0",
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaFutbol style={{ marginRight: "8px", fontSize: "1.5rem" }} />
          Complejo de Futbol 5
        </Link>

        {/* Toggle móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {token ? (
              <>
                {/* Mostramos el nombre */}
                <li className="nav-item">
                  <span className="nav-link text-white">
                    Hola, {username}
                  </span>
                </li>

                <li className="nav-item">
                  <Link className="nav-link btn-reserva" to="/reservas-admin">
                    Reservas Admin
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-danger"
                    onClick={handleLogout}
                    style={{ marginLeft: "10px" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link btn btn-success" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link btn btn-primary"
                    to="/register"
                    style={{ marginLeft: "10px" }}
                  >
                    Registro
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
