// AuthLayout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";
var AuthLayout = function () {
    return (React.createElement("div", { className: "flex justify-center items-center h-screen w-screen" },
        React.createElement("div", { className: "bg-[#81b64c] h-[54%] w-[25%] rounded-md" },
            React.createElement("div", { className: "" },
                React.createElement("div", { className: "bg-[#ebecd0] w-full rounded-md h-12 flex justify-evenly text-2xl items-center font-bold text-[#302e2b]" },
                    React.createElement(Link, { to: "/auth/login" }, "Login"),
                    React.createElement("div", { className: "h-full border border-[#302e2b]" }),
                    React.createElement(Link, { to: "/auth/register" }, "Register"))),
            React.createElement(Outlet, null))));
};
export default AuthLayout;
