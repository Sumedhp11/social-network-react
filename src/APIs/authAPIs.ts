import { server_url } from "@/constants";
import { CredentialResponse } from "@react-oauth/google";
import axios from "axios";

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

interface RefreshTokenResponse {
  accessToken: string;
}
const refreshAccessTokenAPI = async ({
  setIsAuthenticated,
  setAccessToken,
}: {
  setIsAuthenticated: (i: boolean) => void;
  setAccessToken: (value: string | null) => void;
}): Promise<string> => {
  try {
    const res = await axios.post<RefreshTokenResponse>(
      `${server_url}/user/refresh-token`,
      {},
      { withCredentials: true }
    );

    setAccessToken(res.data.accessToken);
    setIsAuthenticated(true);
  } catch (error) {
    console.error("Error refreshing access token:", error);

    if (axios.isAxiosError(error)) {
      setAccessToken(null);
      setIsAuthenticated(false);
      // Provide more meaningful error handling
      throw new Error(
        error.response?.data?.message || "Failed to refresh token"
      );
    }

    throw error;
  }
};

export { loginAPI, loginWithGoogleAPI, refreshAccessTokenAPI };
