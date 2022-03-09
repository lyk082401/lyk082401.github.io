<?php
// jverification/getPhone/
// jverification/verify/?phone=
;?><!DOCTYPE html>
<html lang="zh-CN" style="width: 100%; height: 100%; margin: 0; padding: 0; border: 0; overflow: auto;">
	<head>
		<meta charset="UTF-8" />
		<meta name="referrer" content="always" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="description" content="Serverless 应用" />
		<meta name="keywords" content="serverless,无服务" />
		<title>OMEO - 一键登录 - 号码认证</title>
		<script type="text/javascript" charset="UTF-8"
			src="https://cdnjs.cat.net/ajax/libs/eruda/2.4.1/eruda.min.js?https://cdn.staticfile.org/eruda/2.4.1/eruda.min.js"
			onload="javascript: (self.eruda && eruda._isInit) || eruda.init({autoScale: true, useShadowDom: true, defaults: {displaySize: 60, transparency: 0.9, theme: 'Dark'}}); /**@close self.eruda && eruda.destroy(); */ /**@el #eruda.eruda-container */"
			crossorigin="anonymous"></script>
		<script type="text/javascript" charset="UTF-8" src="https://jverification.jiguang.cn/scripts/jverification-web-2.0.0.min.js"></script>
		<!-- 如需支持联通一键登录，请单独引入 h5auth1.min.js -->
		<script type="text/javascript" charset="UTF-8" src="https://opencloud.wostore.cn/h5netauth/h5login/singleton/h5auth1.min.js"></script>
		<!-- 移动一键登录必须接入 crypto-js.js -->
		<script type="text/javascript" charset="UTF-8" src="https://jverification.jiguang.cn/scripts/util/crypto-js.js"></script>
	</head>
	<body>
		<script type="text/javascript">
		// https://go48pg.yuque.com/docs/share/2291ed72-2c67-43d5-9cd6-cc98a8330a4d
		// https://github.com/qzHub/JG-JVerification-web-demo
		// http://demo-h5.verification.jiguang.cn/jverif ication/
		// https://docs.jiguang.cn/jverification/server/rest_api/rest_api_summary/
		let debugMode = true;
		function alertMsg(msg)
		{
			(debugMode ? alert : console.log)(JSON.stringify(msg, null, 3));
		}
		function sendLogs(data)
		{
			(/^http[s]*/).test(document.location.protocol) && navigator.sendBeacon("<?php echo $GLOBALS['workurl']; ?>logger/", JSON.stringify(data, null, 3));
		}
		async function setCustomUIWithConfig(operater)
		{
			let logos = {
				default: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
				default_black: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
				CM: "https://hmrz.wo.cn/sdk-resource/img/logo/hz/cm.png",
				CU: "https://hmrz.wo.cn/sdk-resource/img/logo/hz/cu.png",
				CT: "https://hmrz.wo.cn/sdk-resource/img/logo/hz/ct.png"
			};
			let names = {
				default: "应用",
				CM: "中国移动",
				CU: "中国联通",
				CT: "中国电信"
			};
			if(!operater)
			{
				console.log(await new Promise(function(resolve, reject)
				{
					JVerificationInterface.getToken({
						operater: "CM",
						success: function(data)
						{
							resolve(operater = data.operater, data);
						},
						fail: function(data)
						{
							resolve(data);
						}
					});
				}));
			}
			// SDK 一键登录UI设置
			JVerificationInterface.setCustomUIWithConfig && JVerificationInterface.setCustomUIWithConfig({
				logo: logos[operater || "default"],
				appName: names[operater || "default"]
			});
			return operater || "CM";
		}
		function getToken(operater, phone)
		{
			// SDK 获取号码认证 Token（验证）
			JVerificationInterface.getToken({
				operater: operater || "CM",
				success: function(data)
				{
					console.info("getToken", data);
					alertMsg(["getToken", "Token 获取成功", data]);
					let operater = data.operater;
					let token = data.content;
					eruda.util.ajax.post("<?php echo $GLOBALS['workurl']; ?>jverification-api/verify/", {operater, phone, token}, function(data2, xhr2)
					{
						console.info("verify", data2, xhr2);
						alertMsg(["verify", "号码 " + phone + " 验证成功", data2]);
					});
				},
				fail: function(data)
				{
					console.warn("getToken", data);
					alertMsg(["getToken", "Token 获取失败", data]);
				}
			});
		}
		function loginAuth(operater, type)
		{
			// SDK 一键登录（登录）
			JVerificationInterface.loginAuth && JVerificationInterface.loginAuth({
				operater: operater || "CM",
				// 页面登录模式，全屏：full，弹窗：dialog
				type: type || "dialog",
				success: function(data)
				{
					console.info("loginAuth", data);
					alertMsg(["loginAuth", "一键登录 Token 获取成功", data]);
					let operater = data.operater;
					let token = data.content;
					eruda.util.ajax.post("<?php echo $GLOBALS['workurl']; ?>jverification-api/getPhone/", {operater, token}, function(data2, xhr2)
					{
						console.info("getPhone", data2, xhr2);
						alertMsg(["getPhone", (data2.code == 0) ? ("已获取号码 " + data2.content) : "获取号码失败", data2]);
					});
				},
				fail: function(data)
				{
					console.warn("loginAuth", data);
					alertMsg(["loginAuth", "一键登录 Token 获取失败", data]);
				}
			});
		}
		function init(appkey)
		{
			// SDK 初始化
			JVerificationInterface.init({
				appkey: appkey,
				debugMode: debugMode,
				success: function(data)
				{
					console.info("init", data);
					// SDK 判断网络环境是否支持
					if(!JVerificationInterface.checkVerifyEnable())
					{
						alertMsg("当前网络环境不支持认证");
					}
					else if(!JVerificationInterface.isInitSuccess())
					{
						alertMsg(["init", "初始化失败", data]);
					}
					else
					{
						let operater = null;
						setCustomUIWithConfig().then(function()
						{
							operater = arguments[0];
						}).finally(function()
						{
							if((/\/verify/).test(document.location.pathname))
							{
								let phone = document.location.search.match(/phone=([0-9]{11})($|&)/);
								if(phone && phone[1])
								{
									getToken(operater, phone[1]);
								}
								else
								{
									alertMsg("缺少参数 phone，或 phone 位数不正确，请确认后重试");
								}
							}
							else
							{
								loginAuth(operater);
							}
						});
					}
				},
				fail: function(data)
				{
					console.warn("init", data);
					alertMsg(["init", "初始化失败", data]);
				}
			});
		}
		init("<?php echo env('ENVCONFIG', '{}')['jiguang_appkey']; ?>");
		if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i))
		{
			let viewportmeta = document.querySelector("meta[name='viewport']");
			if(viewportmeta)
			{
				viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0";
				document.body.addEventListener("gesturestart", function()
				{
					viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
				}, false);
			}
		}
		</script>
	</body>
</html>