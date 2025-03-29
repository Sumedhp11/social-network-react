import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { messageInterface } from "@/types/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MessageComponent = ({
  isSender,
  msg,
  friend_avatar,
  isLastMessage,
}: {
  isSender: boolean;
  msg: messageInterface;
  friend_avatar: string | null;
  isLastMessage: boolean;
}) => {
  // Format time from timestamp
  const formatTime = (timestamp: string | Date) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-2.5",
        isSender ? "justify-end" : "justify-start"
      )}
    >
      {!isSender && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage
            src={
              friend_avatar ??
              "https://avatars.githubusercontent.com/u/124599?v=4"
            }
            alt="User Avatar"
            className="object-cover"
          />
        </Avatar>
      )}

      <div className="flex flex-col max-w-xs md:max-w-sm lg:max-w-md">
        <div
          className={cn(
            "px-4 py-2.5 rounded-lg text-sm shadow-sm",
            isSender
              ? "bg-green-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-100"
          )}
        >
          <p className="font-normal break-words">{msg?.message}</p>
        </div>

        <div
          className={cn(
            "flex items-center mt-1 text-xs",
            isSender ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-gray-500 dark:text-gray-400">
            {formatTime(msg?.createdAt)}
          </span>

          {isSender && isLastMessage && msg?.seen_at && (
            <span className="ml-1.5 text-blue-500 flex items-center">
              <Check size={12} className="mr-0.5" />
              <span>Seen</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
