import React, { useState, FormEvent, RefObject } from "react";
import { Socket } from "socket.io-client";
import { Message } from "@/server/chat";
import "./style.scss";

interface Props {
  messages: Record<string, Message> | undefined;
  socket: Socket | undefined;
  recordRef: RefObject<HTMLDivElement>;
}

function Chat(props: Props) {
  const { messages, socket, recordRef } = props;

  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    socket?.emit("message", inputVal);
    setInputVal("");
  };

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
