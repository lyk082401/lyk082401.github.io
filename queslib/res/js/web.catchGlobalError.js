		(function webCatchGlobalError()
		{
			try
			{
				window.addEventListener("error", window.onerror = function($message, $filename, $lineno, $colno, $error)
				{
					let err = $error ? {
						message: $message,
						filename: $filename,
						lineno: $lineno,
						colno: $colno,
						error: $error
					} : $message;
					console.warn(err);
					(Array.isArray(window.webCatchGlobalErrors) ? window.webCatchGlobalErrors : (window.webCatchGlobalErrors = [])).push(err);
					if(err)
					{
						let target = err.target || err.srcElement || err.currentTarget;
						let forJson = {};
						// 转为普通数组
						Array.from(
							// 去重
							new Set(
								Object.getOwnPropertyNames(Object.getPrototypeOf(err))
								// 合并
								.concat(Object.getOwnPropertyNames(err))
							)
						).forEach(function($k, $i, $all)
						{
							try
							{
								JSON.stringify(err[$k]);
								forJson[$k] = err[$k];
							}
							catch(e)
							{
								// console.warn(e);
							}
						});
						if(err.error)
						{
							forJson.error = {
								message: err.error.message,
								stack: err.error.stack
							};
						}
						if(err.originalEvent)
						{
							forJson.originalEvent = {
								message: err.originalEvent.message,
								lineno: err.originalEvent.lineno,
								colno: err.originalEvent.colno,
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
								})(err.originalEvent.error)
							};
						}
						if(target && (target.href || target.src))
						{
							forJson.url = target.href || target.src;
						}
						alert(JSON.stringify(forJson, null, "\t"));
					}
					else
					{
						console.warn("未知传递参数", err, arguments);
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