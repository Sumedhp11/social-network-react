import { refreshAccessTokenAPI } from "@/APIs/authAPIs";
import { axiosInstance, ICE_SERVERS, socketEvents } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { MutableRefObject } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setupAxiosInterceptor = () => {
  axiosInstance.interceptors.response.use(
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

interface SetupConnectionProps {
  peerConnectionRef: MutableRefObject<RTCPeerConnection | null>;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  socket: Socket;
  recipientId: number;
}

export const getLocalMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return { stream };
  } catch (error) {
    toast.error("Camera/Microphone access is Required!");
    throw error;
  }
};

export const setupConnection = ({
  peerConnectionRef,
  socket,
  recipientId,
  setRemoteStream,
}: SetupConnectionProps) => {
  if (peerConnectionRef.current) {
    console.warn("⚠️ Closing existing peer connection...");
    peerConnectionRef.current.close();
  }

  const pc = new RTCPeerConnection(ICE_SERVERS);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket?.emit(socketEvents.ICE_CANDIDATE, {
        recipientId,
        candidate: event.candidate,
      });
    }
  };
  pc.ontrack = (event) => {
    if (event.streams && event.streams.length > 0) {
      console.log("🎥 Remote stream received:", event.streams[0]);

      // ✅ Update state instead of ref
      setRemoteStream(new MediaStream(event.streams[0].getTracks()));
    } else {
      console.warn("⚠️ No remote stream found in event.");
    }
  };

  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState === "failed") {
      console.error("❌ ICE Connection Failed! Retrying...");
      pc.restartIce();
    }
  };

  peerConnectionRef.current = pc;
  console.log("✅ Peer connection setup complete!");
};
