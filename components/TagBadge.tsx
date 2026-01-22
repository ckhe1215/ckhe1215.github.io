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
      className="hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer rounded-lg px-3 py-1 text-xs font-medium"
    >
      {tag}
    </Badge>
  );

  if (asLink) {
    return <Link href={`/tags/${tag}`}>{badge}</Link>;
  }

  return badge;
}
