import React, { useState, FormEvent, RefObject } from "react";
import { Socket } from "socket.io-client";
import { Button } from "@mui/material";
import { IMessage } from "@/types/common";

import "./style.scss";

interface Props {
  messages: Record<string, IMessage> | undefined;
  socket: Socket | undefined;
  recordRef: RefObject<HTMLDivElement>;
}

function Connection(props: Props) {
  const { messages, socket, recordRef } = props;

  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    socket?.emit("message", inputVal);
    setInputVal("");
  };

  return (
    <div className="connection">
      <div className="record" ref={recordRef}>
        <ul>
          {Object.values(messages || {})
            .sort((a, b) => a.time - b.time)
            .map((item) => (
              <li
                key={item.id}
                className={item.player.name === "Dealer" ? "dealer" : ""}
              >
                <div
                  className="avatar"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: item.player.avatar as string }}
                />
                <div className="content">
                  <div className="content-top">
                    {item.player.name !== "Dealer" && (
                      <span className="name" style={{ color: item.player.color }}>
                        {item.player.name}
                      </span>
                    )}
                    <span className="time">
                      {new Date(item.time).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="content-text">{item.content}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="input">
        <form onSubmit={handleSend}>
          <div className="input-form">
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <Button
              size="small"
              color="info"
              variant="contained"
              disabled={!inputVal}
              type="submit"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Connection;
