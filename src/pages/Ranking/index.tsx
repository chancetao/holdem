import React from "react";
import Player from "@/server/player";

interface Props {
  users: Player[]
  selfIndex: number
}

function Ranking(props: Props) {
  const { users, selfIndex } = props;
  return (
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
  );
}

export default Ranking;
