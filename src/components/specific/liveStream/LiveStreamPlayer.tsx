import { startStreamAPI } from "@/APIs/streamAPIs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { useSearchParams } from "react-router";
import { Socket } from "socket.io-client";

const LiveStreamPlayer = ({ socket }: { socket: Socket }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
console.log(socket);

  // @ts-ignore
  const [isStreamable, setIsStreamable] = useState(false);

  const { mutate: startStreamMutate, isPending } = useMutation({
    mutationFn: startStreamAPI,
    onSuccess: (data) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("userId", data.data.userId);
      newParams.set("streamId", data.data.streamId);
      setSearchParams(newParams);
      toast.success("Stream Started Successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="h-[85%] flex flex-col rounded-lg overflow-hidden bg-cardGray">
      <div className="w-full flex items-center px-3 py-3 gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
        </Avatar>
        <h1 className="text-base font-medium text-white">Sumedh Pawar</h1>
      </div>

      <div className="flex-1 px-3 py-3">
        <ReactPlayer
          url={""}
          controls
          playing={isStreamable}
          width="100%"
          height="100%"
          config={{
            file: {
              hlsOptions: {
                xhrSetup: (xhr: XMLHttpRequest) => {
                  xhr.withCredentials = true;
                },
              },
            },
          }}
          style={{
            border: "1px solid white",
            borderRadius: "8px",
            background: "gray",
          }}
          onError={(e) => console.error("ReactPlayer error:", e)}
        />
        {/* Hidden video element for local preview */}
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      </div>

      <div className="flex items-center w-full py-3 px-3 gap-5">
        <Button
          className="bg-[#189FF2] hover:bg-blue-600"
          onClick={() => startStreamMutate()}
          disabled={isPending || isStreamable}
        >
          {isPending
            ? "Starting..."
            : isStreamable
            ? "Streaming..."
            : "Start Stream"}
        </Button>
      </div>
    </Card>
  );
};

export default LiveStreamPlayer;
