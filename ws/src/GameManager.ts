import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";
import { User } from "./SocketManager";

export class GameManager {
  private games: Game[];
  private pendingUser: User | null;
  private users: User[];
  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }
  addUser(socket: WebSocket, id: string) {
    const user = new User(socket, id);
    this.users.push(user);
    this.addHandeler(user);
  }
  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user.socket !== socket);
  }
  private addHandeler(user: User) {
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, user);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = user;
        }
      }
      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.Player1 === user || game.Player2 === user
        );
        if (game) {
          game.MakeMove(user, message.payload);
        }
      }
    });
  }
}
