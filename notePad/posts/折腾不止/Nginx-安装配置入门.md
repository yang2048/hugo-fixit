---
title: Nginx 安装配置入门
cover: https://cdn.jsdelivr.net/gh/yang2048/media@master/img/fodder/horse-5101069_1280.jpg
categories:
  - 折腾不止
tags:
  - nginx
  - tengine
  - 运维
  - 监控
---

> tengine（推荐）阿里出品,开源项目,继承Nginx的所有特性，兼容Nginx的配置；添加了很多高级功能和特性，增加可视监控,扩展功能模块化，插拔容易。

<!--more-->

## 1. 安装编译工具及库文件
```
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

## 2. 下载安装版
```
cd /home
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.40.tar.gz
# nginx,tengine（推荐模块更强大）二选一
wget http://nginx.org/download/nginx-1.15.11.tar.gz
wget http://tengine.taobao.org/download/tengine-2.3.0.tar.gz
```

## 3. 编译安装
```
# 安装PCRE
tar zxvf /home/pcre-8.40.tar.gz
cd /home/pcre-8.40
./configure && make && make install
pcre-config --version

# 安装NGINX
tar zxvf /home/nginx-1.15.11.tar.gz
cd /home/nginx-1.15.11
./configure && make && make install
/usr/local/nginx/sbin/nginx -v

# 安装tengine（推荐）
tar zxvf /home/tengine-2.3.0.tar.gz
cd /home/tengine-2.3.0
./configure && make && make install
/usr/local/nginx/sbin/nginx -v
```

## 4. 初启动NGINX
```
whereis libpcre.so.1
ln -s /usr/local/lib/libpcre.so.1 /lib64
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ps -aux | grep nginx 
```

## 4. 常有命令
```
#启动
[root@localhost ~]# /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
#停止/重启
[root@localhost ~]# /usr/local/nginx/sbin/nginx -s stop(quit、reload)
#命令帮助
[root@localhost ~]# /usr/local/nginx/sbin/nginx -h
#验证配置文件
[root@localhost ~]# /usr/local/nginx/sbin/nginx -t
#配置文件
[root@localhost ~]# vim /usr/local/nginx/conf/nginx.conf
```

 PS：访问http://172.16.18.240/status 可查看服务器健康状态（需配置健康状态模块）

## 5. nginx.conf配置文件详解
```
#运行用户
#user  nobody;
#启动进程,通常设置成和cpu的数量相等
worker_processes 4;  
worker_cpu_affinity 0001 0010 0100 1000;  

#全局错误日志
error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;
error_log  "pipe:rollback logs/error_log interval=1d baknum=7 maxsize=2G";

#PID文件，记录当前启动的nginx的进程ID
pid        logs/nginx.pid;

#工作模式及连接数上限
events {
    worker_connections  1024;  # 单个后台worker process进程的最大并发链接数
}

# load modules compiled as Dynamic Shared Object (DSO)
#
#dso {
#    load ngx_http_fastcgi_module.so;
#    load ngx_http_rewrite_module.so;
#}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
	include       mime.types; #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型
	charset       utf-8; #默认编码
	server_names_hash_bucket_size 128; #服务器名字的hash表大小
	client_header_buffer_size     32k; #上传文件大小限制
	large_client_header_buffers   4 64k; #设定请求缓
	client_max_body_size          8m; #设定请求缓
	sendfile      on; #开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
	autoindex     on; #开启目录列表访问，合适下载服务器，默认关闭。
	tcp_nopush    on; #防止网络阻塞
	tcp_nodelay   on; #防止网络阻塞
	keepalive_timeout 120; #长连接超时时间，单位是秒

	#FastCGI相关参数是为了改善网站的性能：减少资源占用，提高访问速度。下面参数看字面意思都能理解。
	fastcgi_connect_timeout      300;
	fastcgi_send_timeout         300;
	fastcgi_read_timeout         300;
	fastcgi_buffer_size          64k;
	fastcgi_buffers              4 64k;
	fastcgi_busy_buffers_size    128k;
	fastcgi_temp_file_write_size 128k;

	#gzip模块设置
	gzip  on; #开启gzip压缩输出
	gzip_min_length 1k; #最小压缩文件大小
	gzip_buffers 4 16k; #压缩缓冲区
	gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
	gzip_comp_level 2; #压缩等级
	gzip_types      text/plain application/x-javascript text/css application/xml;
	#压缩类型，默认就已经包含text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
	gzip_vary on;
	#limit_zone crawler $binary_remote_addr 10m; #开启限制IP连接数的时候需要使用

	#设定日志
	log_format main '[$remote_addr] - [$remote_user] [$time_local] "$request" '
		   '$status $body_bytes_sent "$http_referer" '
		   '"$http_user_agent" "$http_x_forwarded_for"';
		   
	#access_log  logs/access.log  main;
    #access_log  "pipe:rollback logs/access_log interval=1d baknum=7 maxsize=2G"  main;
	rewrite_log   on;

	#设定负载均衡的服务器列表
	upstream tomcat_server {
		#weigth参数表示权值，权值越高被分配到的几率越大
		server 172.16.18.238:8888 weight=1;
		server 172.16.18.240:8888  weight=1;
		server 127.0.0.1:8888 max_fails=1 fail_timeout=600s;
		#当服务器响应出错1次 600s内此服务器标记为宕机状态，不分发请求给此服务器。
		server 127.0.0.1:9999 backup;
		#backup 标记当前服务器为 备用。只有当 未标记backup的服务器 全部无响应时 此服务器 接受请求
		
		#服务器健康检查
		check interval=3000 rise=2 fall=5 timeout=1000 type=http;
        check_http_send "HEAD / HTTP/1.0\r\n\r\n";
        check_http_expect_alive http_2xx http_3xx;
	}
	
	server {
        listen       80;
        server_name  www.aaa.com;
        rewrite ^(.*)$ https://$host/$1 permanent;#将所有http请求转发为https
    }
		
	#HTTP服务器
    server {
        listen       443 ssl;
        server_name  www.aaa.com
        ssl_certificate      /home/soft/ssl/aaa.crt;
        ssl_certificate_key  /home/soft/ssl/aaa.key;
        ssl on;
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        #首页
		index index.html

		#指向webapp的目录
		root \home\open_8888\webapps;

		#编码格式
		charset utf-8;

		#反向代理的路径（和upstream绑定），location 后面设置映射的路径
        location / {
            #root    /ROOT;         #定义服务器的默认网站根目录位置
			index    index.html index.htm; #定义首页索引文件的名称
			proxy_pass http://tomcat_server;
			
			#以下是一些反向代理的配置(可选择性配置)
			proxy_redirect off;
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
			#后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
			proxy_set_header X-Forwarded-For $remote_addr;
			proxy_connect_timeout 90;     #nginx跟后端服务器连接超时时间(代理连接超时)
			proxy_send_timeout 90;       #后端服务器数据回传时间(代理发送超时)
			proxy_read_timeout 90;       #连接成功后，后端服务器响应时间(代理接收超时)
			proxy_buffer_size 4k;       #设置代理服务器（nginx）保存用户头信息的缓冲区大小
			proxy_buffers 4 32k;        #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
			proxy_busy_buffers_size 64k;    #高负荷下缓冲大小（proxy_buffers*2）
			proxy_temp_file_write_size 64k;  #设定缓存文件夹大小，大于这个值，将从upstream服务器传

			client_max_body_size 10m;     #允许客户端请求的最大单文件字节数
			client_body_buffer_size 128k;   #缓冲区代理缓冲用户端请求的最大字节数
        }
		
		#/status 服务器健康检查
		location /status {
            check_status;

            access_log   off;
            allow 10.1.1.35; #允许访问的IP
            deny all;
        }
		#静态文件，nginx自己处理
		location ~ ^/(images|javascript|js|css|flash|media|static)/ {
			root \home\open_8888\webapps\ROOT\resources;
			#过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
			expires 30d;
		}

		#错误处理页面（可选择性配置）
		#error_page  404       /404.html;

        # 错误处理页面 /50x.html
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

		#禁止访问 .htxxx 文件
		location ~ /\.ht {
		  deny all;
		}
    }

}

```
