import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

const SideBarCardSkeleton = () => {
  return (
    <div className="w-full flex justify-center">
      <Card className="bg-cardGray w-[95%] rounded-xl shadow-md border-none animate-pulse">
        <CardContent className="w-full h-full flex flex-col py-6 space-y-4">
          {/* Avatar Skeleton */}
          <div className="w-full flex justify-center">
            <div className="w-16 h-16 bg-gray-500 rounded-full"></div>
          </div>

          {/* User Info Skeleton */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-5 bg-gray-500 rounded"></div>
            <div className="w-32 h-4 bg-gray-400 rounded"></div>
          </div>

          {/* Friends and Posts Section Skeleton */}
          <div className="border-t border-b border-gray-400 flex justify-between items-center px-4 py-4">
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-8 h-5 bg-gray-500 rounded"></div>
              <div className="w-12 h-4 bg-gray-400 rounded mt-1"></div>
            </div>
            <Separator orientation="vertical" className="bg-gray-300" />
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-8 h-5 bg-gray-500 rounded"></div>
              <div className="w-12 h-4 bg-gray-400 rounded mt-1"></div>
            </div>
          </div>

          {/* Profile Link Skeleton */}
          <div className="w-full flex justify-center">
            <div className="w-24 h-5 bg-gray-400 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SideBarCardSkeleton;
