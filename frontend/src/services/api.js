// frontend/src/services/api.js

const API_URL = "http://127.0.0.1:8000/api/reservas/"; // usar 127.0.0.1 para evitar problemas de CORS

// 🔹 Función para obtener headers con token JWT
function getAuthHeaders() {
  const token = localStorage.getItem("access");
  // Para debug, podés activar este console.log:
  console.log("TOKEN EN GETAUTHHEADERS:", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔹 Listar reservas (solo usuarios logueados)
export const listarReservas = async () => {
  const token = localStorage.getItem("access");
  if (!token) {
    console.error("No estás logueado");
    return [];
  }

  try {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // enviamos token seguro
      },
    });

    if (!res.ok) {
      console.error("Error al listar reservas:", res.status);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 🔹 Crear reserva (usuarios logueados)
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
        Authorization: `Bearer ${token}`, // token enviado seguro
      },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

// 🔹 Cancelar reserva (usuarios logueados)
export const cancelarReserva = async ({ codigo }) => {
  const token = localStorage.getItem("access");
  if (!token) return { error: "No estás logueado" };

  try {
    const res = await fetch(API_URL + "cancelar/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // token necesario
      },
      body: JSON.stringify({ codigo }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};
