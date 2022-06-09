import React, { useState, useEffect, FormEvent } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_PORT } from "@/constants/common";
import "./style.scss";

function Chat() {
  const [socket, setSocket] = useState<Socket>();

  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    socket?.emit("chat message", inputVal);
    setInputVal("");
  };

  useEffect(() => {
    const newSocket = io(`http://localhost:${SERVER_PORT}`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    socket?.on("chat message", (msg) => {
      setMessages((prev) => prev.concat(msg));
    });
    socket?.emit("chat message", "enter");

    return () => {
      socket?.off("chat message");
    };
  }, [socket]);

  return (
    <div className="chat">
      <div className="record">
        <ul>
          {messages.map((item) => (
            <li key={item}>
              <span className="name">You: </span>
              <span className="content">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="input">
        <form onSubmit={handleSend}>
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button disabled={!inputVal} type="submit">
            send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
