import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Hourglass, Search, UserRoundPlus, Loader2 } from "lucide-react";
import { getUsersAPI, sendFriendRequestAPI } from "@/APIs/authAPIs";
import Loader from "../ui/Loader";
import { Link } from "react-router";
import { userInterface } from "@/types/types";
import { Avatar, AvatarImage } from "../ui/avatar";
import toast from "react-hot-toast";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-term", debouncedSearchTerm],
    queryFn: () => {
      if (!debouncedSearchTerm) return [];
      return getUsersAPI({ searchTerm: debouncedSearchTerm });
    },
    enabled: !!debouncedSearchTerm,
  });

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  const { mutate: sendFriendRequestMutation } = useMutation({
    mutationFn: sendFriendRequestAPI,
    onMutate: ({ friendId }) => {
      setPendingRequests((prev) => [...prev, friendId]);
    },
    onSuccess: (_, { friendId }) => {
      toast.success("Friend Request Sent Successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["search-term"] });
      setPendingRequests((prev) => prev.filter((id) => id !== friendId));
    },
    onError: (_, { friendId }) => {
      toast.error("Failed to send friend request");
      setPendingRequests((prev) => prev.filter((id) => id !== friendId));
    },
  });

  function handleSendFriendRequest(friendId: number) {
    sendFriendRequestMutation({ friendId });
  }

  return (
    <div className="relative md:w-96">
      <Input
        placeholder="Search"
        className={`pr-10 text-black placeholder:text-white border border-gray-400 outline-none focus:bg-white focus:border-gray-400 bg-cardGray ${
          searchTerm && "bg-white"
        }`}
        onChange={handleSearch}
        value={searchTerm}
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
        size={20}
      />

      {(isLoading || data) && (
        <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded z-30 max-h-[220px] overflow-auto">
          {isLoading && <Loader />}
          {!isLoading && isError && (
            <p className="p-2 text-red-500">Error fetching users.</p>
          )}
          {!isLoading && data?.length > 0
            ? data.map((user: userInterface) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-2"
                >
                  <Link
                    to={`/profile/${user.id}`}
                    className="p-2 flex items-center gap-4 cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  >
                    <Avatar className="w-12 h-12 ring-2 ring-white">
                      <AvatarImage
                        src={user.avatarUrl || "https://github.com/shadcn.png"}
                        alt="User Avatar"
                        className="object-contain"
                      />
                    </Avatar>
                    <p className="font-medium text-sm text-black">
                      {user.username}
                    </p>
                  </Link>
                  <div className="flex items-center">
                    {user.friendshipStatus === "none" ? (
                      pendingRequests.includes(user.id) ? (
                        <Loader2
                          size={25}
                          className="animate-spin text-black"
                        />
                      ) : (
                        <UserRoundPlus
                          size={25}
                          className="cursor-pointer text-black"
                          onClick={() => handleSendFriendRequest(user.id)}
                        />
                      )
                    ) : user.friendshipStatus === "pending" ? (
                      <Hourglass size={25} className="text-black" />
                    ) : null}
                  </div>
                </div>
              ))
            : !isLoading && (
                <p className="p-2 text-gray-700">No users found.</p>
              )}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
