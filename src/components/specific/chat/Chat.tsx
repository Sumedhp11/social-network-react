import { useSocketEvents, useUserId } from "@/hooks";
import { userInterface } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  const [userId] = useUserId("userId", 0);
  if (!userId) return;
  const selectedChatId = Number(selectedUser.chat.id);
  const queryClient = useQueryClient();
  const [iamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-none">
        <ChatHeader
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setOpenDrawer={setOpenDrawer}
          socket={socket}
        />
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto pb-2">
          <Messages
            socket={socket}
            selectedChatId={selectedChatId}
            queryClient={queryClient}
            friendAvatar={selectedUser.avatarUrl}
            userId={userId}
            userTyping={userTyping}
            setUserTyping={setUserTyping}
          />
        </div>
      </div>
      <div className="flex-none mt-auto">
        <SendMessage
          queryClient={queryClient}
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
