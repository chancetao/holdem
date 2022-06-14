import React from "react";
import Chat from "../Chat";

import "./style.scss";

function Room() {
  return (
    <div className="room">
      <div className="left" />
      <div className="desk">
        <div className="felt" />
      </div>
      <div className="right">
        <Chat />
      </div>
    </div>
  );
}

export default Room;
