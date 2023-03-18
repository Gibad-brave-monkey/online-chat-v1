import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

import music from "../mp3/The_Irish_Rovers_-_Drunken_Sailor_(musmore.com).mp3";

function Chat({ users, messages, userName, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const messageRef = useRef(null);

  const onSubmitMessage = () => {
    socket.emit("ROOM:NEW_MESSAGE", { userName, text: messageValue, roomId });
    onAddMessage({
      userName,
      roomId,
      text: messageValue,
    });
    setMessageValue("");
  };

  useEffect(() => {
    messageRef.current.scrollTo(0, 99999);
  }, [messages]);

  return (
    <>
      <p className="music_button" onClick={() => setMusicOn(!musicOn)}>
        Выключить/Включить музыку
      </p>
      <div className="chat">
        <audio src={music} autoPlay muted={musicOn} />
        <div className="chat-users">
          Комната: <b>{roomId}</b>
          <hr />
          <b>Онлайн: ({users.length})</b>
          <ul>
            {users.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="chat-messages">
          <div ref={messageRef} className="messages">
            {messages.map((message, idx) => (
              <div key={idx} className="message">
                <p>{message.text}</p>
                <div>
                  <span>{message.userName}</span>
                </div>
              </div>
            ))}
          </div>
          <form>
            <textarea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="form-control"
              rows="3"
            ></textarea>
            <button
              onClick={onSubmitMessage}
              type="button"
              className="btn btn-primary"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chat;
