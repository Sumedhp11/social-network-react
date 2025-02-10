import axios from "axios";

const server_url = import.meta.env.VITE_BACKEND_URL;
const socket_url = import.meta.env.VITE_SOCKET_URL;
const axiosIntance = axios.create({
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
};
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    // Free STUN Servers (Google's public STUN)
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun.voipbuster.com:3478" },

    {
      urls: "relay1.expressturn.com:3478",
      username: "ef7S6M6U80AZBN01P9",
      credential: "VweYZ3NdXyTSUAuT",
    },
  ],
};

export { server_url, axiosIntance, socketEvents, socket_url, ICE_SERVERS };
