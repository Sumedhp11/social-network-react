import { getSingleUserAPI } from "@/APIs/authAPIs";
import Loader from "@/components/ui/Loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis, KeyRound, UserPen } from "lucide-react";
import { useState } from "react";
import EditProfileForm from "../../forms/EditProfileForm";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import useUserId from "@/hooks";

const UserCard = ({ userId }: { userId: number }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [user_id] = useUserId("userId", 0);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-data", userId],
    queryFn: () => getSingleUserAPI(userId),
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-8 p-3 my-4 relative">
      {/* User Info Section */}
      <div className="col-span-4 flex flex-col items-start">
        <div className="flex flex-col space-y-5 items-start">
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
        <p className="font-semibold text-base text-white text-center">
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

      <div className="absolute right-1 top-1">
        <Popover open={openPopup} onOpenChange={setOpenPopup}>
          <PopoverTrigger>
            {user_id === userId ? (
              <Ellipsis size={27} className="text-white" />
            ) : null}
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-fit p-2">
            <Dialog
              open={openEditProfileDialog}
              onOpenChange={setOpenEditProfileDialog}
            >
              <DialogTrigger>
                <li className="list-none flex items-center gap-4 p-2 border-b border-gray-600 cursor-pointer hover:bg-gray-100">
                  <UserPen size={20} className="text-black" />
                  <p>Update Profile</p>
                </li>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <EditProfileForm
                  userData={userData}
                  setOpenDialog={setOpenEditProfileDialog}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={openResetPasswordDialog}
              onOpenChange={setOpenResetPasswordDialog}
            >
              <DialogTrigger>
                <li className="list-none flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-100">
                  <KeyRound size={20} className="text-black" />
                  <p>Change Password</p>
                </li>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <ChangePasswordForm
                  userData={userData}
                  setOpenDialog={setOpenResetPasswordDialog}
                />
              </DialogContent>
            </Dialog>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default UserCard;
