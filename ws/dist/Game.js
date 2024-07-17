"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
const db_1 = require("./db");
function isPromoting(chess, from, to) {
    if (!from) {
        return false;
    }
    const piece = chess.get(from);
    if ((piece === null || piece === void 0 ? void 0 : piece.type) !== "p") {
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
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.Player1 = player1;
        this.Player2 = player2;
        this.board = new chess_js_1.Chess();
        this.initGame();
    }
    initGame() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const player1Data = yield db_1.db.user.findFirst({
                    where: {
                        id: this.Player1.userId,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });
                const player2Data = yield db_1.db.user.findFirst({
                    where: {
                        id: this.Player2.userId,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });
                this.Player1.socket.send(JSON.stringify({
                    type: messages_1.INIT_GAME,
                    color: "white",
                    playerData: { white: player1Data, black: player2Data },
                }));
                this.Player2.socket.send(JSON.stringify({
                    type: messages_1.INIT_GAME,
                    color: "black",
                    playerData: { white: player1Data, black: player2Data },
                }));
            }
            catch (error) {
                console.error("Error initializing game:", error);
            }
        });
    }
    MakeMove(user, move) {
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
            }
            else {
                this.board.move({
                    from: move.from,
                    to: move.to,
                });
            }
        }
        catch (e) {
            console.error("Error while making move");
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
            this.Player2.socket.send(JSON.stringify({
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
