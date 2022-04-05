import React, { useState } from "react";
import { Col, Container, Form, Button, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import deafultProfilePic from "../assets/default.png";
import "./styles/signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  // NOTE img stuff
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const validateImg = (e) => {
    const file = e.target.files[0];

    if (file.size >= 1048576) {
      return alert("File must be smaller then 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "yxjpv0wn");
    try {
      setUploadingImg(true);
      let res = await fetch("https://api.cloudinary.com/v1_1/dbmvfqnpx/image/upload", {
        method: "post",
        body: data,
      });
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      console.log(error);
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload a profile picture");
    const url = await uploadImage(image);
    // console.log(url);
    // signup user
    axios
      .post("http://localhost:5000/api/users", {
        username,
        password,
        email,
        picture: url,
      })
      .then((resp) => {
        // console.log(resp.data);
        navigate("/login");
      })
      .catch((err) => {
        // gets errors
        setEmail("");
        setPassword("");
        setUsername("");
        // console.log(err.response);
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
        <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSubmit}>
            <h1 className="text-center">Create Account</h1>
            <div className="signup-profile-pic__container">
              <img src={imagePreview || deafultProfilePic} alt="" className="signup-profile-pic" />
              <label htmlFor="image-upload" className="img-uplaod-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={validateImg} />
            </div>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
              {uploadingImg ? "Registering User..." : "Register"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already Have An Account ?{" "}
                <Link to="/login" className="lnk">
                  Login
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
        <Col md={5} className="signup__bg"></Col>
      </Row>
    </Container>
  );
}

export default Signup;
