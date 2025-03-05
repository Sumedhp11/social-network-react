import axios from "axios";

const server_url = import.meta.env.VITE_BACKEND_URL;
const socket_url = import.meta.env.VITE_SOCKET_URL;
const stream_server_url = import.meta.env.VITE_STREAM_SERVER_URL;
const turn_server_url = import.meta.env.VITE_TURN_SERVER_URL;
const turn_server_username = import.meta.env.VITE_TURN_SERVER_USERNAME;
const turn_server_password = import.meta.env.VITE_TURN_SERVER_PASSWORD;

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
    {
      urls: [
        // `${turn_server_url}?transport=udp`,
        `${turn_server_url}`,
      ],
      username: turn_server_username,
      credential: turn_server_password,
    },
  ],
  iceTransportPolicy: "relay",
};

export {
  server_url,
  axiosInstance,
  socketEvents,
  socket_url,
  ICE_SERVERS,
  stream_server_url,
};
