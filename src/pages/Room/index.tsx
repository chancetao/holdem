import React from "react";
import Chat from "../Chat";

import "./style.scss";

function Room() {
  return (
    <div className="room">
      <div className="left">
        <Chat />
      </div>
      <div className="desk">
        <div className="felt" />
      </div>
      <div className="right" />
    </div>
  );
}

export default Room;
