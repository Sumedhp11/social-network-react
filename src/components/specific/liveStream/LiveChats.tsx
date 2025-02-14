import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

const LiveChats = () => {
  return (
    <Card className="h-[75%] flex flex-col rounded-lg overflow-hidden bg-cardGray">
      <div className="w-full flex items-center justify-center py-3 border-b">
        <h1 className="text-base font-medium text-white">Live Chats 🚀</h1>
      </div>
      <div className="flex-1 px-3 py-3 border">
        <div className="h-full border rounded-lg"></div>
      </div>
      <div className="py-3 px-3 flex items-center gap-3">
        <Input className="bg-white text-black font-medium " />{" "}
        <Button
          className="w-10 h-10 rounded-full bg-[#189FF2] hover:bg-blue-600 flex items-center justify-center"
          type="submit"
        >
          <SendHorizontal size={20} className="text-white" />
        </Button>
      </div>
    </Card>
  );
};

export default LiveChats;
