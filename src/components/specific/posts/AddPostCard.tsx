import { addPostAPI } from "@/APIs/postAPIs";
import { PostData, userInterface } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Loader, Video } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import MediaViewer from "../../ui/MediaView";
import { Link } from "react-router";

const AddPostCard = ({ user }: { user: userInterface }) => {
  const queryClient = useQueryClient();
  const [postImage, setPostImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [newPost, setNewPost] = useState<PostData | null>(null);

  const { mutate: AddPost, isPending } = useMutation({
    mutationFn: addPostAPI,
    onSuccess: (data) => {
      toast.success(data.message, { position: "top-right" });
      setCaption("");
      setIsImageSelected(false);
      setPostImage(null);

      setNewPost({
        id: data?.data.id,
        description: data?.data?.description,
        content: data.data.content, // Assuming this is the URL string from backend
        user_id: data.data.user_id,
        user: user,
        createdAt: data.data.createdAt || new Date().toISOString(),
        updatedAt: data.data.updatedAt || new Date().toISOString(), // Fixed typo
        likes: [],
        comments: [],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Failed to post. Try again.", { position: "top-right" });
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
    setNewPost(null);
  };

  const handleAddpost = () => {
    if (!postImage) {
      return toast.error("Please select an image or video");
    }
    if (!caption.trim()) {
      return;
    }
    const data = new FormData();
    data.append("description", caption);
    data.append("content", postImage);
    AddPost(data);
  };

  const getInitials = (username?: string) => {
    if (!username) return "U";
    const initials = username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials.slice(0, 2);
  };

  return (
    <Card className="w-full rounded-xl pt-3 bg-cardGray border-none h-fit">
      <CardContent className="w-full">
        {/* Post Input Section */}
        <div className="flex gap-3 items-center">
          <Link to={"/profile/" + user?.id}>
            <Avatar className="w-12 h-12 bg-[#28343E]">
              <AvatarImage
                src={user?.avatarUrl}
                alt={`${user?.username || "User"}'s Avatar`}
                className="object-cover"
              />
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Default Avatar"
                className="object-cover"
              />
              <AvatarFallback className="bg-[#28343E] text-white flex items-center justify-center text-lg font-semibold">
                {getInitials(user?.username)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Input
            placeholder="What's Happening?"
            className="rounded-md placeholder:text-white text-white text-base font-normal border-none outline-none focus:border-white focus:outline-white bg-[#28343E] h-12"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          />
        </div>

        {/* Media Selection Preview (Before Submission) */}
        {isImageSelected && postImage && !newPost && (
          <div className="w-full mt-5 pl-14">
            <MediaViewer postImage={postImage} />
            {isImageSelected && !caption.trim() && (
              <p className="text-red-500 text-sm font-medium mt-2">
                Please add a caption
              </p>
            )}
            <div className="w-full flex justify-end mt-3">
              <div className="flex items-center gap-5">
                <Button
                  className="bg-white text-black rounded-lg hover:bg-white hover:text-black"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!caption.trim() || !postImage || isPending}
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

        {/* Post Preview After Submission */}
        {newPost && (
          <div className="w-full mt-5 pl-14 border-t border-gray-700 pt-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 bg-[#28343E]">
                <AvatarImage
                  src={user?.avatarUrl}
                  alt={`${user?.username || "User"}'s Avatar`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#28343E] text-white flex items-center justify-center text-lg font-semibold">
                  {getInitials(user?.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white font-semibold">{user?.username}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(newPost.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-white mt-2">{newPost.description}</p>
            <div className="mt-3">
              <MediaViewer postImage={newPost.content!} />{" "}
              {/* Adjusted for URL */}
            </div>
            <Button
              className="mt-3 text-white bg-gray-700 hover:bg-gray-600"
              onClick={() => setNewPost(null)}
            >
              Add Another Post
            </Button>
          </div>
        )}

        {/* Media Selection Buttons */}
        {!isImageSelected && !newPost && (
          <div className="flex items-center mt-5 gap-5 pl-14">
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
