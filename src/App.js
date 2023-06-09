import { useEffect, useReducer } from "react";
import { ToastContainer } from "react-toastify";
import { JoinBlock } from "./components/JoinBlock.jsx";
import socket from "./socket";
import reducer from "./reduces";
import Chat from "./components/Chat.jsx";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj,
    });

    socket.emit("ROOM:JOIN", obj);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);
    setUsers(data.users);
  };

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", addMessage);
  }, []);

  return (
    <>
      <div className="wrapper">
        {!state.joined ? (
          <JoinBlock onLogin={onLogin} />
        ) : (
          <Chat {...state} onAddMessage={addMessage} />
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
