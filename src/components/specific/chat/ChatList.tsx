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
    queryFn: () => getFriendsAPI({ username }),
    staleTime: 0,
    gcTime: 0,
    initialData: [],
    refetchOnMount: true,
  });

  if (error) return <p>Error loading friends!</p>;

  return (
    <>
      {isLoading ? (
        <Loader className="text-black" />
      ) : friendsList && friendsList.length > 0 ? (
        friendsList.map((i: userInterface) => (
          <div
            key={i.friendId}
            className="w-full flex items-center gap-3 cursor-pointer hover:bg-slate-300 p-2 rounded"
            onClick={() => setSelectedUser(i)}
          >
            {/* Avatar Section */}
            <div className="w-[15%]">
              <Avatar className="w-12 h-12 ring-2 ring-white">
                <AvatarImage
                  src={
                    i.avatarUrl ||
                    "https://avatars.githubusercontent.com/u/124599?v=4"
                  }
                  alt="User Avatar"
                  className="object-contain"
                />
              </Avatar>
            </div>

            {/* User Info Section */}
            <div className="space-y-2">
              <p className="font-medium text-sm text-black">{i.username}</p>
              {i.chat?.id && (
                <div>
                  {newMessagesAlert.some(
                    (item) => item.chatId === i.chat.id
                  ) ? (
                    <span className="text-red-600 font-medium text-sm ml-2">
                      New Messages
                    </span>
                  ) : (
                    <span className="font-semibold text-sm text-[#758694]">
                      {i.chat.last_message || "No messages yet"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center font-medium text-sm text-black">
          You Don’t Have Any Friends!
        </p>
      )}
    </>
  );
};

export default ChatList;
