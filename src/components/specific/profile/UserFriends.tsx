import { getFriendsAPI } from "@/APIs/authAPIs";
import Loader from "@/components/ui/Loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userInterface } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const UserFriends = ({ user_id }: { user_id: number }) => {
  const { data: friendsList, isLoading } = useQuery({
    queryKey: ["friends", user_id],
    queryFn: () => getFriendsAPI(undefined, user_id),
    staleTime: 0,
    gcTime: 0,
    initialData: [],
    refetchOnMount: true,
  });

  return (
    <div className="py-3 flex flex-col w-full">
      {isLoading ? (
        <Loader className="text-white" />
      ) : (
        <div className="space-y-5">
          {friendsList?.map((i: userInterface, index: number) => (
            <div
              key={i.friendId}
              className={`pb-3 ${
                index !== friendsList.length - 1
                  ? "border-b border-gray-600"
                  : ""
              }`}
            >
              <Link
                to={`/profile/${i.friendId}`}
                className="p-2 flex items-center gap-8 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={i.avatarUrl ?? "https://github.com/shadcn.png"}
                    alt={i.username}
                    className="object-cover"
                  />
                </Avatar>
                <p className="font-medium text-sm text-white">{i.username}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFriends;
