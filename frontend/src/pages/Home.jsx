// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { listarReservas, crearReserva, cancelarReserva } from "../services/api";
import "../styles/Home.css"; // Asegúrate de tener Home.css en la misma carpeta
import canchaVideo from "../assets/cancha.mp4";


const Home = () => {
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora_inicio: "",
    comentario: "",
  });
  const [cancelar, setCancelar] = useState({ codigo: "" });
  const [mensaje, setMensaje] = useState("");
  const [codigoReserva, setCodigoReserva] = useState("");

  const horariosFijos = [
    { inicio: "18:00", fin: "18:50" },
    { inicio: "19:00", fin: "19:50" },
    { inicio: "20:00", fin: "20:50" },
    { inicio: "21:00", fin: "21:50" },
    { inicio: "22:00", fin: "22:50" },
    { inicio: "23:00", fin: "23:50" },
  ];

  const cargarReservas = async () => {
    const data = await listarReservas();
    setReservas(data.filter((r) => r.estado !== "cancelada"));
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const horaAMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const normalizarHora = (hora) => (hora ? hora.slice(0, 5) : "");

  const handleCrear = async () => {
    if (!form.hora_inicio) {
      setMensaje("Selecciona un horario para reservar.");
      return;
    }
    const seleccion = horariosFijos.find((h) => h.inicio === form.hora_inicio);
    if (!seleccion) {
      setMensaje("Horario inválido.");
      return;
    }

    const inicioNueva = horaAMinutos(seleccion.inicio);
    const finNueva = horaAMinutos(seleccion.fin);

    const conflicto = reservas.find(
      (r) =>
        r.fecha === form.fecha &&
        !(
          finNueva <= horaAMinutos(normalizarHora(r.hora_inicio)) ||
          inicioNueva >= horaAMinutos(normalizarHora(r.hora_fin))
        )
    );

    if (conflicto) {
      setMensaje("Ya hay una reserva en ese horario. Elige otro.");
      return;
    }

    const data = await crearReserva({
      ...form,
      hora_inicio: seleccion.inicio,
      hora_fin: seleccion.fin,
    });

    if (data.codigo_cancelacion) {
      setCodigoReserva(data.codigo_cancelacion);
      setMensaje("Reserva confirmada. Tu código: " + data.codigo_cancelacion);
      setForm({
        nombre: "",
        telefono: "",
        email: "",
        fecha: "",
        hora_inicio: "",
        comentario: "",
      });
      cargarReservas();
    } else {
      setMensaje(data.error || "Error al crear reserva");
    }
  };

  const handleCancelar = async () => {
    if (!cancelar.codigo) {
      setMensaje("Ingresa el código de cancelación.");
      return;
    }
    const reserva = reservas.find((r) => r.codigo_cancelacion === cancelar.codigo);
    if (!reserva) {
      setMensaje("Código inválido o reserva no encontrada.");
      return;
    }
    const data = await cancelarReserva({ id: reserva.id, codigo: cancelar.codigo });
    if (data.mensaje) {
      setMensaje(data.mensaje);
      setCancelar({ codigo: "" });
      cargarReservas();
    } else {
      setMensaje(data.error || "No se pudo cancelar la reserva");
    }
  };

  const renderDiagrama = () => {
    if (!form.fecha)
      return <p className="text-center">Selecciona una fecha para ver el cronograma</p>;

    const reservasDelDia = reservas.filter((r) => r.fecha === form.fecha);

    return (
      <div className="cronograma">
        <h5 className="text-center mb-3">Cronograma de reservas - {form.fecha}</h5>
        <div className="grid-cronograma">
          {horariosFijos.map((h) => {
            const ocupada = reservasDelDia.find(
              (r) =>
                normalizarHora(r.hora_inicio) === h.inicio &&
                normalizarHora(r.hora_fin) === h.fin
            );
            return (
              <div
                key={h.inicio}
                className={`bloque ${ocupada ? "ocupado" : "libre"}`}
              >
                <span className="hora">{h.inicio} - {h.fin}</span>
                <span className="nombre">{ocupada ? ocupada.nombre : "Libre"}</span>
              </div>
            );
          })}
        </div>
        <div className="leyenda">
          <span className="libre-leyenda">Libre</span>
          <span className="ocupado-leyenda">Ocupado</span>
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      {/* Hero con video de fondo */}
      <div className="hero">
      <video className="video-hero" src={canchaVideo} autoPlay muted loop />
        <div className="hero-text">
          <h1>Complejo de Futbol </h1>
          <p>Selecciona tu fecha y horario disponible</p>
        </div>
      </div>

      <div className="contenido">
        <div className="formulario">
          <div className="card-form">
            <h4>Crear reserva</h4>
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
            <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
            <input name="email" placeholder="Email (opcional)" value={form.email} onChange={handleChange} />
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />

            <select name="hora_inicio" value={form.hora_inicio} onChange={handleChange}>
              <option value="">Selecciona horario</option>
              {horariosFijos.map((h) => (
                <option key={h.inicio} value={h.inicio}>{h.inicio} - {h.fin}</option>
              ))}
            </select>

            <textarea name="comentario" placeholder="Comentario (opcional)" value={form.comentario} onChange={handleChange} />
            <button className="btn-reservar" onClick={handleCrear}>Reservar</button>
          </div>

          <div className="card-form">
            <h4>Cancelar reserva</h4>
            <input placeholder="Código de cancelación" value={cancelar.codigo} onChange={(e) => setCancelar({ codigo: e.target.value })} />
            <button className="btn-cancelar" onClick={handleCancelar}>Cancelar reserva</button>
          </div>

          {mensaje && <div className="mensaje">{mensaje}</div>}
        </div>

        <div className="cronograma-container">{renderDiagrama()}</div>
      </div>
    </div>
  );
};

export default Home;