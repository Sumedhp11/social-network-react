import { socketEvents } from "@/constants";
import { useSocketEvents } from "@/hooks/index";
import { Phone, PhoneOff } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/SocketContext";

interface VideoChatContextProps {
  callUser: (userId: number) => void;
  acceptCall: () => void;
  declineCall: () => void;
  isInCall: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  openVideoChat: boolean;
  setOpenVideoChat: (i: boolean) => void;
  openDrawer: boolean;
  setOpenDrawer: (i: boolean) => void;
}

const VideoChatContext = createContext<VideoChatContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useVideoChat = () => useContext(VideoChatContext)!;

export const VideoChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useSocket();

  const [isInCall, setIsInCall] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [openVideoChat, setOpenVideoChat] = useState(false);
  const [user, setUser] = useState<number | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const createMockStream = (): MediaStream => {
    const mockStream = new MediaStream();

    const createMockTrack = (kind: "video" | "audio"): MediaStreamTrack => {
      const canvas = document.createElement("canvas");
      const stream = canvas.captureStream();
      const track = stream.getTracks()[0];

      Object.defineProperties(track, {
        kind: { value: kind },
        label: {
          value: `mock${kind.charAt(0).toUpperCase() + kind.slice(1)}Track`,
        },
        id: {
          value: `mock${kind.charAt(0).toUpperCase() + kind.slice(1)}TrackId`,
        },
        enabled: {
          get: () => true,
          set: (val) => {
            console.log(`${kind} track enabled set to ${val}`);
          },
        },
        stop: {
          value: () => {
            console.log(`Mock ${kind} track stopped`);
          },
        },
      });

      return track;
    };

    mockStream.addTrack(createMockTrack("video"));
    mockStream.addTrack(createMockTrack("audio"));

    return mockStream;
  };

  const initializeConnection = useCallback(
    async (useMockStream = false) => {
      try {
        if (localStream) return;

        let localStream1;

        if (useMockStream) {
          localStream1 = createMockStream();
        } else {
          localStream1 = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        }

        setLocalStream(localStream1);

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket?.emit(socketEvents.ICE_CANDIDATE, {
              recipientId: user,
              candidate: event.candidate,
            });
          }
        };

        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        localStream1
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream1));

        peerConnectionRef.current = pc;
      } catch (error) {
        console.error("Error initializing connection:", error);
        toast.error("Error accessing media devices. Please check permissions.");
      }
    },
    [localStream, socket, user]
  );

  const callUser = async (userId: number) => {
    setUser(userId);
    if (!socket) return;

    setIsInCall(true);
    setOpenVideoChat(true);

    try {
      await initializeConnection(false);

      const offer = await peerConnectionRef.current!.createOffer();
      await peerConnectionRef.current!.setLocalDescription(offer);

      socket.emit(socketEvents.CALL_USER, { recipientId: userId, offer });
    } catch (error) {
      console.error("Error calling user:", error);
      toast.error("Error initiating call.");
      setIsInCall(false);
    }
  };

  const acceptCall = useCallback(async () => {
    if (
      !peerConnectionRef.current ||
      !peerConnectionRef.current.remoteDescription
    ) {
      console.error("No remote description to accept the call.");
      return;
    }

    try {
      setIsInCall(true);
      setOpenVideoChat(true);

      const answer = await peerConnectionRef.current.createAnswer();

      await peerConnectionRef.current.setLocalDescription(answer);

      socket?.emit(socketEvents.ANSWER_CALL, { recipientId: user, answer });
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Error accepting the call.");
      setIsInCall(false);
    }
  }, [socket, user]);

  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    setRemoteStream(null);
    setIsInCall(false);
  }, [localStream]);

  const declineCall = useCallback(() => {
    if (!socket || user === null) return;
    console.log("emitting Decline CallTracker", 193);

    setOpenVideoChat(false);
    socket.emit(socketEvents.END_CALL, { recipientId: user });
    cleanup();
  }, [socket, cleanup, user]);

  const handleIncomingCall = useCallback(
    async (data: {
      from: { avatarUrl: string; id: number; username: string };
      offer: RTCSessionDescriptionInit;
    }) => {
      if (!peerConnectionRef.current) {
        await initializeConnection();
      }

      try {
        await peerConnectionRef.current?.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );

        toast(
          (t) => (
            <div className="w-[250px] h-28 flex flex-col space-y-5">
              <div className="w-full flex gap-3 items-center">
                <Avatar className="w-11 h-11 ring-2">
                  <AvatarImage
                    src={
                      data.from.avatarUrl ??
                      "https://avatars.githubusercontent.com/u/124599?v=4"
                    }
                    alt="User Avatar"
                  />
                </Avatar>
                <p className="font-medium text-sm text-black">
                  {data.from.username} is calling...
                </p>
              </div>
              <div className="w-full flex justify-around">
                <div
                  className="w-28 flex items-center justify-center bg-green-600 p-2 rounded"
                  onClick={() => {
                    acceptCall();
                    toast.dismiss(t.id);
                  }}
                >
                  <Phone size={25} className="text-white cursor-pointer" />
                </div>
                <div
                  className="w-28 flex items-center justify-center bg-red-600 p-2 rounded"
                  onClick={() => {
                    declineCall();
                    toast.dismiss(t.id);
                  }}
                >
                  <PhoneOff size={25} className="text-white cursor-pointer" />
                </div>
              </div>
            </div>
          ),
          { duration: Infinity }
        );
      } catch (error) {
        console.error("Failed to handle incoming call:", error);
        toast.error("Error handling incoming call.");
      }
    },
    [acceptCall, declineCall, initializeConnection]
  );

  const handleEndCall = useCallback(() => {
    console.log("Worked End Call");

    cleanup();
    setOpenVideoChat(false);
    setIsInCall(false);
  }, [cleanup]);
  const eventHandler = {
    [socketEvents.INCOMING_CALL]: handleIncomingCall,
    [socketEvents.END_CALL]: handleEndCall,
  };
  useSocketEvents(socket, eventHandler);

  return (
    <VideoChatContext.Provider
      value={{
        callUser,
        acceptCall,
        declineCall,
        isInCall,
        localStream,
        remoteStream,
        setOpenVideoChat,
        openVideoChat,
        openDrawer,
        setOpenDrawer,
      }}
    >
      {children}
    </VideoChatContext.Provider>
  );
};

export default VideoChatProvider;
