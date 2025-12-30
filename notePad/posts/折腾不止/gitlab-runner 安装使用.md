---
title: gitlab-runner 安装使用
date: 2025-12-11 15:35:58
series:
categories:
tags:
slug:
description:
keywords:
featuredImage: https://random-api.czl.net/pic/czlwb
featuredImagePreview: https://random-api.czl.net/pic/czlwb
draft: false
push: true
comment: true
weight: 0
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromFeed: false
hiddenFromRelated: false
---


### 安装
```
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /srv/gitlab-runner/docker-machine-config:/root/.docker/machine \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e TZ=Asia/Shanghai \
  gitlab/gitlab-runner:latest
```

### 注册
```
docker run --rm -it -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner register
```

