import { addCommentAPI, likePostAPI } from "@/APIs/postAPIs";
import MediaViewer from "@/components/ui/MediaView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useUserId} from "@/hooks";
import type { PostData } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Heart, MessageSquare, Send } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

const PostCard = ({ post }: { post: PostData }) => {
  const [comment, setComment] = useState<string>("");
  const [userId] = useUserId("userId", 0);
  const [likesCount, setLikesCount] = useState<number>(post.likes.length);
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like) => like.user_id === userId)
  );
  const [showComments, setShowComments] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: likeMutation } = useMutation({
    mutationFn: likePostAPI,
    onMutate: () => {
      setLikesCount((prev) => prev + (isLiked ? -1 : 1));
      setIsLiked((prev) => !prev);
    },
    onError: () => {
      setLikesCount(post.likes.length);
      setIsLiked(post.likes.some((like) => like.user_id === userId));
      toast.error("Failed to like the post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: commentMutation, isPending: isPendingComment } = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  function LikeHandler() {
    likeMutation(post.id);
  }

  function CommentHandler() {
    if (!comment.trim()) return;
    commentMutation({ post_id: post.id, comment });
  }

  const getInitials = (username?: string) => {
    if (!username) return "U";
    const initials = username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials.slice(0, 2);
  };

  return (
    <div className="w-full my-6">
      <Card className="w-full rounded-xl bg-cardGray border-none overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          {post.user ? (
            <Link
              to={`/profile/${post.user.id}`}
              className="flex items-center gap-3 group"
            >
              <Avatar className="w-10 h-10 ring-2 ring-[#3A4A58]/50 group-hover:ring-[#4A5A68] transition-all duration-300">
                <AvatarImage
                  src={post.user.avatarUrl || "https://github.com/shadcn.png"}
                  alt={`${post.user.username}'s Avatar`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#28343E] text-white">
                  {getInitials(post.user.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                  {post.user.username}
                </h1>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={10} className="mr-1" />
                  {moment(post.createdAt).fromNow()}
                </div>
              </div>
            </Link>
          ) : null}
        </div>

        {/* Content Section */}
        <CardContent className="p-0">
          {/* Description */}
          {post.description && (
            <div className="px-5 py-3">
              <p className="text-white leading-relaxed">{post.description}</p>
            </div>
          )}

          {/* Media Content */}
          {post.content && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer w-full relative group">
                  <div className="w-full overflow-hidden">
                    <MediaViewer postImage={post.content} />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"></div>
                </div>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[650px] bg-cardGray border-none ring-offset-0"
                closeClassName="text-white border-none hover:bg-[#3A4A58]"
              >
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <Avatar className="w-8 h-8 bg-[#28343E]">
                      <AvatarImage
                        src={
                          post.user?.avatarUrl ||
                          "https://github.com/shadcn.png"
                        }
                        alt="Avatar"
                      />
                      <AvatarFallback className="bg-[#28343E] text-white">
                        {getInitials(post.user?.username)}
                      </AvatarFallback>
                    </Avatar>
                    {post.user?.username}'s Post
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Posted {moment(post.createdAt).fromNow()}
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg overflow-hidden">
                  <MediaViewer postImage={post.content} />
                </div>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-b border-[#3A4A58]/50">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="bg-red-500 p-1 rounded-full">
                  <Heart size={10} fill="white" className="text-white" />
                </div>
                <span className="text-gray-400 text-sm ml-2">{likesCount}</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {post.comments.length}{" "}
              {post.comments.length === 1 ? "comment" : "comments"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 divide-x divide-[#3A4A58]/50 border-b border-[#3A4A58]/50">
            <button
              onClick={LikeHandler}
              className={`flex items-center justify-center gap-2 py-3 transition-colors ${
                isLiked ? "text-red-500" : "text-gray-400 hover:text-white"
              }`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              <span className="font-medium">Like</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-white transition-colors"
            >
              <MessageSquare size={18} />
              <span className="font-medium">Comment</span>
            </button>
          </div>

          {/* Comments Section (Expandable) */}
          {showComments && (
            <div className="px-5 py-3 border-b border-[#3A4A58]/50 space-y-4">
              {/* Comment Input */}
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Your Avatar"
                  />
                  <AvatarFallback className="bg-[#28343E] text-white">
                    {getInitials("You")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center bg-[#28343E] rounded-full overflow-hidden pr-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="bg-transparent border-none outline-none text-white px-4 py-2 w-full text-sm"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        CommentHandler();
                      }
                    }}
                  />
                  <button
                    onClick={CommentHandler}
                    disabled={!comment.trim() || isPendingComment}
                    className={`p-1 rounded-full ${
                      comment.trim()
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-gray-500"
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              {post.comments.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage
                          src={
                            comment.user.avatarUrl ||
                            "https://github.com/shadcn.png"
                          }
                          alt={`${comment.user.username}'s Avatar`}
                        />
                        <AvatarFallback className="bg-[#28343E] text-white">
                          {getInitials(comment.user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-[#28343E] rounded-2xl px-3 py-2">
                          <div className="font-medium text-white text-sm">
                            {comment.user.username}
                          </div>
                          <p className="text-gray-300 text-sm">
                            {comment.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 pl-2">
                          <span>{moment(comment.createdAt).fromNow()}</span>
                          <button className="hover:text-gray-300">Like</button>
                          <button className="hover:text-gray-300">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No comments yet</p>
                  <p className="text-xs mt-1">Be the first to comment</p>
                </div>
              )}

              {post.comments.length > 3 && (
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium w-full text-center">
                  View all {post.comments.length} comments
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCard;
