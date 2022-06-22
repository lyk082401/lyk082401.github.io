		(function webCatchGlobalError()
		{
			try
			{
				window.addEventListener("error", window.onerror = function($e)
				{
					console.warn($e);
					if($e)
					{
						let target = $e.target || $e.srcElement || $e.currentTarget;
						let forJson = {};
						// 转为普通数组
						Array.from(
							// 去重
							new Set(
								Object.getOwnPropertyNames(Object.getPrototypeOf($e))
								// 合并
								.concat(Object.getOwnPropertyNames($e))
							)
						).forEach(function($k, $i, $all)
						{
							try
							{
								JSON.stringify($e[$k]);
								forJson[$k] = $e[$k];
							}
							catch(e)
							{
								// console.warn(e);
							}
						});
						if($e.error)
						{
							forJson.error = {
								message: $e.error.message,
								stack: $e.error.stack
							};
						}
						if($e.originalEvent)
						{
							forJson.originalEvent = {
								message: $e.originalEvent.message,
								lineno: $e.originalEvent.lineno,
								colno: $e.originalEvent.colno,
								error: (function($err)
								{
									if($err)
									{
										return {
											message: $err.message,
											stack: $err.stack
										};
									}
									return $err;
								})($e.originalEvent.error)
							};
						}
						if(target && (target.href || target.src))
						{
							forJson.url = target.href || target.src;
						}
						alert(JSON.stringify(forJson, null, "\t"));
					}
				}, true);
				window.addEventListener("unhandledrejection", function($e)
				{
					// 只有 Chrome 浏览器支持此事件，拦截全局未 catch 的 Promise 错误
					console.warn($e);
				}, true);
				window.addEventListener("beforeunload", function($e)
				{
					console.log($e);
					return $e.returnValue = "确定离开当前页面吗？";
				}, true);
				window.addEventListener("unload", function($e)
				{
					console.log($e);
					document.title = "已离开当前页面，即将载入新页面……";
				}, true);
			}
			catch(e)
			{
				console.warn(e);
			}
		})();