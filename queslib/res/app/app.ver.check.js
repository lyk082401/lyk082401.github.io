(function()
{
	let api = self.android || self.appapi || self.appApi;
	api && self.$ && $.get && $.get("res/app/app.ver.conf.json", null, "json")
	.done(function($data, $status, $xhr)
	{
		try
		{
			let latestVerCode = $data.release.latest.verCode;
			let currentVerCode = api.AppUtil().getVerCode();
			let desc = $data.release.latest.desc;
			let url = $data.release.latest.dlPath;
			if(!(/(http)|(https)/).test(url))
			{
				// "//"
				if((/^\/\//).test(url))
				{
					url = location.protocol + url;
				}
				else
				{
					// "/"
					if((/^\//).test(url))
					{
						url = location.origin + url;
					}
					else
					{
						url = location.origin + "/" + url;
					}
				}
			}
			if(currentVerCode < latestVerCode)
			{
				let btns = [];
				btns.push(
					{
						caption: "立即更新", custom_class: "dialog-bg-right", callback: function()
						{
							if(api.openBrowser)
							{
								new $.Zebra_Dialog("即将调用浏览器，请手动下载安装", {
									auto_close: 1500,
									buttons: false,
									modal: false
								});
								api.openBrowser(url);
							}
							else
							{
								new $.Zebra_Dialog(`<code>${url}</code><br /><input style="width: 100%; height: 50px;" value="${url}" />`, {
									type: "information",
									title: "请手动复制下载链接到浏览器",
									buttons: [{caption: "好的"}],
									overlay_close: false,
						  			center_buttons: true
								});
							}
						}
				});
				btns.push(
					{
						caption: "取消更新", custom_class: "dialog-bg-error", callback: function()
						{
							new $.Zebra_Dialog("将在下次重新打开软件时继续提醒", {
								auto_close: 1500,
								buttons: false,
								modal: false
							});
						}
				});
				btns.push(
					{
						caption: "不再提醒", custom_class: "dialog-bg-notdo", callback: function()
						{
							new $.Zebra_Dialog("当前版本后续将不再提示更新", {
								auto_close: 1500,
								buttons: false,
								modal: false
							});
						}
				});
				new $.Zebra_Dialog(`<span><b>${currentVerCode} --> ${latestVerCode}</b></span><br /><p>` + desc.replace(/\n|\\n/g, "<br />") + "</p>", {
					type: "information",
					title: "版本更新",
					buttons: btns,
					overlay_close: false,
					center_buttons: true
				});
			}
		}
		catch(e)
		{
			console.warn(e);
		}
		
	})
	.fail(function($xhr, $status, $e)
	{
		console.warn($xhr, $status, $e);
	});
})();