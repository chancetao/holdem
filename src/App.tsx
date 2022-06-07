import React from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:8888");

function App() {
  const handleHello = () => {
    socket.on("hello", (arg) => {
      console.log(arg);
    });

    socket.emit("howdy", Math.random());
  };

  return (
    <button type="button" onClick={handleHello}>
      click
    </button>
  );
}

export default App;
