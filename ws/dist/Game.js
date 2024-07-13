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
            console.log(this.moveCount);
            console.log("return 1");
            return;
        }
        if (this.moveCount % 2 === 1 && user.socket !== this.Player2.socket) {
            console.log("return 2");
            return;
        }
        try {
            console.log("moving");
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            console.log("return 3");
            return;
        }
        if (this.board.isGameOver()) {
            this.Player1.socket.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        if (this.moveCount % 2 === 0) {
            console.log("sending move to player 2");
            this.Player2.socket.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            console.log("sending move to player 1");
            this.Player1.socket.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
        console.log(this.moveCount);
    }
}
exports.Game = Game;
