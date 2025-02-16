import { axiosInstance, server_url } from "@/constants";
import { isAxiosError } from "axios";

const startStreamAPI = async () => {
  try {
    const res = await axiosInstance.post(`${server_url}/stream/start-stream`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
};

export { startStreamAPI };
