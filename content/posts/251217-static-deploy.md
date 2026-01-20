---
title: "S3 + CloudFront를 활용한 정적 사이트 배포"
date: "2025-12-17"
description: "AWS free tier로 S3와 CloudFront를 활용한 정적 사이트를 배포하는 실습을 해봅니다."
tags: ["Deployment"]
published: true
---

최근 구름톤에 참여하면서 docker, k8s, jenkins, argo 등으로 프로젝트를 배포하고 CI/CD 파이프라인까지 구축하는 경험을 했다. 사실 프론트엔드 개발자들은 DS 특강 때문에 인프라 특강을 듣지 못해서, 백엔드 개발자분이 많이 도와주셨다.

인프라 특강 자료를 보면서 슬쩍 공부해보니 회사 배포 환경이랑 굉장히 비슷하다는 생각이 들었다. 회사에서는 항상 DevOps팀이 세팅해준 환경에서 버튼만 눌러 배포했는데, 실제로 어떻게 구성되는지 궁금했다. 이번 기회에 프론트엔드 배포 프로세스를 직접 경험해보고 싶어졌다.

개인 프로젝트는 주로 Vercel로 배포했었는데, 안에서 무슨 일이 일어나고 있는지 궁금하니 이번엔 직접 AWS에 배포해보려고 한다. 일단 S3 + CloudFront로 정적 사이트 배포부터 시작하고, 나중엔 EC2에 SSR 페이지 배포하는 것까지 실습해볼 예정이다.

## S3에 정적 사이트 업로드

일단 클로드코드의 도움을 받아 10분만에 블로그 하나를 완성했다. 해당 블로그는 마크다운 파일의 포스트를 HTML로 바꿔서 보여준다.

![image.png](/posts/251217/image.png)

빌드 해보니 모든 페이지가 정적 페이지임을 확인할 수 있었다.

![image.png](/posts/251217/image2.png)

AWS에 들어가 S3 버킷을 하나 만든 뒤, 정적 웹 사이트 호스팅을 활성화해준다.

- 인덱스 문서(index.html)과 오류 문서(404.html)을 지정해주었다.

![image.png](/posts/251217/image3.png)

이제 next 프로젝트에서 빌드 결과물을 S3에 올려보자.

빌드 결과물이 out 폴더에 떨어질 수 있도록 `next.config.js`에 아래와 같이 output 옵션을 추가해준다.

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

이후 빌드를 돌리면 이렇게 결과물이 생성된 것을 확인할 수 있다.

![image.png](/posts/251217/image4.png)

이제 콘솔에서 해당 파일을 S3로 업로드 해주자.

```bash
aws s3 sync out/ s3://bucket-name
```

이때 `aws configure`로 액세스 키를 주기 위해서, IAM에 사용자와 그룹을 생성하고 정책으로 s3에 get, put만 할 수 있는 권한을 주어 액세스 키를 생성하려고 했는데, `aws login` 을 쓰라는 경고가 떠서 로그인 해서 일단 루트 권한으로 작업했다.

## CloudFront에서 배포하기

이제 CloudFront에 가서 배포를 생성해주자.

원본 도메인은 방금 만든 S3 버킷으로 하고, 원본 액세스를 `원본 액세스 제어 설정(권장)` 으로 해주고, OAC를 새로 만든다.

이 때 정책을 복사할 수 있는 버튼이 생기는데, 그대로 복사해서 S3 권한에 붙여준다.

S3 퍼블릭 액세스는 막아두었지만 CF에서 버킷에 접근할 수 있도록!

![image.png](/posts/251217/image5.png)

이후 CloudFront 오류페이지를 설정해준다. 이렇게 하면 항상 index.html로 떨어져서 SPA 라우팅이 가능해진다.

![image.png](/posts/251217/image6.png)

야호! cdn 주소로 접근하면 블로그가 뜨는 것을 확인할 수 있다!

![image.png](/posts/251217/image7.png)

## Github Actions로 자동 배포 설정

Git에 푸시되면 알아서 빌드하고 배포되도록 github actions를 세팅해보자.

일단 IAM에 사용자를 만들어 준 뒤, 아래와 같은 정책을 만들어 권한을 준다. 이후 액세스 키와 시크릿 키를 만들어 잘 복사해두자.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

이제 github로 넘어가서 Actions secrets and variables에 아래 값들을 등록하자

![image.png](/posts/251217/image8.png)

그리고 `./github/workflows/deploy.yml` 을 아래와 같이 작성하면 완성!

```yaml
name: Deploy to S3

on:
  push:
    branches:
      - main # main 브랜치에 푸시할 때 자동 배포

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. 코드 체크아웃
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Node.js 설정
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      # 3. 의존성 설치
      - name: Install dependencies
        run: npm ci

      # 4. Next.js 빌드
      - name: Build Next.js
        run: npm run build

      # 5. AWS 자격증명 설정
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      # 6. S3에 업로드
      - name: Deploy to S3
        run: |
          aws s3 sync out/ s3://${{ secrets.S3_BUCKET }} --delete

      # 7. CloudFront 캐시 무효화
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

이제 푸시하면 액션이 돌아가고, s3에 업로드된 파일들이 바뀌면서 재배포 되는 것을 확인할 수 있다!

![image.png](/posts/251217/image9.png)

## 커스텀 도메인 연결

마지막으로, 도메인을 사서 붙여보자. 나는 GoDddy에서 마음에 드는 도메인을 구매해두었다.

DNS 서비스로는 route53을 이용해서, route53에서 구매한 도메인으로 레코드를 만들었다.

레코드를 만들면 NS 주소를 받을 수 있는데, 이걸 GoDaddy에 등록해준다.

![image.png](/posts/251217/image10.png)

CloudFront에 해당 도메인을 등록하기 위해서는 ACM(AWS Certificate Manager) 인증서가 필요하다.

참고로 ACM은 꼭 미국(버지니아 북부) 리전에서 만들어야한다! 아시아 리전에서 했더니 cloudFront에서 인증서 목록을 불러오지 못하는 문제가 있었다.

인증서를 발급 받은 후 Route 53에서 레코드 생성을 눌러주자.

![image.png](/posts/251217/image11.png)

자동으로 생성된 레코드 외에 별칭 레코드를 추가로 만들어서 cdn 주소를 연결해주었다.

![image.png](/posts/251217/image12.png)

정말 마지막으로! CloudFront로 돌아가서, 대체도메인과 인증서를 등록하면 끝이다!

![image.png](/posts/251217/image13.png)

30분 정도 기다리니, 등록한 도메인으로 접속이 가능해졌다!
