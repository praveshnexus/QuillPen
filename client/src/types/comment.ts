export interface CommentUser {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;

  user: CommentUser;
}