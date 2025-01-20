import { Button } from "@/components/ui/button";
import { socketEvents } from "@/constants";
import { userInterface } from "@/types/types";
import React, { useCallback, useState } from "react";

export interface newMessageAlertInterface {
  chatId: number;
  message: string;
}

const ChatDrawer = () => {
  const [username, setUsername] = useState("");
  //   const socket = useSocket();
  const [selectedUser, setSelectedUser] = useState<userInterface | null>(null);
  const [newMessagesAlert, setNewMessagesAlert] = useState<
    newMessageAlertInterface[]
  >([]);

  //   const { setOpenVideoChat, openVideoChat, setOpenDrawer, openDrawer } =
  //     useVideoChat();

  const newMessagesListener = useCallback(
    (data: { chatId: number; message: string }) => {
      if (selectedUser?.chat.id !== data.chatId) {
        setNewMessagesAlert((prev) => {
          const existingMessage = prev.find(
            (alert) => alert.chatId === data.chatId
          );
          if (existingMessage) {
            return prev.map((alert) =>
              alert.chatId === data.chatId
                ? { ...alert, message: data.message }
                : alert
            );
          }
          return [...prev, { chatId: data.chatId, message: data.message }];
        });
      }
    },
    [selectedUser]
  );

  const eventHandler = {
    [socketEvents.NEW_MESSAGE_ALERT]: newMessagesListener,
  };

  //   useSocketEvents(socket, eventHandler);

  return (
    <>
      <Button
        // onClick={() => setOpenDrawer(true)}
        className="w-full bg-blue-100 text-[#189FF2] hover:bg-blue-200 flex items-center gap-4 justify-center"
      >
        <span className="text-base">Messages </span>
        {newMessagesAlert.length > 0 ? (
          <span className="w-5 h-5 bg-red-500 text-white rounded-full flex justify-center items-center">
            {newMessagesAlert.length}
          </span>
        ) : null}
      </Button>

      {/* {openDrawer ? (
        <Drawer
          open={openDrawer}
          onOpenChange={(value) => setOpenDrawer(value)}
        >
          <DrawerContent className="w-[75%] md:w-[30%] h-[80%] right-3 p-0 bg-white">
            <DrawerHeader className="w-full rounded-t-lg border-b border-gray-400 text-zinc-800 relative flex items-center justify-center px-4 py-2 shadow-md">
              <DrawerTitle className="text-base font-medium">
                Messages
              </DrawerTitle>
              <DrawerClose className="absolute top-1.5 right-2">
                <X size={20} className="text-gray-300 hover:text-gray-500" />
              </DrawerClose>
            </DrawerHeader>
            <div className="h-full">
              {!selectedUser ? (
                <>
                  <div className="w-full flex justify-center">
                    <Input
                      className={`w-[97%] mt-2 text-black placeholder:text-white border border-gray-900 bg-gray-300 ${
                        username && "bg-white"
                      }`}
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                    />
                  </div>
                  <div className="w-full h-full overflow-auto flex flex-col items-center py-4 px-1 bg-gray-50">
                    <div className="w-full relative flex flex-col items-center space-y-5">
                      <ChatList
                        setSelectedUser={setSelectedUser}
                        username={username}
                        newMessagesAlert={newMessagesAlert}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <Chat
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  setOpenDrawer={setOpenDrawer}
                  setNewMessagesAlert={setNewMessagesAlert}
                />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
      {openVideoChat ? (
        <Dialog onOpenChange={setOpenVideoChat} open={openVideoChat}>
          <DialogContent className="w-[50%] h-[65%] bg-white border border-blue-600">
            <DialogTitle className="hidden"></DialogTitle>
            <div className="w-full h-full py-3 grid grid-rows-8 border border-red-500 space-y-4">
              <div className="flex gap-3 items-center px-4 row-span-1">
                <Avatar className="w-12 h-12 ring-2 ring-white">
                  <AvatarImage
                    src={
                      selectedUser?.avatarUrl === null
                        ? "https://avatars.githubusercontent.com/u/124599?v=4"
                        : selectedUser?.avatarUrl
                    }
                    alt="User Avatar"
                    className="object-contain"
                  />
                </Avatar>
                <h2 className="text-lg font-medium leading-none tracking-tight text-black">
                  {selectedUser?.username}
                </h2>
              </div>
              <div className="row-span-7">
                <VideoChatComponent />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : null} */}
    </>
  );
};

export default React.memo(ChatDrawer);
