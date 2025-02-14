import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReactPlayer from "react-player";

const LiveStreamPlayer = () => {
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
        <Button className="bg-[#189FF2] hover:bg-blue-600">Start Stream</Button>
        {/* <Button></Button> */}
      </div>
    </Card>
  );
};

export default LiveStreamPlayer;
