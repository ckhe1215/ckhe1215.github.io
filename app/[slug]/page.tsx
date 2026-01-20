import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { PostContent } from "@/components/PostContent";
import { TagBadge } from "@/components/TagBadge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다",
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.frontmatter.title}</h1>
          <time className="text-muted-foreground">
            {new Date(post.frontmatter.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <div className="flex gap-2 flex-wrap mt-4">
            {post.frontmatter.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </header>

        <Separator className="mb-8" />

        <PostContent content={content} />
      </article>
    </div>
  );
}
