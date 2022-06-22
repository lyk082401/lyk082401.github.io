		(function webCheckUnsupportBrowser()
		{
			try
			{
				if(!window.addEventListener)
				{
					if(confirm(document.title = "当前浏览器不被支持，建议更换浏览器访问，已停止网页继续载入，点击确定前往下载建议的浏览器！"))
					{
						location.assign("https://www.microsoft.com/zh-cn/edge");
					}
					else
					{
						if(window.stop)
						{
							window.stop();
						}
						else
						{
							document.execCommand && document.execCommand("Stop");
						}
					}
				}
			}
			catch(e)
			{
				console.warn(e);
			}
		})();