import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TagBadgeProps {
  tag: string;
  asLink?: boolean;
}

export function TagBadge({ tag, asLink = true }: TagBadgeProps) {
  const badge = (
    <Badge
      variant="secondary"
      className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
    >
      {tag}
    </Badge>
  );

  if (asLink) {
    return <Link href={`/tags/${tag}`}>{badge}</Link>;
  }

  return badge;
}
