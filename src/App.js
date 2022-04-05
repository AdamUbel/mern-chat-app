import { useEffect, useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext, socket } from "./context/app.context";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState([]);
  const [newMessage, setNewMessage] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("UUID")) {
      setLoggedIn(false);
    } else if (localStorage.getItem("UUID")) {
      setLoggedIn(true);
    }
  }, [toggle]);

  const setLogIn = () => {
    setToggle(!toggle);
  };

  return (
    <AppContext.Provider
      value={{
        socket,
        currentRoom,
        setCurrentRoom,
        members,
        setMembers,
        messages,
        setMessages,
        newMessage,
        setNewMessage,
        privateMemberMsg,
        setPrivateMemberMsg,
        rooms,
        setRooms,
      }}
    >
      <BrowserRouter>
        <Navigation setLogIn={setLogIn} loggedIn={loggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          {!loggedIn && (
            <>
              <Route path="/login" element={<Login setLogIn={setLogIn} />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
