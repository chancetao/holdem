import React, { useEffect, useMemo, useState } from "react";
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
    socket?.emit("check");
  };

  const handleCall = () => {
    socket?.emit("call", gameParams!.maxBet - self!.bet);
  };

  const handleFold = () => {
    socket?.emit("fold");
  };

  const handleRise = () => {
    socket?.emit("rise", sliderVal);
  };

  const showCheck = useMemo(() => {
    if (self?.bet === gameParams?.maxBet) {
      return true;
    }
    return false;
  }, [self, gameParams]);

  const showCall = useMemo(() => {
    if (self && gameParams) {
      if ((self.bet < gameParams.maxBet)
      && (self?.chips > (gameParams.maxBet - self.bet))) {
        return true;
      }
    }
    return false;
  }, [self, gameParams]);

  const disabled = useMemo(() => gameParams?.turn !== self?.profile.id, [self, gameParams]);

  useEffect(() => {
    if (gameParams?.turn === self?.profile.id
       && self?.status === PlayerStatus.Fold) {
      handleCheck();
    }
  }, [self, gameParams]);

  return (
    <div className="operation">
      {
        self?.status === PlayerStatus.Waiting
        && <Button variant="contained" onClick={handleGetReady}>Get Ready</Button>
      }
      { self?.status === PlayerStatus.Playing
      && (
      <>
        <Stack
          direction="row"
          spacing={1}
        >
          {showCheck && (
          <Button
            disabled={disabled}
            variant="contained"
            onClick={handleCheck}
          >
            Check
          </Button>
          )}
          {showCall && (
          <Button
            disabled={disabled}
            variant="contained"
            onClick={handleCall}
          >
            {`Call ${(gameParams?.maxBet ?? 0) - self.bet}`}
          </Button>
          )}
          <Button
            disabled={disabled}
            variant="contained"
            onClick={handleFold}
          >
            Fold
          </Button>
        </Stack>
        <Stack
          direction="row"
          justifyContent="start"
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
          <Button
            variant="contained"
            onClick={handleRise}
            disabled={disabled}
          >
            {`Rise to ${sliderVal}`}
          </Button>
        </Stack>
      </>
      )}
    </div>
  );
}

export default Operation;
