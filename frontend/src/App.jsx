import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ReservasAdmin from "./pages/ReservasAdmin.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorBoundary from "./components/ErrorBoundary.jsx"; // <-- IMPORTANTE
import PerfilUsuario from "./pages/PerfilUsuario.jsx";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservas-admin" element={<ReservasAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<PerfilUsuario />} /> {/* <-- nueva ruta */}
        </Routes>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
}

export default App;



