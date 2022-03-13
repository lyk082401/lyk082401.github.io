## 关于新版微信无法使用 `X5 内核` 的解决方法
* 注意
* * 目前只支持 `64位` 微信版本
* 推荐使用 [MT管理器](http://d.binmt.cc) 操作 `http://d.binmt.cc` 或者 [直链下载](https://web.omeo.top/tbs/core/MT管理器-bin.mt.plus-2.10.3-22022063.apk)
* 推荐使用 [小米快传](https://web.omeo.top/tbs/core/ShareMe-com.xiaomi.midrop-3.17.52-31752.apk) 分享 `https://web.omeo.top/tbs/core/ShareMe-com.xiaomi.midrop-3.17.52-31752.apk`

### 第一步
* [下载](https://web.omeo.top/tbs/core/tbs_com.tencent.tbs.core-5.0.0-45913-arm64-v8a.apk) `tbs_com.tencent.tbs.core-5.0.0-45913-arm64-v8a.apk`
* 然后复制 `tbs_com.tencent.tbs.core-5.0.0-45913-arm64-v8a.apk` 到 `/storage/emulated/0/Android/data/com.tencent.mm/files/tbs/` 文件夹里
* * <s>（提示 `地址不合法` 暂不可用）或者也可以使用 [在线安装](http://debugtbs.qq.com/?type=1&url=https://web.omeo.top/tbs/core/tbs_com.tencent.tbs.core-5.0.0-45913-arm64-v8a.apk) 方式
* * * 微信里打开 `http://debugtbs.qq.com/?type=1&url=https://web.omeo.top/tbs/core/tbs_com.tencent.tbs.core-5.0.0-45913-arm64-v8a.apk` 按提示确认安装即可</s>
* * 也可以在任意可用 `X5 内核` 的手机微信
* * 打开 [TBS 调试页面](http://debugtbs.qq.com/) `http://debugtbs.qq.com`
* * 然后点击 `安装在线内核` 等待安装完成即可
* * 之后再次打开 [TBS 调试页面](http://debugtbs.qq.com/) `http://debugtbs.qq.com`
* * 然后点击 `拷贝内核` 提示成功之后到文件管理器里找到 `/storage/emulated/0/tencent/tbs/backup/com.tencent.mm/corefiles_时间戳/core_private/x5.debug.tbs` 或 `/storage/emulated/0/tencent/tbs/backup/com.tencent.mm/x5.tbs.org` 发送给无法使用 `X5 内核` 的手机
* * 之后复制 `x5.debug.tbs` 或 `x5.tbs.org` 到 `/storage/emulated/0/Android/data/com.tencent.mm/files/tbs/` 文件夹里，并重命名为 `tbs.apk` 即可

### 第二步
* `强制启用 x5`
* * [旧版](http://debugmm.qq.com/?forcex5=true) `http://debugmm.qq.com/?forcex5=true`
* * [新版](http://debugxweb.qq.com/?forcex5=true) `http://debugxweb.qq.com/?forcex5=true`
* * * 提示 `foce use x5 switch is on` 即可

### 第三步
* 安装 `本地内核`
* * 打开 [TBS 调试页面](http://debugtbs.qq.com/) `http://debugtbs.qq.com`
* * 然后点击 `安装本地内核` 等待安装完成然后重启即可

### 最后一步
* 启用 `vConsole`
* * 打开 [X5 调试页面](http://debugx5.qq.com/) `http://debugx5.qq.com`
* * 然后点击上方 `信息` 选项卡，下拉找到 `TBS settings` 标签，勾选 `打开vConsole调试功能` 即可

##### 可选操作
* 打开 `Inspector 调试`
* * [旧版](http://debugx5.qq.com/?inspector=true) `http://debugx5.qq.com/?inspector=true`
* * [新版](http://debugxweb.qq.com/?inspector=true) `http://debugxweb.qq.com/?inspector=true`
* * * [电脑 Chrome 调试](chrome://inspect/#devices) `chrome://inspect/#devices`
* 检查 `浏览器和插件更新`
* * [旧版](http://debugmm.qq.com/?check_xwalk_update) `http://debugmm.qq.com/?check_xwalk_update`
* * [新版](http://debugxweb.qq.com/?check_xwalk_update) `http://debugxweb.qq.com/?check_xwalk_update`

### [MarkDown 转 HTML](https://markdown-it.github.io/)
* * [MarkDown](https://cdnjs.cat.net/ajax/libs/markdown-it/12.3.2/markdown-it.min.js)
* * [语法高亮](https://cdnjs.cat.net/ajax/libs/highlight.js/11.5.0/highlight.min.js)