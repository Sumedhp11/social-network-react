import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { getFriendsAPI } from "@/APIs/authAPIs";
import NoDataFound from "./NoDataFound";
import Loader from "../ui/Loader";
import { userInterface } from "@/types/types";
import { Link } from "react-router";
import { Avatar, AvatarImage } from "../ui/avatar";

const FriendList = ({ userId }: { userId?: number | undefined }) => {
  const { data: friendsList, isLoading } = useQuery({
    queryKey: ["friends", userId],
    queryFn: () => getFriendsAPI(undefined, userId),
    staleTime: 0,
    gcTime: 0,
    initialData: [],
    refetchOnMount: true,
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full flex justify-center mt-5">
      <Card className="bg-cardGray w-[95%] rounded-xl shadow-md border-none">
        <CardContent className="w-full h-full flex flex-col py-6 space-y-4">
          <h2 className="text-white font-medium">
            FriendList ({friendsList?.length})
          </h2>

          {friendsList?.length === 0 ? (
            <NoDataFound text="No Friends" />
          ) : (
            friendsList?.map((i: userInterface) => (
              <div key={i.id}>
                <Link
                  to={`/profile/${i.friendId}`}
                  className="p-2 flex items-center gap-4 cursor-pointer"
                >
                  <Avatar className="w-12 h-12 ring-2 ring-white">
                    <AvatarImage
                      src={i.avatarUrl ?? "https://github.com/shadcn.png"}
                      alt={i.username}
                      className="object-cover"
                    />
                  </Avatar>
                  <p className="font-medium text-sm text-white">{i.username}</p>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendList;
