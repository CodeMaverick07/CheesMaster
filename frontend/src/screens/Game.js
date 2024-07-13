import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket.js";
import ChessBoard from "../components/ChessBoard.js";
import { Button } from "../components/ui/button.js";
import { GAME_OVER, INIT_GAME, MOVE } from "../lib/utils.js";
import { Chess } from "chess.js";
import Loader from "../components/Loader.js";
var Game = function () {
    var _a = useState(new Chess()), chess = _a[0], setChess = _a[1];
    var _b = useState(chess.board()), board = _b[0], setBoard = _b[1];
    var _c = useState(false), started = _c[0], setStarted = _c[1];
    var _d = useState(false), clicked = _d[0], setClicked = _d[1];
    var _e = useState(false), isFliped = _e[0], setIsFliped = _e[1];
    var _f = useState("w"), playerColor = _f[0], setPlayerColor = _f[1];
    var socket = useSocket();
    useEffect(function () {
        if (!socket) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.onmessage = function (event) {
            var message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    if (message.color === "black") {
                        setIsFliped(true);
                        setPlayerColor("b");
                    }
                    setBoard(chess.board());
                    setStarted(true);
                    setBoard(chess.board());
                    break;
                case MOVE: {
                    var move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    break;
                }
                case GAME_OVER:
                    console.log(setChess);
                    break;
            }
        };
    }, [socket]);
    return (React.createElement("div", { className: "flex mx-32 max-md:-mt-10 max-md:mx-0 max-md:flex-col max-md:items-center justify-center" },
        React.createElement("div", { className: "w-[50%] h-screen flex justify-center items-center " },
            React.createElement("div", { className: "".concat(isFliped ? "rotate-180" : "") },
                React.createElement(ChessBoard, { isFliped: isFliped, board: board, socket: socket, setBoard: setBoard, chess: started ? chess : null, playerColor: playerColor }))),
        React.createElement("div", { className: "w-[35%] h-screen flex justify-start items-center max-md:-mt-20" },
            React.createElement("div", { className: "bg-[#262522] h-[83%] w-full flex max-md:items-start justify-center items-center" },
                !clicked && (React.createElement(Button, { onClick: function () {
                        setClicked(true);
                        socket.send(JSON.stringify({ type: INIT_GAME }));
                    } }, "Start")),
                clicked && !started && (React.createElement("div", { className: "text-white text-xl flex flex-col justify-center items-center gap-2" },
                    React.createElement("p", null, "waiting for another player to join... "),
                    React.createElement(Loader, null))),
                started && (React.createElement("div", { className: "text-white text-xl" }, chess.turn() === "w" ? "white to paly" : "black to play"))))));
};
export default Game;
