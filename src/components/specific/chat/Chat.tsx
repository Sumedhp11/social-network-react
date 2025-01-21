import { socketEvents } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { MessagesPage, useGetMessages, useSocketEvents } from "@/hooks";
import { messageInterface, userInterface } from "@/types/types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

interface ChatProps {
  selectedUser: userInterface;
  setSelectedUser: (user: null) => void;
  setOpenDrawer: (i: boolean) => void;
  setNewMessagesAlert: (i: []) => void;
}

const Chat = ({
  selectedUser,
  setSelectedUser,
  setOpenDrawer,
  setNewMessagesAlert,
}: ChatProps) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [iamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetMessages({
      chatId: selectedUser.chat.id!,
    });

//   const markMessagesAsSeen = useCallback(() => {
//     const unseenMessages =
//       data?.pages.flatMap((page) =>
//         page.data.filter(
//           (message) =>
//             !message.seen_at &&
//             Number(message.senderId) !== Number(session?.user.id)
//         )
//       ) || [];

//     if (unseenMessages.length > 0) {
//       socket.emit(socketEvents.MESSAGE_SEEN, {
//         chatId: selectedUser.chat.id,
//         messageIds: unseenMessages.map((msg) => msg?._id),
//         seen_at: new Date(),
//       });

//       queryClient.setQueryData<InfiniteData<MessagesPage>>(
//         ["messages", selectedUser.chat.id],
//         (oldData) => {
//           if (!oldData) return;

//           return {
//             ...oldData,
//             pages: oldData.pages.map((page) => ({
//               ...page,
//               data: page.data.map((msg) =>
//                 unseenMessages.some((unseenMsg) => unseenMsg._id === msg._id)
//                   ? { ...msg, seen_at: new Date() }
//                   : msg
//               ),
//             })),
//           };
//         }
//       );
//     }
//   }, [data, selectedUser.chat.id, queryClient, socket, session?.user.id]);

//   const newMessagesListener = useCallback(
//     (data: { chatId: string; messageForRealTime: messageInterface }) => {
//       if (!session) return;
//       if (Number(data.chatId) !== Number(selectedUser.chat.id)) return;

//       queryClient.setQueryData<InfiniteData<MessagesPage>>(
//         ["messages", selectedUser.chat.id],
//         (oldData) => {
//           if (!oldData) return;

//           return {
//             ...oldData,
//             pages: oldData.pages.map((page, index) =>
//               index === 0
//                 ? { ...page, data: [data.messageForRealTime, ...page.data] }
//                 : page
//             ),
//           };
//         }
//       );

//       if (Number(data.messageForRealTime.senderId) === Number(session?.user.id))
//         return;
//       if (selectedUser.chat.id) {
//         console.log("Worked", 95);
//         console.log(data.messageForRealTime, 96);

//         socket.emit(socketEvents.MESSAGE_SEEN, {
//           chatId: data.chatId,
//           messageIds: [data.messageForRealTime?._id],
//           seen_at: new Date(),
//         });
//       }
//     },
//     [selectedUser.chat.id, queryClient, socket, session]
//   );

//   useEffect(() => {
//     if (selectedUser.chat.id) {
//       markMessagesAsSeen();
//       setNewMessagesAlert([]);
//     }
//   }, [selectedUser.chat.id, markMessagesAsSeen, setNewMessagesAlert]);

//   const MessageListener = useCallback(
//     (data: { chatId: number; messageId: string; seen_at: Date }) => {
//       if (
//         Number(data.chatId) !== Number(selectedUser.chat.id) ||
//         selectedUser.friendId === session?.user.id
//       ) {
//         return;
//       }
//       queryClient.setQueryData<InfiniteData<MessagesPage>>(
//         ["messages", selectedUser.chat.id],
//         (oldData) => {
//           if (!oldData) return;

//           return {
//             ...oldData,
//             pages: oldData.pages.map((page) => ({
//               ...page,
//               data: page.data.map((msg) =>
//                 msg._id === data.messageId
//                   ? { ...msg, seen_at: data.seen_at }
//                   : msg
//               ),
//             })),
//           };
//         }
//       );
//     },
//     [selectedUser.chat.id, queryClient, selectedUser.friendId, session?.user.id]
//   );

//   const handleStartTyping = useCallback(
//     (data: { chatId: number }) => {
//       if (data.chatId === selectedUser.chat.id) {
//         setUserTyping(true);
//       }
//     },
//     [selectedUser.chat.id]
//   );

//   const handleStopTyping = useCallback(
//     (data: { chatId: number }) => {
//       if (data.chatId === selectedUser.chat.id) {
//         setUserTyping(false);
//       }
//     },
//     [selectedUser.chat.id]
//   );

//   const eventHandler = {
//     [socketEvents.NEW_MESSAGE]: newMessagesListener,
//     [socketEvents.MESSAGE_SEEN]: MessageListener,
//     [socketEvents.STARTED_TYPING]: handleStartTyping,
//     [socketEvents.STOPPED_TYPING]: handleStopTyping,
//   };

//   useSocketEvents(socket, eventHandler);

//   return (
//     <div className="w-full h-full grid grid-rows-12">
//       <div className="row-span-1">
//         <ChatHeader
//           selectedUser={selectedUser}
//           setSelectedUser={setSelectedUser}
//           setOpenDrawer={setOpenDrawer}
//           socket={socket}
//         />
//       </div>
//       <div className="row-span-9 overflow-auto">
//         <Messages
//           messages={data?.pages.flatMap((page) => page.data) || []}
//           isFetching={isFetching}
//           isFetchingNextPage={isFetchingNextPage}
//           fetchNextPage={fetchNextPage}
//           friendAvatar={selectedUser.avatarUrl}
//           session={session}
//           userTyping={userTyping}
//           hasNextPage={hasNextPage}
//         />
//       </div>
//       <div className="row-span-2">
//         <SendMessage
//           session={session}
//           socket={socket}
//           selectedUser={selectedUser}
//           setIamTyping={setIamTyping}
//           iamTyping={iamTyping}
//         />
//       </div>
//     </div>
//   );
// };

export default Chat;
