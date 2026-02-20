// src/pages/ReservasAdmin.jsx
import React, { useEffect, useState } from "react";
import { listarReservas } from "../services/api";
import "../styles/ReservasAdmin.css";

const ReservasAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroFecha, setFiltroFecha] = useState(""); // YYYY-MM-DD

  useEffect(() => {
    const fetchData = async () => {
      const data = await listarReservas();
      setReservas(data);
    };
    fetchData();
  }, []);

  const estadoBadge = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "badge bg-warning text-dark";
      case "confirmada":
        return "badge bg-success";
      case "cancelada":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  const cardBg = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-warning bg-opacity-10";
      case "confirmada":
        return "bg-success bg-opacity-10";
      case "cancelada":
        return "bg-danger bg-opacity-10";
      default:
        return "bg-light";
    }
  };

  const reservasFiltradas = reservas.filter((r) => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesEstado =
      filtroEstado === "todos" || r.estado.toLowerCase() === filtroEstado;
    const matchesFecha = !filtroFecha || r.fecha === filtroFecha;
    return matchesSearch && matchesEstado && matchesFecha;
  });

  return (
    <div className="reservas-admin-container">
      <h1 className="text-center mb-4">Reservas del Complejo (Admin)</h1>

      {/* Filtros rápidos por estado */}
      <div className="filtros-estado mb-3">
        {["todos", "pendiente", "confirmada", "cancelada"].map((estado) => (
          <button
            key={estado}
            className={`btn btn-sm filtro-btn ${
              filtroEstado === estado ? `activo ${estado}` : ""
            }`}
            onClick={() => setFiltroEstado(estado)}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {/* Búsqueda y filtro por fecha */}
      <div className="filtros-inputs row g-2 mb-4">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <input
            type="date"
            className="form-control"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
      </div>

      {reservasFiltradas.length === 0 ? (
        <p className="text-center">No se encontraron reservas.</p>
      ) : (
        <div className="row g-3 reservas-grid">
          {reservasFiltradas.map((r) => (
            <div key={r.id} className="col-12 col-sm-6 col-lg-4">
              <div className={`card h-100 reserva-card ${cardBg(r.estado)}`}>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{r.nombre}</h5>
                  <p className="card-text mb-1"><strong>Tel:</strong> {r.telefono}</p>
                  <p className="card-text mb-1"><strong>Email:</strong> {r.email}</p>
                  <p className="card-text mb-1"><strong>Fecha:</strong> {r.fecha}</p>
                  <p className="card-text mb-1"><strong>Horario:</strong> {r.hora_inicio} - {r.hora_fin}</p>
                  {r.comentario && (
                    <p className="card-text mb-1"><strong>Comentario:</strong> {r.comentario}</p>
                  )}
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className={estadoBadge(r.estado)}>{r.estado}</span>
                    <small className="text-muted">{new Date(r.created_at).toLocaleString()}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservasAdmin;


