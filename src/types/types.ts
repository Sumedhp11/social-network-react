export interface userInterface {
  id: number;
  username: string;
  bio?: string;
  avatarUrl: string;
  friendshipStatus?: string;
  friendships?: [];
  friendId?: number;
  email?: string;
  chat: {
    id: number | null;
    last_message: string | null;
  };
  posts?: [];
  friendshipId?: number;
}
export interface PostData {
  id: number;
  user_id: number;
  content?: string;
  description?: string;
  user?: userInterface;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[] | [];
  likes: Like[] | [];
}
export interface Comment {
  id: number;
  post: PostData;
  post_id: number;
  user: userInterface;
  user_id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Like {
  user_id: number;
}
export interface messageInterface {
  attachment: string[];
  chatId?: number;
  createdAt: Date;
  message: string;
  sender: { id: number; avatarUrl: string | null; username: string };
  senderId: number;
  updatedAt: Date;
  __v: number;
  _id: string | number;
  seen_at: Date | string | null;
  status?: "sent" | "delivered" | "failed";
  countdown?: number;
}