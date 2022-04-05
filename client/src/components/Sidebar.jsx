import React, { useContext, useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { AppContext, socket } from "../context/app.context";
import "./styles/sidebar.css";

function Sidebar() {
  const {
    socket,
    setMembers,
    members,
    currentRoom,
    setCurrentRoom,
    rooms,
    setRooms,
    privateMemberMsg,
    setPrivateMemberMsg,
  } = useContext(AppContext);

  // const [user, setUser] = useState(JSON.parse(localStorage.getItem("USER")) || null);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  // BUG notifications switch users room messages otherwise work

  // const addNotification = (user, room) => {
  //   let updatedUser = user;
  //   if (updatedUser.newMessage[room]) {
  //     updatedUser.newMessage[room] = updatedUser.newMessage[room] + 1;
  //   } else {
  //     updatedUser.newMessage[room] = 1;
  //   }
  //   setUser(updatedUser);
  // };
  // const removeNotification = (user, room) => {
  //   let updatedUser = user;
  //   updatedUser.newMessage[room] = 0;

  //   setUser(updatedUser);
  // };

  const getRooms = () => {
    fetch("http://localhost:5000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };

  useEffect(() => {
    setCurrentRoom("General");
    getRooms();
    socket.emit("join-room", "General");
    socket.emit("new-user");
  }, []);

  const joinRoom = (room, isPublic = true) => {
    socket.emit("join-room", room);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    // if (user) {
    // removeNotification(user, room); BUG continuation of notification bug
    // socket.off("notifications").on("notifications", (room) => {
    //   addNotification(user, room);
    // });
    // }
  };

  return (
    <>
      <h2 className="sidebar_title">Available Rooms</h2>
      <ListGroup className="rooms">
        {rooms.map((room, i) => (
          <ListGroup.Item
            className="sidebar_item"
            key={i}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
          >
            {room}{" "}
            {
              currentRoom !== room && <span></span>
              // <span> BUG continuation of notification bug
              //   {user &&
              //     Object.keys(user.newMessage)
              //       .filter((key) => key == room)
              //       .map((key, id) => {
              //         return <div key={id}>{user.newMessage[key] > 0 ? user.newMessage[key] : null}</div>;
              //       })}
              // </span>
            }
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2 className="sidebar_title">Members</h2>
      <ListGroup className="members">
        {members.map((member) => (
          <ListGroup.Item className="sidebar_item" key={member._id}>
            {member.username}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default Sidebar;
