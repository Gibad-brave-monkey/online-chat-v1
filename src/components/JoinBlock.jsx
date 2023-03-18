import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const JoinBlock = ({ onLogin }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !userName) {
      return alert("Неверные данные");
    }

    const obj = {
      roomId,
      userName,
    };
    setIsLoading(true);
    await axios.post("/rooms", obj);

    onLogin(obj);
    toast(`Вы вошли в комнату : ${obj.roomId}`);
  };

  return (
    <div className="join-block">
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ваше Имя"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={onEnter} className="btn" disabled={isLoading}>
        {isLoading ? "Вход" : "Войти"}
      </button>
    </div>
  );
};
