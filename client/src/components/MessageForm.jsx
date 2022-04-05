import React, { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { AppContext } from "../context/app.context";
import "./styles/message_form.css";

function MessageForm() {
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("USER"));
  const { socket, currentRoom, messages, setMessages, privateMemberMsg } = useContext(AppContext);

  const formatDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return `${month}/${day}/${year}`;
  };

  const todaysDate = formatDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = `${today.getHours()}:${minutes}`;
    const roomId = currentRoom;
    socket.emit(
      "message-room",
      roomId,
      message,
      user || { username: `anonymous-${Math.floor(Math.random() * 10000) + 1678}` },
      time,
      todaysDate
    );
    setMessage("");
  };
  return (
    <>
      <div className="messages-output" id="style-2">
        {messages &&
          messages.map(({ _id: date, messagesByDate }, i) => (
            <div key={i}>
              <p className="text-center message_date">
                <small className="timestamps text-center">{date}</small>
              </p>

              {messagesByDate?.map(({ content, time, from: sender }, i) => (
                <div className="message message_container" key={i}>
                  <p className="message_text">{content}</p>
                  {sender.picture && <img src={sender.picture} alt="" />}
                  <p className="content_details">
                    From:{"   "}
                    <small>{`${sender.username} - ${time}`}</small>
                  </p>
                </div>
              ))}
            </div>
          ))}
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="chat_input"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button variant="primary" type="submit" style={{ width: "100%", border: "2px solid black" }}>
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default MessageForm;
