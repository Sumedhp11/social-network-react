import { messageInterface } from "@/types/types";
import { getAllMessages } from "@/APIs/messagesAPI";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

type EventHandlers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [event: string]: (...args: any[]) => void;
};
interface useGetMessagesProps {
  chatId: number;
}
export interface MessagesPage {
  data: messageInterface[];
  meta: {
    currentPage: number;
    totalMessages: number;
    totalPages: number;
  };
}

const useSocketEvents = (socket: Socket, handlers: EventHandlers) => {
  const savedHandlers = useRef<EventHandlers>(handlers);

  useEffect(() => {
    savedHandlers.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const currentHandler = savedHandlers.current;
    Object.entries(currentHandler).forEach(([event, handler]) => {
      console.log(event, "Listening");
      socket.on(event, handler);
    });
    return () => {
      Object.entries(currentHandler).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);
};

const useGetMessages = ({
  chatId,
}: useGetMessagesProps): {
  data: InfiniteData<MessagesPage> | undefined;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
} => {
  console.log(chatId, 59);

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<MessagesPage>({
      queryKey: ["messages", chatId],
      queryFn: ({ pageParam = 1 }) =>
        getAllMessages({ page: Number(pageParam), chatId }),
      getNextPageParam: (lastPage) => {
        const { meta } = lastPage;
        if (!meta) return;
        return meta.currentPage < meta.totalPages
          ? meta.currentPage + 1
          : undefined;
      },
      initialPageParam: 1,
      staleTime: 0,
      retry: false,
      enabled: !!chatId,
    });

  return { data, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage };
};

function useUserId(
  key: string,
  initialValue: number
): [number, (value: number) => void] {
  const [storedValue, setStoredValue] = useState<number>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? parseInt(item, 10) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: number) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(parseInt(item, 10));
      }
    } catch (error) {
      console.error(
        `Error syncing localStorage key "${key}" with state:`,
        error
      );
    }
  }, [key]);

  return [storedValue, setValue];
}

export default useUserId;

export { useSocketEvents, useGetMessages, useUserId };
