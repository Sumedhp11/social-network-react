import { userInterface } from "@/types/types";
import { Link } from "react-router";
import SideBarCardSkeleton from "../specific/SideBarCardSkeleton";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

const Sidebar = ({
  userData,
  isLoading,
}: {
  userData: userInterface;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <SideBarCardSkeleton />
  ) : (
    <div className="w-full flex justify-center mt-5">
      <Card className="bg-cardGray w-[95%] rounded-xl shadow-md border-none">
        <CardContent className="w-full h-full flex flex-col py-6 space-y-4">
          {/* Avatar */}
          <div className="w-full flex justify-center">
            <Avatar className="w-16 h-16 ring-2 ring-white">
              <AvatarImage
                src={userData?.avatarUrl || "https://github.com/shadcn.png"}
                alt="User Avatar"
              />
            </Avatar>
          </div>

          {/* User Info */}
          <p className="text-center text-lg font-semibold text-white">
            {userData?.username}
          </p>
          <p className="text-center font-medium text-sm text-gray-300">
            {userData?.bio || "Not Yet Set"}
          </p>

          {/* Friends and Posts Section */}
          <div className="border-t border-b border-gray-400 flex justify-between items-center px-4 py-4">
            <div className="w-1/2 flex flex-col items-center">
              <p className="font-semibold text-white">
                {userData?.friendships?.length}
              </p>
              <p className="text-gray-300 text-sm">Friends</p>
            </div>
            <Separator orientation="vertical" className="bg-gray-300" />
            <div className="w-1/2 flex flex-col items-center">
              <p className="font-semibold text-white">
                {userData?.posts?.length}
              </p>
              <p className="text-gray-300 text-sm">Posts</p>
            </div>
          </div>

          {/* Profile Link */}
          <Link
            to={`/profile/${userData.id}`}
            className="text-center font-semibold text-[#189FF2] transition-colors"
          >
            My Profile
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
