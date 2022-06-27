import React from "react";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import "@/style/reset.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Room />} />
    </Routes>
  );
}

export default App;
