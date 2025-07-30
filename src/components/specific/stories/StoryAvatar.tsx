import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { userInterface } from "@/types/types";
import clsx from "clsx";
import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import StoryAddForm from "./StoryAddForm";
import StoryContent from "./StoryContent";
import { UserWithStories } from "./StoryScroller";

type StoryAvatarProps = {
  storyData: UserWithStories;
  index: number;
  userData: userInterface;
};

const StoryAvatar = ({ storyData, index, userData }: StoryAvatarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addStoryDialogOpen, setAddStoryDialogOpen] = useState(false);
  const isMyStory = index === 0;

  const avatarImage = isMyStory
    ? userData?.avatarUrl
    : storyData?.user?.avatarUrl;

  const username = isMyStory ? userData?.username : storyData?.user?.username;

  return (
    <>
      {isMyStory ? (
        <div className="relative group w-[4.3rem] flex flex-col items-center">
          <div
            className={clsx(
              "absolute z-10 flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl transition-all duration-300 scale-95 opacity-0 pointer-events-none",
              "group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto",
              "bg-white/90 dark:bg-neutral-900/90",
              "bottom-2"
            )}
          >
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition"
              title="Add Story"
              onClick={() => {
                setAddStoryDialogOpen(true);
                setDialogOpen(false);
              }}
            >
              <Plus size={16} />
            </button>
            {storyData?.stories.length > 0 && (
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center bg-green-500 text-white hover:bg-green-600 transition"
                title="View Story"
                onClick={() => setDialogOpen(true)}
              >
                <Eye size={16} />
              </button>
            )}
          </div>

          <div className="relative w-[4.3rem] h-[4.3rem]">
            <Avatar className="w-full h-full ring-2 ring-[#189FF2]">
              <AvatarImage src={avatarImage} alt="my-avatar" />
            </Avatar>
          </div>

          <p className="text-white font-normal text-base truncate overflow-hidden whitespace-nowrap w-full text-center">
            {username}
          </p>

          {storyData?.stories.length > 0 && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent
                className="sm:max-w-[650px] bg-cardGray border-none ring-offset-0 min-h-[350px]"
                closeClassName="text-white border-none hover:bg-[#3A4A58]"
              >
                <DialogHeader className="sr-only">
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <StoryContent
                  setDialogOpen={setDialogOpen}
                  storyData={storyData}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <Dialog
          open={dialogOpen && storyData?.stories.length > 0}
          // open={true}
          onOpenChange={setDialogOpen}
        >
          <DialogTrigger asChild>
            <div className="flex flex-col items-center space-y-2 w-[4.3rem] cursor-pointer">
              <Avatar className="w-[4.3rem] h-[4.3rem] ring-2 ring-[#189FF2]">
                <AvatarImage src={avatarImage} alt={`user-avatar-${index}`} />
              </Avatar>
              <p className="text-white font-normal text-sm truncate overflow-hidden whitespace-nowrap w-full text-center">
                {username}
              </p>
            </div>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[650px] bg-cardGray border-none ring-offset-0 min-h-[350px]"
            closeClassName="text-white border-none hover:bg-[#3A4A58]"
          >
            <DialogHeader className="sr-only">
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <StoryContent setDialogOpen={setDialogOpen} storyData={storyData} />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={addStoryDialogOpen} onOpenChange={setAddStoryDialogOpen}>
        <DialogContent
          className="sm:max-w-[650px] w-full bg-cardGray border-none ring-offset-0 min-h-[400px] p-6 rounded-lg shadow-lg"
          closeClassName="text-white hover:bg-[#3A4A58] rounded-full"
        >
          <DialogHeader className="sr-only">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <StoryAddForm setAddStoryDialogOpen={setAddStoryDialogOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryAvatar;
