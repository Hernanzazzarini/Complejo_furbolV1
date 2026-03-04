// src/services/api.js
const API_URL = "http://127.0.0.1:8000/api/reservas/";

// -----------------------------
// Headers con token JWT
// -----------------------------
function getAuthHeaders() {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -----------------------------
// Listar todas las reservas (solo admin)
// -----------------------------
export const listarReservas = async () => {
  const token = localStorage.getItem("access");
  if (!token) return [];

  try {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// -----------------------------
// Crear reserva
// -----------------------------
export const crearReserva = async (reserva) => {
  const token = localStorage.getItem("access");
  if (!token) return { error: "No estás logueado" };

  try {
    const bodyData = {
      ...reserva,
      hora_inicio: reserva.hora_inicio + ":00",
      hora_fin: reserva.hora_fin + ":00",
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(bodyData),
    });

    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

// -----------------------------
// Cancelar reserva
// -----------------------------
export const cancelarReserva = async ({ codigo }) => {
  const token = localStorage.getItem("access");
  if (!token) return { error: "No estás logueado" };

  try {
    const res = await fetch(`${API_URL}cancelar/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ codigo }),
    });

    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

// -----------------------------
// Obtener reservas del usuario logueado
// -----------------------------
export const misReservas = async () => {
  const token = localStorage.getItem("access");
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}mis_reservas/`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// -----------------------------
// Obtener horarios ocupados (público)
// -----------------------------
export const horariosOcupados = async () => {
  try {
    const res = await fetch(`${API_URL}ocupadas/`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};