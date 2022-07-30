import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Divider, Stack } from "@mui/material";
import ChatRoom from "../Chat";
import { GamePhase, HandRanking, HAND_RANKING_TEXT, SERVER_PORT } from "@/constants/common";

import Chips from "@/assets/Chips.svg";

import "./style.scss";
import { IMessage } from "@/types/common";
import Player from "@/server/player";
import Tags from "@/components/Tags";
import { GameParams } from "@/server/game";
import Operation from "./Operation";
import referee from "@/utils/referee";

const { SmallBlind, BigBlind, AllIn } = Tags;

function Room() {
  const [socket, setSocket] = useState<Socket>();

  const [messages, setMessages] = useState<Record<string, IMessage>>();
  const [users, setUsers] = useState<Player[]>([]);
  const [self, setSelf] = useState<Player>();

  const [gameParams, setGameParams] = useState<GameParams>();

  const recordRef = useRef<HTMLDivElement>(null);

  const selfIndex = useMemo(
    () => users.findIndex((item) => item.profile.id === self?.profile.id),
    [users, self],
  );

  const rankType = useMemo(
    () => referee([...(gameParams?.boardCards || []), ...(self?.handCards || [])]),
    [gameParams, self],
  );

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:${SERVER_PORT}`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    const messageListener = (response: { msg: IMessage; users: Player[] }) => {
      setMessages((prev) => {
        const newMsgs = { ...prev };
        newMsgs[response.msg.id] = response.msg;
        return newMsgs;
      });

      setUsers(response.users);

      setTimeout(() => {
        if (recordRef.current) {
          recordRef.current.scrollTop = recordRef.current?.scrollHeight ?? 0;
        }
      }, 0);
    };

    const identifyListener = (res: Player) => {
      setSelf(res);
    };

    const dealListener = (handCards:string[]) => {
      setSelf((prev) => ({
        ...prev,
        handCards,
      } as Player));
    };

    const updateGame = (data: Player[], params: GameParams) => {
      console.log(data, params);

      setGameParams(params);
      setUsers(data);
    };

    socket?.on("message", messageListener);
    socket?.on("identify", identifyListener);
    socket?.on("deal", dealListener);
    socket?.on("updateGame", updateGame);
    socket?.emit("sitDown");
    socket?.emit("getMessages");

    return () => {
      socket?.off("message");
    };
  }, [socket]);

  useEffect(() => {
    if (users.length > 1) {
      const mySelf = users.find((item) => item.profile.id === self?.profile.id);
      setSelf(mySelf);
    }
  }, [users]);

  useEffect(() => {
    if (gameParams?.phase === GamePhase.Settle) {
      socket?.emit("settle", rankType, self?.profile.id);
    }
  }, [gameParams?.phase]);

  return (
    <div className="room">
      <div className="desk">
        <div className="felt">
          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
          >
            {gameParams?.pot.pots.map((item) => item.amount)}
          </Stack>

          <div className="self">
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              {self?.profile.id === gameParams?.sbId && <SmallBlind />}
              {self?.profile.id === gameParams?.bbId && <BigBlind />}
              {self?.allIn && <AllIn />}
              {(self?.bet ?? 0) > 0 && <span>{self?.bet}</span>}
            </Stack>
            <div className="hand-cards">
              {self?.handCards.map((item) => (
                <div key={item} className={`card card-${item}`} />
              ))}
            </div>
            <Stack
              className="avatar-name-chips"
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              divider={<Divider flexItem />}
            >
              <Stack direction="row" alignItems="center" spacing={1} style={{ padding: "2px 8px" }}>
                <div
                  className="avatar"
                // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: (self?.profile.avatar as string) }}
                />
                <div className="name" style={{ color: self?.profile.color }}>
                  {self?.profile.name}
                </div>
              </Stack>

              <div className="chips">
                <img src={Chips} alt="chip" />
                {self?.chips.toLocaleString()}
              </div>
            </Stack>
            <div className="hand-rank">{ HAND_RANKING_TEXT[rankType?.rank as HandRanking]}</div>

          </div>

          <div className="board-cards">
            {gameParams?.boardCards.map((item) => (
              <div key={item} className={`card card-${item}`} />
            ))}
          </div>

          {users.map((item, index) => (index !== selfIndex && (
            <div
              key={item.profile.id}
              className={`player ${selfIndex > index ? "left" : "right"}${Math.abs(
                selfIndex - index,
              )}`}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                {item?.profile.id === gameParams?.sbId && <SmallBlind />}
                {item?.profile.id === gameParams?.bbId && <BigBlind />}
                {item?.allIn && <AllIn /> }
                {(item?.bet ?? 0) > 0 && <span>{item?.bet}</span>}
              </Stack>

              <div className="hand-cards">
                {self?.handCards.map((card) => (
                  <div key={card} className="card" />
                ))}
              </div>

              <Stack
                className="avatar-name-chips"
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                divider={<Divider flexItem />}
              >
                <Stack direction="row" alignItems="center" spacing={1} style={{ padding: "2px 8px" }}>
                  <div
                    className="avatar"
                // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: (item?.profile.avatar as string) }}
                  />
                  <div className="name" style={{ color: item?.profile.color }}>
                    {item?.profile.name}
                  </div>
                </Stack>

                <div className="chips">
                  <img src={Chips} alt="chip" />
                  {item?.chips.toLocaleString()}
                </div>
              </Stack>
            </div>
          )))}
        </div>
        <Operation self={self} gameParams={gameParams} socket={socket} />
      </div>
      <div className="right">
        <ChatRoom recordRef={recordRef} messages={messages} socket={socket} />
      </div>
    </div>
  );
}

export default Room;
