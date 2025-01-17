import { server_url } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { refreshAccessTokenAPI } from "@/APIs/authAPIs";
import Loader from "@/components/ui/Loader";

interface TokenContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
}
const TokenContext = createContext<TokenContextType | undefined>(undefined);

interface TokenProviderProps {
  children: React.ReactNode;
}

// Create Axios instance
export const api = axios.create({
  baseURL: server_url,
  withCredentials: true,
});

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Token refresh query
  const { isLoading: isPending } = useQuery({
    queryKey: ["refresh-token"],
    queryFn: () =>
      refreshAccessTokenAPI({ setIsAuthenticated, setAccessToken }),

    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessTokenAPI();
            if (newAccessToken) {
              setAccessToken(newAccessToken);
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              return api.request(error.config);
            }
          } catch (refreshError) {
            setIsAuthenticated(false);
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, navigate]);

  return (
    <TokenContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isAuthenticated,
        setIsAuthenticated,
        isPending,
      }}
    >
      {isPending ? <Loader /> : children}
    </TokenContext.Provider>
  );
};

export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
