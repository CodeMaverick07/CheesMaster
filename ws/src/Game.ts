import { Chess, Square } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { User } from "./SocketManager";
import { db } from "./db";
function isPromoting(chess: Chess, from: Square, to: Square): boolean {
  if (!from) {
    return false;
  }

  const piece = chess.get(from);

  if (piece?.type !== "p") {
    return false;
  }

  if (piece.color !== chess.turn()) {
    return false;
  }

  if (!["1", "8"].some((it) => to.endsWith(it))) {
    return false;
  }

  return true;
}

export class Game {
  public Player1: User;
  public Player2: User;
  private board: Chess;
  private moveCount: number = 0;

  constructor(player1: User, player2: User) {
    this.Player1 = player1;
    this.Player2 = player2;
    this.board = new Chess();
    this.initGame();
  }

  private async initGame() {
    try {
      const player1Data = await db.user.findFirst({
        where: {
          id: this.Player1.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const player2Data = await db.user.findFirst({
        where: {
          id: this.Player2.userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      this.Player1.socket.send(
        JSON.stringify({
          type: INIT_GAME,
          color: "white",
          playerData: { white: player1Data, black: player2Data },
        })
      );
      this.Player2.socket.send(
        JSON.stringify({
          type: INIT_GAME,
          color: "black",
          playerData: { white: player1Data, black: player2Data },
        })
      );
    } catch (error) {
      console.error("Error initializing game:", error);
    }
  }

  public MakeMove(
    user: User,
    move: {
      from: Square;
      to: Square;
    }
  ) {
    if (this.moveCount % 2 === 0 && user.socket !== this.Player1.socket) {
      return;
    }
    if (this.moveCount % 2 === 1 && user.socket !== this.Player2.socket) {
      return;
    }
    try {
      if (isPromoting(this.board, move.from, move.to)) {
        console.log("promoting");
        this.board.move({
          from: move.from,
          to: move.to,
          promotion: "q",
        });
      } else {
        this.board.move({
          from: move.from,
          to: move.to,
        });
      }
    } catch (e) {
      console.error("Error while making move");
      return;
    }
    if (this.board.isGameOver()) {
      console.log("game over");
      this.Player1.socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.Player2.socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }
    if (this.moveCount % 2 === 0) {
      this.Player2.socket.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.Player1.socket.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
    this.moveCount++;
  }
}
