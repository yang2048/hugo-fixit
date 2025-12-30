---
title: 奇淫技巧-selenium 爬虫
date: 2025-12-11 15:36:08
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

### selenium 爬虫Demo
```JAVA
public static void main(String[] args) throws MalformedURLException {  
// System.setProperty("webdriver.edge.driver", "D:\\bb\\msedgedriver.exe");  
EdgeOptions options = new EdgeOptions();  
options.addArguments("--remote-allow-origins=*");//解决 403 出错问题  
// options.setHeadless(true);// 开启无界面模式  

Proxy proxy = new Proxy();
proxy.setHttpProxy("<HOST:PORT>");
options.setCapability("proxy", proxy);
options.setCapability("platformName", "Windows XP");
// options.setBinary("C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe");  
// WebDriver driver = new EdgeDriver(options);  
//docker run -d -p 4444:4444 -p 7900:7900 --shm-size="2g" selenium/standalone-edge:latest  
//@see link https://hub.docker.com/r/selenium/standalone-edge  
WebDriver driver = new RemoteWebDriver(new URL("http://127.0.0.1:4444/wd/hub"), options);  
driver.get("https://www.mancity.com/players/mens");  
String title = driver.getTitle();  
System.out.println(title);  
System.out.println("-------------------------------");  
driver.manage().timeouts().implicitlyWait(Duration.ofMillis(1000));  
  
// WebElement textBox = driver.findElement(By.name("my-text"));  
// WebElement submitButton = driver.findElement(By.cssSelector("button"));  
//  
// textBox.sendKeys("Selenium");  
// submitButton.click();  
System.out.println("==============================");  
  
// WebElement message = driver.findElement(By.className("js-card-slider-list-item"));  
// String value = message.getText();  
// System.out.println( value);  
  
driver.quit();  
}
```