import Loader from "@/components/ui/Loader";
import TypingLoader from "@/components/ui/TypingLoader";
import { socketEvents } from "@/constants";
import {
  useChatScroll,
  useFailMessageListener,
  useGetMessages,
  useMapDbMessageToTempMessageListener,
  useNewMessagesListener,
  useSocketEvents,
  useStartTypingListener,
  useStopTypingListener,
} from "@/hooks";
import { QueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { Socket } from "socket.io-client";
import MessageComponent from "./MessageComponent";

interface MessagesProps {
  queryClient: QueryClient;
  friendAvatar: string | null;
  userTyping: boolean;
  userId: number;
  selectedChatId: number;
  socket: Socket;
  setUserTyping: (value: boolean) => void;
  setNewMessagesAlert: (i: []) => void;
}

const Messages: React.FC<MessagesProps> = ({
  queryClient,
  userId,
  selectedChatId,
  friendAvatar,
  userTyping,
  socket,
  setUserTyping,
  setNewMessagesAlert,
}) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetMessages({
      chatId: selectedChatId,
    });

  const messages = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data ?? []) ?? [];
  }, [data]);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { showScrollButton } = useChatScroll({
    bottomRef,
    lastMessageRef,
    messagesLength: reversedMessages.length,
    setNewMessagesAlert,
  });

  const newMessageListener = useNewMessagesListener(
    selectedChatId,
    userId,
    queryClient
  );
  const mapMessageListener = useMapDbMessageToTempMessageListener(
    selectedChatId,
    queryClient
  );
  const failMessageListener = useFailMessageListener(queryClient);
  const userStartTypingListener = useStartTypingListener({
    chatId: selectedChatId,
    setUserTyping,
  });
  const userStopTypingListener = useStopTypingListener({
    chatId: selectedChatId,
    setUserTyping,
  });

  const eventHandler = {
    [socketEvents.NEW_MESSAGE]: newMessageListener,
    [socketEvents.MAP_MESSAGE]: mapMessageListener,
    [socketEvents.FAIL_MESSAGE]: failMessageListener,
    [socketEvents.STARTED_TYPING]: userStartTypingListener,
    [socketEvents.STOPPED_TYPING]: userStopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isFetchingNextPage && scrollContainerRef.current) {
      const prevScrollHeight = scrollContainerRef.current.scrollHeight;
      const prevScrollTop = scrollContainerRef.current.scrollTop;

      return () => {
        if (scrollContainerRef.current) {
          const newScrollHeight = scrollContainerRef.current.scrollHeight;
          scrollContainerRef.current.scrollTop =
            prevScrollTop + (newScrollHeight - prevScrollHeight);
        }
      };
    }
  }, [isFetchingNextPage]);

  return (
    <div
      className="relative w-full h-full flex flex-col py-2 px-2"
      aria-live="polite"
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden space-y-2"
      >
        {(isFetching || isFetchingNextPage) && (
          <div
            className="flex justify-center items-center py-2"
            aria-label="Loading messages"
          >
            <Loader />
          </div>
        )}

        {reversedMessages.length === 0 && !isFetching && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center font-medium text-sm text-black">{`You Don't Have Any Messages Yet`}</p>
          </div>
        )}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full text-center py-2 text-sm text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            aria-label="Load more messages"
            tabIndex={0}
          >
            {isFetchingNextPage ? "Loading..." : "Load More Messages"}
          </button>
        )}

        {reversedMessages.map((msg, index) => {
          const isSender = Number(msg?.senderId) === Number(userId);
          const isLastMessage = index === reversedMessages.length - 1;
          return (
            <MessageComponent
              friend_avatar={friendAvatar}
              key={msg?._id || index}
              msg={msg}
              isSender={isSender}
              isLastMessage={isLastMessage}
              ref={isLastMessage ? lastMessageRef : undefined}
            />
          );
        })}

        {userTyping && (
          <div className="w-full flex flex-start pl-5 mt-4">
            <TypingLoader />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded shadow-lg text-sm hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Scroll to latest messages"
          tabIndex={0}
        >
          Scroll to Bottom ↓
        </button>
      )}
    </div>
  );
};

export default Messages;
