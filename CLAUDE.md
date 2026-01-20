# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 blog application using the App Router pattern.

**Tech Stack:**
- Next.js 16 with App Router (`app/` directory)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui components

**Project Structure:**
- `app/` - Next.js App Router pages and layouts
  - `app/layout.tsx` - Root layout with metadata and Geist font configuration
  - `app/page.tsx` - Home page (displays all posts)
  - `app/[slug]/page.tsx` - Post detail page
  - `app/tags/page.tsx` - All tags listing page
  - `app/tags/[tag]/page.tsx` - Posts filtered by tag
  - `app/globals.css` - Global styles with Tailwind and CSS variables for theming
- `components/` - React components
  - `components/ui/` - shadcn/ui base components (card, badge, button, etc.)
  - `components/Header.tsx` - Site header with navigation
  - `components/PostCard.tsx` - Post card component (clickable, navigates to post detail)
  - `components/PostContent.tsx` - Markdown content renderer
  - `components/TagBadge.tsx` - Tag badge component (links to tag page)
- `content/posts/` - Markdown blog posts
- `lib/` - Utility functions
  - `lib/posts.ts` - Post data fetching (getAllPosts, getPostBySlug, getPostsByTag, getAllTags)
  - `lib/markdown.ts` - Markdown to HTML conversion with Shiki syntax highlighting
  - `lib/utils.ts` - General utilities (cn function for className merging)
- `types/` - TypeScript type definitions
  - `types/post.ts` - Post and PostFrontmatter interfaces

**Key Conventions:**
- Path alias: `@/*` maps to project root (e.g., `@/components/PostCard`)
- Dark mode: CSS variables with `prefers-color-scheme` media query
- Fonts: Geist Sans and Geist Mono from `next/font/google`

**Post Frontmatter Schema:**
```yaml
title: string       # Post title
date: string        # Publication date (YYYY-MM-DD)
description: string # Short description
tags: string[]      # Array of tags
published?: boolean # Optional, defaults to true
```

**Markdown Processing:**
- Uses unified/remark/rehype pipeline
- Shiki for syntax highlighting (github-dark/github-light themes)
- Supports multiple languages: js, ts, jsx, tsx, json, html, css, markdown, bash, python, rust, go
