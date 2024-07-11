import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./screens/Landing";
import Game from "./screens/Game";
import Login from "./screens/Login";
import { Suspense } from "react";
import { RecoilRoot } from "recoil";

import Loader from "./components/Loader";
import Register from "./screens/Register";
import AuthLayout from "./screens/Auth";
import ProtectedPage from "./components/ProtectedPage";

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
