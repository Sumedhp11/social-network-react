import { refreshAccessTokenAPI } from "@/APIs/authAPIs";
import { axiosIntance } from "@/constants";
import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setupAxiosInterceptor = () => {
  axiosIntance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        try {
          await refreshAccessTokenAPI();
          return error.request(error.config);
        } catch (error) {
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
    }
  );
};
