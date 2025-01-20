export interface userInterface {
  id: number;
  username: string;
  avatarUrl: string;
  friendshipStatus?: string;
  friendId?: number;
  chat: {
    id: number | null;
    last_message: string | null;
  };
}
export interface PostData {
  id: number;
  user_id: number;
  content?: string;
  description?: string;
  user: userInterface;
  createdAt: Date;
  updatedAt: Date;
  comments: [Comment];
  likes: [Like];
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
