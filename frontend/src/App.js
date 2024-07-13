import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./screens/Landing.js";
import Game from "./screens/Game.js";
import Login from "./screens/Login.js";
import { Suspense } from "react";
import { RecoilRoot } from "recoil";
import Loader from "./components/Loader.js";
import Register from "./screens/Register.js";
import AuthLayout from "./screens/Auth.js";
import ProtectedPage from "./components/ProtectedPage.js";
function App() {
    return (React.createElement("div", { className: "min-h-screen bg-stone-800" },
        React.createElement(RecoilRoot, null,
            React.createElement(Suspense, { fallback: React.createElement(Loader, null) },
                React.createElement(BrowserRouter, null,
                    React.createElement(Routes, null,
                        React.createElement(Route, { path: "/auth", element: React.createElement(AuthLayout, null) },
                            React.createElement(Route, { path: "login", element: React.createElement(Login, null) }),
                            React.createElement(Route, { path: "register", element: React.createElement(Register, null) })),
                        React.createElement(Route, { path: "/", element: React.createElement(Landing, null) }),
                        React.createElement(Route, { path: "/game", element: React.createElement(ProtectedPage, null,
                                React.createElement(Game, null)) })))))));
}
export default App;
