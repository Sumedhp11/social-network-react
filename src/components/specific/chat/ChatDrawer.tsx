import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { socketEvents } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useVideoChat } from "@/contexts/VideoChatContext";
import { useSocketEvents } from "@/hooks";
import { userInterface } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { X } from "lucide-react";
import React, { useCallback, useState } from "react";
import VideoChatComponent from "../video chat/VideoChatComponent";
import Chat from "./Chat";
import ChatList from "./ChatList";

export interface newMessageAlertInterface {
  chatId: number;
  message: string;
  unreadCount: number;
}

const ChatDrawer = () => {
  const [username, setUsername] = useState("");
  const socket = useSocket();

  const [selectedUser, setSelectedUser] = useState<userInterface | null>(null);
  const [newMessagesAlert, setNewMessagesAlert] = useState<
    newMessageAlertInterface[]
  >([]);
  const queryClient = useQueryClient();

  const {
    openDialog,
    setOpenDialog,
    openDrawer,
    setOpenDrawer,
    recipentUserDetails,
  } = useVideoChat();

  const newMessagesListener = useCallback(
    (data: { chatId: number; message: string }) => {
      if (!selectedUser || selectedUser.chat.id !== data.chatId) {
        setNewMessagesAlert((prev) => {
          const existingAlert = prev.find(
            (alert) => alert.chatId === data.chatId
          );
          if (existingAlert) {
            return prev.map((alert) =>
              alert.chatId === data.chatId
                ? {
                    ...alert,
                    message: data.message,
                    unreadCount: alert.unreadCount + 1,
                  }
                : alert
            );
          }
          return [
            ...prev,
            { chatId: data.chatId, message: data.message, unreadCount: 1 },
          ];
        });
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      }
    },
    [selectedUser, queryClient]
  );

  const handleChatSelection = (user: userInterface) => {
    setSelectedUser(user);
    setNewMessagesAlert((prev) =>
      prev.filter((alert) => alert.chatId !== user.chat?.id)
    );
  };

  const eventHandler = {
    [socketEvents.NEW_MESSAGE_ALERT]: newMessagesListener,
  };

  useSocketEvents(socket, eventHandler);

  return (
    <>
      <Button
        onClick={() => setOpenDrawer(true)}
        className="w-full bg-blue-100 text-[#189FF2] hover:bg-blue-200 flex items-center gap-4 justify-center"
      >
        <span className="text-base">Messages </span>
        {newMessagesAlert.length > 0 && (
          <span className="w-5 h-5 bg-red-500 text-white rounded-full flex justify-center items-center">
            {newMessagesAlert.reduce(
              (total, alert) => total + alert.unreadCount,
              0
            )}
          </span>
        )}
      </Button>

      {openDrawer && (
        <Drawer
          open={openDrawer}
          onOpenChange={(value) => setOpenDrawer(value)}
        >
          <DrawerContent className="w-[75%] md:w-[30%] lg:w-[25%] h-[80%] right-3 p-0 bg-white">
            <DrawerHeader className="w-full rounded-t-lg border-b border-gray-400 text-zinc-800 relative flex items-center justify-center px-4 py-2 shadow-md">
              <DrawerTitle className="text-base font-medium">
                Messages
              </DrawerTitle>
              <DrawerClose className="absolute top-1.5 right-2">
                <X size={20} className="text-gray-300 hover:text-gray-500" />
              </DrawerClose>
            </DrawerHeader>
            <div className="h-full flex flex-col">
              {selectedUser ? (
                <Chat
                  socket={socket}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  setOpenDrawer={setOpenDrawer}
                  setNewMessagesAlert={setNewMessagesAlert}
                />
              ) : (
                <>
                  <div className="w-full flex justify-center">
                    <Input
                      className={clsx(
                        "w-[97%] mt-2 text-black border border-gray-900",
                        username ? "bg-white" : "bg-gray-300"
                      )}
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      placeholder="Search users..."
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto py-4 px-1 bg-gray-50">
                    <ChatList
                      setSelectedUser={handleChatSelection}
                      username={username}
                      newMessagesAlert={newMessagesAlert}
                    />
                  </div>
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}
      {openDialog ? (
        <Dialog onOpenChange={setOpenDialog} open={openDialog}>
          <DialogContent className="h-[600px] max-h-[90vh] w-full sm:max-w-[70%] md:max-w-[50%] lg:max-w-[35%] rounded-sm bg-white  border ">
            <DialogTitle className="sr-only"></DialogTitle>
            <div className="w-full h-full flex flex-col space-y-3 border border-black">
              <div className="flex gap-3 items-center px-3 py-1.5 max-h-[400px]">
                <Avatar className="w-12 h-12 ring-2 ring-red-400">
                  <AvatarImage
                    src={
                      selectedUser?.avatarUrl
                        ? selectedUser?.avatarUrl
                        : recipentUserDetails
                        ? recipentUserDetails.avatarUrl
                        : "https://avatars.githubusercontent.com/u/124599?v=4"
                    }
                    alt="User Avatar"
                    className="object-contain"
                  />
                </Avatar>
                <h2 className="text-lg font-medium leading-none tracking-tight text-black">
                  {selectedUser?.username
                    ? selectedUser.username
                    : recipentUserDetails?.username}{" "}
                </h2>
              </div>
              <div className="flex-1">
                <VideoChatComponent />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default React.memo(ChatDrawer);
