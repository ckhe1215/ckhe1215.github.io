import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse all tags.",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tags</h1>
        <p className="text-muted-foreground">
          {tags.length} {tags.length === 1 ? "tag" : "tags"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => {
          const count = getPostsByTag(tag).length;
          return (
            <Link key={tag} href={`/tags/${tag}`}>
              <Badge
                variant="secondary"
                className="text-base px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag} ({count})
              </Badge>
            </Link>
          );
        })}
      </div>

      {tags.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No tags yet.
        </p>
      )}
    </div>
  );
}
