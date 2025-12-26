import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export function AppNavbar() {
  return (
    <Navbar className="appNavbar" expand="sm" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img className="navLogo" src="logo.png" alt="Cavalos de Aço MG" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end>
              <i className="bi bi-house-door-fill me-2" aria-hidden="true" />
              Home
            </Nav.Link>

            <span className="navSep d-none d-lg-inline" aria-hidden="true" />

            <Nav.Link as={NavLink} to="/calendario">
              <i className="bi bi-calendar-week-fill me-2" aria-hidden="true" />
              Calendário
            </Nav.Link>

            <span className="navSep d-none d-lg-inline" aria-hidden="true" />

            <Nav.Link as={NavLink} to="/galeria">
              <i className="bi bi-images me-2" aria-hidden="true" />
              Galeria
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
