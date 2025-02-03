import UserCard from "@/components/specific/profile/UserCard";
import UserProfilePosts from "@/components/specific/profile/UserProfilePosts";
import { useParams } from "react-router";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  const parsedUserId = parseInt(userId!);
  return (
    <div className="w-full h-[90vh] flex flex-col">
      {!parsedUserId ? (
        <p className="text-red-500 p-4">User ID Not Provided</p>
      ) : (
        <>
          <div className="flex-none">
            <UserCard userId={parsedUserId} />
          </div>

          <div
            className="flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #333",
            }}
          >
            <UserProfilePosts userId={parsedUserId} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
