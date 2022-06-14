import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, User } from "@/server/chat";
import Chat from "../Chat";
import { SERVER_PORT } from "@/constants/common";
// import Tags from "@/pages/components/Tags";

import "./style.scss";

// const { SmallBlind, BigBlind, AllIn } = Tags;

function Room() {
  const [socket, setSocket] = useState<Socket>();

  const [messages, setMessages] = useState<Record<string, Message>>();
  const [users, setUsers] = useState<User[]>([]);

  const [self, setSelf] = useState<User>();

  const recordRef = useRef<HTMLDivElement>(null);

  const selfIndex = useMemo(
    () => users.findIndex((item) => item.id === self?.id),
    [users, self],
  );

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:${SERVER_PORT}`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    const messageListener = (response: { msg: Message; users: User[] }) => {
      setMessages((prev) => {
        const newMsgs = { ...prev };
        newMsgs[response.msg.id] = response.msg;
        return newMsgs;
      });

      setUsers(response.users);

      if (recordRef.current) {
        recordRef.current.scrollTop = recordRef.current?.scrollHeight ?? 0;
      }
    };

    const identifyListener = (res: User) => {
      setSelf(res);
    };

    socket?.on("message", messageListener);
    socket?.on("identify", identifyListener);
    socket?.emit("sit_down");
    socket?.emit("getMessages");

    return () => {
      socket?.off("message");
    };
  }, [socket]);

  return (
    <div className="room">
      <div className="left" />
      <div className="desk">
        <div className="felt">
          <div className="self">{self?.name}</div>
          {users.map((item, index) => (index !== selfIndex ? (
            <div
              key={item.id}
              className={`player ${selfIndex > index ? "left" : "right"}${Math.abs(
                selfIndex - index,
              )}`}
            >
              {item.name}
            </div>
          ) : null))}
        </div>
      </div>
      <div className="right">
        <Chat recordRef={recordRef} messages={messages} socket={socket} />
      </div>
    </div>
  );
}

export default Room;
