// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { crearReserva, cancelarReserva, horariosOcupados } from "../services/api";
import "../styles/Home.css";

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
    const data = await horariosOcupados();
    setReservas(data);
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
    if (!form.nombre) { setMensaje("Ingresa tu nombre."); return; }
    if (!form.telefono) { setMensaje("Ingresa tu teléfono."); return; }
    if (!/^\d{8,15}$/.test(form.telefono.replace(/\D/g, ""))) {
      setMensaje("Ingresa un teléfono válido (8-15 dígitos)."); return;
    }
    if (!form.fecha || !form.hora_inicio) { setMensaje("Selecciona fecha y horario."); return; }

    const seleccion = horariosFijos.find((h) => h.inicio === form.hora_inicio);
    if (!seleccion) { setMensaje("Horario inválido."); return; }

    const inicioNueva = horaAMinutos(seleccion.inicio);
    const finNueva = horaAMinutos(seleccion.fin);
    const reservasDelDia = reservas.filter((r) => r.fecha === form.fecha);

    const conflicto = reservasDelDia.find(
      (r) =>
        !(finNueva <= horaAMinutos(normalizarHora(r.hora_inicio)) ||
          inicioNueva >= horaAMinutos(normalizarHora(r.hora_fin)))
    );

    if (conflicto) { setMensaje("Ya hay una reserva en ese horario."); return; }

    const data = await crearReserva({
      ...form,
      telefono: form.telefono.replace(/\D/g, ""),
      hora_inicio: seleccion.inicio,
      hora_fin: seleccion.fin,
    });

    if (data.codigo_cancelacion) {
      setCodigoReserva(data.codigo_cancelacion);
      setMensaje("Reserva confirmada. Tu código: " + data.codigo_cancelacion);
      setForm({ nombre: "", telefono: "", email: "", fecha: "", hora_inicio: "", comentario: "" });
      cargarReservas();
    } else {
      setMensaje(data.error || "Error al crear reserva");
    }
  };

  const handleCancelar = async () => {
    if (!cancelar.codigo) { setMensaje("Ingresa el código de cancelación."); return; }

    const data = await cancelarReserva({ codigo: cancelar.codigo });

    if (data.mensaje) {
      setMensaje(data.mensaje);
      setCancelar({ codigo: "" });
      cargarReservas();
    } else {
      setMensaje(data.error || "No se pudo cancelar la reserva");
    }
  };

  const renderDiagrama = () => {
    if (!form.fecha) return <p className="text-center">Selecciona una fecha para ver el cronograma</p>;

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
              <div key={h.inicio} className={`bloque ${ocupada ? "ocupado" : "libre"}`}>
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
    <div className="home-container-professional">

      {/* HERO con imagen Cloudinary */}
      <div className="hero-professional">
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1>Complejo de Futbol 5</h1>
          <p>Selecciona tu fecha y horario disponible</p>
        </div>
      </div>

      <div className="contenido">
        <div className="formulario">
          <div className="card-form">
            <h4>Crear reserva</h4>

            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
            <input name="telefono" placeholder="Teléfono (solo números)" value={form.telefono} onChange={handleChange} />
            <input name="email" placeholder="Email (opcional)" value={form.email} onChange={handleChange} />
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />
            <select name="hora_inicio" value={form.hora_inicio} onChange={handleChange}>
              <option value="">Selecciona horario</option>
              {horariosFijos.map((h) => {
                const ocupado = reservas.find(r => r.fecha === form.fecha && normalizarHora(r.hora_inicio) === h.inicio);
                return (
                  <option key={h.inicio} value={h.inicio} disabled={!!ocupado}>
                    {h.inicio} - {h.fin} {ocupado ? "(Ocupado)" : ""}
                  </option>
                );
              })}
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

        <div className="cronograma-container">
          {renderDiagrama()}
        </div>
      </div>

      <div className="mapa-container">
        <h3 className="mapa-titulo">📍 Cómo llegar al complejo</h3>
        <div className="mapa-wrapper">
          <iframe
            title="Ubicación del complejo"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3603.7485959154487!2d-63.872471!3d-33.199011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDExJzU2LjQiUyA2M8KwNTInMjAuOSJX!5e1!3m2!1ses!2sar!4v1771593941244!5m2!1ses!2sar"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;