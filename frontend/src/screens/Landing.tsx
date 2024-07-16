import { useNavigate } from "react-router-dom";
import React from "react";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-20">
      <div className="flex  ">
        <div className="flex justify-center items-center w-1/2 ">
          <img src="/chessBoard.png" className="h-3/4" alt="chessBoard" />
        </div>
        <div className="flex justify-center items-center w-1/2 ">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white">Play Chess</h1>
              <h1 className="text-5xl font-bold text-white">Online</h1>
              <h1 className="text-5xl font-bold text-white">on the #2 Site!</h1>
            </div>
            <div>
              <button
                onClick={() => {
                  navigate("/game");
                }}
                className="bg-[#81b64c] rounded-md font-bold shadow shadow-[#45753c] text-white text-3xl px-20 py-7"
              >
                Play Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
