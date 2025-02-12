import { axiosInstance, server_url } from "@/constants";
import { CredentialResponse } from "@react-oauth/google";
import axios, { isAxiosError } from "axios";

const loginWithGoogleAPI = async ({
  credentials,
}: {
  credentials: CredentialResponse;
}) => {
  try {
    const res = await axios.post(
      `${server_url}/user/login-with-google`,
      {
        credentials: credentials,
      },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data);
    }
    throw error;
  }
};

const loginAPI = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const res = await axios.post(`${server_url}/user/login`, {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data);
    }
    throw error;
  }
};
const registerAPI = async (formData: FormData) => {
  try {
    const res = await axios.post(`${server_url}/user/register`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
const refreshAccessTokenAPI = async () => {
  try {
    const res = await axios.get(
      `${server_url}/user/refresh-token`,

      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);

    if (axios.isAxiosError(error)) {
      throw Error(error.response?.data?.message || "Failed to refresh token");
    }
  }
};
const validateAccessToken = async () => {
  try {
    const res = await axios.get(`${server_url}/user/validate-access-token`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Error(error.response?.data.success || "Failed to validate token");
    }
  }
};

const getSingleUserAPI = async (userId?: number) => {
  try {
    let url = `/user/get-user-details`;
    if (userId) {
      url += `?userId=${userId}`;
    }

    const res = await axiosInstance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const logoutAPI = async () => {
  try {
    const url = `/user/logout`;
    const res = await axiosInstance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const getUsersAPI = async ({ searchTerm }: { searchTerm: string }) => {
  try {
    let url = `/user/all-users`;
    if (searchTerm) {
      url += `?search=${searchTerm}`;
    }
    const res = await axiosInstance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const sendFriendRequestAPI = async ({ friendId }: { friendId: number }) => {
  try {
    const url = `/friends/add-friend`;

    const res = await axiosInstance.post(url, { friendId });
    return res?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
const HandleFriendRequestAPI = async ({
  friendShipId,
  action,
}: {
  friendShipId: number;
  action: string;
}) => {
  try {
    const url = `/friends/handle-friend-request`;

    const res = await axiosInstance.post(url, { friendShipId, action });
    return res?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const getFriendsAPI = async (username?: string, userId?: number) => {
  try {
    let url = `/user/friend-list`;
    if (username) {
      url += `?username=${username}`;
    }
    if (userId) {
      url += `?userId=${userId}`;
    }

    const res = await axiosInstance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const getRecommendedUsersAPI = async () => {
  try {
    const res = await axiosInstance.get("/friends/get-recommended-friends");
    return res.data?.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
const unFriendAPI = async (friendshipId: number) => {
  try {
    const res = await axiosInstance.delete(`/friends/unfriend/${friendshipId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
const editUserDataAPI = async (formData: FormData) => {
  try {
    const res = await axiosInstance.post(`/user/update-user-data`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const verifyUserAPI = async ({
  verification_code,
  otpToken,
}: {
  verification_code: string;
  otpToken: string;
}) => {
  try {
    const res = await axios.post(`${server_url}/user/verify`, {
      verification_code: verification_code,
      otpToken,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const changePasswordAPI = async ({
  current_password,
  new_password,
  isGoogleSignedIn,
}: {
  current_password?: string;
  new_password: string;
  isGoogleSignedIn?: boolean;
}) => {
  try {
    const res = await axiosInstance.post(`/user/change-password`, {
      current_password,
      new_password,
      isGoogleSignedIn,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const sendResetPasswordMailAPI = async (email: string) => {
  try {
    const res = await axiosInstance.post(`/user/send-reset-password-mail`, {
      email,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

const resetPasswordAPI = async ({
  otpToken,
  new_password,
}: {
  otpToken: string;
  new_password: string;
}) => {
  try {
    const res = await axiosInstance.post(`/user/reset-password`, {
      otpToken,
      new_password,
    });
    console.log(res, 287);

    return res.data.message;
  } catch (error) {
    console.log(error, 291);

    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Something went wrong");
    }
  }
};
export {
  changePasswordAPI,
  loginAPI,
  loginWithGoogleAPI,
  refreshAccessTokenAPI,
  validateAccessToken,
  getSingleUserAPI,
  logoutAPI,
  getUsersAPI,
  sendFriendRequestAPI,
  HandleFriendRequestAPI,
  getFriendsAPI,
  getRecommendedUsersAPI,
  registerAPI,
  unFriendAPI,
  editUserDataAPI,
  verifyUserAPI,
  sendResetPasswordMailAPI,
  resetPasswordAPI,
};
