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


const addCommentAPI = async ({
  post_id,
  comment,
}: {
  post_id: number;
  comment: string;
}) => {
  try {
    const res = await axiosIntance.post(`/post/add-comment`, {
      postId: post_id,
      comment,
    });
    return res?.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const likePostAPI = async (post_id: number) => {
  try {
    const res = await axiosIntance.post(`/post/like-post`, {
      post_id,
    });
    return res?.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export {
  addPostAPI,
  getAllpostsAPI,
  getUserPostsAPI,
  addCommentAPI,
  likePostAPI,
};
