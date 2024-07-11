import ProtectedPage from "@/components/ProtectedPage";
import React from "react";
import { useUser } from "@/Store/hooks/useUser";

const Game = () => {
  const user = useUser();
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
