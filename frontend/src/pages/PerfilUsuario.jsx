import React, { useState, useEffect } from "react";
import { misReservas, cancelarReserva } from "../services/api";

const PerfilUsuario = () => {
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true); // Nuevo estado para carga

  // -----------------------------
  // Cargar reservas del usuario
  // -----------------------------
  const cargarReservas = async () => {
    setCargando(true);
    try {
      const data = await misReservas(); // Llama al endpoint mis_reservas
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

  // -----------------------------
  // Cancelar reserva
  // -----------------------------
  const handleCancelar = async (codigo) => {
    if (!window.confirm("¿Estás seguro que quieres cancelar esta reserva?")) return;

    try {
      const data = await cancelarReserva({ codigo });
      if (data.mensaje) {
        setMensaje(data.mensaje);
        cargarReservas(); // Actualiza lista
      } else {
        setMensaje(data.error || "No se pudo cancelar la reserva");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al cancelar la reserva");
    }
  };

  return (
    <div className="perfil-container container my-4">
      <h2 className="mb-4">Mis Reservas</h2>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {cargando ? (
        <p>Cargando tus reservas...</p>
      ) : reservas.length === 0 ? (
        <p>No tienes reservas activas.</p>
      ) : (
        <div className="row">
          {reservas.map((r) => (
            <div key={r.codigo_cancelacion} className="col-md-6 mb-3">
              <div className="card shadow-sm reserva-card">
                <div className="card-body">
                  <p><strong>Fecha:</strong> {r.fecha}</p>
                  <p><strong>Horario:</strong> {r.hora_inicio} - {r.hora_fin}</p>
                  <p><strong>Comentario:</strong> {r.comentario || "Ninguno"}</p>
                  <p><strong>Código de cancelación:</strong> {r.codigo_cancelacion}</p>
                  <button
                    className="btn btn-danger mt-2"
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
