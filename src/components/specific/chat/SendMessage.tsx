import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socketEvents } from "@/constants";
import {
  addNewMessageToCache,
  generateMessage,
  scrollToBottomHelper,
} from "@/helpers/socketHelpers";
import { userInterface } from "@/types/types";
import { QueryClient } from "@tanstack/react-query";
import { SendHorizontal } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { Socket } from "socket.io-client";

const SendMessage = ({
  userId,
  socket,
  selectedUser,
  iamTyping,
  setIamTyping,
  queryClient,
  bottomRef,
}: {
  userId: number;
  socket: Socket;
  selectedUser: userInterface;
  iamTyping: boolean;
  setIamTyping: (value: boolean) => void;
  queryClient: QueryClient;
  bottomRef: React.RefObject<HTMLDivElement>;
}) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const tempMessage = generateMessage(
      message,
      userId,
      selectedUser.chat.id ?? undefined
    );
    addNewMessageToCache({
      queryClient,
      chatId: selectedUser.chat.id ?? undefined,
      message: tempMessage,
    });
    socket.emit(socketEvents.NEW_MESSAGE, {
      chatId: selectedUser.chat.id,
      memberIds: [selectedUser.friendId, userId],
      message,
      tempId: tempMessage._id,
    });

    setMessage("");
    scrollToBottomHelper(bottomRef);
  };

  const handleTypingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (!iamTyping && userId) {
      socket.emit(socketEvents.STARTED_TYPING, {
        memberIds: [selectedUser.friendId, userId],
        chatId: selectedUser.chat.id,
      });
      setIamTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (iamTyping && userId) {
        socket.emit(socketEvents.STOPPED_TYPING, {
          memberIds: [selectedUser.friendId, userId],
          chatId: selectedUser.chat.id,
        });
        setIamTyping(false);
      }
    }, 1500);
  };

  return (
    <form className="w-full flex items-center p-2" onSubmit={handleSendMessage}>
      <Input
        className="flex-grow mr-2 text-black font-medium"
        placeholder="Type your message..."
        value={message}
        onChange={handleTypingChange}
      />

      <Button
        className="p-2 rounded-full bg-[#189FF2] hover:bg-sky-600 flex items-center justify-center"
        type="submit"
      >
        <SendHorizontal size={20} className="text-white" />
      </Button>
    </form>
  );
};

export default SendMessage;
