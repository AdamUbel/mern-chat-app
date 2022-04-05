import React, { useState } from "react";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GameRoomLogo.jpg";
import "./styles/navigation.css";

function Navigation(props) {
  const { setLogIn, loggedIn } = props;
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("USER")) || {});

  const onClickResponse = () => {
    localStorage.clear();
    setLogIn();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={logo} style={{ height: 75, width: "auto" }} className="navbar_img" />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {loggedIn ? (
              <>
                <LinkContainer to="/chat">
                  <Nav.Link>Chat</Nav.Link>
                </LinkContainer>

                <NavDropdown
                  title={
                    <>
                      <img
                        src={user.picture}
                        alt="profile picture"
                        style={{ width: 35, height: 35, marginRight: 10, objectFit: "cover" }}
                        className="nav_dropdown-img"
                      />
                      {user.username}
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onClick={onClickResponse}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Nav.Link>Signup</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/chat">
                  <Nav.Link>Chat</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
