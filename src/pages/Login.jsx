import React, { useState, useContext } from "react";
import { Col, Container, Form, Button, Row } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";
import { AppContext } from "../context/app.context";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { socket } = useContext(AppContext);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // localStorage.setItem("user", JSON.stringify(user));
    // login logic
    axios
      .post("http://localhost:5000/api/user", {
        username,
        password,
      })
      .then((resp) => {
        localStorage.setItem("UUID", resp.data._id);
        localStorage.setItem("USER", JSON.stringify(resp.data));
        props.setLogIn();
        // socket
        socket.emit("new-user");
        navigate("/chat");
        // console.log(localStorage);
      })
      .catch((err) => {
        // gets errors
        setPassword("");
        setUsername("");
        console.log(err.response);
        const errData = err.response.data.errors;
        // make a newArr to push errors too
        const newErrors = [];
        // loop through the resp of errors and push the message from server

        for (const key of Object.keys(errData)) {
          newErrors.push(errData[key]["message"]);
        }

        setErrors(newErrors);
      });
  };

  return (
    <Container>
      <Row>
        <Col md={5} className="login__bg"></Col>
        <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
            <h1 className="text-center">Login</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
            <div className="py-4">
              <p className="text-center">
                Don't Have An Account ?{" "}
                <Link to="/signup" className="lnk">
                  Signup
                </Link>
              </p>
              {errors.length > 0 &&
                errors.map((err, i) => {
                  return (
                    <small style={{ color: "red", display: "block", textAlign: "center" }} key={i}>
                      {err}
                    </small>
                  );
                })}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
