import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Button, Slider, Stack } from "@mui/material";
import { Message, User } from "@/server/connection";
import Connection from "../Connection";
import { SERVER_PORT } from "@/constants/common";
// import Tags from "@/pages/components/Tags";
import Deck from "@/server/deck";
import Chips from "@/assets/Chips.svg";

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

  useEffect(() => {
    const deck = new Deck();
    deck.shuffle();
  }, []);

  return (
    <div className="room">
      <div className="left">
        rank:
        <ul>
          {users.map((item, index) => (
            <div
              key={item.id}
              className={`player ${selfIndex > index ? "left" : "right"}${Math.abs(
                selfIndex - index,
              )}`}
            >
              {item.name}
            </div>
          ))}
        </ul>
      </div>
      <div className="desk">
        <div className="felt">
          <div className="self">{self?.name}</div>
          {users.map((item, index) => (index !== selfIndex && (
            <div
              key={item.id}
              className={`player ${selfIndex > index ? "left" : "right"}${Math.abs(
                selfIndex - index,
              )}`}
            >
              <div
                className="avatar"
                style={{ display: "inline-block", flex: " 0 0 48px" }}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: (item.avatar as string) }}
              />
              <div className="name">
                {item.name}
                <span>
                  <img src={Chips} alt="chip" />
                  1000
                </span>
              </div>
            </div>
          )))}
        </div>
        <div className="operation">
          <Stack
            direction="row"
            spacing={1}
          >
            <Button variant="contained">Check</Button>
            <Button variant="contained">Call</Button>
            <Button variant="contained">Fold</Button>
          </Stack>
          <Box sx={{ width: 200 }}>
            <Slider />
          </Box>
        </div>
      </div>
      <div className="right">
        <Connection recordRef={recordRef} messages={messages} socket={socket} />
      </div>
    </div>
  );
}

export default Room;
