"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const url_1 = __importDefault(require("url"));
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
const wss = new ws_1.WebSocketServer({ server: httpServer });
dotenv_1.default.config();
const gameManager = new GameManager_1.GameManager();
wss.on("connection", function connection(ws, req) {
    //@ts-ignore
    const Id = url_1.default.parse(req.url, true).query.id;
    gameManager.addUser(ws, Id);
    ws.on("close", () => {
        gameManager.removeUser(ws);
    });
});
console.log("Server is running on port 8080");
