import { useNavigate } from "react-router-dom";

const GameOverPage = ({ winner }: { winner: string }) => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen fixed flex-col gap-1 z-100 bg-black opacity-60 text-white flex justify-center items-center">
      <div className="text-3xl">{winner} wins</div>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="border p-2 rounded-md hover:bg-slate-800"
      >
        go Back
      </button>
    </div>
  );
};

export default GameOverPage;
