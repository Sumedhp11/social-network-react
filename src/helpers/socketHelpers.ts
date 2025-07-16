import { cacheKeyStore } from "@/constants";
import { MessagesPage } from "@/hooks";
import { messageInterface } from "@/types/types";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

export function addNewMessageToCache({
  queryClient,
  chatId,
  message,
}: {
  queryClient: QueryClient;
  chatId?: number;
  message: messageInterface;
}) {
  queryClient.setQueryData<InfiniteData<MessagesPage>>(
    [cacheKeyStore.messages, chatId],
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page, index) =>
          index === 0 ? { ...page, data: [message, ...page.data] } : page
        ),
      };
    }
  );
}

export function generateMessage(
  message: string,
  userId: number,
  chatId?: number
) {
  const messageObj: messageInterface = {
    _id: crypto.randomUUID(),
    chatId: chatId,
    message: message,
    senderId: userId,
    sender: {
      avatarUrl: null,
      id: userId,
      username: "",
    },
    attachment: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    seen_at: null,
    status: "sent",
  };
  return messageObj;
}

export function mapDbMessageToTempMessage({
  chatId,
  message: savedMessage,
  tempId,
  queryClient,
}: {
  chatId?: number;
  message: messageInterface;
  tempId: string;
  queryClient: QueryClient;
}) {
  queryClient.setQueryData<InfiniteData<MessagesPage>>(
    [cacheKeyStore.messages, chatId],
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((msg) =>
            msg._id === tempId ? { ...savedMessage, status: "delivered" } : msg
          ),
        })),
      };
    }
  );
}

export function markMessageAsFailedWithCountdown({
  chatId,
  tempId,
  queryClient,
}: {
  chatId?: number;
  tempId: string;
  queryClient: QueryClient;
}) {
  const cacheKey = [cacheKeyStore.messages, chatId];

  queryClient.setQueryData<InfiniteData<MessagesPage>>(cacheKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: page.data.map((msg) =>
          msg._id === tempId ? { ...msg, status: "failed", countdown: 6 } : msg
        ),
      })),
    };
  });

  const intervalId = setInterval(() => {
    queryClient.setQueryData<InfiniteData<MessagesPage>>(
      cacheKey,
      (oldData) => {
        if (!oldData) return oldData;

        let shouldClearInterval = false;

        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          data: page.data
            .map((msg) => {
              if (msg._id !== tempId) return msg;

              const newCountdown = (msg.countdown ?? 1) - 1;

              if (newCountdown <= 0) {
                shouldClearInterval = true;
                return null;
              }

              return { ...msg, countdown: newCountdown };
            })
            .filter(Boolean) as messageInterface[],
        }));

        if (shouldClearInterval) clearInterval(intervalId);

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );
  }, 1000);
}
