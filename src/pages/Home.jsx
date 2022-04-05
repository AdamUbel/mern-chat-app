import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./styles/home.css";

function Home() {
  return (
    <Row>
      <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
        <div>
          <h1>The Gaming World Without Limits</h1>
          <p>The Game Room Lets You Chat With Those Sharing Your Quest For World Domination.</p>
          <LinkContainer to="/chat">
            <Button className="home_btn">
              Start Your Adventure <i className="fas fa-comments home-message-icon"></i>
            </Button>
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className="home__bg"></Col>
    </Row>
  );
}

export default Home;
