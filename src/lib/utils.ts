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
      if (error.response && error.response.status === 401) {
        try {
          await refreshAccessTokenAPI();
          return axiosInstance(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
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
      console.log("ICE Candidate Generated:", event.candidate.candidate);
      socket?.emit(socketEvents.ICE_CANDIDATE, {
        recipientId,
        candidate: event.candidate,
      });
    } else {
      console.log("ICE Gathering Complete");
    }
  };

  pc.onicecandidateerror = (event) => {
    console.error("ICE Candidate Error:", event.errorText, event);
  };

  pc.ontrack = (event) => {
    if (event.streams && event.streams.length > 0) {
      console.log("🎥 Remote stream received:", event.streams[0]);
      setRemoteStream(new MediaStream(event.streams[0].getTracks()));
    } else {
      console.warn("⚠️ No remote stream found in event.");
    }
  };

  pc.onconnectionstatechange = () => {
    console.log("Connection State:", pc.connectionState);
  };

  pc.oniceconnectionstatechange = () => {
    console.log("ICE Connection State:", pc.iceConnectionState);
    if (pc.iceConnectionState === "failed") {
      console.error("❌ ICE Connection Failed! Retrying...");
      pc.restartIce();
    }
  };

  socket.on(socketEvents.ICE_CANDIDATE, (data) => {
    if (data.candidate) {
      console.log("ICE Candidate Received:", data.candidate);
      pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch((err) =>
        console.error("Error adding candidate:", err)
      );
    }
  });

  peerConnectionRef.current = pc;
  console.log("✅ Peer connection setup complete!");
};