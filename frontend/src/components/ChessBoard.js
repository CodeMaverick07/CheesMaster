import React, { useState } from "react";
import { MOVE } from "../lib/utils.js";
var ChessBoard = function (_a) {
    var board = _a.board, socket = _a.socket, setBoard = _a.setBoard, chess = _a.chess, isFliped = _a.isFliped, playerColor = _a.playerColor;
    var _b = useState(null), from = _b[0], setFrom = _b[1];
    var _c = useState([]), legalMoves = _c[0], setLegalMoves = _c[1];
    var handleSquareClick = function (squareRepresetation, square) {
        if (!from) {
            if ((square === null || square === void 0 ? void 0 : square.color) === playerColor) {
                setFrom(squareRepresetation);
                var moves = chess
                    .moves({ square: squareRepresetation, verbose: true })
                    .map(function (move) { return move.to; });
                setLegalMoves(moves);
            }
        }
        else {
            if ((square === null || square === void 0 ? void 0 : square.color) === playerColor) {
                setFrom(squareRepresetation);
                var moves = chess
                    .moves({ square: squareRepresetation, verbose: true })
                    .map(function (move) { return move.to; });
                setLegalMoves(moves);
            }
            else {
                var move = { from: from, to: squareRepresetation };
                if (chess === null || chess === void 0 ? void 0 : chess.move(move)) {
                    socket.send(JSON.stringify({
                        type: MOVE,
                        payload: move,
                    }));
                    setFrom(null);
                    setBoard(chess.board());
                    setLegalMoves([]);
                }
                else {
                    setFrom(null);
                    setLegalMoves([]);
                }
            }
        }
    };
    return (React.createElement("div", { className: "text-white-200" }, board.map(function (row, i) { return (React.createElement("div", { key: i, className: "flex" }, row.map(function (square, j) {
        var squareRepresetation = (String.fromCharCode(97 + (j % 8)) +
            (8 - i));
        var isLegalMove = legalMoves.includes(squareRepresetation);
        return (React.createElement("div", { key: j, onClick: function () { return handleSquareClick(squareRepresetation, square); }, className: "w-[4.5rem] h-[4.5rem] flex justify-center items-center ".concat(i % 2 === j % 2 ? "bg-[#ebebd0]" : "bg-[#779455]", " ") },
            isLegalMove && (React.createElement("div", { className: "bg-[#302e2b] rounded-full h-6 w-6" })),
            square ? (React.createElement("img", { className: "".concat(isFliped ? "rotate-180" : ""), src: "/".concat(square.color === "b"
                    ? square.type
                    : "".concat(square.type.toUpperCase(), " copy"), ".png"), alt: "".concat(square.color, " ").concat(square.type) })) : null));
    }))); })));
};
export default ChessBoard;
