import { axiosIntance } from "@/constants";
import { isAxiosError } from "axios";

const addPostAPI = async (formdata: FormData) => {
  try {
    const res = await axiosIntance.post(`/post/add-post`, formdata);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const getAllpostsAPI = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const res = await axiosIntance.get(
      `/post/get-post?page=${page}&limit=${limit}`
    );
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

const getUserPostsAPI = async ({ userId }: { userId: number }) => {
  try {
    const res = await axiosIntance.get(`/user/get-user-posts/${userId}`);
    console.log(res.data);

    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
export { addPostAPI, getAllpostsAPI, getUserPostsAPI };
