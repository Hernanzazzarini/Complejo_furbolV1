import React, { useEffect, useState } from "react";
import { listarReservas } from "../services/api";

const ReservasAdmin = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await listarReservas();
      setReservas(data);
    };
    fetchData();
  }, []);

  return (
    <div className="container my-4">
      <h1>Reservas del Complejo (Admin)</h1>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Comentario</th>
            <th>Estado</th>
            <th>Creado</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td>{r.nombre}</td>
              <td>{r.telefono}</td>
              <td>{r.email}</td>
              <td>{r.fecha}</td>
              <td>{r.hora_inicio}</td>
              <td>{r.hora_fin}</td>
              <td>{r.comentario}</td>
              <td>{r.estado}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservasAdmin;

