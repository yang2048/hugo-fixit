---
title: Termius pro 通用破解
date: 2025-12-11 15:00:34
series:
categories:
  - 折腾不止
tags:
slug:
description:
keywords:
featuredImage: https://random-api.czl.net/pic/czlwb
featuredImagePreview: 
draft: false
push: true
comment: true
weight: 0
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromFeed: false
hiddenFromRelated: false
---

> 注意： 这里不是破解Termius服务器，而是破解一些本地termius的功能， 比如隧道跳板机等，xshell也有类似功能，但是xshell没有linux客户端，

参考

[https://github.com/h3110w0r1d-y/termius-cracked](https://github.com/h3110w0r1d-y/termius-cracked)

[https://www.52pojie.cn/thread-1860682-1-1.html](https://www.52pojie.cn/thread-1860682-1-1.html)

### 汉化补丁

[ArcSurge/Termius-Pro-zh_CN: 本地Termius Pro汉化](https://github.com/ArcSurge/Termius-Pro-zh_CN)

### 8.11.0下载地址

> 版本8.12以后有变更不支持，适用8.11.0及之前版本

```bash
git clone https://aur.archlinux.org/v.git
```

这里提供一下termius 8.11.0的snap地址

```yaml
https://api.snapcraft.io/api/v1/snaps/download/WkTBXwoX81rBe3s3OTt3EiiLKBx2QhuS_186.snap
```

只需要termius 8.11.0 的asar文件可以从这里下载，下载后改名为app.asar即可不需要解压

```yaml
https://www.hao.kim/upload/app.asar-8.11.0.zip
```

构建文件

```yaml
https://aur.archlinux.org/cgit/aur.git/tree/PKGBUILD?h=termius
```

安装squashfs

```bash
sudo apt update
sudo apt install squashfs-tools
#解压snap文件
mkdir extracted_snap
unsquashfs -d extracted_snap/ WkTBXwoX81rBe3s3OTt3EiiLKBx2QhuS_186.snap
```

### **安装npm，asar**

```bash
#这里为ubuntu或者debian
# centos使用yum -y install npm
sudo apt -y install npm

sudo npm config set registry https://registry.npmmirror.com --global
sudo npm install -g asar
```

### 解压app.asar

linux版的目录为 /opt/Termius/resources Mac版的目录为 /Applications/Termius.app/Contents/Resources/ Windows 目录为 C:\\Users\\Administrator\\AppData\\Local\\Programs\\Termius\\resources

```bash
cd /opt/Termius/resources
sudo asar extract app.asar ./app  # 修改完不需要重新打包
sudo mv app.asar app.asar.bak  # 留个备份，或者直接rm
sudo rm app-update.yml  # 防止自动更新,这个文件不一定有
```

### 修改app/js/background-process.js

> v9.85 版以上路径为 `app\background-process\assets\main-*.js`

搜索

```js
await this.api.bulkAccount
```

将下面的进行替换

```js
const e=await this.api.bulkAccount();
```

修改为

```js
var e=await this.api.bulkAccount();
e.account.pro_mode=true;
e.account.need_to_update_subscription=false;
e.account.current_period={
    "from": "2022-01-01T00:00:00",
    "until": "2099-01-01T00:00:00"
};
e.account.plan_type="Premium";
e.account.user_type="Premium";
e.student=null;
e.trial=null;
e.account.authorized_features.show_trial_section=false;
e.account.authorized_features.show_subscription_section=true;
e.account.authorized_features.show_github_account_section=false;
e.account.expired_screen_type=null;
e.personal_subscription={
    "now": new Date().toISOString().slice(0, -5),
    "status": "SUCCESS",
    "platform": "stripe",
    "current_period": {
        "from": "2022-01-01T00:00:00",
        "until": "2099-01-01T00:00:00"
    },
    "revokable": true,
    "refunded": false,
    "cancelable": true,
    "reactivatable": false,
    "currency": "usd",
    "created_at": "2022-01-01T00:00:00",
    "updated_at": new Date().toISOString().slice(0, -5),
    "valid_until": "2099-01-01T00:00:00",
    "auto_renew": true,
    "price": 12.0,
    "verbose_plan_name": "Termius Pro Monthly",
    "plan_type": "SINGLE",
    "is_expired": false
};
e.access_objects=[{
    "period": {
        "start": "2022-01-01T00:00:00",
        "end": "2099-01-01T00:00:00"
    },
    "title": "Pro"
}];
```

![file](https://www.hao.kim/upload/2024/02/65cf6ae1bd403.png) 保存文件，重新打开Termius 即可， pro功能即可使用，

破解脚本

#### Python版本

```python
import re

# 要替换的原文本（可能需要调整正则表达式以精确匹配）
pattern = re.compile(r'const e=await this\.api\.bulkAccount\(\);', re.DOTALL)

# 新的文本内容
replacement = """
var e=await this.api.bulkAccount();
e.account.pro_mode=true;
e.account.need_to_update_subscription=false;
e.account.current_period={
    "from": "2022-01-01T00:00:00",
    "until": "2099-01-01T00:00:00"
};
e.account.plan_type="Premium";
e.account.user_type="Premium";
e.student=null;
e.trial=null;
e.account.authorized_features.show_trial_section=false;
e.account.authorized_features.show_subscription_section=true;
e.account.authorized_features.show_github_account_section=false;
e.account.expired_screen_type=null;
e.personal_subscription={
    "now": new Date().toISOString().slice(0, -5),
    "status": "SUCCESS",
    "platform": "stripe",
    "current_period": {
        "from": "2022-01-01T00:00:00",
        "until": "2099-01-01T00:00:00"
    },
    "revokable": true,
    "refunded": false,
    "cancelable": true,
    "reactivatable": false,
    "currency": "usd",
    "created_at": "2022-01-01T00:00:00",
    "updated_at": new Date().toISOString().slice(0, -5),
    "valid_until": "2099-01-01T00:00:00",
    "auto_renew": true,
    "price": 12.0,
    "verbose_plan_name": "Termius Pro Monthly",
    "plan_type": "SINGLE",
    "is_expired": false
};
e.access_objects=[{
    "period": {
        "start": "2022-01-01T00:00:00",
        "end": "2099-01-01T00:00:00"
    },
    "title": "Pro"
}];
"""

# 文件路径
file_path = '/opt/Termius/resources/app/js/background-process.js'

# 读取文件
with open(file_path, 'r', encoding='utf-8') as file:
    content = file.read()

# 替换文本
new_content = re.sub(pattern, replacement, content)

# 写回文件
with open(file_path, 'w', encoding='utf-8') as file:
    file.write(new_content)

print("替换完成。")
```

### GO版本

src.js

```yaml
const e=await this.api.bulkAccount();
```

dst.js

```yaml
var e=await this.api.bulkAccount();
e.account.pro_mode=true;
e.account.need_to_update_subscription=false;
e.account.current_period={
    "from": "2022-01-01T00:00:00",
    "until": "2099-01-01T00:00:00"
};
e.account.plan_type="Premium";
e.account.user_type="Premium";
e.student=null;
e.trial=null;
e.account.authorized_features.show_trial_section=false;
e.account.authorized_features.show_subscription_section=true;
e.account.authorized_features.show_github_account_section=false;
e.account.expired_screen_type=null;
e.personal_subscription={
    "now": new Date().toISOString().slice(0, -5),
    "status": "SUCCESS",
    "platform": "stripe",
    "current_period": {
        "from": "2022-01-01T00:00:00",
        "until": "2099-01-01T00:00:00"
    },
    "revokable": true,
    "refunded": false,
    "cancelable": true,
    "reactivatable": false,
    "currency": "usd",
    "created_at": "2022-01-01T00:00:00",
    "updated_at": new Date().toISOString().slice(0, -5),
    "valid_until": "2099-01-01T00:00:00",
    "auto_renew": true,
    "price": 12.0,
    "verbose_plan_name": "Termius Pro Monthly",
    "plan_type": "SINGLE",
    "is_expired": false
};
e.access_objects=[{
    "period": {
        "start": "2022-01-01T00:00:00",
        "end": "2099-01-01T00:00:00"
    },
    "title": "Pro"
}];
```

crack.go

```go
package main

import (
    "fmt"
    "log"
    "os"
    "regexp"
)

func main() {
    // 读取要替换的文本和替换文本
    originalText, err := os.ReadFile("src.js")
    if err != nil {
        log.Fatalf("failed reading file: %s", err)
    }
    replacementText, err := os.ReadFile("dst.js")
    if err != nil {
        log.Fatalf("failed reading file: %s", err)
    }

    // 读取目标文件
    targetFileContent, err := os.ReadFile("/opt/Termius/resources/app/js/background-process.js")
    if err != nil {
        log.Fatalf("failed reading file: %s", err)
    }

    // 使用regexp进行替换
    // 注意：这里的正则表达式需要根据实际文本进行调整
    re := regexp.MustCompile(`(?s)` + regexp.QuoteMeta(string(originalText)))
    replacedContent := re.ReplaceAll(targetFileContent, replacementText)

    // 将替换后的内容写回文件
    if err := os.WriteFile("/opt/Termius/resources/app/js/background-process.js", replacedContent, 0666); err != nil {
        log.Fatalf("failed writing to file: %s", err)
    }

    fmt.Println("替换完成。")
}
```
