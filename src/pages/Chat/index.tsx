import React, { useState, useEffect, FormEvent, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_PORT } from "@/constants/common";
import { Message } from "@/server/chat";
import "./style.scss";

function Chat() {
  const [socket, setSocket] = useState<Socket>();

  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<Record<string, Message>>();

  const recordRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    socket?.emit("message", inputVal);
    setInputVal("");
  };

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:${SERVER_PORT}`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    const messageListener = (msg: Message) => {
      setMessages((prev) => {
        const newMsgs = { ...prev };
        newMsgs[msg.id] = msg;
        return newMsgs;
      });

      if (recordRef.current) {
        recordRef.current.scrollTop = recordRef.current?.scrollHeight ?? 0;
      }
    };

    socket?.on("message", messageListener);
    socket?.emit("register");
    socket?.emit("getMessages");

    return () => {
      socket?.off("message");
    };
  }, [socket]);

  return (
    <div className="chat">
      <div className="record" ref={recordRef}>
        <ul>
          {Object.values(messages || {})
            .sort((a, b) => a.time - b.time)
            .map((item) => (
              <li key={item.id} style={{ color: item.user.color }}>
                <span className="time">
                  {new Date(item.time).toLocaleTimeString()}
                </span>
                <span className="name">{` ${item.user.name}: `}</span>
                <span className="content">{item.content}</span>
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
