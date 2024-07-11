import ProtectedPage from "@/components/ProtectedPage";
import React from "react";
import { useUser } from "@/Store/hooks/useUser";
import { useSocket } from "@/hooks/useSocket";

const Game = () => {
  const user = useUser();
  const socket = useSocket();
  return (
    <ProtectedPage>
      <div className="text-white">
        {user?.email}
        {user?.name}
        {user?.id}
      </div>
    </ProtectedPage>
  );
};

export default Game;
