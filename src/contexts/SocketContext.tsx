import { server_url } from "@/constants";
import { ReactNode, createContext, useContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

const SocketContext = createContext<Socket | null>(null);

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    console.log(socket);

    if (!socket) {
      socket = io(`${server_url}/`, {
        autoConnect: false,
        withCredentials: true,
      });
    }

    socket.connect();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);
  if (!socket) return;
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
