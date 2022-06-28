import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import "@/style/reset.scss";
import Deck from "./server/deck";
import referee from "./utils/referee";

function App() {
  useEffect(() => {
    const deck = new Deck();
    deck.shuffle();

    referee(deck.deal(7));
  });

  return (
    <Routes>
      <Route path="/" element={<Room />} />
    </Routes>
  );
}

export default App;
