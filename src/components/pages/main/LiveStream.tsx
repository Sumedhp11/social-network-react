import LiveChats from "@/components/specific/liveStream/LiveChats";
import LiveStreamPlayer from "@/components/specific/liveStream/LiveStreamPlayer";
import { useStreamSocket } from "@/contexts/LiveStreamSocketContext";

const LiveStream = () => {
  const socket = useStreamSocket();
  return (
    <div className="border w-full h-full flex items-center gap-5 px-7 py-4">
      <div className="w-[70%] h-full p-5">
        <LiveStreamPlayer socket={socket} />
      </div>
      <div className="w-[30%] h-full p-5">
        <LiveChats />
      </div>
    </div>
  );
};

export default LiveStream;
