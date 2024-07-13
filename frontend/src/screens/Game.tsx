import React, { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import ChessBoard from "@/components/ChessBoard";
import { Button } from "@/components/ui/button";
import { GAME_OVER, INIT_GAME, MOVE } from "@/lib/utils";
import { Chess, Color } from "chess.js";
import Loader from "@/components/Loader";

const Game = () => {
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isFliped, setIsFliped] = useState(false);
  const [playerColor, setPlayerColor] = useState<Color>("w");

  const socket = useSocket()!;

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          if (message.color === "black") {
            setIsFliped(true);
            setPlayerColor("b");
          }
          setBoard(chess.board());
          setStarted(true);

          setBoard(chess.board());
          break;
        case MOVE: {
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());

          break;
        }
        case GAME_OVER:
          console.log(setChess);
          break;
      }
    };
  }, [socket]);

  return (
    <div className="flex mx-32 justify-center">
      <div className="w-[50%] h-screen flex justify-center items-center ">
        <div className={`${isFliped ? "rotate-180" : ""}`}>
          <ChessBoard
            isFliped={isFliped}
            board={board}
            socket={socket}
            setBoard={setBoard}
            chess={started ? chess : null}
            playerColor={playerColor}
          />
        </div>
      </div>
      <div className="w-[35%] h-screen flex justify-start items-center">
        <div className="bg-[#262522] h-[83%] w-full flex justify-center items-center">
          {!clicked && (
            <Button
              onClick={() => {
                setClicked(true);
                socket.send(JSON.stringify({ type: INIT_GAME }));
              }}
            >
              Start
            </Button>
          )}
          {clicked && !started && (
            <div className="text-white text-xl flex flex-col justify-center items-center gap-2">
              <p>waiting for another player to join... </p>
              <Loader />
            </div>
          )}
          {started && (
            <div className="text-white text-xl">
              {chess.turn() === "w" ? "white to paly" : "black to play"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
