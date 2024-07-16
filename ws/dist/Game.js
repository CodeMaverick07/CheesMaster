"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.Player1 = player1;
        this.Player2 = player2;
        this.board = new chess_js_1.Chess();
        this.Player1.socket.send(JSON.stringify({ type: messages_1.INIT_GAME, color: "white" }));
        this.Player2.socket.send(JSON.stringify({ type: messages_1.INIT_GAME, color: "black" }));
    }
    MakeMove(user, move) {
        if (this.moveCount % 2 === 0 && user.socket !== this.Player1.socket) {
            return;
        }
        if (this.moveCount % 2 === 1 && user.socket !== this.Player2.socket) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        if (this.board.isGameOver()) {
            console.log("game over");
            this.Player1.socket.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        if (this.moveCount % 2 === 0) {
            this.Player2.socket.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            this.Player1.socket.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
