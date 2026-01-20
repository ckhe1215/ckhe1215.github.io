# Blog

Next.js 기반의 개인 블로그입니다.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Theme**: next-themes (다크모드 지원)
- **Syntax Highlighting**: Shiki

## Features

- 마크다운 기반 블로그 포스트
- 태그 기반 포스트 분류
- 다크모드 지원 (시스템 설정 기본값)
- 반응형 디자인
- 코드 구문 강조 (Shiki)

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈페이지 (포스트 목록)
│   ├── [slug]/             # 포스트 상세 페이지
│   └── tags/               # 태그 페이지
├── components/             # React 컴포넌트
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── Header.tsx          # 헤더 (네비게이션, 언어/테마 토글)
│   ├── PostCard.tsx        # 포스트 카드
│   ├── ThemeToggle.tsx     # 다크모드 토글
│   ├── LanguageToggle.tsx  # 언어 전환
│   └── ThemeProvider.tsx   # 테마 프로바이더
├── content/posts/          # 마크다운 블로그 포스트
├── lib/                    # 유틸리티 함수
└── types/                  # TypeScript 타입 정의
```

## Writing Posts

`content/posts/` 디렉토리에 마크다운 파일을 추가하세요.

```markdown
---
title: 포스트 제목
date: 2024-01-01
description: 포스트 설명
tags: [태그1, 태그2]
published: true
---

포스트 내용...
```
