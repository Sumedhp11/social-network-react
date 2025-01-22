import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socketEvents } from "@/constants";
import { userInterface } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { SendHorizontal } from "lucide-react";

import React, { ChangeEvent, useRef, useState } from "react";
import { Socket } from "socket.io-client";

const SendMessage = ({
  userId,
  socket,
  selectedUser,
  iamTyping,
  setIamTyping,
}: {
  userId: number;
  socket: Socket;
  selectedUser: userInterface;
  iamTyping: boolean;
  setIamTyping: (value: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !userId || !userId) return;

    socket.emit(socketEvents.NEW_MESSAGE, {
      chatId: selectedUser.chat.id,
      memberIds: [selectedUser.friendId, userId],
      message,
    });
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    setMessage("");
  };
  const handleTypingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

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
      if (userId) {
        socket.emit(socketEvents.STOPPED_TYPING, {
          memberIds: [selectedUser.friendId, userId],
          chatId: selectedUser.chat.id,
        });
        setIamTyping(false);
      }
    }, 3000);
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
