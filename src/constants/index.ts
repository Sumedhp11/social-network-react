import axios from "axios";

const server_url = import.meta.env.VITE_BACKEND_URL;
const socket_url = import.meta.env.VITE_SOCKET_URL;
const stream_server_url = import.meta.env.VITE_STREAM_SERVER_URL;
const axiosInstance = axios.create({
  baseURL: server_url,
  withCredentials: true,
});

const socketEvents = {
  JOINED: "JOINED",
  EXITED: "EXITED",
  NEW_MESSAGE: "NEW_MESSAGE",
  NEW_MESSAGE_ALERT: "NEW_MESSAGE_ALERT",
  STARTED_TYPING: "STARTED_TYPING",
  STOPPED_TYPING: "STOPPED_TYPING",
  MESSAGE_SEEN: "MESSAGE_SEEN",
  CALL_USER: "CALL_USER",
  ANSWER_CALL: "ANSWER_CALL",
  ICE_CANDIDATE: "ICE_CANDIDATE",
  END_CALL: "END_CALL",
  CALL_ACCEPTED: "CALL_ACCEPTED",
  INCOMING_CALL: "INCOMING_CALL",
  CALL_ENDED: "CALL_ENDED",
  STREAM_VIDEO: "STREAM_VIDEO",
  END_STREAM: "END_STREAM",
};
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:119.18.55.92:3478" },
    {
      urls: "turn:119.18.55.92:3478",
      username: "bn_turn",
      credential: "bn_2_0",
    },
  ],
};

export {
  server_url,
  axiosInstance,
  socketEvents,
  socket_url,
  ICE_SERVERS,
  stream_server_url,
};
