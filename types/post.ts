export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  published?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}
