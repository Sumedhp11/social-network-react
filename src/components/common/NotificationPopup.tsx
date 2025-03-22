import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Bell, Check, X } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { getAllNotifications } from "@/APIs/notificationAPIs";
import { HandleFriendRequestAPI } from "@/APIs/authAPIs";
import Loader from "../ui/Loader";
import { Avatar, AvatarImage } from "../ui/avatar";
import moment from "moment";

interface Notification {
  sender: {
    avatarUrl?: string | null;
    username: string;
    id: number;
  };
  createdAt: Date;
  message: string;
  notificationType: string;
  id: number;
  friendship: {
    id: number;
  };
}

const NotificationPopup = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const { hasUnread, markAllAsRead } = useNotifications();
  const queryClient = useQueryClient();
  const { isLoading, data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotifications,
  });

  const { mutate: handleRequest } = useMutation({
    mutationFn: HandleFriendRequestAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleFriendRequestClick = async (
    friendshipId: number,
    action: string
  ) => {
    if (action === "Accept") {
      handleRequest({ friendShipId: friendshipId, action });
    } else if (action === "Decline") {
      handleRequest({ friendShipId: friendshipId, action });
    }
    setOpenPopup(false);
  };

  return (
    <div className="relative">
      <Popover open={openPopup} onOpenChange={setOpenPopup}>
        <PopoverTrigger>
          <div className="relative">
            <Bell
              size={25}
              className="text-white cursor-pointer"
              onClick={markAllAsRead}
            />
            {hasUnread && (
              <div className="w-2 h-2 bg-green-800 rounded-full animate-ping absolute top-0 right-0"></div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] max-w-[90vw] max-h-[350px] mr-4 mt-4 p-4 overflow-y-auto rounded-lg bg-white shadow-lg">
          {isLoading ? (
            <Loader />
          ) : notifications && notifications.length > 0 ? (
            notifications.map((n: Notification, index: number) => (
              <div
                key={n.id}
                className={`w-full grid grid-cols-12 gap-3 py-2.5 ${
                  index !== notifications.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <div
                  className={`${
                    n.notificationType === "FRIEND_REQUEST_RECEIVED"
                      ? "col-span-8"
                      : "col-span-12"
                  } flex items-center gap-3`}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={
                        n.sender.avatarUrl || "https://github.com/shadcn.png"
                      }
                      alt={n.sender.username}
                    />
                  </Avatar>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {n.sender.username}
                    </p>
                    <p className="text-xs font-normal text-gray-700 whitespace-nowrap text-ellipsis overflow-hidden">
                      {n.notificationType === "FRIEND_REQUEST_RECEIVED"
                        ? `Sent you a Friend Request`
                        : n.message}
                    </p>
                    <p className="text-xs font-normal text-gray-500">
                      {moment(n.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                {n.notificationType === "FRIEND_REQUEST_RECEIVED" && (
                  <div className="col-span-4 flex justify-end items-center gap-2">
                    <button
                      className="rounded-full w-8 h-8 p-1.5 flex items-center justify-center bg-green-100 text-green-500 hover:bg-green-200 transition-colors"
                      onClick={() =>
                        handleFriendRequestClick(n.friendship.id, "Accept")
                      }
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      className="rounded-full w-8 h-8 p-1.5 flex items-center justify-center bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                      onClick={() =>
                        handleFriendRequestClick(n.friendship.id, "Decline")
                      }
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-sm">
              No notifications
            </p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationPopup;
