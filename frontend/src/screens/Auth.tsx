// AuthLayout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="bg-[#81b64c] h-[54%] w-[25%] rounded-md">
        <div className="">
          <div className="bg-[#ebecd0] w-full rounded-md h-12 flex justify-evenly text-2xl items-center font-bold text-[#302e2b]">
            <Link to="/auth/login">Login</Link>
            <div className="h-full border border-[#302e2b]"></div>
            <Link to="/auth/register">Register</Link>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
