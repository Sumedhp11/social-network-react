import { axiosIntance } from "@/constants";
import { isAxiosError } from "axios";

const getAllNotifications = async () => {
  try {
    const res = await axiosIntance.get(`/notification/get-notification`);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export { getAllNotifications };
