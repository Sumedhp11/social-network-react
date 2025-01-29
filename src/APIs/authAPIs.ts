import { axiosIntance, server_url } from "@/constants";
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

    const res = await axiosIntance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

const logoutAPI = async () => {
  try {
    const url = `/user/logout`;
    const res = await axiosIntance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

const getUsersAPI = async ({ searchTerm }: { searchTerm: string }) => {
  try {
    let url = `/user/all-users`;
    if (searchTerm) {
      url += `?search=${searchTerm}`;
    }
    const res = await axiosIntance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

const sendFriendRequestAPI = async ({ friendId }: { friendId: number }) => {
  try {
    const url = `/friends/add-friend`;

    const res = await axiosIntance.post(url, { friendId });
    return res?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
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

    const res = await axiosIntance.post(url, { friendShipId, action });
    return res?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

const getFriendsAPI = async ({ username }: { username: string }) => {
  try {
    let url = `/user/friend-list`;
    if (username) {
      url += `?username=${username}`;
    }
    const res = await axiosIntance.get(url);
    return res?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
export {
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
};
