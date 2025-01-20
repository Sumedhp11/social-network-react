import { server_url } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface NotificationContextType {
  hasUnread: boolean;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    const initEventSource = async () => {
      try {
        eventSource = new EventSource(`${server_url}/notification/sse`, {
          withCredentials: true,
        });

        eventSource.onopen = () => {
          console.log("Notification server connection established");
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.message === "Connection established") return;

            setHasUnread(true);

            toast.success(data.message, {
              position: "bottom-right",
              duration: 5000,
            });

            // Invalidate notifications cache
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          } catch (err) {
            console.error("Error parsing SSE message data:", err);
          }
        };

        eventSource.onerror = () => {
          console.error("Error with EventSource. Attempting to reconnect...");
          if (eventSource) {
            eventSource.close();
          }
          if (!retryTimeout) {
            retryTimeout = setTimeout(() => {
              initEventSource();
            }, 5000);
          }
        };
      } catch (error) {
        console.error("Failed to initialize EventSource:", error);
      }
    };

    initEventSource();

    return () => {
      if (eventSource) {
        console.log("Closing EventSource connection");
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [queryClient]);

  const markAllAsRead = () => {
    setHasUnread(false);
  };

  return (
    <NotificationContext.Provider value={{ hasUnread, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
