import { useEffect, useState } from "react";
import { useUser } from "../Store/hooks/useUser";

const WS_URL = "https://ws.hemantjatal.me";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const user = useUser();

  useEffect(() => {
    if (!user) return;
    const ws = new WebSocket(`${WS_URL}?id=${user.id}`);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return socket;
};
