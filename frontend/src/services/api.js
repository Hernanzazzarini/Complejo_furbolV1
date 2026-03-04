// src/services/api.js

// 👉 Base URL desde variable de entorno de Vercel (Vite)
const API_BASE = import.meta.env.VITE_API_URL;

// 👉 Endpoints
const AUTH_URL = `${API_BASE}/auth/`;
const RESERVAS_URL = `${API_BASE}/reservas/`;

// -----------------------------
// Headers con token JWT
// -----------------------------
function getAuthHeaders() {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -----------------------------
// Registro de usuario
// -----------------------------
export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${AUTH_URL}register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      const errMsg =
        data.username?.[0] || data.password?.[0] || data.detail || JSON.stringify(data);
      return { error: errMsg };
    }
    return data;
  } catch (err) {
    return { error: err.message };
  }
};

// -----------------------------
// Login de usuario
// -----------------------------
export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${AUTH_URL}login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.detail || JSON.stringify(data) };
    }

    // Guardar token y usuario
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      })
    );

    return data;
  } catch (err) {
    return { error: err.message };
  }
};

// -----------------------------
// Listar todas las reservas (solo admin)
// -----------------------------
export const listarReservas = async () => {
  const token = localStorage.getItem("access");
  if (!token) return [];

  try {
    const res = await fetch(RESERVAS_URL, {
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
    const res = await fetch(RESERVAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
    const res = await fetch(`${RESERVAS_URL}cancelar/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
    const res = await fetch(`${RESERVAS_URL}mis_reservas/`, {
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
    const res = await fetch(`${RESERVAS_URL}ocupadas/`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};