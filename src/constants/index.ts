import axios from "axios";

const server_url = import.meta.env.VITE_BACKEND_URL;
const axiosIntance = axios.create({
  baseURL: server_url,
  withCredentials: true,
});

export { server_url, axiosIntance };
