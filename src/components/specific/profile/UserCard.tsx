import { getSingleUserAPI } from "@/APIs/authAPIs";
import Loader from "@/components/ui/Loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

const UserCard = ({ userId }: { userId: number }) => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-data", userId],
    queryFn: () => getSingleUserAPI(userId),
  });
  
  return isLoading ? (
    <Loader />
  ) : (
    <div className="grid grid-cols-8 p-3 my-4">
      <div className="col-span-4 flex flex-col items-start">
        <div className="flex flex-col space-y-5 items-start ">
          <Avatar className="w-24 h-24 ring-2 ring-white ml-3">
            <AvatarImage
              src={
                userData.avatarUrl
                  ? userData?.avatarUrl
                  : "https://github.com/shadcn.png"
              }
              alt="User Avatar"
            />
          </Avatar>
          <div>
            <p className="text-white font-normal text-lg">
              {userData.username}
            </p>
            <p className="text-gray-300 font-normal">
              {userData.bio || "Not yet Set"}
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col max-h-20 justify-center">
        <p className="font-semibold text-base text-white text-center ">
          {userData?.friendships?.length}
        </p>
        <p className="text-gray-300 text-base text-center">Friends</p>
      </div>
      <div className="col-span-2 flex flex-col max-h-20 justify-center">
        <p className="font-semibold text-base text-white text-center">
          {userData?.posts?.length}
        </p>
        <p className="text-gray-300 text-base text-center">Posts</p>
      </div>
    </div>
  );
};

export default UserCard;
