"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Bell } from "lucide-react";

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
  //   const { hasUnread, markAllAsRead } = useNotifications();
  const queryClient = useQueryClient();
  //   const { isLoading, data: notifications } = useQuery({
  //     queryKey: ["notifications"],
  //     queryFn: getAllNotifications,
  //   });

  //   const { mutate: handleRequest } = useMutation({
  //     mutationFn: HandleFriendRequestAPI,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["notifications"] });
  //     },
  //   });

  //   const handleFriendRequestClick = async (
  //     friendshipId: number,
  //     action: string
  //   ) => {
  //     if (action === "Accept") {
  //       handleRequest({ friendShipId: friendshipId, action });
  //     } else if (action === "Decline") {
  //       handleRequest({ friendShipId: friendshipId, action });
  //     }
  //     setOpenPopup(false);
  //   };

  return (
    <div className="relative">
      <Popover open={openPopup} onOpenChange={setOpenPopup}>
        <PopoverTrigger>
          <div className="relative">
            <Bell
              size={25}
              className="text-white cursor-pointer"
              //   onClick={markAllAsRead}
            />
            {/* {hasUnread && (
              <div className="w-2 h-2 bg-green-800 rounded-full animate-ping absolute top-0 right-0"></div>
            )} */}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] mr-4 mt-4 p-4">
          {/* {isLoading ? (
            <Loader />
          ) : notifications && notifications.length > 0 ? (
            notifications.map((n: Notification, index: number) => (
              <div
                key={n.id}
                className={`w-full grid grid-cols-12 gap-2 py-3 ${
                  index !== notifications.length - 1
                    ? "border-b border-gray-300"
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
                  <Avatar>
                    <AvatarImage
                      src={
                        n.sender.avatarUrl || "https://github.com/shadcn.png"
                      }
                      alt={n.sender.username}
                    />
                  </Avatar>
                  <div className="w-[70%] flex flex-col gap-1">
                    <p className="text-sm font-medium">{n.sender.username}</p>
                    <p className="text-xs font-medium text-black text-ellipsis overflow-hidden">
                      {n.notificationType === "FRIEND_REQUEST_RECEIVED"
                        ? `Sent you a Friend Request`
                        : n.message}
                    </p>
                    <p className="text-gray-500 text-xs font-medium">
                      {moment(n.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                {n.notificationType === "FRIEND_REQUEST_RECEIVED" && (
                  <div className="col-span-4 flex justify-end items-center gap-2">
                    <Check
                      className="rounded-full w-8 h-8 p-1 cursor-pointer bg-green-100 text-green-500"
                      onClick={() =>
                        handleFriendRequestClick(n.friendship.id, "Accept")
                      }
                    />
                    <X
                      className="rounded-full w-8 h-8 p-1 cursor-pointer bg-red-100 text-red-500"
                      onClick={() =>
                        handleFriendRequestClick(n.friendship.id, "Decline")
                      }
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No notifications</p>
          )} */}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationPopup;
