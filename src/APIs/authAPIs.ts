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

const getSingleUserAPI = async () => {
  try {
    const url = `/user/get-user-details`;
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
};
