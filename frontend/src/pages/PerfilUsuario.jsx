import React, { useState, useEffect } from "react";
import { misReservas, cancelarReserva } from "../services/api";
import "../styles/PerfilUsuario.css";

const PerfilUsuario = () => {
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarReservas = async () => {
    setCargando(true);
    try {
      const data = await misReservas(); 
      setReservas(data);
      setMensaje("");
    } catch (err) {
      console.error(err);
      setMensaje("No se pudieron cargar tus reservas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCancelar = async (codigo) => {
    if (!window.confirm("¿Estás seguro que quieres cancelar esta reserva?")) return;

    try {
      const data = await cancelarReserva({ codigo });
      if (data.mensaje) {
        setMensaje(data.mensaje);
        cargarReservas();
      } else {
        setMensaje(data.error || "No se pudo cancelar la reserva");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al cancelar la reserva");
    }
  };

  return (
    <div className="perfil-container-full">
      <h2 className="mb-4 text-center">Mis Reservas</h2>

      {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

      {cargando ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : reservas.length === 0 ? (
        <p className="text-center">No tienes reservas activas.</p>
      ) : (
        <div className="reservas-grid-full">
          {reservas.map((r) => (
            <div key={r.codigo_cancelacion} className="reserva-col-full">
              <div className="card shadow-sm reserva-card-full h-100">
                <div className="card-body d-flex flex-column">
                  <p><strong>Fecha:</strong> {r.fecha}</p>
                  <p><strong>Horario:</strong> {r.hora_inicio} - {r.hora_fin}</p>
                  <p><strong>Comentario:</strong> {r.comentario || "Ninguno"}</p>
                  <p><strong>Código de cancelación:</strong> {r.codigo_cancelacion}</p>
                  <button
                    className="btn btn-danger mt-auto"
                    onClick={() => handleCancelar(r.codigo_cancelacion)}
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;