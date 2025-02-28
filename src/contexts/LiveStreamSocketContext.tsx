import { stream_server_url } from "@/constants";
import { ReactNode, createContext, useContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";
let socket: Socket | null = null;

const SocketContext = createContext<Socket | null>(null);

const useStreamSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a StremSocketProvider");
  }
  return context;
};

const StremSocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (!socket) {
      socket = io(`${stream_server_url}/`, {
        autoConnect: true,
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

export { StremSocketProvider, useStreamSocket };
