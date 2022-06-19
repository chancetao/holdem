import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Button, Slider, Stack } from "@mui/material";
import Connection from "../Connection";
import { SERVER_PORT } from "@/constants/common";
// import Tags from "@/pages/components/Tags";
import Chips from "@/assets/Chips.svg";

import "./style.scss";
import { IMessage, IPlayer } from "@/types/common";

// const { SmallBlind, BigBlind, AllIn } = Tags;

function Room() {
  const [socket, setSocket] = useState<Socket>();

  const [messages, setMessages] = useState<Record<string, IMessage>>();
  const [users, setUsers] = useState<IPlayer[]>([]);
  const [self, setSelf] = useState<IPlayer>();

  const recordRef = useRef<HTMLDivElement>(null);

  const selfIndex = useMemo(
    () => users.findIndex((item) => item.profile.id === self?.profile.id),
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
    let timeout:any;
    const messageListener = (response: { msg: IMessage; users: IPlayer[] }) => {
      setMessages((prev) => {
        const newMsgs = { ...prev };
        newMsgs[response.msg.id] = response.msg;
        return newMsgs;
      });

      setUsers(response.users);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (recordRef.current) {
          recordRef.current.scrollTop = recordRef.current?.scrollHeight ?? 0;
        }
      }, 0);
    };

    const identifyListener = (res: IPlayer) => {
      setSelf(res);
    };

    const receivedHandler = (type:string) => {
      switch (type) {
        case "getReady":
          setSelf((prev) => ({
            ...prev,
            ready: true,
          } as IPlayer));
          break;

        default:
          break;
      }
    };

    const dealListener = (handCards:string[]) => {
      setSelf((prev) => ({
        ...prev,
        handCards,
      } as IPlayer));
    };

    socket?.on("message", messageListener);
    socket?.on("identify", identifyListener);
    socket?.on("received", receivedHandler);
    socket?.on("deal", dealListener);
    socket?.emit("sitDown");
    socket?.emit("getMessages");

    return () => {
      socket?.off("message");
    };
  }, [socket]);

  const handleGetReady = () => {
    socket?.emit("getReady");
  };

  return (
    <div className="room">
      <div className="rank">
        RANK
        <ul>
          {users
            .map((item, index) => (
              <div
                key={item.profile.id}
                className={`player ${selfIndex > index ? "left" : "right"}${Math.abs(
                  selfIndex - index,
                )}`}
              >
                {index + 1}
                .
                {item.profile.name}
              </div>
            ))}
        </ul>
      </div>
      <div className="desk">
        <div className="felt">

          <div className="self">
            <div className="top">
              <div
                className="avatar"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: (self?.profile.avatar as string) }}
              />
              <div className="name">
                <span style={{ color: self?.profile.color }}>{self?.profile.name}</span>
                <span>
                  <img src={Chips} alt="chip" />
                  1000
                </span>
              </div>

            </div>
            <div className="hand-cards">
              {self?.handCards.map((item) => (
                <div key={item} className={`card card-${item}`} />
              ))}
            </div>

          </div>
          {users.map((item, index) => (index !== selfIndex && (
            <div
              key={item.profile.id}
              className={`player ${selfIndex > index ? "left" : "right"}${Math.abs(
                selfIndex - index,
              )}`}
            >
              <div className="top">
                <div
                  className="avatar"
                // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: (item.profile.avatar as string) }}
                />
                <div className="name">
                  <span style={{ color: item?.profile.color }}>{item?.profile.name}</span>
                  <span>
                    <img src={Chips} alt="chip" />
                    1000
                  </span>
                </div>
              </div>

              <div className="hand-cards">
                {self?.handCards.map((card) => (
                  <div key={card} className="card" />
                ))}
              </div>
            </div>
          )))}
        </div>
        <div className="operation">
          {
             !self?.ready ? <Button variant="contained" onClick={handleGetReady}>Get Ready</Button>
               : (
                 <>
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
                 </>
               )
          }
        </div>
      </div>
      <div className="right">
        <Connection recordRef={recordRef} messages={messages} socket={socket} />
      </div>
    </div>
  );
}

export default Room;
