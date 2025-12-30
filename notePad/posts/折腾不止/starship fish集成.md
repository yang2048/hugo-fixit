---
title: starship fish集成
date: 2025-12-11 15:33:10
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

# starship  fish 集成

# 设置默认
```
cat etcshells
chsh -s usrbinfish
```

# 安装 Starship
```
curl -sS httpsstarship.rsinstall.sh  sh
winget install --id Starship.Starship
安装fish
sudo apt install fish
```

# 配置：
```
# 创建配置文件
mkdir -p ~.config && touch ~.configstarship.toml
curl  httpsgist.githubusercontent.comyy43829f949c0934aef6c97cfb98d28f7cc8b9raw1bac33d4732b0f45a5fa71cdd8fc86c5ffbf4995starship.toml -o ~.configstarship.toml
starship preset pastel-powerline  ~.configstarship.toml
starship preset plain-text-symbols  ~.configstarship.toml

# Bash
echo 'eval $(starship init bash)'  ~.bashrc
# fish
echo 'starship init fish  source'  ~.configfishconfig.fish
# Powershell
echo 'Invoke-Expression (&starship init powershell)'  $PROFILE

```