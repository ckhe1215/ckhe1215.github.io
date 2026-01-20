import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const frontmatter = data as PostFrontmatter;

  // 기본값 설정
  if (frontmatter.published === undefined) {
    frontmatter.published = true;
  }

  return {
    slug,
    frontmatter,
    content,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && post.frontmatter.published !== false)
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  return posts;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      tagsSet.add(tag);
    });
  });

  return Array.from(tagsSet).sort();
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.frontmatter.tags.includes(tag));
}

export function searchPosts(query: string): Post[] {
  if (!query.trim()) {
    return [];
  }

  const posts = getAllPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter((post) => {
    const titleMatch = post.frontmatter.title.toLowerCase().includes(lowerQuery);
    const contentMatch = post.content.toLowerCase().includes(lowerQuery);
    const descriptionMatch = post.frontmatter.description?.toLowerCase().includes(lowerQuery);

    return titleMatch || contentMatch || descriptionMatch;
  });
}
