import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { User } from "./SocketManager";

export class Game {
  public Player1: User;
  public Player2: User;
  private board: Chess;
  private moveCount: number = 0;

  constructor(player1: User, player2: User) {
    this.Player1 = player1;
    this.Player2 = player2;
    this.board = new Chess();
    this.Player1.socket.send(
      JSON.stringify({ type: INIT_GAME, color: "white" })
    );
    this.Player2.socket.send(
      JSON.stringify({ type: INIT_GAME, color: "black" })
    );
  }
  MakeMove(
    user: User,
    move: {
      from: string;
      to: string;
    }
  ) {
    if (this.moveCount % 2 === 0 && user.socket !== this.Player1.socket) {
      return;
    }
    if (this.moveCount % 2 === 1 && user.socket !== this.Player2.socket) {
      return;
    }
    try {
      this.board.move(move);
    } catch (error) {
      console.log(error);

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
