import { addCommentAPI, likePostAPI } from "@/APIs/postAPIs";
import Loader from "@/components/ui/Loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PostData } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageSquare } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router";

const PostCard = ({ post }: { post: PostData }) => {
  const [comment, setComment] = useState<string>("");

  const queryClient = useQueryClient();
  const { mutate: likeMutation, isPending } = useMutation({
    mutationFn: likePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const { mutate: commentMutation, isPending: isPendingComment } = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  function Likehandler() {
    likeMutation(post.id);
  }

  function CommentHandler() {
    commentMutation({ post_id: post.id, comment });
  }

  return (
    <div className="w-full rounded-xl pt-3 bg-cardGray border-none h-fit my-5">
      <Card className="w-full rounded-xl pt-3 bg-cardGray border-none h-fit">
        <CardContent className="w-full">
          {post.user ? (
            <Link to={`/profile/${post.user.id}`}>
              <div className="flex gap-3 items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={
                      post.user.avatarUrl
                        ? post.user.avatarUrl
                        : "https://github.com/shadcn.png"
                    }
                    alt="User Avatar"
                  />
                </Avatar>
                <h1 className="text-base text-white font-normal">
                  {post.user.username}
                </h1>
              </div>
            </Link>
          ) : null}

          <div className="pl-14 flex flex-col space-y-5">
            <h2 className="text-sm font-normal text-gray-400">
              {moment(post.createdAt).fromNow()}
            </h2>
            <p className="text-base font-medium text-white text-wrap w-full">
              {post.description}
            </p>

            {post.content && (
              <img
                src={post.content}
                alt="post-image"
                className="h-56 w-full object-contain rounded-xl border"
                width={400}
                height={900}
                loading="lazy"
              />
            )}

            <div className="w-full flex items-center gap-3">
              {/* Like button */}
              <div
                className="w-28 rounded-xl bg-[#2B3A45] flex items-center gap-2 justify-center cursor-pointer py-3"
                onClick={Likehandler}
              >
                <Heart
                  size={20}
                  className="text-white hover:scale-125 transform ease-out duration-300"
                />
                {isPending ? (
                  <Loader />
                ) : (
                  <p className="text-sm font-medium text-white">
                    ({post.likes.length})
                  </p>
                )}
              </div>

              {/* Comment Popover */}
              <Popover>
                <PopoverTrigger>
                  <div className="w-28 rounded-xl bg-[#2B3A45] flex items-center gap-2 justify-center py-3">
                    <MessageSquare size={20} className="text-white" />
                    <p className="text-sm font-medium text-white">
                      ({post.comments.length})
                    </p>
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  className="w-full max-w-7xl space-y-4 h-fit border border-black"
                  align="start"
                >
                  <div className="w-full flex items-center gap-3">
                    <Textarea
                      placeholder="Comment..."
                      className="h-10 resize-none"
                      rows={1}
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    />
                    <Button
                      className="px-4 h-10"
                      onClick={CommentHandler}
                      disabled={isPendingComment}
                    >
                      Comment
                    </Button>
                  </div>

                  {/* Comments section */}
                  {post.comments.length ? (
                    <ScrollArea className="h-60 rounded-md border">
                      {post.comments.map((comment) => (
                        <div className="w-full px-3 py-2" key={comment.id}>
                          <div className="w-full flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={
                                  comment.user.avatarUrl ||
                                  "https://github.com/shadcn.png"
                                }
                                alt="Comment User Avatar"
                              />
                            </Avatar>
                            <h3 className="text-base font-medium">
                              {comment.user.username}
                            </h3>
                          </div>

                          <div className="w-full pl-12 flex flex-col space-y-3">
                            <p className="text-gray-800 font-medium text-sm">
                              {moment(comment.createdAt).fromNow()}
                            </p>
                            <p className="text-black font-medium text-lg">
                              {comment.content}
                            </p>
                          </div>

                          <Separator className="w-full h-px bg-gray-600 my-4" />
                        </div>
                      ))}
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  ) : (
                    <p className="text-center text-gray-500">
                      No Comments Found
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCard;
