---
title: NFS服务器文件同步
featuredImage: https://cdn.jsdelivr.net/gh/yang2048/media@master/img/fodder/horse-5101069_1280.jpg
categories:
  - 折腾不止
tags:
  - 服务器
---
NFS服务器文件同步
<!--more-->

## 目的

服务器 | IP | 路径
---|---|---
服务端 | 172.16.18.238 | /home/open_8888/webapps/ROOT
客户端 | 172.16.18.240 | /home/open_8888/webapps/ROOT

==两台服务器文件实现共享，可写、同步，允许客户机以root权限访问==

## 测试环境
系统版本:
```
    需开放端口：
    tcp  111 2049 端口
    udp 111  4046 端口

    [root@basic ~]#  cat /etc/redhat-release 
    CentOS release 6.5 (Final)
```
内核参数:
```
    [root@basic ~]# uname -r
    2.6.32-431.el6.x86_64
```

## 服务端部署
  ##### 1. NFS软件包安装
  ```
    yum -y install nfs-utils rpcbind
  ```
  ##### 2. 配置
  ```
    [root@basic ~]# vim /etc/exports
    /home/open_8888/webapps/ROOT 172.16.18.240(rw,sync,no_root_squash)
  ```
/root 172.16.1.0/24(rw,sync,all_squash,anonuid=admin,anongid=admin)
> - 客户端：网络中可以访问nfs共享目录的客户端ip，有这么几种表示方式：
>     - 指定ip地址的主机：192.168.22.11
>     - 通过ip地址段指定子网中的主机：192.168.22.0/24
>     - *：所有主机
> - no_root_squash：NFS客户端连接服务端时如果使用的是root的话，那么对服务端分享的目录来说，也拥有root权限。显然开启这项是不安全的。 
> - root_squash：NFS客户端连接服务端时如果使用的是root的话，那么对服务端分享的目录来说，拥有匿名用户权限，通常他将使用nobody或nfsnobody身份； 
> - all_squash：不论NFS客户端连接服务端时使用什么用户，对服务端分享的目录来说都是拥有匿名用户权限； 
> - anonuid：匿名用户的UID值，通常是nobody或nfsnobody，可以在此处自行设定； 
anongid：匿名用户的GID值。
> - ro # 只读权限
> - rw # 读写权限
> - sync # 文件同时写入硬盘和内存，数据更安全，速度慢
> - async #异步,文件暂存于内存，而不是直接写入内存，速度快，效率高，安全性低
> - nfs层面开启读写权限，系统也要对others开启读写权限：chmod o+w /共享目录
  

##### 使配置生效并查看
```
    exportfs -rv
```
  ##### 3. 开机自启动，注意顺序
  ```
    service rpcbind start
      
    service nfs start

    chkconfig rpcbind on

    chkconfig nfs on
  ```
  ##### 4. 关闭 （star/stop/restart）
  ```
    service nfs restart
    service rpcbind restart
  ```

---
## 客户端部署（挂载）
##### 1.服务安装
```
yum -y install rpcbind
```

##### 2. 开机自启动(同上)
 ```
    service rpcbind start
      
    service nfs start

    chkconfig rpcbind on

    chkconfig nfs on
 ```
 
##### 3. 挂载
```
测试连接
showmount -e 172.16.18.238
挂载
mount 172.16.18.238:/home/open_8888/webapps/ROOT /home/open_8888/webapps/ROOT
```
##### 4. 添加删除文件测试并查看挂载目录
```
df -h
```

---
#### PS:
##### 1. 取消挂载
```
umount /home/open_8888/webapps/ROOT
```