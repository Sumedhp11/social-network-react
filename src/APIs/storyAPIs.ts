import { axiosInstance } from "@/constants";
import { isAxiosError } from "axios";

const getAllStoryAPI = async () => {
  try {
    const res = await axiosInstance.get(`/story/get-stories`);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
const addStoryAPI = async (formdata: FormData) => {
  try {
    const res = await axiosInstance.post(`/story/create`, formdata);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export { getAllStoryAPI, addStoryAPI };
