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
  return (
    <div className="min-h-screen bg-stone-800">
      <RecoilRoot>
        <Suspense fallback={<Loader />}>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              <Route path="/" element={<Landing />} />

              <Route
                path="/game"
                element={
                  <ProtectedPage>
                    <Game />
                  </ProtectedPage>
                }
              />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </RecoilRoot>
    </div>
  );
}

export default App;
