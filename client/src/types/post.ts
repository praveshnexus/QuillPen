export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;

  author: Author;

  _count: {
    likes: number;
    comments: number;
  };
}