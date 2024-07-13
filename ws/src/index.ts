import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import dotenv from "dotenv";

const wss = new WebSocketServer({ port: 8080 });
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

console.log("done");
