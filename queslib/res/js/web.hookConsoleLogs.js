		(function($console)
		{
			try
			{
				let moments = function($time = +(new Date()))
				{
					let date = new Date($time - (new Date()).getTimezoneOffset() * 60 * 1000);
					return date.toJSON().slice(0, 19).replace("T", " ").concat(" ").concat(String(date.getTime()).slice(-3));
				};
				if($console)
				{
					$console.moments = moments;
					Object.entries(
					{
						log: $console.log,
						info: $console.info,
						warn: $console.warn,
						error: $console.error,
						debug: $console.debug
					})
					.forEach(function($kv, $i, $all)
					{
						if($kv[1] && $kv[1].apply)
						{
							$console[$kv[0]] = function()
							{
								try
								{
									let param1 = ["[" + $kv[0].toUpperCase() + "][" + moments().split(/-\d+\s+/)[1] + "][" + String(arguments.length) + "]", new Error($kv[0].toUpperCase())];
									let param2 = Array.prototype.slice.call(arguments);
									let params = param1.concat(["\n\t"]).concat(param2);
									// console.table(webHookConsoleLogs);
									(window.webHookConsoleLogs || (window.webHookConsoleLogs = [])).push(params);
									if(window.eruda && eruda.get && eruda.get("console") && eruda.get("console")[$kv[0]])
									{
										if(eruda.get("console")[$kv[0]] != $console[$kv[0]])
										{
											// eruda.get("console")[$kv[0]](param1, param2);
											// return;
										}
									}
									$kv[1].apply($console, [param1, param2]);
								}
								catch(e)
								{
									window.alert && alert(e.stack || e.message);
								}
							};
						}
					});
				}
			}
			catch(e)
			{
				window.alert && alert(e.stack || e.message);
			}
		})(window.console);