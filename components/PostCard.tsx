"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Post } from "@/types/post";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TagBadge } from "./TagBadge";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/tags/${tag}`);
  };

  return (
    <Link href={`/${post.slug}`}>
      <Card className="hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-2">
        <CardHeader>
          <CardTitle className="hover:text-primary transition-colors line-clamp-2 text-lg">
            {post.frontmatter.title}
          </CardTitle>
          <CardDescription className="text-sm">
            {new Date(post.frontmatter.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 leading-relaxed">
            {post.frontmatter.description}
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 flex-wrap">
          {post.frontmatter.tags.map((tag) => (
            <span key={tag} onClick={(e) => handleTagClick(e, tag)}>
              <TagBadge tag={tag} asLink={false} />
            </span>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
