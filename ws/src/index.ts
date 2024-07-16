import dotenv from "dotenv";
import express from "express";
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url";

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

dotenv.config();

const gameManager = new GameManager();

wss.on("connection", function connection(ws, req) {
  //@ts-ignore
  const Id: string = url.parse(req.url, true).query.id;

  gameManager.addUser(ws, Id);

  ws.on("close", () => {
    gameManager.removeUser(ws);
  });
});

console.log("Server is running on port 8080");
