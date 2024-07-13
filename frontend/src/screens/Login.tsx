// Login.js
import { LoginHandler } from "../api/user.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const res = await LoginHandler(email, password);

      if (!res.success) {
        setIsLoading(false);
        alert(res.message);
      } else {
        navigate("/game");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form onSubmit={handleSubmit}>
        <h2 className="text-4xl text-center font-bold py-5 text-[#302e2b] w-full leading-loose">
          Login to Chess
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <input
              className="w-full p-2 mb-2 rounded-md bg-[#ebecd0]"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              placeholder="Password"
              className="w-full p-2 mb-2 rounded-md bg-[#ebecd0]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="bg-[#302e2b] p-3 rounded-md w-full text-[#ebecd0] font-bold text-lg flex justify-center items-center"
            type="submit"
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
