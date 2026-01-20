---
title: "ImagePullSecret 없이 K8s에서 AWS ECR 인증하기"
date: "2026-01-06"
description: "Credential Provider를 활용하여 ImagePullSecret 없이 이미지 pull 권한을 주는 방법을 공유합니다."
tags: ["Deployment"]
published: true
---

## 배경

![image.png](/posts/260106/infrastructure.png)

지금 사용중인 이 블로그의 배포를 위해 K8s (사실은 K3s) 클러스터를 구성하고, Argo CD를 활용해 자동으로 배포가 진행되도록 세팅하고 있었다.

위의 이미지와 같이, Github action이 코드가 변경될때마다 도커 이미지를 새로 빌드하고 K8s 파일을 수정하는 커밋을 추가하는 방식으로 구성했다. 따라서 K8s manifest의 이미지가 변경되면 Argo CD가 이를 인지하고 클러스터에 apply 하는 구조이다.

클러스터에 Argo CD를 띄우고 변경사항을 추가해 잘 되는지 확인해봤더니, pod에서 ImagePull 에러가 나는 것을 발견할 수 있었다.

## 원인

EC2에서 AWS CLI를 통해 ECR에 접근이 가능하더라도, K8s containerd 레벨에서 ECR에 접근하려면 별도의 권한이 필요하다.

```bash
kubectl create secret docker-registry ecr-secret \
  --docker-server=<YOUR_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region <AWS_REGION>) \
  --namespace=default
```

```yaml
spec:
  imagePullSecrets:
    - name: ecr-secret
```

Argo CD를 적용하기 전 K8s로 배포를 먼저 진행했는데, 이때 컨테이너에서 이미지를 Pull 할 수 있는 권한을 imagePullSecret을 통해 부여하고 있었다.

하지만 이 ECR Secret의 유효기간은 12시간으로, 전날 세팅해놓은 토큰이 만료되어 이미지 Pull이 불가능 하다는 것을 알게 되었다.

## 대안

imagePullSecret이 12시간 마다 만료된다면 어떻게 필요할때마다 토큰을 갱신할 수 있을까?

1. CronJob을 이용해 12시간마다 토큰 갱신
2. [ecr-credential-helper](https://github.com/awslabs/amazon-ecr-credential-helper)를 활용해 컨테이너 런타임이 Helper를 이용해 AWS SDK를 통해 GetAuthorizationToken API 호출하여 토큰을 획득
3. [Credential Provider](https://github.com/kubernetes/cloud-provider-aws)를 이용해 kubelet이 ECR 이미지 pull 전에 권한을 획득

1번 CronJob을 활용한 방법도 좋지만, 공식적인 해결책이 아닌 것 같아서 후순위로 두었다.

대신 2번을 활용해보려고 했으나, 해당 라이브러리는 도커를 지원하기 위한 프로그램으로, containerd 기반의 k3s 환경에서 사용하기는 어렵다는 것을 [k3s 이슈](https://github.com/k3s-io/k3s/discussions/3012)에서 확인하고 다른 방법을 모색하게 되었다. (해당 라이브러리는 docker daemon 수준에서 동작하는데, 이걸 모르고 containerd 환경에서 사용할 방법이 있을 줄 알아서 삽질이 길어졌다ㅜㅜ)

마지막으로 발견한 것이 [Credential Provider](https://github.com/k3s-io/k3s/discussions/3012)로, K8s 공식문서에도 포함되어있을 정도로 공식적인 해결 방법이다. Credential Provider는 컨테이너 단에서 동작하는 2번 방법과 달리 Kubelet단에서 동작한다. Credential Provider의 동작방식은 아래와 같다.

1. kubelet이 이미지 주소를 확인하고, credential-provider-config.yaml의 matchImages 패턴과 매칭되는지 확인한다.
2. 매칭되는 패턴이라면 ecr-credential-provider 바이너리를 실행하면서, stdin으로 이미지 정보를 전달한다.
3. ecr-credential-provider가 아래작업을 수행 후 stdout으로 credential을 전달한다.
   - EC2 IAM Role에서 임시 자격 증명 가져옴
   - AWS ECR GetAuthorizationToken API 호출
   - ECR 로그인 토큰 받음 (12시간 유효)
4. kubelet이 받은 자격 증명을 캐싱하고, containerd에 해당 자격 증명으로 이미지 pull을 요청한다.

## 해결 방법

### 사전준비

EC2에 IAM role 등록이 필요하다. ECR ReadOnly 권한을 가진 역할을 등록해주었다.

### 바이너리 설치

다음으로 `ecr-credential-provider` 바이너리를 설치해야한다. 공식적으로 제공되는 바이너리가 없어서, 권장되는 방법인 clone해서 go로 직접 빌드하는 방식을 사용했다.

```bash
git clone https://github.com/kubernetes/cloud-provider-aws.git
cd cloud-provider-aws
make ecr-credential-provider

sudo cp ./bin/ecr-credential-provider /usr/local/bin/
sudo chmod +x /usr/local/bin/ecr-credential-provider
```

### Credential Provider Config 생성

`/etc/kubernetes/credential-provider-config.yaml` 를 만들어 아래와 같이 작성해준다.

```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
providers:
  - name: ecr-credential-provider
    matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.com.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
    defaultCacheDuration: "12h"
    apiVersion: credentialprovider.kubelet.k8s.io/v1
```

이때 주의사항으로, 나는 k3s 환경이라 `/etc/rancher/k3s/`에 설정파일을 만들어주어서 한번 실패했는데, 무관하게 kubernetes 디렉토리를 참조하고 있으니 해당 디렉토리를 생성후 설정파일을 만들면된다.

### k3s 플래그 추가

`/etc/systemd/system/k3s.service` 에 아래 플래그들을 추가한다.

```bash
ExecStart=/usr/local/bin/k3s \
    server \
    --image-credential-provider-config=/etc/kubernetes/credential-provider-config.yaml \
    --image-credential-provider-bin-dir=/usr/local/bin
```

### 재시작 및 동작확인

```bash
sudo systemctl daemon-reload
sudo systemctl restart k3s
```

이후 새 pod을 띄워 이미지를 pull해보면 정상적으로 동작하는지 확인할 수 있다.

## 마무리

12시간 뒤에도 정상적으로 이미지를 받아올 수 있는 것을 확인했다!

정리해보면 ImagePullSecret 대신 Credential Provider를 사용하면 아래와 같은 장점이 있다.

- 토큰 갱신 자동화로 운영 부담 감소
- K8s 네이티브 방식으로 보안 강화
- 초기 설정 후 추가 관리 불필요
- kubelet 단 권한부여로 Pod마다 다른 credential 사용가능

처음엔 EC2에서 ECR에 접근 가능한데 왜 권한이 또 필요하지...? 하는 의문부터 시작했는데, 좋은 방법을 찾아 해결하는 과정에서 많이 배운 것 같아서 뿌듯하다!

---

### 참고자료

- [https://github.com/k3s-io/k3s/discussions/3012](https://github.com/k3s-io/k3s/discussions/3012)
- [https://kubernetes.io/docs/tasks/administer-cluster/kubelet-credential-provider/
  ](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-credential-provider/)
- [https://hyperconnect.github.io/2022/02/21/no-more-image-pull-secrets.html](https://hyperconnect.github.io/2022/02/21/no-more-image-pull-secrets.html)
