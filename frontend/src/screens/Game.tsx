import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import ChessBoard from "../components/ChessBoard";
import { Button } from "../components/ui/button";
import { GAME_OVER, INIT_GAME, MOVE, PlAYING_WITH_SELF } from "../lib/utils";
import { Chess, Color } from "chess.js";
import Loader from "../components/Loader";
import { User } from "../Store/atoms/user";
import GameOverPage from "./GameOverPage";

const Game = () => {
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playerColor, setPlayerColor] = useState<Color>("w");
  const [playerData, setPlayerData] = useState<{
    white: User;
    black: User;
  } | null>(null);
  const [isGameOver, setIsGameOver] = useState(true);
  const [winner, setWinner] = useState("");

  const socket = useSocket()!;

  useEffect(() => {
    setIsGameOver(false);
    if (!socket) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          console.log(setChess);
          setPlayerData({
            white: {
              id: message.playerData.white.id,
              name: message.playerData.white.name,
              email: message.playerData.white.email,
            },
            black: {
              id: message.playerData.black.id,
              name: message.playerData.black.name,
              email: message.playerData.black.email,
            },
          });

          if (message.color === "black") {
            setIsFlipped(true);
            setPlayerColor("b");
          }
          setBoard(chess.board());
          setStarted(true);
          break;
        case MOVE: {
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          break;
        }
        case GAME_OVER:
          setIsGameOver(true);
          setWinner(message.payload.winner);
          break;
        case PlAYING_WITH_SELF:
          setStarted(false);
          setClicked(false);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, chess]);

  return (
    <>
      {" "}
      {isGameOver ? (
        <GameOverPage winner={winner} />
      ) : (
        <div className="flex max-sm:h-screen max-md:-mt-10 max-sm:mt-0 max-md:mx-0 max-md:flex-col max-md:items-center justify-ceneter mx-32 max-sm:justify-normal max-sm:mx-0 z-0 ">
          <div className="w-[50%] max-sm:w-full max-sm:h-[82%] h-screen flex justify-center items-center">
            <div
              className={`${isFlipped ? "rotate-180" : ""} flex flex-col gap-1`}
            >
              <h1 className={`${isFlipped ? "rotate-180" : ""} text-white`}>
                {playerData?.white?.name || "player1"}
              </h1>
              <ChessBoard
                isFlipped={isFlipped}
                board={board}
                socket={socket}
                setBoard={setBoard}
                chess={started ? chess : null}
                playerColor={playerColor}
              />
              <h1 className={`${isFlipped ? "rotate-180" : ""} text-white`}>
                {playerData?.black?.name || "player2"}
              </h1>
            </div>
          </div>
          <div className="w-[35%] max-sm:w-screen max-md:h-screen max-sm:h-10 flex justify-start items-center overflow-hidden">
            <div className="bg-[#262522] max-md:bg-[#292524] h-[83%] max-sm:h-full w-full flex max-md:items-start justify-center items-center max-md:-mt-32 max-sm:-mt-0">
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
                <div className="text-white text-xl max-sm:text-sm flex flex-col justify-center items-center gap-1">
                  <p>waiting for another player to join... </p>
                  <Loader />
                </div>
              )}
              {started && (
                <div className="text-white text-lg max-sm:text-sm">
                  {chess.turn() === "w" ? "white to play" : "black to play"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Game;
