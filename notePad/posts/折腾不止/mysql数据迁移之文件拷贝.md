---
title: MySql数据迁移之文件拷贝
categories:
  - 数据
tags:
  - 数据库
  - MySql
date: 2024-06-13 13:20:00
slug: 
description: 通过备份文件迁移MySql数据
keywords: ""
featuredImage: https://random-api.czl.net/pic/czlwb
featuredImagePreview: https://random-api.czl.net/pic/czlwb
draft: false
push: true
comment: true
repost:
  enable: true
  url: https://blog.csdn.net/tirestay/article/details/131257630
---
## 1、简述：

mysql数据迁移有多种方式，🥳最常见的就是先把数据库导出，然后导入新的数据库。拷贝数据目录data是另外一种方式。

尤其是当数据库启动不了，或者大型数据库迁移的时候，可以考虑这个方式。

<!--more-->

## 2、场景：

从老的mysql（**mysqlA**）迁移到新的mysql（**mysqlB**）。mysqlA对应的数据路径为：**/var/lib/mysql-old**，mysqlB对应的数据路径为：**/var/lib/mysql**。

## 3、迁移示意图：

![](https://s11.ax1x.com/2024/03/01/pF0E0N6.png)

## 4、步骤：

1、停止**mysqlB**。

2、移除 **/var/lib/mysql** 路径下除 **performance\_schema** 文件夹的其余文件。

3、拷贝 **/var/lib/mysql-old** 路径下所有文件到 **/var/lib/mysql**，除了 **performace\_schema**、**iblogfile\_0**,**iblogfile\_1**。

4、现在 **/var/lib/mysql** 下面的文件来源和作用是：

* **performace\_schema**: **新**，性能监控，它在5.6及其之前的版本中，默认没有启用，从5.7及其之后的版本才修改为默认启用。
* **数据库目录**：**老**，具体存储数据的目录，每个数据库对应一个文件夹，文件夹的名字和数据库的名称一致。
* **ibdata1**: **老**，用来构建innodb系统表空间的文件，这个文件包含了innodb表的元数据、undo日志、修改buffer和双写buffer。
* **iblogfile\_0**,**iblogfile\_1**: **新**，日志文件，被删除了，重启后会重新生成。

5、重启**mysqlB**。
