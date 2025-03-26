import { userInterface } from "@/types/types";
import { newMessageAlertInterface } from "./ChatDrawer";
import { useQuery } from "@tanstack/react-query";
import { getFriendsAPI } from "@/APIs/authAPIs";
import Loader from "@/components/ui/Loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ChatList = ({
  username,
  setSelectedUser,
  newMessagesAlert,
}: {
  username: string;
  setSelectedUser: (user: userInterface) => void;
  newMessagesAlert: newMessageAlertInterface[];
}) => {
  const {
    data: friendsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friends", username],
    queryFn: () => getFriendsAPI(username),
    refetchOnMount: true,
  });

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600 text-sm font-semibold bg-red-100 px-3 py-1 rounded-md">
          Error loading friends!
        </p>
      </div>
    );

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="text-gray-700 w-6 h-6 animate-spin" />
        </div>
      ) : friendsList && friendsList.length > 0 ? (
        friendsList.map((i: userInterface) => (
          <div
            key={i.friendId}
            className="w-full flex items-center gap-4 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
            onClick={() => setSelectedUser(i)}
          >
            {/* Avatar Section */}
            <div className="w-[15%] flex-shrink-0">
              <Avatar className="w-12 h-12 ring-2 ring-gray-200 shadow-sm transition-transform duration-150 group-hover:scale-105">
                <AvatarImage
                  src={
                    i.avatarUrl ||
                    "https://avatars.githubusercontent.com/u/124599?v=4"
                  }
                  alt={`${i.username}'s avatar`}
                  className="object-cover"
                />
              </Avatar>
            </div>

            {/* User Info Section */}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors duration-150">
                {i.username}
              </p>
              {i.chat?.id && (
                <div className="flex items-center">
                  {newMessagesAlert.some(
                    (item) => item.chatId === i.chat.id
                  ) ? (
                    <span className="text-red-500 font-medium text-xs bg-red-50 px-2 py-0.5 rounded-full">
                      New Messages
                    </span>
                  ) : (
                    <span className="text-gray-600 text-sm truncate max-w-[180px] block">
                      {i.chat.last_message || "No messages yet"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">
            You Don’t Have Any Friends!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
