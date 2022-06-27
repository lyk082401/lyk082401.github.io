		(function webFixUrlPathName()
		{
			// 修复若网页绝对链接为“https://xxx.xx/a/b/index.html”，之后用户在浏览器输入的链接为“https://xxx.xx/a/b”（此时链接没有以“/”结尾，也不是“/index.html”结尾），如果服务器没有进行处理的话，会导致网页中的相对资源的链接请求失败（即假如网页里的某个资源链接为“lib/main.js”，此时真正请求的为“https://xxx.xx/a/lib/main.js”，而不是“https://xxx.xx/a/b/lib/main.js”）
			try
			{
				// 可以使用“location.pathname.split("/")”，但得到的结果会不一样
				let u = location.pathname && location.pathname.match(/([^/]{0,})/igm);
				if(u != null)
				{
					let uu = u.slice().reverse();
					if((uu[0] != null) && (uu[1] != null))
					{
						// 这里的“uu[0]”将始终为零长度空字符串
						if(uu[0].length == 0)
						{
							// 若不满足文件名包含“.”时，如“/res/index.html”变为“/res”。（注意这里并没有判断服务器能忽略拓展名的情况，也没有判断是不是一个有效的首页文件，即路径名也包含“.”的情况）
							if(!(/\./).test(uu[1]))
							{
								// 若不是以“/”结尾时，如“/res/”变为“/res”
								if(!(uu[1].length == 0))
								{
									// “/res”
									let pathname = (location.pathname && (location.pathname.length > 0)) ? location.pathname : "/";
									let search = (location.search && (location.search.length > 0)) ? location.search : "";
									let hash = (location.hash && (location.hash.length > 0)) ? location.hash : "";
									// 此时在末尾添加“/”来修复此问题
									let path = location.protocol + "//" + location.host + pathname + "/";
									// document.write('\t\t<base href="' + path + '" target="_self" />\n');
									location.replace(path + search + hash);
								}
							}
						}
					}
				}
			}
			catch(e)
			{
				console.warn(e);
			}
		})();