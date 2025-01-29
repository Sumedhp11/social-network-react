import UserCard from "@/components/specific/profile/UserCard";
import UserProfilePosts from "@/components/specific/profile/UserProfilePosts";
import { useParams } from "react-router";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  const parsedUserId = parseInt(userId!);
  return (
    <div className="w-full h-full">
      {!parsedUserId ? (
        <p>userId Not Provided</p>
      ) : (
        <>
          <UserCard userId={parsedUserId} />
          <UserProfilePosts userId={parsedUserId} />
        </>
      )}
    </div>
  );
};

export default UserProfile;
