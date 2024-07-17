import React, { useState } from "react";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { MOVE } from "../lib/utils";

interface ChessBoardProps {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    >
  >;
  chess: Chess | null;
  isFliped: boolean;
  playerColor: Color;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  socket,
  setBoard,
  chess,
  isFliped,
  playerColor,
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  const handleSquareClick = (
    squareRepresetation: Square,
    square: { square: Square; type: PieceSymbol; color: Color } | null
  ) => {
    if (!from) {
      if (square?.color === playerColor) {
        setFrom(squareRepresetation);
        const moves = chess!
          .moves({ square: squareRepresetation, verbose: true })
          .map((move) => move.to);
        setLegalMoves(moves as Square[]);
      }
    } else {
      if (square?.color === playerColor) {
        setFrom(squareRepresetation);
        const moves = chess!
          .moves({ square: squareRepresetation, verbose: true })
          .map((move) => move.to);
        setLegalMoves(moves as Square[]);
      } else {
        const move = { from, to: squareRepresetation };

        if (chess?.move(move)) {
          socket.send(
            JSON.stringify({
              type: MOVE,
              payload: move,
            })
          );
          setFrom(null);
          setBoard(chess.board());
          setLegalMoves([]);
        } else {
          setFrom(null);
          setLegalMoves([]);
        }
      }
    }
  };

  return (
    <div className="text-white-200">
      <div>
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresetation = (String.fromCharCode(97 + (j % 8)) +
                (8 - i)) as Square;
              const isLegalMove = legalMoves.includes(squareRepresetation);

              return (
                <div
                  key={j}
                  onClick={() => handleSquareClick(squareRepresetation, square)}
                  className={`w-[4.5rem] max-sm:w-[2.5rem] max-sm:h-[2.5rem] h-[4.5rem] flex justify-center items-center ${
                    i % 2 === j % 2 ? "bg-[#ebebd0]" : "bg-[#779455]"
                  } `}
                >
                  {isLegalMove && (
                    <div className="bg-[#302e2b] rounded-full h-6 w-6 max-sm:h-3 max-sm:w-3"></div>
                  )}
                  {square ? (
                    <img
                      className={`${isFliped ? "rotate-180" : ""}`}
                      src={`/${
                        square.color === "b"
                          ? square.type
                          : `${square.type.toUpperCase()} copy`
                      }.png`}
                      alt={`${square.color} ${square.type}`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
