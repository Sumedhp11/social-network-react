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
    <div className={`chat ${isSender ? "chat-end " : "chat-start"} p-1 `}>
      <div className="chat-bubble bg-green-500">
        {!isSender && (
          <p className="text-white text-sm font-light">
            {msg?.sender?.username}
          </p>
        )}
        <p className="text-sm font-light text-white">{msg?.message}</p>
        <p className="text-xs font-light text-white">
          {new Date(msg?.createdAt).getHours()}:
          {new Date(msg?.createdAt).getMinutes().toString().padStart(2, "0")}
        </p>
      </div>
      {isSender && isLastMessage && msg.seen_at && (
        <div className="chat-start animate-bounce">
          <Avatar className="w-6 h-6 ">
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
