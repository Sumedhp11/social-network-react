import { axiosIntance } from "@/constants";
import { isAxiosError } from "axios";

const getAllMessages = async ({
  chatId,
  page,
}: {
  chatId?: number | null;
  page: number;
}) => {
  try {
    if (!chatId) return;
    const res = await axiosIntance.get(
      `/chat/get-messages?chatId=${chatId}&page=${page}&limit=${10}`
    );
    return res?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export { getAllMessages };
