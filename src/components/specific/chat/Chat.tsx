import { socketEvents } from "@/constants";
import useUserId, {
  MessagesPage,
  useGetMessages,
  useSocketEvents,
} from "@/hooks";
import { messageInterface, userInterface } from "@/types/types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import SendMessage from "./SendMessage";

interface ChatProps {
  selectedUser: userInterface;
  setSelectedUser: (user: null) => void;
  setOpenDrawer: (i: boolean) => void;
  setNewMessagesAlert: (i: []) => void;
  socket: Socket;
}

const Chat = ({
  selectedUser,
  setSelectedUser,
  setOpenDrawer,
  setNewMessagesAlert,
  socket,
}: ChatProps) => {
  const queryClient = useQueryClient();
  const [userId] = useUserId("userId", 0);
  const [iamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetMessages({
      chatId: selectedUser.chat.id!,
    });

  const markMessagesAsSeen = useCallback(() => {
    if (!data?.pages || !userId) return;

    const unseenMessages = data.pages
      .flatMap((page) => page.data)
      .filter(
        (message) =>
          !message.seen_at && Number(message.senderId) !== Number(userId)
      );

    if (unseenMessages.length === 0) return;

    const messageIds = unseenMessages.map((msg) => msg?._id);

    socket.emit(socketEvents.MESSAGE_SEEN, {
      chatId: selectedUser.chat.id,
      messageIds,
      seen_at: new Date(),
    });

    queryClient.setQueryData<InfiniteData<MessagesPage>>(
      ["messages", selectedUser.chat.id],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((msg) =>
              messageIds.includes(msg._id) && !msg.seen_at
                ? { ...msg, seen_at: new Date() }
                : msg
            ),
          })),
        };
      }
    );
  }, [data, selectedUser.chat.id, queryClient, socket, userId]);

  const newMessagesListener = useCallback(
    (data: { chatId: string; messageForRealTime: messageInterface }) => {
      if (!userId || Number(data.chatId) !== Number(selectedUser.chat.id))
        return;

      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        ["messages", selectedUser.chat.id],
        (oldData) => {
          if (!oldData) return oldData;

          const messageExists = oldData.pages
            .flatMap((page) => page.data)
            .some((msg) => msg._id === data.messageForRealTime._id);

          if (messageExists) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? { ...page, data: [data.messageForRealTime, ...page.data] }
                : page
            ),
          };
        }
      );

      if (Number(data.messageForRealTime.senderId) !== Number(userId)) {
        socket.emit(socketEvents.MESSAGE_SEEN, {
          chatId: data.chatId,
          messageIds: [data.messageForRealTime?._id],
          seen_at: new Date(),
        });
      }
    },
    [selectedUser.chat.id, queryClient, socket, userId]
  );

  const MessageListener = useCallback(
    (data: { chatId: number; messageId: string; seen_at: Date }) => {
      if (Number(data.chatId) !== Number(selectedUser.chat.id)) return;

      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        ["messages", selectedUser.chat.id],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((msg) =>
                msg._id === data.messageId && !msg.seen_at
                  ? { ...msg, seen_at: data.seen_at }
                  : msg
              ),
            })),
          };
        }
      );
    },
    [selectedUser.chat.id, queryClient]
  );

  const handleStartTyping = useCallback(
    (data: { chatId: number }) => {
      if (data.chatId === selectedUser.chat.id) {
        setUserTyping(true);
      }
    },
    [selectedUser.chat.id]
  );

  const handleStopTyping = useCallback(
    (data: { chatId: number }) => {
      if (data.chatId === selectedUser.chat.id) {
        setTimeout(() => {
          setUserTyping(false);
        }, 500);
      }
    },
    [selectedUser.chat.id]
  );

  useEffect(() => {
    if (selectedUser.chat.id && data?.pages) {
      markMessagesAsSeen();
      setNewMessagesAlert([]);
    }
  }, [
    selectedUser.chat.id,
    data?.pages,
    markMessagesAsSeen,
    setNewMessagesAlert,
  ]);

  const eventHandler = {
    [socketEvents.NEW_MESSAGE]: newMessagesListener,
    [socketEvents.MESSAGE_SEEN]: MessageListener,
    [socketEvents.STARTED_TYPING]: handleStartTyping,
    [socketEvents.STOPPED_TYPING]: handleStopTyping,
  };

  useSocketEvents(socket, eventHandler);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[12.1%]">
        <ChatHeader
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setOpenDrawer={setOpenDrawer}
          socket={socket}
        />
      </div>
      <div className="h-[70%] overflow-hidden overflow-y-auto">
        <Messages
          messages={data?.pages.flatMap((page) => page.data) || []}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          friendAvatar={selectedUser.avatarUrl}
          userId={userId}
          userTyping={userTyping}
          hasNextPage={hasNextPage}
        />
      </div>
      <div className="">
        <SendMessage
          userId={userId}
          socket={socket}
          selectedUser={selectedUser}
          setIamTyping={setIamTyping}
          iamTyping={iamTyping}
        />
      </div>
    </div>
  );
};

export default Chat;
