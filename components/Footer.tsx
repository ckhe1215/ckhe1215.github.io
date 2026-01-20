import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-6">
          <Link
            href="https://github.com/ckhe1215"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
            <span className="text-sm">GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/haeun-kim-2507a920b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
            <span className="text-sm">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
