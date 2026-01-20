import { Comments } from "@/components/Comments";
import { PostContent } from "@/components/PostContent";
import { TagBadge } from "@/components/TagBadge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { markdownToHtml } from "@/lib/markdown";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      title: "Post Not Found",
    };
  }

  const publishedTime = new Date(post.frontmatter.date).toISOString();
  const url = `https://ckhe1215.github.io/${slug}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    authors: [{ name: "Haeun Kim" }],
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      siteName: "Haeun Kim's Blog",
      locale: "en_US",
      type: "article",
      publishedTime,
      authors: ["Haeun Kim"],
      tags: post.frontmatter.tags,
      images: [
        {
          url: "/blog-og-image.png",
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      creator: "@ckhe1215",
    },
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
          Back
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.frontmatter.title}</h1>
          <time className="text-muted-foreground">
            {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
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

      <Separator className="my-8" />

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <Comments />
      </section>
    </div>
  );
}
