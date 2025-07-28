import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useVideoChat } from "@/contexts/VideoChatContext";
import { useState } from "react";
import ReactPlayer from "react-player";

const VideoChatComponent = () => {
  const { isInCall, localStream, remoteStream, endCall, streamKey } =
    useVideoChat();
  const [isRemoteMain, setIsRemoteMain] = useState(true);

  const mainStream = isRemoteMain ? remoteStream : localStream;
  const pipStream = isRemoteMain ? localStream : remoteStream;
  const mainLabel = isRemoteMain ? "Remote" : "You";
  const pipLabel = isRemoteMain ? "You" : "Remote";

  return (
    <div
      className="w-full h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden"
      style={{ maxHeight: "100vh" }}
    >
      <div className="relative flex-1 ">
        <div className="w-full h-full rounded-xl overflow-hidden shadow-lg bg-gray-200 border border-gray-300 max-h-[350px]">
          {mainStream ? (
            <div className="w-full h-full pointer-events-none">
              <ReactPlayer
                key={`main-${isRemoteMain}-${streamKey}`}
                url={mainStream}
                playing
                muted={mainLabel === "You"}
                width="100%"
                height="100%"
                className="object-cover"
                playsinline
                controls={false}
                config={{
                  file: {
                    attributes: {
                      playsinline: true,
                      webkitPlaysinline: true,
                      controlsList: "nofullscreen nodownload noplaybackrate",
                    },
                  },
                }}
                style={{ pointerEvents: "none" }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-base font-medium">
              <Avatar className="w-20 h-20 ring-2 ring-gray-300">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/124599?v=4"
                  alt={`${pipLabel} Avatar`}
                  className="object-cover"
                />
              </Avatar>
            </div>
          )}
          <span className="absolute top-4 left-4 px-3 py-1 text-sm font-medium text-white bg-gray-500 rounded-full backdrop-blur-sm">
            {mainLabel}
          </span>
        </div>

        {pipStream && (
          <div
            className="cursor-pointer absolute bottom-7 right-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 transition-all duration-300 hover:scale-110"
            onClick={() => setIsRemoteMain((prev) => !prev)}
          >
            <div className="w-full h-full pointer-events-none">
              <ReactPlayer
                key={`pip-${isRemoteMain}-${streamKey}`}
                url={pipStream}
                playing
                muted={pipLabel === "You"}
                width="100%"
                height="100%"
                className="object-cover"
                playsinline
                controls={false}
                config={{
                  file: {
                    attributes: {
                      playsinline: true,
                      webkitPlaysinline: true,
                      controlsList: "nofullscreen nodownload noplaybackrate",
                    },
                  },
                }}
                style={{ pointerEvents: "none" }}
              />
            </div>
            <span className="absolute bottom-1 right-7 px-2 py-0.5 text-xs font-medium text-white bg-black/70 rounded-full backdrop-blur-sm">
              {pipLabel}
            </span>
          </div>
        )}
      </div>

      {isInCall && (
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex items-center justify-center gap-6">
          <Button
            onClick={endCall}
            className="px-6 py-2 rounded-lg font-semibold shadow-md bg-red-600 hover:bg-red-700 transition-all duration-200 text-white"
          >
            End Call
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoChatComponent;
