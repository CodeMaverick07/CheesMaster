// Login.js
import { RegisterHandler } from "../api/user";
import Loader from "../components/Loader";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const res = await RegisterHandler(email, name, password);

      if (!res.success) {
        setIsLoading(false);
        alert(res.message);
      } else {
        navigate("/game");
        setIsLoading(false);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error registering in:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <h2 className="text-4xl text-center font-bold py-5 text-[#302e2b]">
          Register to Chess
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <input
              className="w-full p-2 mb-2 rounded-md bg-[#ebecd0]"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            className="bg-[#302e2b] p-3 rounded-md w-full flex justify-center text-[#ebecd0] font-bold text-lg"
            type="submit"
          >
            {isLoading ? <Loader /> : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
