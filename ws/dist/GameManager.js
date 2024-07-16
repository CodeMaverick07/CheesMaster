"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
const SocketManager_1 = require("./SocketManager");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket, id) {
        const user = new SocketManager_1.User(socket, id);
        this.users.push(user);
        this.addHandeler(user);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user.socket !== socket);
    }
    addHandeler(user) {
        user.socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, user);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = user;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find((game) => game.Player1 === user || game.Player2 === user);
                if (game) {
                    game.MakeMove(user, message.payload);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
