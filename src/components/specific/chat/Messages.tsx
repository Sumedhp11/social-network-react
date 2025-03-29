import Loader from "@/components/ui/Loader";
import { messageInterface } from "@/types/types";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import MessageComponent from "./MessageComponent";
import TypingLoader from "@/components/ui/TypingLoader";

interface MessagesProps {
  messages: messageInterface[];
  isFetching: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  friendAvatar: string | null;
  userTyping: boolean;
  hasNextPage: boolean;
  userId: number;
}

const Messages: React.FC<MessagesProps> = ({
  messages,
  isFetching,
  isFetchingNextPage,
  fetchNextPage,
  friendAvatar,
  userTyping,
  hasNextPage,
  userId,
}) => {
  const { ref, inView } = useInView();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <div className="w-full h-full flex flex-col py-2 px-2">
      {(isFetching || isFetchingNextPage) && (
        <div className="flex justify-center items-center py-2">
          <Loader />
        </div>
      )}

      {messages.length === 0 && !isFetching && !isFetchingNextPage && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center font-medium text-sm text-black">{`You Don't Have Any Messages Yet`}</p>
        </div>
      )}

      <div ref={ref} className="h-1" />

      <div className="space-y-2">
        {messages.length > 0 &&
          messages
            .slice()
            .reverse()
            .map((msg, index) => {
              const isSender = Number(msg?.senderId) === Number(userId);
              const isLastMessage = index === messages.length - 1;
              return (
                <MessageComponent
                  friend_avatar={friendAvatar}
                  key={msg?._id || index}
                  msg={msg}
                  isSender={isSender}
                  isLastMessage={isLastMessage}
                />
              );
            })}
      </div>

      {userTyping && (
        <div className="w-full flex flex-start pl-5 mt-4">
          <TypingLoader />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};

export default Messages;
