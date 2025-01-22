import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useVideoChat } from "@/contexts/VideoChatContext";
import { userInterface } from "@/types/types";
import { ArrowLeft, Video } from "lucide-react";
import { Link } from "react-router";
import { Socket } from "socket.io-client";

const ChatHeader = ({
  selectedUser,
  setOpenDrawer,
  setSelectedUser,
  socket,
}: {
  selectedUser: userInterface;
  setSelectedUser: (user: null) => void;
  setOpenDrawer: (i: boolean) => void;
  socket: Socket;
}) => {
  const { callUser } = useVideoChat();

  return (
    <div className="w-full flex justify-between items-center py-2 px-1 bg-[#189FF2]">
      <div className="gap-3 flex items-center">
        <ArrowLeft
          size={28}
          className="text-white cursor-pointer"
          onClick={() => setSelectedUser(null)}
        />
        <Link
          to={`/user/${selectedUser.friendId}`}
          className="flex items-center gap-3"
          onClick={() => setOpenDrawer(false)}
        >
          <Avatar className="w-11 h-11 ring-2">
            <AvatarImage
              src={
                selectedUser.avatarUrl ??
                "https://avatars.githubusercontent.com/u/124599?v=4"
              }
              alt="User Avatar"
              className="object-contain"
            />
          </Avatar>
          <p className="text-sm font-medium text-white">
            {selectedUser.username}
          </p>
        </Link>
      </div>
      <div className="mr-5">
        <Video
          size={28}
          className="text-white cursor-pointer"
          onClick={() => {
            if (socket) {
              callUser(selectedUser.friendId!);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
