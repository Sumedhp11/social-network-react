import { axiosInstance } from "@/constants";
import { isAxiosError } from "axios";

const getAllNotifications = async () => {
  try {
    const res = await axiosInstance.get(`/notification/get-notification`);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export { getAllNotifications };
