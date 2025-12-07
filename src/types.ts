export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  body: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  user: User;
}

export interface PaginatedPosts {
  data: Post[];
  meta: {
    totalCount: number;
  };
}
