import { useNavigate } from "react-router-dom";
import React from "react";
var Landing = function () {
    var navigate = useNavigate();
    return (React.createElement("div", { className: "mx-20" },
        React.createElement("div", { className: "flex  " },
            React.createElement("div", { className: "flex justify-center items-center w-1/2 " },
                React.createElement("img", { src: "/chessBoard.png", className: "h-3/4", alt: "chessBoard" })),
            React.createElement("div", { className: "flex justify-center items-center w-1/2 " },
                React.createElement("div", { className: "flex flex-col items-center gap-8" },
                    React.createElement("div", { className: "text-center" },
                        React.createElement("h1", { className: "text-5xl font-bold text-white" }, "Play Chess"),
                        React.createElement("h1", { className: "text-5xl font-bold text-white" }, "Online"),
                        React.createElement("h1", { className: "text-5xl font-bold text-white" }, "on the #2 Site!")),
                    React.createElement("div", null,
                        React.createElement("button", { onClick: function () {
                                navigate("/game");
                            }, className: "bg-[#81b64c] rounded-md font-bold shadow shadow-[#45753c] text-white text-3xl px-20 py-7" }, "Play Online")))))));
};
export default Landing;
