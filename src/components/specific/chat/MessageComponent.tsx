import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { messageInterface } from "@/types/types";

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
  return (
    <div
      className={`flex items-end ${
        isSender ? "justify-end" : "justify-start"
      } mb-2`}
    >
      {/* Friend's Avatar for Received Messages */}
      {!isSender && (
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage
            src={
              friend_avatar ??
              "https://avatars.githubusercontent.com/u/124599?v=4"
            }
            alt="User Avatar"
            className="object-contain"
          />
        </Avatar>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-lg text-sm font-light shadow-md ${
          isSender
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-gray-500 text-white rounded-bl-none"
        }`}
      >
        {/* Message Content */}
        <p className="text-sm font-medium">{msg?.message}</p>

        {/* Timestamp */}
        <p className="text-sm font-medium mt-1 text-white text-right">
          {new Date(msg?.createdAt).getHours()}:
          {new Date(msg?.createdAt).getMinutes().toString().padStart(2, "0")}
        </p>
      </div>

      {/* Seen Indicator for Last Sent Message */}
      {isSender && isLastMessage && msg.seen_at && (
        <div className="ml-2 animate-bounce">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={
                friend_avatar ??
                "https://avatars.githubusercontent.com/u/124599?v=4"
              }
              alt="User Avatar"
              className="object-contain"
            />
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
