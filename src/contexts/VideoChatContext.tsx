import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { socketEvents } from "@/constants";
import { useSocketEvents } from "@/hooks";
import { getLocalMedia, setupConnection } from "@/lib/utils";
import { Phone, PhoneOff } from "lucide-react";
import { createContext, useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "./SocketContext";

interface VideoChatContextProps {
  callUser: (userId: number) => void;
  endCall: () => void;
  isInCall: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  openDrawer: boolean;
  setOpenDrawer: (i: boolean) => void;
  openDialog: boolean;
  setOpenDialog: (i: boolean) => void;
  recipentUserDetails: {
    avatarUrl: string;
    id: number;
    username: string;
  } | null;
}

const VideoChatContext = createContext<VideoChatContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useVideoChat = () => useContext(VideoChatContext)!;

export const VideoChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socket = useSocket();
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [recipentUserDetails, setRecipentUserDetails] = useState<{
    avatarUrl: string;
    id: number;
    username: string;
  } | null>(null);

  /** ✅ Call another user */
  const callUser = async (userId: number) => {
    const { stream } = await getLocalMedia();
    setLocalStream(stream);

    setupConnection({
      peerConnectionRef,
      recipientId: userId,
      setRemoteStream,
      socket,
    });

    const pc = peerConnectionRef.current!;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit(socketEvents.CALL_USER, { recipientId: userId, offer });

    setOpenDrawer(false);
    setOpenDialog(true);
    setIsInCall(true);
    setRecipientId(userId);
  };

  /** ✅ Accept an incoming call */
  const acceptCall = async (id: number, offer: RTCSessionDescriptionInit) => {
    const { stream } = await getLocalMedia();
    setLocalStream(stream);

    setupConnection({
      peerConnectionRef,
      setRemoteStream,
      socket,
      recipientId: id,
    });

    const pc = peerConnectionRef.current!;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit(socketEvents.ANSWER_CALL, {
      recipientId: id,
      answer,
    });
    setRecipientId(id);
    setOpenDrawer(false);
    setOpenDialog(true);
    setIsInCall(true);
  };

  /** ✅ Decline an incoming call */
  const declineCall = (id: number) => {
    socket.emit(socketEvents.END_CALL, { recipientId: id });
    toast.dismiss();
    setRecipentUserDetails(null);
  };

  /** ✅ End an active call */
  const endCall = () => {
    socket.emit(socketEvents.END_CALL, { recipientId: recipientId });

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());

    setLocalStream(null);
    setRemoteStream(null);
    setIsInCall(false);
    setOpenDialog(false);
    setOpenDrawer(false);
    setRecipientId(null);
    setRecipentUserDetails(null);

    toast.success("Call Ended");
  };

  /** ✅ Handle incoming call */
  const handleIncomingCall = ({
    from,
    offer,
  }: {
    from: { avatarUrl: string; id: number; username: string };
    offer: RTCSessionDescriptionInit;
  }) => {
    toast(
      (t) => (
        <div className="w-[250px] h-28 flex flex-col space-y-5">
          <div className="w-full flex gap-3 items-center">
            <Avatar className="w-11 h-11 ring-2">
              <AvatarImage
                src={
                  from.avatarUrl ??
                  "https://avatars.githubusercontent.com/u/124599?v=4"
                }
                alt="User Avatar"
              />
            </Avatar>
            <p className="font-medium text-sm text-black">
              {from.username} is calling...
            </p>
          </div>
          <div className="w-full flex justify-around">
            <div
              className="w-28 flex items-center justify-center bg-green-600 p-2 rounded"
              onClick={() => {
                acceptCall(from.id, offer);
                setRecipentUserDetails(from);
                toast.dismiss(t.id);
              }}
            >
              <Phone size={25} className="text-white cursor-pointer" />
            </div>
            <div
              className="w-28 flex items-center justify-center bg-red-600 p-2 rounded"
              onClick={() => {
                declineCall(from.id);
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
  };

  /** ✅ Handle call accepted */
  const handleCallAccepted = async ({
    answer,
  }: {
    answer: RTCSessionDescriptionInit;
  }) => {
    const pc = peerConnectionRef.current;
    console.log(pc);

    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log(pc);
  };

  /** ✅ Handle ICE candidates */
  const handleIceCandidates = async ({
    candidate,
  }: {
    candidate: RTCIceCandidateInit;
  }) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  /** ✅ Event Handlers */
  const eventHandler = {
    [socketEvents.INCOMING_CALL]: handleIncomingCall,
    [socketEvents.CALL_ACCEPTED]: handleCallAccepted,
    [socketEvents.ICE_CANDIDATE]: handleIceCandidates,
    [socketEvents.CALL_ENDED]: endCall,
  };

  /** ✅ Listen for socket events */
  useSocketEvents(socket, eventHandler);

  return (
    <VideoChatContext.Provider
      value={{
        callUser,
        endCall,
        isInCall,
        localStream,
        remoteStream,
        openDrawer,
        setOpenDrawer,
        openDialog,
        setOpenDialog,
        recipentUserDetails,
      }}
    >
      {children}
    </VideoChatContext.Provider>
  );
};
