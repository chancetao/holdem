import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { Box, Button, Slider, Stack } from "@mui/material";
import { GameParams } from "@/server/game";
import Player from "@/server/player";
import { PlayerStatus } from "@/constants/common";

interface Props {
  socket: Socket | undefined
  self: Player | undefined
  gameParams: GameParams | undefined
}

function Operation({ socket, self, gameParams }: Props) {
  const [sliderVal, setSliderVal] = useState(0);

  const handleGetReady = () => {
    socket?.emit("getReady");
  };

  const handleCheck = () => {
    socket?.emit("check", socket.id);
  };

  const handleCall = () => {
    socket?.emit("call", socket.id);
  };

  const handleFold = () => {
    socket?.emit("fold", socket.id);
  };

  const handleRise = () => {
    socket?.emit("rise", socket.id, sliderVal);
  };

  return (
    <div className="operation">
      {
        self?.status === PlayerStatus.Waiting && <Button variant="contained" onClick={handleGetReady}>Get Ready</Button>
      }
      { self?.status === PlayerStatus.Playing
      && (
      <>
        <Stack
          direction="row"
          spacing={1}
        >
          {self.showCheck && (
          <Button
              //  disabled={disabled}
            variant="contained"
            onClick={handleCheck}
          >
            Check
          </Button>
          )}
          {self.showCall && (
          <Button
              //  disabled={disabled}
            variant="contained"
            onClick={handleCall}
          >
            Call
          </Button>
          )}
          <Button
              //  disabled={disabled}
            variant="contained"
            onClick={handleFold}
          >
            Fold
          </Button>
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
        >
          <Box sx={{ width: 200 }}>
            <Slider
              onChange={(_, value) => setSliderVal(value as number)}
              step={gameParams?.bbBet}
              min={gameParams?.bbBet}
              max={self?.chips}
            />
          </Box>
          <Button variant="contained" onClick={handleRise}>
            {`Rise to ${sliderVal}`}
          </Button>
        </Stack>
      </>
      )}
    </div>
  );
}

export default Operation;
