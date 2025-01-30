import { useEffect } from "react";
import { useVideoChat } from "@/contexts/VideoChatContext";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const VideoChatComponent = () => {
  const { isInCall, localStream, remoteStream, declineCall } = useVideoChat();

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  return (
    <div className="w-full h-full p-4 flex flex-col items-center bg-gray-100 rounded-lg shadow-lg">
      <div className="flex gap-4 w-full h-full">
        {/* Local Video */}
        <div className="w-1/2 h-full border border-gray-300 rounded-lg overflow-hidden relative shadow-md">
          {localStream ? (
            <video
              ref={(ref) => {
                if (ref && localStream) {
                  ref.srcObject = localStream;
                }
              }}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-center text-gray-500">
              No Local Stream
            </div>
          )}
          <span className="absolute top-2 left-2 px-2 py-1 text-xs bg-gray-800 text-white rounded">
            You
          </span>
        </div>

        {/* Remote Video */}
        <div className="w-1/2 h-full border border-gray-300 rounded-lg overflow-hidden relative shadow-md">
          {remoteStream ? (
            <video
              ref={(ref) => {
                if (ref && remoteStream) {
                  ref.srcObject = remoteStream;
                }
              }}
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="w-14 h-14 ring-1">
                <AvatarImage
                  src={"https://avatars.githubusercontent.com/u/124599?v=4"}
                  alt="User Avatar"
                  className="object-cover"
                />
              </Avatar>
            </div>
          )}
          <span className="absolute top-2 left-2 px-2 py-1 text-xs bg-gray-800 text-white rounded">
            Remote
          </span>
        </div>
      </div>

      {/* Hang Up Button */}
      {isInCall && (
        <button
          onClick={declineCall}
          className="px-4 py-2 mt-4 text-white bg-red-600 rounded-lg shadow hover:bg-red-700 transition duration-200"
        >
          Hang Up
        </button>
      )}
    </div>
  );
};

export default VideoChatComponent;
