import { cn } from "@/lib/utils";

const StoryLoader = () => {
  return (
    <div className="flex flex-col items-center space-y-2 w-[4.3rem]">
      <div className="w-[4.3rem] h-[4.3rem] ring-2 ring-[#189FF2] relative flex shrink-0 overflow-hidden rounded-full">
        <div
          className={cn(
            "aspect-square h-full w-full bg-gray-700 relative overflow-hidden rounded-full",
            "before:absolute before:inset-0 before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent"
          )}
        ></div>
      </div>
    </div>
  );
};

export default StoryLoader;
