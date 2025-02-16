import { startStreamAPI } from "@/APIs/streamAPIs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSocket } from "@/contexts/SocketContext";
import { getLocalMedia } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { useSearchParams } from "react-router";

const LiveStreamPlayer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  let mediaRecorder: MediaRecorder | null = null;
  const socket = useSocket()
  const { mutate: startStreamMutate } = useMutation({
    mutationFn: startStreamAPI,
    onSuccess: (data) => {
      searchParams.set("streamId", data.data.streamId);
      setSearchParams(searchParams);
      toast.success("Stream Started Successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const startStreaming = async () => {
    const { stream } = await getLocalMedia();
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp8",
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.emit("stream-data", {
          streamId,
          chunk: event.data,
        });
      }
    };

    mediaRecorder.start(1000);
  };

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
          url=""
          controls
          playing
          width="100%"
          height="100%"
          style={{
            border: "1px solid white",
            borderRadius: "8px",
            background: "gray",
          }}
        />
      </div>

      <div className="flex items-center w-full py-3 px-3 gap-5">
        <Button
          className="bg-[#189FF2] hover:bg-blue-600"
          onClick={() => startStreamMutate()}
        >
          Start Stream
        </Button>
      </div>
    </Card>
  );
};

export default LiveStreamPlayer;
