import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFutbol, FaUserCircle } from "react-icons/fa";
import { Dropdown, Nav, Navbar as BSNavbar, Container } from "react-bootstrap";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <BSNavbar expand="lg" variant="dark" style={{ background: "linear-gradient(90deg, #2ecc71, #27ae60)" }}>
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaFutbol style={{ marginRight: "8px", fontSize: "1.5rem" }} />
          Complejo de Futbol 5
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {token ? (
              <>
                <Dropdown align="end" className="ms-2">
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className="d-flex align-items-center">
                    <FaUserCircle style={{ marginRight: "5px" }} />
                    {username}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/perfil">Mi Perfil</Dropdown.Item>
                    <Dropdown.Item className="text-danger" onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Nav.Link as={Link} to="/reservas-admin" className="btn btn-outline-light ms-2">
                  Reservas Admin
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-success">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-primary ms-2">Registro</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;

