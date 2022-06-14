import React from "react";
import "./style.scss";

function SmallBlind() {
  return <span className="tag small-blind">Small Blind</span>;
}

function BigBlind() {
  return <span className="tag big-blind">Big Blind</span>;
}

function AllIn() {
  return <span className="tag all-in">ALL IN</span>;
}

export default {
  SmallBlind,
  BigBlind,
  AllIn,
};
