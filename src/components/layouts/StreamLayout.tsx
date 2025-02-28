import { useStreamSocket } from "@/contexts/LiveStreamSocketContext";
import LiveChats from "../specific/liveStream/LiveChats";
import LiveStreamPlayer from "../specific/liveStream/LiveStreamPlayer";

const StreamLayout = () => {
  const streamSocket = useStreamSocket();
  return (
    <div className="border w-full h-full flex items-center gap-5 px-7 py-4">
      <div className="w-[70%] h-full p-5">
        <LiveStreamPlayer socket={streamSocket} />
      </div>
      <div className="w-[30%] h-full p-5">
        <LiveChats />
      </div>
    </div>
  );
};

export default StreamLayout;
