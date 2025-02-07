import React, { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Input } from "../../ui/input";
import { Image as ImageIcon, Loader, Video } from "lucide-react";
import { Button } from "../../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addPostAPI } from "@/APIs/postAPIs";
import MediaViewer from "../../ui/MediaView";
import { userInterface } from "@/types/types";

const AddPostCard = ({ user }: { user: userInterface }) => {
  const queryClient = useQueryClient();
  const [postImage, setPostImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isImageSelected, setIsImageSelected] = useState(false);

  const { mutate: AddPost, isPending } = useMutation({
    mutationFn: addPostAPI,
    onSuccess: (data) => {
      toast.success(data.message, {
        position: "top-right",
      });
      setCaption("");
      setIsImageSelected(false);
      setPostImage(null);
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPostImage(file);
      setIsImageSelected(true);
    }
  };

  const handleCancel = () => {
    setPostImage(null);
    setIsImageSelected(false);
  };
  const handleAddpost = () => {
    if (!postImage || !caption) {
      return toast.error("Content or Caption Not Provided");
    }
    const data = new FormData();
    data.append("description", caption);
    data.append("content", postImage);
    AddPost(data);
  };

  return (
    <Card className="w-full rounded-xl pt-3 bg-cardGray border-none h-fit">
      <CardContent className="w-full">
        <div className="flex gap-3 items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={user?.avatarUrl || "https://github.com/shadcn.png"}
              alt="User Avatar"
            />
          </Avatar>
          <Input
            placeholder="What's Happening?"
            className="rounded-md placeholder:text-white text-white text-base font-normal border-none outline-none focus:border-white focus:outline-white bg-[#28343E] h-12"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          />
        </div>

        {isImageSelected && postImage && (
          <div className="w-full mt-5 pl-14">
            <MediaViewer postImage={postImage} />
            <div className="w-full flex justify-end mt-3">
              <div className="flex items-center gap-5">
                <Button
                  className="bg-white text-black rounded-lg hover:bg-white hover:text-black"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!caption || !postImage || isPending}
                  className="text-white bg-[#189FF2] hover:bg-blue-600 border-none w-20 rounded-lg"
                  onClick={handleAddpost}
                >
                  {isPending ? (
                    <div className="flex items-center gap-1">
                      <Loader className="animate-spin" size={15} />
                      <p className="text-sm font-semibold">Posting</p>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold">Post</p>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {!isImageSelected && (
          <div className="flex items-center mt-5 gap-5 pl-14">
            {/* Photo Picker */}
            <label
              htmlFor="image-picker"
              className="cursor-pointer rounded-3xl border border-[#2B3A45] w-28 flex justify-center items-center gap-3 py-2"
            >
              <ImageIcon
                size={25}
                className="text-[#20E79E]"
                strokeWidth={2.4}
              />
              <p className="text-sm text-white">Photo</p>
            </label>
            <input
              id="image-picker"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Video Picker */}
            <label
              htmlFor="video-picker"
              className="cursor-pointer rounded-3xl border border-[#2B3A45] w-28 flex justify-center items-center gap-3 py-2"
            >
              <Video size={25} className="text-[#4D97FF]" strokeWidth={2.4} />
              <p className="text-sm text-white">Video</p>
            </label>
            <input
              id="video-picker"
              type="file"
              accept="video/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPostCard;
