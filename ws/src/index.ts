import { WebSocketServer } from "ws";
// import { GameManager } from "./GameManager";
import url from "url";
import { extractUserId } from "./auth/index";
// import { User } from "./SocketManager";
import dotenv from "dotenv";

const wss = new WebSocketServer({ port: 8080 });
dotenv.config();
wss.on("connection", function connection(ws, req) {
  //@ts-ignore
  const id: string = url.parse(req.url, true).query.id;

  //   gameManager.addUser(new User(ws, id));

  ws.on("close", () => {
    // gameManager.removeUser(ws);
  });
});

console.log("done");
