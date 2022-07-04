		/** 使用 eruda 时可能不可用
		(function()
		{
			try
			{
				// https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror https://my.oschina.net/qcloudcommunity/blog/2963894
				const originAddEventListener = EventTarget.prototype.addEventListener;
				EventTarget.prototype.addEventListener = function($type, $listener, $options)
				{
					let args = Array.prototype.slice.apply(arguments);
					// 捕获添加事件时的堆栈
					const addStack = (new Error("Event (" + $type + ")")).stack;
					const wrappedListener = function($arg)
					{
						try
						{
							if($listener.apply)
							{
								return $listener.apply(this, Array.prototype.slice.apply(arguments));
							}
							else
							{
								console.warn("inject-event-target", "no apply function", Array.prototype.slice.apply(arguments), args);
							}
						}
						catch(e)
						{
							// 异常发生时，扩展堆栈
							e.stack += "\n" + addStack;
							console.warn("inject-event-target", e);
							throw e;
						}
					};
					return originAddEventListener.call(this, $type, wrappedListener, $options);
				};
			}
			catch(e)
			{
				console.warn(e);
			}
		})();
		*/
window.type = function($obj)
{
	try
	{
		if(typeof($obj) !== "string")
		{
			return typeof($obj);
		}
		return typeof(eval($obj));
	}
	catch(e)
	{
		console.warn(e);
	}
	return "undefined";
};
if(!Element.prototype.matches)
{
	Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s)
	{
		let matches = (this.document || this.ownerDocument).querySelectorAll(s);
		let i = matches.length;
		while((--i >= 0) && (matches.item(i) !== this)){}
		return i > -1;
	};
}
if(!Element.prototype.closest)
{
	Element.prototype.closest = function(selector)
	{
		let el = this;
		while(el)
		{
			if(this.matches.call(el, selector))
			{
				break;
			}
			el = el.parentElement;
		}
		return el;
	};
}
/**
http.get("https://zjy2.icve.com.cn/api/NewMobileAPI/mobilelogin/loginByH5?userName=${username}&userPwd=${password}&appVersion=2.8.25")
http.get("https://zjy2.icve.com.cn/api/NewMobileAPI/mobilelogin/loginOut?newToken=${newToken}&userId=${userId}")
http.get("https://zjy2.icve.com.cn/api/NewMobileAPI/mobilelogin/getUserInfo?newToken=${newToken}&userId=${userId}")
http.get("https://zjy2.icve.com.cn/api/NewMobileAPI/student/getCourseList?newToken=${newToken}&stuId=${userId}&isPass=1")
http.get("https://zjy2.icve.com.cn/api/NewMobileAPI/student/getCourseList?newToken=${newToken}&stuId=${userId}&isPass=0")
*/
/**
IE11 IE.png https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads
Microsoft Edge edge.png https://www.microsoft.com/en-us/edge/business/download
Google Chrome chrome.png https://www.google.cn/chrome/
Firefox firefox.png https://www.firefox.com.cn/download/
Safari safari.png https://support.apple.com/zh-cn/guide/safari/sfri40598/mac
360安全浏览器 360.png https://browser.360.cn/
*/
window.parser = {
	set visualViewport($val){},
	get visualViewport()
	{
		// window.innerWidth window.devicePixelRatio document.documentElement.clientWidth
		return window.visualViewport || {};
	},
	isOnline: (function($initStatus)
	{
		window.addEventListener && addEventListener("offline", function($event)
		{
			console.log("网络已断开", $event);
			parser.isOnline = false;
		});
		window.addEventListener && addEventListener("online", function($event)
		{
			console.log("网络已连接", $event);
			parser.isOnline = true;
		});
		return $initStatus;
	})((window.navigator && (typeof(navigator.onLine) === "boolean")) ? navigator.onLine : true),
	isVisible: (function($initStatus)
	{
		window.addEventListener && addEventListener("visibilitychange", function($event)
		{
			console.log("页面可视状态改变", ["hidden", document.hidden, "visibilityState", document.visibilityState], $event);
			parser.isVisible = !document.hidden;
		});
		return $initStatus;
	})(!document.hidden),
	cssForDisableSelect: "-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none;",
	tryKeepScreenAlive: function($minutes)
	{
		if(!navigator.wakeLock)
		{
			console.warn("浏览器不支持唤醒锁");
			return;
		}
		(!navigator.wakeLock.currentKeepScreenIsAlive && ((document.visibilityState === "visible") ? navigator.wakeLock.request("screen")
		.then(function($lock)
		{
			console.log($lock, "唤醒锁已打开", (new Date()).toTimeString());
			(navigator.wakeLock.savekeepScreenWakeLocks || (navigator.wakeLock.savekeepScreenWakeLocks = [])).push({lock: $lock, alive: $lock.released});
			navigator.wakeLock.currentKeepScreenIsAlive = true;
			$lock.onrelease = function($e)
			{
				console.log($e, "唤醒锁已关闭", (new Date()).toTimeString());
				setTimeout(function()
				{
					if(document.visibilityState === "visible"/** && confirm("屏幕唤醒锁已关闭，为防止屏幕自动黑屏，是否需要打开？")*/)
					{
						if(navigator.wakeLock.wakeLockOnvisibilitychange)
						{
							document.removeEventListener("visibilitychange", navigator.wakeLock.wakeLockOnvisibilitychange);
							navigator.wakeLock.wakeLockOnvisibilitychange = null;
							navigator.wakeLock.currentKeepScreenIsAlive = false;
							parser.tryKeepScreenAlive($minutes);
						}
					}
					else
					{
						$lock.onrelease();
					}
				}, 30 * 1000);
			};
			let visibilitychange = function($e2)
			{
				if(["visible", "hidden"].includes(document.visibilityState))
				{
					let extra = $lock.released ? "唤醒锁已释放" : "唤醒锁未释放";
					if(document.visibilityState === "visible")
					{
						console.log($e2, "当前页面已可视", extra, (new Date()).toTimeString());
						document.removeEventListener("visibilitychange", visibilitychange);
						navigator.wakeLock.wakeLockOnvisibilitychange = null;
						setTimeout(function()
						{
							navigator.wakeLock.currentKeepScreenIsAlive = false;
							parser.tryKeepScreenAlive($minutes);
						}, 100);
					}
					if(document.visibilityState === "hidden")
					{
						console.log($e2, "当前页面不可视", extra, (new Date()).toTimeString());
					}
				}
			};
			navigator.wakeLock.wakeLockOnvisibilitychange = visibilitychange;
			document.addEventListener("visibilitychange", visibilitychange);
			// 默认20分钟后自动关闭
			setTimeout(function()
			{
				$lock.released || $lock.release("screen").then(console.log).catch(console.warn);
			}, (($minutes != null) ? $minutes : 20) * 60 * 1000);
		})
		.catch(console.warn) : (function()
		{
			let visibilitychange = function($e)
			{
				if(document.visibilityState === "visible")
				{
					console.log($e, "当前页面已可视", "尝试开启唤醒锁", (new Date()).toTimeString());
					document.removeEventListener("visibilitychange", visibilitychange);
					parser.tryKeepScreenAlive($minutes);
				}
			};
			document.addEventListener("visibilitychange", visibilitychange);
			console.log({minutes: $minutes}, "当前页面不可视", "将等待页面可视", (new Date()).toTimeString());
		})()));
	},
	event: {
		stopCapturing: function($e)
		{
			if($e.preventDefault)
			{
				$e.preventDefault();
			}
			else
			{
				$e.returnValue = false;
			}
			return false;
		},
		stopBubbling: function($e)
		{
			if($e.stopPropagation)
			{
				$e.stopPropagation();
			}
			else
			{
				$e.cancelBubble = true;
			}
			return false;
		},
		stopHere: function($e)
		{
			$e.stopImmediatePropagation();
			return false;
		}
	},
	removeArrayAt: function($arr, $index)
	{
		/** 删除数组元素 */
		if(!Array.isArray($arr) || (typeof($index) !== "number") || isNaN($index) || ($index < 0))
		{
			return $arr;
		}
		else
		{
			let arr = [];
			$arr.forEach(function($v, $i, $all)
			{
				if($i !== $index)
				{
					// 不重置原有引索
					arr[$i] = $v;
				}
			});
			return arr;
		}
	},
	resetArrayIndex: function($arr)
	{
		/** 重置数组引索 */
		if(!Array.isArray($arr))
		{
			return $arr;
		}
		else
		{
			let arr = [];
			$arr.forEach(function($v, $i, $all)
			{
				// 重置原有引索
				arr.push($v);
			});
			return arr;
		}
	},
	storage: {
		set: function($key, $val)
		{
			/** 适配苹果设备。苹果设备 localStorage 最大2.5M（超过会抛 "QuotaExceededError: The quota has been exceeded."异常），sessionStorage 无限制；安卓设备 localStorage 和 sessionStorage 最大都是不超过5M。
			*/
			let result = this.local.set($key, $val);
			if(result == null)
			{
				result = this.session.set($key, $val);
				if(result == null)
				{
					result = this.ctx.set($key, $val);
					if(result == null)
					{
						result = null;
					}
				}
			}
			return result;
		},
		get: function($key)
		{
			let result = this.ctx.get($key);
			if(result == null)
			{
				result = this.session.get($key);
				if(result == null)
				{
					result = this.local.get($key);
					if(result == null)
					{
						result = null;
					}
				}
			}
			return result;
		},
		// 持久化本地数据库超大文件存储
		big: {
			set: function($key, $val)
			{
				try
				{
					return localforage.setItem($key, $val)
					.then(function($data)
					{
						return $data;
					})
					.catch(function($error)
					{
						console.warn($error);
						throw $error;
					});
				}
				catch(e)
				{
					console.warn(e);
					return Promise.reject(e);
				}
			},
			get: function($key)
			{
				try
				{
					return localforage.getItem($key)
					.then(function($data)
					{
						return $data;
					})
					.catch(function($error)
					{
						console.warn($error);
						throw $error;
					});
				}
				catch(e)
				{
					console.warn(e);
					return Promise.reject(e);
				}
			}
		},
		// 持久本地存储
		local: (function()
		{
			let local = null;
			let methods = {
				set: {
					value: function($key, $val)
					{
						try
						{
							localStorage.setItem($key, $val);
							if(this && (!this.__proto__ || (this.__proto__[$key] === undefined)))
							{
								this[$key] = $val;
							}
							return this ? this.get($key) : String($val);
						}
						catch(e)
						{
							console.warn(e);
						}
						return null;
					}
				},
				get: {
					value: function($key)
					{
						return localStorage.getItem($key);
					}
				},
				key: {
					value: function($index)
					{
						return localStorage.key(($index != null) ? $index : 0);
					}
				},
				size: {
					value: function()
					{
						return localStorage.length;
					}
				},
				clear: {
					value: function()
					{
						localStorage.clear();
						return this;
					}
				},
				remove: {
					value: function($key)
					{
						localStorage.removeItem($key);
						return this;
					}
				},
				length: {
					set: function($val){},
					get: function()
					{
						return localStorage.length;
					}
				}
			};
			try
			{
				local = eval(
				"class local extends Object" +
				"{" +
				"	constructor()" +
				"	{" +
				"		super();" +
				"	}" +
				"	set($key, $val)" +
				"	{" +
				"		return methods.set.value.apply(this, arguments);" +
				"	}" +
				"	get($key)" +
				"	{" +
				"		return methods.get.value.apply(this, arguments);" +
				"	}" +
				"	key($index)" +
				"	{" +
				"		return methods.key.value.apply(this, arguments);" +
				"	}" +
				"	size()" +
				"	{" +
				"		return methods.size.value.apply(this, arguments);" +
				"	}" +
				"	clear()" +
				"	{" +
				"		return methods.clear.value.apply(this, arguments);" +
				"	}" +
				"	remove($key)" +
				"	{" +
				"		return methods.remove.value.apply(this, arguments);" +
				"	}" +
				"	set length($val)" +
				"	{" +
				"		return methods.length.set.apply(this, arguments);" +
				"	}" +
				"	get length()" +
				"	{" +
				"		return methods.length.get.apply(this, arguments);" +
				"	}" +
				"}" +
				"local");
				local = new local();
			}
			catch(e)
			{
				console.warn(e);
				local = Object.defineProperties(new Object(), methods);
			}
			return local;
		})(),
		// 当前会话存储
		session: (function()
		{
			let session = null;
			let methods = {
				set: {
					value: function($key, $val)
					{
						try
						{
							sessionStorage.setItem($key, $val);
							if(this && (!this.__proto__ || (this.__proto__[$key] === undefined)))
							{
								this[$key] = $val;
							}
							return this ? this.get($key) : String($val);
						}
						catch(e)
						{
							console.warn(e);
						}
						return null;
					}
				},
				get: {
					value: function($key)
					{
						return sessionStorage.getItem($key);
					}
				},
				key: {
					value: function($index)
					{
						return sessionStorage.key(($index != null) ? $index : 0);
					}
				},
				size: {
					value: function()
					{
						return sessionStorage.length;
					}
				},
				clear: {
					value: function()
					{
						sessionStorage.clear();
						return this;
					}
				},
				remove: {
					value: function($key)
					{
						sessionStorage.removeItem($key);
						return this;
					}
				},
				length: {
					set: function($val){},
					get: function()
					{
						return sessionStorage.length;
					}
				}
			};
			try
			{
				session = eval(
				"class session extends Object" +
				"{" +
				"	constructor()" +
				"	{" +
				"		super();" +
				"	}" +
				"	set($key, $val)" +
				"	{" +
				"		return methods.set.value.apply(this, arguments);" +
				"	}" +
				"	get($key)" +
				"	{" +
				"		return methods.get.value.apply(this, arguments);" +
				"	}" +
				"	key($index)" +
				"	{" +
				"		return methods.key.value.apply(this, arguments);" +
				"	}" +
				"	size()" +
				"	{" +
				"		return methods.size.value.apply(this, arguments);" +
				"	}" +
				"	clear()" +
				"	{" +
				"		return methods.clear.value.apply(this, arguments);" +
				"	}" +
				"	remove($key)" +
				"	{" +
				"		return methods.remove.value.apply(this, arguments);" +
				"	}" +
				"	set length($val)" +
				"	{" +
				"		return methods.length.set.apply(this, arguments);" +
				"	}" +
				"	get length()" +
				"	{" +
				"		return methods.length.get.apply(this, arguments);" +
				"	}" +
				"}" +
				"session");
				session = new session();
			}
			catch(e)
			{
				console.warn(e);
				session = Object.defineProperties(new Object(), methods);
			}
			return session;
		})(),
		// 当前上下文存储
		ctx: (function()
		{
			let ctx = null;
			let item = {};
			let methods = {
				set: {
					value: function($key, $val)
					{
						if(this && (!this.__proto__ || (this.__proto__[$key] === undefined)))
						{
							this[$key] = $val;
						}
						return item[$key] = $val;
					}
				},
				get: {
					value: function($key)
					{
						return item[$key];
					}
				},
				key: {
					value: function($index)
					{
						return Object.keys(item)[($index != null) ? $index : 0];
					}
				},
				size: {
					value: function()
					{
						return Object.keys(item).length;
					}
				},
				clear: {
					value: function()
					{
						item = {};
						return this;
					}
				},
				remove: {
					value: function($key)
					{
						Reflect.deleteProperty(item, $key);
						if(this && (!this.__proto__ || (this.__proto__[$key] === undefined)))
						{
							Reflect.deleteProperty(this, $key);
						}
						return this;
					}
				},
				length: {
					set: function($val){},
					get: function()
					{
						return Object.keys(item).length;
					}
				}
			};
			try
			{
				ctx = eval(
				"class ctx extends Object" +
				"{" +
				"	constructor()" +
				"	{" +
				"		super();" +
				"	}" +
				"	set($key, $val)" +
				"	{" +
				"		return methods.set.value.apply(this, arguments);" +
				"	}" +
				"	get($key)" +
				"	{" +
				"		return methods.get.value.apply(this, arguments);" +
				"	}" +
				"	key($index)" +
				"	{" +
				"		return methods.key.value.apply(this, arguments);" +
				"	}" +
				"	size()" +
				"	{" +
				"		return methods.size.value.apply(this, arguments);" +
				"	}" +
				"	clear()" +
				"	{" +
				"		return methods.clear.value.apply(this, arguments);" +
				"	}" +
				"	remove($key)" +
				"	{" +
				"		return methods.remove.value.apply(this, arguments);" +
				"	}" +
				"	set length($val)" +
				"	{" +
				"		return methods.length.set.apply(this, arguments);" +
				"	}" +
				"	get length()" +
				"	{" +
				"		return methods.length.get.apply(this, arguments);" +
				"	}" +
				"}" +
				"ctx");
				ctx = new ctx();
			}
			catch(e)
			{
				console.warn(e);
				ctx = Object.defineProperties(new Object(), methods);
			}
			return ctx;
		})()
	},
	findArrValIndexs: function($arr, $target)
	{
		return $arr.map(function($elem, $index)
		{
			return ($elem === $target) ? $index : -1;
		})
		.filter(function($v)
		{
			return $v != -1;
		});
	},
	findArrValIndex: function($arr, $target)
	{
		let index = findArrValIndexs($arr, $target);
		return index.length ? index[0] : -1;
	},
	api: {}, txt: {}, xml: {}, json: {},
	type: {
		// 单选题 isSCQ
		// 多选题 isMCQ
		// 判断题 isTFQ
		// 填空题 isFBQ
		// 作答题 isWAQ
		// 默认题型
		default: "单选题",
		all: ["单选题", "多选题", "共用题干单选题", "共用答案单选题", "填空题", "名词解释", "名词解析", "简答题", "问答题", "思考题", "论述题", "案例分析", "病例分析", "写作", "常用术语", "要点指南"],
		// 选择题
		choices: {
			alone: ["单选题", "多选题"],
			share: {
				title: ["共用题干单选题"],
				answer: ["共用答案单选题"]
			}
		},
		// 文字作答题
		answers: {
			fill: ["填空题"],
			word: ["名词解释", "名词解析", "简答题", "问答题", "思考题", "论述题", "案例分析", "病例分析", "写作", "常用术语", "要点指南"]
		}
	},
	re: {
		// 题号匹配 ["1) ", "1)", "1. ", "1.", "1．", "1 ", "（1）", "(1)"]
		quesnum: /(^[0-9]{1,}\)\u0020)|(^[0-9]{1,}\))|(^[0-9]{1,}\.\u0020)|(^[0-9]{1,}\.)|(^[0-9]{1,}．)|(^[0-9]{1,}\u0020)|(^（[0-9]{1,}）)|(^\([0-9]{1,}\))/,
		// 选项号匹配 ["A) ", "A)", "A. ", "A.", "A．", "A ", "（A）", "(A)"]
		optsnum: /(^[A-Z]{1}\)\u0020)|(^[A-Z]{1}\))|(^[A-Z]{1}\.\u0020)|(^[A-Z]{1}\.)|(^[A-Z]{1}．)|(^[A-Z]{1}\u0020)|(^（[A-Z]{1}）)|(^\([A-Z]{1}\))/i,
		// 选项名
		_optname: /^([A-Z])[\.．]/,
		// 注释 [![注释]!]
		_note: /\[\!\[(.*?)\]\!\]/,
		// 章节 [#[章节]#]
		_chapter: /\[\#\[(.*?)\]\#\]/,
		// 题型 [=[题型]=]
		_type: /\[\=\[(.*?)\]\=\]/,
		// 资源 [$[资源]$]
		_res: /\[\$\[(.*?)\]\$\]/,
		// 答案 {@{答案\n答案}@}
		_answer: /\{\@\{([\s\S]*?)\}\@\}/,
		_answer_begin: /^(参考答案：)(.*)/,
		_answer_ended: /(\u3164√|√)$/,
		_answer_aline: /^([A-Z]+)$/,
		// 难度 {%{难度}%}
		_coeffic: /\{\%\{(.*?)\}\%\}/,
		_coeffic_begin: /^(难度系数：)(.*)/,
		// 解析 {?{解析\n解析}?}
		_analysis: /\{\?\{([\s\S]*?)\}\?\}/,
		_analysis_begin: /^(参考解析：)(.*)/
	},
	const: {
		optionNames: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
		optionIndex: {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, 0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F", 6: "G", 7: "H", 8: "I", 9: "J", 10: "K", 11: "L", 12: "M", 13: "N", 14: "O", 15: "P", 16: "Q", 17: "R", 18: "S", 19: "T", 20: "U", 21: "V", 22: "W", 23: "X", 24: "Y", 25: "Z"},
		quesnumCNs: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四"]
	}
};
/**
* 数字转成汉字
* @params num === 要转换的数字
* @return 汉字
* */
parser.api.toChineseNum = (function(num)
{
	let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	let unit = ["", "十", "百", "千", "万"];
	num = parseInt(num, 10);
	let getWan = (function(temp)
	{
		let strArr = temp.toString().split("").slice().reverse();
		let newNum = "";
		let newArr = [];
		strArr.forEach(function(item, index)
		{
			newArr.unshift((item === "0") ? changeNum[item] : (changeNum[item] + unit[index]));
		});
		let numArr = [];
		newArr.forEach(function(m, n)
		{
			if(m !== "零")
			{
				numArr.push(n);
			}
		});
		if(newArr.length > 1)
		{
			newArr.forEach(function(m, n)
			{
				if(newArr[newArr.length - 1] === "零")
				{
					if(n <= numArr[numArr.length - 1])
					{
						newNum += m;
					}
				}
				else
				{
					newNum += m;
				}
			});
		}
		else
		{
			newNum = newArr[0];
		}
		return newNum;
	});
	let overWan = Math.floor(num / 10000);
	let noWan = num % 10000;
	if(noWan.toString().length < 4)
	{
		noWan = "0" + noWan;
	}
	return (overWan ? (getWan(overWan) + "万" + getWan(noWan)) : getWan(num)).replace(/^一十/, "十");
});
parser.api.toChineseBig = (function(num)
{
	function numToChinese(n)
	{
		// let chineseBigNum = "零壹贰叁肆伍陆柒捌玖";
		let chineseBigNum = "零一二三四五六七八九";
		return chineseBigNum[n];
	}
	// 将接收到的num转换为字符串
	let strNum = String(num);
	// 定义单位
	// let unit = ["拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟"];
	let unit = ["十", "百", "千", "万", "十", "百", "千", "亿", "十", "百", "千"];
	// 结果中放一个符号，用来解决最后的零去不掉的问题
	let result = ["@"];
	// 单位下标
	let unitNo = 0;
	// 从后往前遍历接收到的数据，省略结束条件
	for(let i = strNum.length - 1;; i--)
	{
		// 调用转大写函数，将每一个数字转换成中文大写，一次放入一个到结果数组中
		result.unshift(numToChinese(strNum[i]));
		// 如果不大于0
		if(i <= 0)
		{
			// 结束循环
			break;
		}
		// 放入一个数字，放入一个单位
		result.unshift(unit[unitNo]);
		// 单位下标加1
		unitNo++;
	}
	// 将结果数组转换成字符串，并使用正则替换一些关键位置，让结果符合语法
	// return result.join("").replace(/(零[仟佰拾]){1,3}/g, "零").replace(/零{2,}/g, "零").replace(/零([万亿])/g, "$1").replace(/亿万/g, "亿").replace(/零*@/g, "");
	return (result.join("").replace(/(零[千百十]){1,3}/g, "零").replace(/零{2,}/g, "零").replace(/零([万亿])/g, "$1").replace(/亿万/g, "亿").replace(/零*@/g, "")).replace(/^一十/, "十") || "零";
});
(function()
{
	for(let i = 0; i < 1000; i++)
	{
		parser.const.quesnumCNs[i] = parser.api.toChineseNum(i + 1);
	}
})();
parser.api.init = (function()
{
	document.title = "梧职院 | 20级护理 | 复习题库";
	/**
	if(prompt("请输入密码：", "") !== localStorage.getItem("queslib-access-pwd"))
	{
		return;
	}*/
	if(typeof(eruda) !== "object")
	{
		return alert("Eruda 未加载");
	}
	if(typeof(jQuery) !== "function")
	{
		return alert("jQuery 未加载");
	}
	if(typeof(JSZip) !== "function")
	{
		return alert("JSZip 未加载");
	}
	// 让屏幕保持常亮
	parser.tryKeepScreenAlive(20);
	let queslib = $(document).find("[name='queslib']").get(0),
	select = $(queslib).find("select").get(0),
	cloneSelect = null,
	initIndex = select.selectedIndex,
	savedIndex = (function($d)
	{
		if(arguments.length > 0)
		{
			localStorage.setItem("queslib-selected-index", String($d));
		}
		return parseInt(localStorage.getItem("queslib-selected-index"), 10);
	}),
	urlIndex = parseInt(parser.api.getUrlParam("i"), 10),
	queslibCompressRes = window.localforage ? function($d)
	{
		let storeName = "queslib-compress-res";
		if(arguments.length > 0)
		{
			return parser.storage.big.set(storeName, $d)
			.then(function($data)
			{
				return parser.storage.big.get(storeName);
			})
			.finally(function()
			{
				try
				{
					if(!parser.storage.local.set(storeName, $d))
					{
						let data = JSON.parse($d);
						Reflect.deleteProperty(data, "data");
						parser.storage.set(storeName, JSON.stringify(data));
					}
					parser.storage.ctx.set(storeName, $d);
				}
				catch(e)
				{
					console.warn(e);
				}
			});
		}
		return parser.storage.big.get(storeName);
	} : function($d)
	{
		let storeName = "queslib-compress-res";
		if(arguments.length > 0)
		{
			parser.storage.set(storeName, $d);
			if(!parser.storage.local.set(storeName, $d))
			{
				let data = JSON.parse($d);
				Reflect.deleteProperty(data, "data");
				parser.storage.set(storeName, JSON.stringify(data));
			}
		}
		return parser.storage.get(storeName);
	};
	$.LoadingOverlay && $.LoadingOverlay("show");
	try
	{
		let pwd = parser.api.getUrlParam("pwd");
		if(pwd && ((pwd = pwd.split(",")).length > 0))
		{
			$("[data-pwd]").each(function($index, $opt)
			{
				if(pwd.includes($($opt).attr("data-pwd")))
				{
					parser.api.tipmsg(`${$opt.text}<font color="red">已解锁</font>`, "info");
					$($opt).removeAttr("disabled").prop("disabled", false);
				}
			});
		}
		$("[data-ifsite]").each(function($i, $og)
		{
			if($($og).attr("data-ifsite"))
			{
				let rm = true;
				$($($og).attr("data-ifsite").split("|").concat("/storage/emulated/0")).each(function($$i, $s)
				{
					if((/(iPhone|iPad|iPod|iOS)/i).test(navigator.userAgent) || location.href.includes($s))
					{
						rm = false;
					}
				});
				rm && $($og).remove();
			}
		});
		initIndex = select.selectedIndex;
	}
	catch(e)
	{
		console.warn(e);
	}
	let nonAppearanceCss = `<style type="text/css">
	select, button, input[type="button"], details, summary, hr
	{
		/** 去除默认样式 */
		-webkit-appearance: none;
		-moz-appearance: none;
		-ms-appearance: none;
		-o-appearance: none;
		appearance: none;
	}
	</style>`;
	try
	{
		// eruda.util.$ eruda._$el eruda._devTools._tools eruda._devTools._tools.network._requests
		eruda.add(
		{
			name: "题库菜单",
			init: (function($el)
			{
				$el.html((`${nonAppearanceCss}<center><hr />
					<p name="cloneSelect_container">${select.outerHTML.replace(/eruda\.util\.\$\.cloneSelect/, "$(document).find('[name=\\'queslib\\'] select').get(0)")}</p><hr />
					<button name="autoread" style="color: grey;">自动浏览</button>&nbsp;&nbsp;&nbsp;
					<button name="autoread-switch" style="color: grey;">${localStorage.getItem("queslib-autoread-switch") ? localStorage.getItem("queslib-autoread-switch") : "开"}</button><hr />
					<button name="changebg" style="color: grey;">日间模式</button><hr />
					<button name="icveview" style="color: grey;">${(/icve\-data\-view/).test(location.pathname) ? "返回复习题库" : "职教云数据查看"}</button><hr />
					每章题量&nbsp;&nbsp;&nbsp;
					<button name="quesnum">➖</button>
					<input name="quesnum" type="range" min="10" max="200" step="5" value="${localStorage.getItem('queslib-question-num') ? localStorage.getItem('queslib-question-num') : '50'}" />
					<button name="quesnum">➕</button>
					&nbsp;&nbsp;&nbsp;<span name="quesnum">${localStorage.getItem("queslib-question-num") ? localStorage.getItem("queslib-question-num") : "50"}题</span>
					<hr />
					显示模式&nbsp;&nbsp;&nbsp;
					<button name="showmode" style="color: grey;">按<font color="red">题型</font>显示</button><hr />
				</center>`).replace(/^\s+/g, ""));
				// 设置每章题量
				(function()
				{
					$el.find("input[name='quesnum']").get(0).oninput = (function()
					{
						let intxt = this.parentElement.querySelector("span[name='quesnum']");
						intxt.innerText = this.value + "题";
					});
					$el.find("input[name='quesnum']").get(0).onchange = (function()
					{
						this.oninput();
						localStorage.setItem("queslib-question-num", this.value);
						select.onchange();
					});
					$el.find("button[name='quesnum']").on("click", function()
					{
						let input = this.parentElement.querySelector("input[name='quesnum']");
						input.value = (this.innerText === "➖") ? (parseInt(input.value, 10) - parseInt(input.step)) : (parseInt(input.value, 10) + parseInt(input.step));
						input.onchange();
					});
				})();
				// 克隆的副本
				cloneSelect = eruda.util.$.cloneSelect = $el.find("[name='cloneSelect_container'] select").get(0);
				function autoreadSwitchGetOrSet($setval)
				{
					if($setval != null)
					{
						return localStorage.setItem("queslib-autoread-switch", $setval);
					}
					else if(localStorage.getItem("queslib-autoread-switch") === "关")
					{
						return false;
					}
					return true;
				}
				$el.find("button[name='autoread-switch']").get(0).onclick = function($e)
				{
					let btn = this;
					if(autoreadSwitchGetOrSet() === "开")
					{
						autoreadSwitchGetOrSet("关");
						btn.innerText = "关";
					}
					else
					{
						autoreadSwitchGetOrSet("开");
						btn.innerText = "开";
					}
				};
				$el.find("button[name='autoread']").get(0).onclick = (function($e)
				{
					if(!autoreadSwitchGetOrSet())
					{
						return;
					}
					let btn = this;
					if(btn.start)
					{
						return btn.start = false, $(btn).text("自动浏览"), btn.timer = clearInterval(btn.timer);
					}
					// 判断向上或向下移动
					let jus = btn.jus || -1,
					// 向上或向下移动的距离
					num = queslib.scrollTop || window.scrollY || 0;
					btn.start = true, $(btn).text("手动浏览"), btn.timer = setInterval(function()
					{
						let y = queslib.scrollTop || window.scrollY;
						if(y == 0)
						{
							num++;
							// 位于顶部时向下移动
							jus = -1;
						}
						if(y > jus)
						{
							num++;
						}
						else
						{
							num--;
						}
						(queslib || window).scroll(0, num);
						// 记录上次的距离位置用来判断是否是折返方向
						btn.jus = jus = y;
					}, 25);
				});
				$(document).on("dblclick", function($e)
				{
					if(autoreadSwitchGetOrSet())
					{
						$el.find("button[name='autoread']").get(0).onclick();
					}
				});
				// 显示方式
				(function()
				{
					$el.find("button[name='showmode']").get(0).innerHTML = '按<font color="red">' + (localStorage.getItem("queslib-display-mode") || "题型") + "</font>显示";
					$el.find("button[name='showmode']").get(0).onclick = (function($e)
					{
						let btn = this;
						if(localStorage.getItem("queslib-display-mode") === "章节")
						{
							btn.innerHTML = '按<font color="red">题型</font>显示';
							localStorage.setItem("queslib-display-mode", "题型");
						}
						else
						{
							btn.innerHTML = '按<font color="red">章节</font>显示';
							localStorage.setItem("queslib-display-mode", "章节");
						}
						select.onchange();
					});
				})();
				// 设置网页背景色
				(function()
				{
					let light = "background-color: #cccccc; color: black; font-size: 18px; opacity: 0.75;", dark = "background-color: rgba(0, 0, 0, 0.75); color: #ffffff; font-size: 18px; opacity: 0.50;";
					if(localStorage.getItem("queslib-background-theme") === "日间模式")
					{
						document.body.style = light;
						select.style.backgroundColor = cloneSelect.style.backgroundColor = "#ffffff";
						$el.find("button[name='changebg']").get(0).innerText = "日间模式";
					}
					else if(localStorage.getItem("queslib-background-theme") === "夜间模式")
					{
						document.body.style = dark;
						select.style.backgroundColor = cloneSelect.style.backgroundColor = "#000000";
						$el.find("button[name='changebg']").get(0).innerText = "夜间模式";
					}
					else if((7 <= new Date().getHours()) && (new Date().getHours() <= 22))
					{
						document.body.style = light;
						select.style.backgroundColor = cloneSelect.style.backgroundColor = "#ffffff";
						$el.find("button[name='changebg']").get(0).innerText = "日间模式";
					}
					else
					{
						document.body.style = dark;
						select.style.backgroundColor = cloneSelect.style.backgroundColor = "#000000";
						$el.find("button[name='changebg']").get(0).innerText = "夜间模式";
					}
					$el.find("button[name='changebg']").get(0).onclick = (function($e)
					{
						let btn = this;
						if(btn.innerText === "日间模式")
						{
							document.body.style = dark;
							select.style.backgroundColor = cloneSelect.style.backgroundColor = "#000000";
							btn.innerText = "夜间模式";
							localStorage.setItem("queslib-background-theme", "夜间模式");
						}
						else
						{
							document.body.style = light;
							select.style.backgroundColor = cloneSelect.style.backgroundColor = "#ffffff";
							btn.innerText = "日间模式";
							localStorage.setItem("queslib-background-theme", "日间模式");
						}
					});
				})();
				// 职教云数据查看
				$el.find("button[name='icveview']").get(0).onclick = (function($e)
				{
					(/icve\-data\-view/).test(location.pathname) ? location.assign("index.html") : location.assign("icve-data-view.html");
				});
				$el.css("position", "absolute");
				$el.css("overflow", "auto");
				this._$el = $el;
			}),
			show: (function()
			{
				this._$el.show();
			}),
			hide: (function()
			{
				this._$el.hide();
			}),
			destroy: (function(){})
		});
		eruda.add(
		{
			name: "试题切换",
			init: (function($el)
			{
				eruda.util.$.switchques = (function($i)
				{
					select.selectedIndex = $i;
					select.onchange();
				});
				let html = `${nonAppearanceCss}<aside name="switchques">`;
				html += `\n${"\t".repeat(1)}<hr />`;
				let plen = $(select).find("optgroup").length;
				$(select).find("optgroup").each(function($index, $optgroup)
				{
					html += `\n${"\t".repeat(1)}<details${$optgroup.disabled ? "" : " open"}>`;
					html += `\n${"\t".repeat(2)}<summary name="optgroup" style="padding: 10px 5px; color: #2983bb;">●${$optgroup.disabled ? "<s>" : ""}${$optgroup.label}${$optgroup.disabled ? "</s>" : ""}</summary>`;
					html += `\n${"\t".repeat(2)}<hr />`;
					let clen = $($optgroup).find("option").length;
					$($optgroup).find("option").each(function($$index, $option)
					{
						let disabled = $optgroup.disabled || $option.disabled;
						disabled || (html += `\n${"\t".repeat(2)}<span name="option" style="padding: 5px;">○○<button style="color: ${disabled ? '#474b4c' : '#68b88e'}; background-color: transparent;" onclick="javascript: eruda.util.$.switchques(${$option.index});"${disabled ? " disabled" : ""}>${disabled ? "<s>" : ""}${$option.label || $option.text}${disabled ? "</s>" : ""}</button></span>`);
						if($$index < (clen - 1))
						{
							disabled || (html += `\n${"\t".repeat(2)}<hr />`);
						}
					});
					html += `\n${"\t".repeat(1)}</details>`;
					if($index < (plen - 1))
					{
						html += `\n${"\t".repeat(1)}<hr />`;
					}
				});
				html += `\n${"\t".repeat(1)}<hr />`;
				html += `\n</aside>`;
				$el.html(html);
				$el.css("position", "absolute");
				$el.css("overflow", "auto");
				this._$el = $el;
			}),
			show: (function()
			{
				this._$el.show();
			}),
			hide: (function()
			{
				this._$el.hide();
			}),
			destroy: (function(){})
		});
		eruda.add(
		{
			name: "距离考试",
			init: (function($el)
			{
				let whichWeek = function($date)
				{
					return (new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"))[(new Date($date)).getDay()];
				};
				let remain = (function($range, $year, $month, $day, $hour, $minute, $second)
				{
					let sec = Math.round((new Date($year, $month - 1, $day, $hour, $minute, $second).getTime() - Date.now()) / 1000),
					d = Math.floor(sec / (60 * 60 * 24)),
					h = Math.floor((sec / (60 * 60)) % 24),
					m = Math.floor((sec / 60) % 60),
					s = Math.floor(sec % 60);
					return (sec < 0) ? ((Date.now() < new Date(`${$year}-${$month}-${$day} ${$range[1]}:${$second}`).getTime()) ? "进行中" : "已结束") : `还剩 ${d} 天 ${h} 时 ${m} 分 ${s} 秒`;
				}), exams = [
					{
						name: "外科护理学",
						date: {
							day: "2022-06-06",
							hour: "18:30",
							until: "20:30"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷"
					},
					{
						name: "社区护理学",
						date: {
							day: "2022-06-15",
							hour: "18:30",
							until: "20:00"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷"
					},
					{
						name: "护理伦理与法律法规",
						date: {
							day: "2022-06-16",
							hour: "18:30",
							until: "20:00"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷"
					},
					{
						name: "中医护理学",
						date: {
							day: "2022-06-23",
							hour: "18:30",
							until: "20:00"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷",
						scope: "选择题	病例分析×1"
					},
					{
						name: "传染病护理学",
						date: {
							day: "2022-06-27",
							hour: "18:30",
							until: "20:00"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷",
						scope: "选择题＾A1/A2/A3/A4"
					},
					{
						name: "老年护理学",
						date: {
							day: "2022-06-30",
							hour: "18:30",
							until: "20:00"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷",
						scope: "选择题	判断题	简答题×2	病例分析×1"
					},
					{
						name: "内科护理学",
						date: {
							day: "2022-07-04",
							hour: "08:00",
							until: "10:00"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷"
					},
					{
						name: "儿科护理学",
						date: {
							day: "2022-07-05",
							hour: "08:00",
							until: "10:00"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷"
					},
					{
						name: "急危重症护理学",
						date: {
							day: "2022-07-05",
							hour: "14:30",
							until: "16:30"
						},
						room:
						{
							single: "『单』三期2号楼301",
							double: "『双』三期2号楼202"
						},
						type: "闭卷"
					}
				];
				$el.timer_func = (function()
				{
					$el.html(nonAppearanceCss + "<center><hr />" + exams.map(function($val, $index, $arrs)
					{
						let params = [[$val.date.hour, $val.date.until]].concat(($val.date.day + " " + $val.date.hour).split(/[\-\s:]/).map(Number).concat([0]));
						return (`<h1>${$val.name}
								<b>（${remain.apply(null, params)}）</b>
							</h1>
							<h3>
								<b style="color: blue;">${$val.date.day}（${whichWeek($val.date.day)}）<br />
									<b style="color: #bec936;">${[$val.date.hour, $val.date.until].join("～")}</b>
									${$val.type ? ('<br /><b style="color: #9eccab;">' + $val.type + "</b>") : ""}
									${$val.scope ? ('<br /><b style="color: #8076a3;">' + $val.scope.split("\t").join('</b><b style="color: #fffef9;">｜</b><b style="color: #8076a3;">') + "</b>") : ""}
								</b>
							</h3>
							<h6>
								<b style="color: green;">${Object.values($val.room).join("")}</b>
							</h6>`).replace(/^\s+/g, "");
					}).join("<hr />") + "<hr /></center>");
				});
				$el.get(0).contentEditable = false;
				$el.css("position", "absolute");
				$el.css("overflow", "auto");
				this._$el = $el;
			}),
			show: (function()
			{
				this._$el.timer_func();
				this._$el.timer = setInterval(this._$el.timer_func, 1000);
				this._$el.show();
			}),
			hide: (function()
			{
				this._$el.timer = clearInterval(this._$el.timer);
				this._$el.hide();
			}),
			destroy: (function()
			{
				this._$el.timer = clearInterval(this._$el.timer);
			})
		});
		// 添加其他剩余工具
		((location.protocol === "file:") ? ["console", "network", "resources", "info", "elements", "sources", "snippets"] : ["console", "network", "snippets"]).forEach(function($val, $index, $arrs)
		{
			if(eruda[eruda.util.upperFirst($val)])
			{
				eruda.add(new eruda[eruda.util.upperFirst($val)]());
			}
		});
		// 优先显示
		eruda.show("题库菜单");
	}
	catch(e)
	{
		console.warn(e);
	}
	try
	{
		let vcPlugin = new VConsole.VConsolePlugin("vcplugin", "网页菜单");
		vcPlugin.on("init", function()
		{
			console.log("vconsole plugin init");
		});
		vcPlugin.on("renderTab", function($callback)
		{
			let html = nonAppearanceCss + "<center><div>Click the tool button below</div></center>";
			$callback(html);
		});
		vcPlugin.on("addTool", function($callback)
		{
			let button1 = {
				name: "刷新网页",
				global: !false,
				data: {},
				onClick: function($event, $data)
				{
					console.log(arguments);
					if(confirm("确定要" + button1.name + "？"))
					{
						location.reload(false);
					}
				}
			};
			let button2 = {
				name: "强制刷新",
				global: !false,
				data: {},
				onClick: function($event, $data)
				{
					console.log(arguments);
					if(confirm("确定要" + button2.name + "？"))
					{
						if(window.localforage)
						{
							localforage.clear()
							.then(function()
							{
								sessionStorage.clear();
								localStorage.clear();
								location.reload(true);
							})
							.catch(console.warn);
						}
						else
						{
							sessionStorage.clear();
							localStorage.clear();
							location.reload(true);
						}
					}
				}
			};
			$callback([button1, button2]);
		});
		vcPlugin.on("addTopBar", function($callback)
		{
			let btnList = [];
			btnList.push(
			{
				name: "测试一",
				className: "",
				data: {type: "test1"},
				onClick: function($event, $data)
				{
					console.log(arguments);
				}
			});
			btnList.push(
			{
				name: "测试二",
				className: "",
				data: {type: "test2"},
				onClick: function($event, $data)
				{
					console.log(arguments);
				}
			});
			$callback(btnList);
		});
		vcPlugin.on("ready", function(){});
		vcPlugin.on("remove", function(){});
		vcPlugin.on("show", function(){});
		vcPlugin.on("hide", function(){});
		vcPlugin.on("showConsole", function(){});
		vcPlugin.on("hideConsole", function(){});
		vcPlugin.on("updateOption", function(){});
		vConsole.addPlugin(vcPlugin);
		/**
		// 添加其他剩余工具
		((location.protocol === "file:") ? ["system", "network", "element", "storage"] : []).forEach(function($val, $index, $arrs)
		{
			if(vConsole.pluginList)
			{
				if(!vConsole.pluginList[$val] || (vConsole.pluginList[$val] && !vConsole.pluginList[$val].isReady))
				{
					VConsole["VConsole" + eruda.util.upperFirst($val) + "Plugin"] && vConsole.addPlugin(new VConsole["VConsole" + eruda.util.upperFirst($val) + "Plugin"]($val, eruda.util.upperFirst($val)));
				}
			}
		});
		*/
	}
	catch(e)
	{
		console.warn(e);
	}
	try
	{
		/**
		get(i) 返回 DOM 对象
		eq(i) 返回 jQuery 对象
		指定元素内围
		prepend prependTo
		append appendTo
		dom.insertAdjacentHTML("afterbegin", "")
		dom.insertAdjacentHTML("beforeend", "")
		指定元素外围
		before insertBefore
		after insertAfter
		dom.insertAdjacentHTML("beforebegin", "")
		dom.insertAdjacentHTML("afterend", "")
		*/
		// 让 jQuery 支持二进制数据格式解析返回
		(function($, undefined)
		{
			"use strict";
			// https://api.jquery.com/jQuery.ajaxTransport/
			// use this transport for "binary" data type
			$.ajaxTransport("+binary", function($options, $originalOptions, $jqXHR)
			{
				// check for conditions and support for blob / arraybuffer response type
				if((typeof(FormData) !== "undefined") && (($options.dataType && ($options.dataType === "binary")) || ($options.data && (((typeof(ArrayBuffer) !== "undefined") && ($options.data instanceof ArrayBuffer)) || ((typeof(Blob) !== "undefined") && ($options.data instanceof Blob))))))
				{
					let xhr = ($originalOptions.xhr && $originalOptions.xhr()) || ($options.xhr && $options.xhr()) || $.ajaxSettings.xhr() || ((typeof(XMLHttpRequest) !== "undefined") ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
					return {
						// create new XMLHttpRequest
						send: (function(headers, callback)
						{
							// setup all variables
							let url = $options.url;
							let type = $options.type && $options.type.toUpperCase();
							let async = (typeof($options.async) === "boolean") ? $options.async : true;
							// blob or arraybuffer. Default is blob
							let dataType = $options.responseType || "blob";
							let data = $options.data || null;
							let username = $options.username || null;
							let password = $options.password || null;
							Array.from(["load", "error", "timeout", "abort"]).forEach(function($eventType)
							{
								xhr.addEventListener($eventType, function($e)
								{
									let responses = {};
									responses[$options.dataType] = $options.response = $jqXHR.response = xhr.response;
									// make callback and send data
									callback(xhr.status, xhr.statusText, responses, xhr.getAllResponseHeaders());
								}, false);
							});
							console.log(window.m=[$options, $originalOptions, $jqXHR])
							xhr.addEventListener("readystatechange", function($e)
							{
								(location.protocol === "file:") && console.log($e.type, {event: $e, options: $options, originalOptions: $originalOptions, jqXHR: $jqXHR}, url);
								if(typeof($originalOptions.onreadystatechange) === "function")
								{
									return $originalOptions.onreadystatechange.apply(xhr, [$e, $jqXHR]);
								}
							}, false);
							xhr.addEventListener("progress", function($progress)
							{
								if($progress.lengthComputable)
								{
									let percentComplete = ($progress.loaded / $progress.total) * 100;
									(location.protocol === "file:") && console.log("xhr", "progress", percentComplete, $progress);
								}
								if(typeof($originalOptions.onprogress) === "function")
								{
									return $originalOptions.onprogress.apply(xhr, [$progress, $jqXHR]);
								}
							}, false);
							xhr.upload && xhr.upload.addEventListener("progress", function($progress)
							{
								if($progress.lengthComputable)
								{
									let percentComplete = ($progress.loaded / $progress.total) * 100;
									(location.protocol === "file:") && console.log("xhr", "upload", "progress", percentComplete, $progress);
								}
								if(typeof($originalOptions.onprogress) === "function")
								{
									return $originalOptions.onprogress.apply(xhr, [$progress, $jqXHR]);
								}
							}, false);
							xhr.open(type || "GET", url, async, username, password);
							// setup custom headers
							for(let i in headers)
							{
								xhr.setRequestHeader(i, headers[i]);
							}
							if(typeof($options.timeout) === "number")
							{
								xhr.timeout = $options.timeout;
							}
							if($options.xhrFields && $options.xhrFields.withCredentials)
							{
								xhr.withCredentials = true;
							}
							if($options.xhrFields && (typeof($options.xhrFields.overrideMimeType) === "string"))
							{
								xhr.overrideMimeType($options.xhrFields.overrideMimeType);
							}
							xhr.responseType = dataType;
							xhr.send(data);
						}),
						abort: (function()
						{
							console.warn("二进制数据解析中断", arguments);
							xhr = null;
						})
					};
				}
				else
				{
					console.warn("浏览器不支持解析二进制数据", arguments);
				}
			});
		})(jQuery);
		$(window).one("error", function()
		{
			console.warn("加载出错了", Array.prototype.slice.apply(arguments));
			parser.api.tipmsg("加载出错了，即将刷新页面…", "error", function()
			{
				confirm("是否刷新页面？") && location.reload(false);
			});
		});
		parser.onToggleDetails = (function($el)
		{
			// 触发 DOM 元素宽高自适应事件
			$el.open && $.each($($el).find("textarea[onclick][oninput][readonly]"), function(i, n)
			{
				if((n.style.display !== "none") && !n.onclickok)
				{
					n.onclick && n.onclick();
					n.onclickok = true;
				}
			});
		});
		$(queslib || window).scroll(function()
		{
			// 触发 DOM 元素宽高自适应事件
			$.each($(queslib).find("textarea[onclick][oninput][readonly]"), function(i, n)
			{
				if((n.style.display !== "none") && !n.onclickok && this.closest("details").open)
				{
					n.onclick && n.onclick();
					n.onclickok = true;
				}
			});
		});
		setTimeout(function()
		{
			(location.protocol === "file:") ? console.log("网页最后更新时间", parser.api.parseTimeToDateStr(document.lastModified, false)) : $.ajax(
			{
				url: location.href,
				type: "HEAD",
				async: true,
				cache: false,
				success: (function($data, $status, $xhr)
				{
					console.log("网页最后更新时间", parser.api.parseTimeToDateStr($xhr.getResponseHeader("Last-Modified"), $xhr.getResponseHeader("Expires") ? false : true));
				}),
				error: (function($xhr, $status, $e)
				{
					console.warn("获取网页更新时间失败", arguments);
					console.log("网页最后更新时间", parser.api.parseTimeToDateStr(document.lastModified, false))
				})
			});
		}, 0);
		if(urlIndex && !isNaN(urlIndex) && (urlIndex >= 0))
		{
			initIndex = urlIndex;
		}
		// 外科护理学
		else if(Date.now() <= (new Date("2022-06-06 20:30:00")).getTime())
		{
			initIndex = 0;
		}
		// 社区护理学
		else if(Date.now() <= (new Date("2022-06-15 20:00:00")).getTime())
		{
			initIndex = 1;
		}
		// 护理伦理与法律法规
		else if(Date.now() <= (new Date("2022-06-16 20:00:00")).getTime())
		{
			initIndex = 2;
		}
		// 中医护理学
		else if(Date.now() <= (new Date("2022-06-23 20:00:00")).getTime())
		{
			initIndex = 3;
		}
		// 传染病护理学
		else if(Date.now() <= (new Date("2022-06-27 20:00:00")).getTime())
		{
			initIndex = 4;
		}
		// 老年护理学
		else if(Date.now() <= (new Date("2022-06-30 20:00:00")).getTime())
		{
			initIndex = 5 + 1;
		}
		// 内科护理学
		else if(Date.now() <= (new Date("2022-07-04 10:00:00")).getTime())
		{
			initIndex = 6 + 1;
		}
		// 儿科护理学
		else if(Date.now() <= (new Date("2022-07-05 10:00:00")).getTime())
		{
			initIndex = 7 + 1;
		}
		// 急危重症护理学
		else if(Date.now() <= (new Date("2022-07-05 16:30:00")).getTime())
		{
			initIndex = 8 + 1;
		}
		else if(savedIndex() && !isNaN(savedIndex()) && (savedIndex() >= 0))
		{
			initIndex = savedIndex();
		}
		select.selectedIndex = cloneSelect.selectedIndex = initIndex;
		$([select, cloneSelect]).each(function($index, $val)
		{
			// 禁用
			$($val).attr("disabled", "disabled").prop("disabled", true);
		});
		let dataBaseName = "quesdata";
		let dataFileLocal = "queslib/res/zip/" + dataBaseName + ".zip";
		let dataFileCos = "res/nosign/zip/" + dataBaseName + ".zip";
		let dataFileCdn = "res/zip/" + dataBaseName + ".nosign.zip";
		let repo = {
			cdn: "https://hn-1252239881.file.myqcloud.com/" + dataFileCdn,
			cos: "https://hn-1252239881.cos.ap-guangzhou.myqcloud.com/" + dataFileCos,
			"cos$global": "https://hn-1252239881.cos.accelerate.myqcloud.com/" + dataFileCos,
			"cos$static": "https://hn-1252239881.cos-website.ap-guangzhou.myqcloud.com/" + dataFileCos,
			local: (location.protocol !== "file:") ? (/**location.origin*/"/" + dataFileLocal) : ("https://hn-1252239881.file.myqcloud.com/" + dataFileCdn),
			"local$nowsh": "https://omeo.vercel.app/" + dataFileLocal,
			"local$git": "https://web.omeo.top/" + dataFileLocal,
			"local$eu": "https://web.omeo.eu.org/" + dataFileLocal
		},
		url = (parser.api.getUrlParam("repo") && parser.api.getUrlParam("repo").length && repo[parser.api.getUrlParam("repo")]) ? repo[parser.api.getUrlParam("repo")] : (repo.local || repo.cos),
		initdata = (function($obj)
		{
			if(!$obj || !$obj.data)
			{
				alert("题库数据缺失，加载失败！请尝试刷新一下网页！");
				console.log("本地题库数据信息", $obj);
				$.LoadingOverlay && $.LoadingOverlay("hide");
				return;
			}
			console.log("本地题库数据更新日期", $obj.date);
			JSZip.loadAsync(new Blob([parser.api.base64ToUint8Array($obj.data)], {type: "application/octet-stream"}))
			.then(function($zip)
			{
				parser.queslib = $zip;
				$([select, cloneSelect]).each(function($index, $val)
				{
					// 启用
					$($val).removeAttr("disabled").prop("disabled", false);
				});
				select.onchange();
				$.LoadingOverlay && $.LoadingOverlay("hide");
			})
			.catch(function($e)
			{
				alert("题库数据加载失败！请尝试刷新一下网页！");
				console.warn([$obj], $e);
			})
			.finally(function()
			{
				$.LoadingOverlay && $.LoadingOverlay("hide");
			});
		}),
		config = (function($xhr)
		{
			return {
				date: $xhr.getResponseHeader("Last-Modified") && (function()
				{
					let d = new Date();
					if($xhr.getResponseHeader("Expires"))
					{
						d.setTime((new Date($xhr.getResponseHeader("Last-Modified"))).getTime());
					}
					else
					{
						d.setTime((new Date($xhr.getResponseHeader("Last-Modified"))).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000));
					}
					return d.toGMTString();
				})(),
				etag: $xhr.getResponseHeader("Etag") && $xhr.getResponseHeader("Etag").match(/"(.+)"/)[1],
				size: $xhr.getResponseHeader("Content-Length") && parseInt($xhr.getResponseHeader("Content-Length"), 10)
			};
		}),
		update = (
		{
			// https://api.jquery.com/jQuery.ajax/
			// https://www.jquery123.com/jQuery.ajax/
			url: url,
			type: "GET",
			// 设置 10 分钟超时时间，文件十几兆的话网速再慢也应该能下载下来了😑
			timeout: 10 * 60 * 1000,
			async: true,
			cache: false,
			// 是否自动处理发送的数据
			processData: false,
			// 是否自动设置`Content-Type`的请求头
			contentType: false,
			// crossDomain: true,
			xhrFields: {
				// withCredentials: true,
				// overrideMimeType: "text/plain; charset=x-user-defined"
				// overrideMimeType: "application/octet-stream"
				overrideMimeType: "application/zip"
			},
			dataType: "binary",
			responseType: "arraybuffer",
			onprogress: function($e)
			{
				if($e.lengthComputable)
				{
					let percentComplete = ($e.loaded / $e.total) * 100;
					// 更新一下显示时间，延迟一下网页无响应提示时间，需要预先hook原加载框函数逻辑，否则会导致创建过多无法关闭
					$.LoadingOverlay && $.LoadingOverlay("show");
					$('[name="queslib"]').LoadingOverlay("text", (percentComplete >= 100) ? "" : percentComplete.toFixed(2) + "%");
					$('[name="queslib"]').LoadingOverlay("progress", percentComplete.toFixed(0));
					$('[name="queslib"]').LoadingOverlay("resize");
				}
				else
				{
					// 使用 true 强制关闭当前元素绑定的全部加载框
					$('[name="queslib"]').LoadingOverlay("hide", true);
				}
			},
			beforeSend: (function($jqXHR, $options)
			{
				let xhr = ($options && $options.xhr && $options.xhr()) || {};
				function insertParam($key, $value)
				{
					$key = encodeURIComponent($key);
					$value = encodeURIComponent($value);
					let s = document.location.search;
					let kvp = $key + "=" + $value;
					let r = new RegExp("(&|\?)" + $key + "=[^&]*");
					s = s.replace(r, "$1" + kvp);
					if(!RegExp.$1)
					{
						s += ((s.length > 0) ? "&" : "?") + kvp;
					}
					document.location.search = s;
				}
				let isCosRepo = (/repo=cos/).test(location.search);
				// https://gasparesganga.com/labs/jquery-loading-overlay/
				let customElement = $("<div>",
				{
					"css": {
						"position": "absolute",
						"width": "95%",
						"height": "auto",
						"border": "0",
						"margin": "0",
						"padding": "0",
						"overflow": "auto",
						"font-size": "18px",
						"text-align": "center",
						"text-decoration": "none",
						// "background": "rgb(160, 160, 160)",
						"color": "rgb(102, 102, 102)"
					},
					// parentElement = this.closest("div.loadingoverlay")
					"html": '题库数据有更新，正在进行下载，请稍等片刻…<br />（网络不通畅将导致下载缓慢&nbsp;<a style="text-decoration: none;" href="?repo=' + (isCosRepo ? "cdn" : "cos") + '">可点此' + (isCosRepo ? "加速" : "") + '解决</a>）'
				});
				$('[name="queslib"]').LoadingOverlay("show", {
					image: "",
					text: "0.00%",
					textColor: "#666",
					textResizeFactor: 0.25,
					// textAnimation: "fadein 1000ms",
					custom: customElement,
					progress: true,
					progressSpeed: 1000 / 60,
					progressFixedPosition: "top"
				});
			}),
			dataFilter: (function($data, $type)
			{
				return $data;
			}),
			success: (function($data, $status, $xhr)
			{
				if(window.localforage)
				{
					queslibCompressRes()
					.then(function($res)
					{
						let old = $res ? JSON.parse($res) : {},
						refresh = (function()
						{
							let obj = {
								date: {
									source: config($xhr).date,
									string: new Date(config($xhr).date).toString(),
									format: parser.api.parseTimeToDateStr($xhr.getResponseHeader("Last-Modified"), $xhr.getResponseHeader("Expires") ? false : true)
								},
								etag: config($xhr).etag,
								size: config($xhr).size,
								data: parser.api.arrayBufferToBase64($data)
							};
							queslibCompressRes(JSON.stringify(obj))
							.then(function($res2)
							{
								parser.api.tipmsg("题库数据已被更新", "log", function()
								{
									console.log("题库数据已被更新", obj.date.format);
								});
							})
							.catch(console.warn);
							return old = obj;
						});
						if((Object.keys(old).length == 0) || (typeof(old) !== "object") || (old.etag !== config($xhr).etag) || (typeof(old.etag) !== "string") || !old.data)
						{
							old = refresh();
						}
						initdata(old);
					})
					.catch(console.warn);
				}
				else
				{
					let old = queslibCompressRes() ? JSON.parse(queslibCompressRes()) : {},
					refresh = (function()
					{
						let obj = {
							date: {
								source: config($xhr).date,
								string: new Date(config($xhr).date).toString(),
								format: parser.api.parseTimeToDateStr($xhr.getResponseHeader("Last-Modified"), $xhr.getResponseHeader("Expires") ? false : true)
							},
							etag: config($xhr).etag,
							size: config($xhr).size,
							data: parser.api.arrayBufferToBase64($data)
						};
						queslibCompressRes(JSON.stringify(obj));
						parser.api.tipmsg("题库数据已被更新", "log", function()
						{
							console.log("题库数据已被更新", obj.date.format);
						});
						return old = obj;
					});
					if((Object.keys(old).length == 0) || (typeof(old) !== "object") || (old.etag !== config($xhr).etag) || (typeof(old.etag) !== "string") || !old.data)
					{
						old = refresh();
					}
					initdata(old);
				}
			}),
			error: (function($xhr, $status, $e)
			{
				console.warn("题库数据更新失败", arguments);
				if(window.localforage)
				{
					queslibCompressRes()
					.then(function($res)
					{
						initdata(JSON.parse($res));
					})
					.catch(console.warn);
				}
				else
				{
					queslibCompressRes() && initdata(JSON.parse(queslibCompressRes()));
				}
				/**
				self.parser && confirm("库数据更新失败！是否进行缓存？") && (location.assign(url), setTimeout(function()
				{
					if(window.localforage)
					{
						localforage.clear()
						.then(function()
						{
							sessionStorage.clear();
							localStorage.clear();
							location.reload(true);
						})
						.catch(console.warn);
					}
					else
					{
						sessionStorage.clear();
						localStorage.clear();
						location.reload(true);
					}
				}, 100));*/
				confirm("库数据更新失败！是否进行刷新？") && location.reload(true);
			}),
			complete: (function($xhr, $status)
			{
				$('[name="queslib"]').LoadingOverlay("hide", true);
			})
		}),
		doUpdate = function()
		{
			return $.ajax(update);
		};
		$.ajax(
		{
			url: url,
			type: "HEAD",
			async: true,
			cache: false,
			success: function($data, $status, $xhr)
			{
				if(window.localforage)
				{
					queslibCompressRes()
					.then(function($res)
					{
						let old = $res ? JSON.parse($res) : {};
						if((Object.keys(old).length == 0) || (typeof(old) !== "object") || (old.etag !== config($xhr).etag) || (typeof(old.etag) !== "string") || !old.data)
						{
							doUpdate();
						}
						else
						{
							initdata(old);
						}
					})
					.catch(console.warn);
				}
				else
				{
					let old = queslibCompressRes() ? JSON.parse(queslibCompressRes()) : {};
					if((Object.keys(old).length == 0) || (typeof(old) !== "object") || (old.etag !== config($xhr).etag) || (typeof(old.etag) !== "string") || !old.data)
					{
						doUpdate();
					}
					else
					{
						initdata(old);
					}
				}
			},
			error: function($xhr, $status, $e)
			{
				console.warn("无法获取题库数据更新信息", arguments);
				if(window.localforage)
				{
					queslibCompressRes()
					.then(function($res)
					{
						initdata(JSON.parse($res));
					})
					.catch(console.warn);
				}
				else
				{
					queslibCompressRes() && initdata(JSON.parse(queslibCompressRes()));
				}
			}
		});
		/**
		if(typeof(JSZipUtils) !== "object")
		{
			return alert("JSZipUtils 未加载");
		}
		JSZipUtils.getBinaryContent(url, (function($err, $data)
		{
			if(typeof(JSZip) !== "function")
			{
				return alert("JSZip 未加载");
			}
			$err ? console.warn("题库数据获取失败", $err) : JSZip.loadAsync($data)
			.then(function($zip)
			{
				$zip.file("index.html").async("string", console.log).then(console.log).catch(console.warn);
			})
			.catch(console.warn);
		}));
		*/
	}
	catch(e)
	{
		console.warn(e);
	}
	// 每隔30秒刷新访问数据的显示
	setInterval(function()
	{
		try
		{
			// 清理控制台日志
			if(window.eruda && eruda.get && (location.protocol !== "file:"))
			{
				// 定量清理控制台日志，防止卡顿
				if(eruda.get("console") && eruda.get("console")._logger && eruda.get("console")._logger._logs)
				{
					if(eruda.get("console")._logger._logs.length > 100)
					{
						eruda.get("console").clear && eruda.get("console").clear();
						window.console && console.clear && console.clear();
						console.log("eruda", "console records", "was cleaned.");
					}
				}
				// 定量清理网络请求日志，防止卡顿
				if(eruda.get("network") && eruda.get("network").requests)
				{
					if(eruda.get("network").requests().length > 100)
					{
						eruda.get("network").clear && eruda.get("network").clear();
						console.log("eruda", "network records", "was cleaned.");
					}
				}
				if(eruda.get("console") && eruda.get("console").config && eruda.get("console").config.set && !eruda["console.config.set.ok"])
				{
					// https://github.com/liriliri/eruda/blob/master/doc/TOOL_API.md#console
					eruda.get("console").config.set("asyncRender", true);
					eruda.get("console").config.set("jsExecution", true);
					eruda.get("console").config.set("catchGlobalErr", true);
					eruda.get("console").config.set("overrideConsole", true);
					eruda.get("console").config.set("displayIfErr", false);
					eruda.get("console").config.set("displayExtraInfo", false);
					eruda.get("console").config.set("displayUnenumerable", true);
					eruda.get("console").config.set("displayGetterVal", true);
					eruda.get("console").config.set("lazyEvaluation", true);
					eruda.get("console").config.set("maxLogNum", "125");
					eruda["console.config.set.ok"] = true;
					console.log("eruda", "console config", "was updated.");
				}
				if(eruda.get("resources") && eruda.get("resources").config && eruda.get("resources").config.set && !eruda["resources.config.set.ok"])
				{
					// https://github.com/liriliri/eruda/blob/master/doc/TOOL_API.md#resources
					eruda.get("resources").config.set("hideErudaSetting", true);
					eruda.get("resources").config.set("observeElement", true);
					eruda["resources.config.set.ok"] = true;
					console.log("eruda", "resources config", "was updated.");
				}
				if(eruda.get("elements") && eruda.get("elements").config && eruda.get("elements").config.set && !eruda["elements.config.set.ok"])
				{
					// https://github.com/liriliri/eruda/blob/master/doc/TOOL_API.md#elements
					eruda.get("elements").config.set("overrideEventTarget", true);
					eruda.get("elements").config.set("observeElement", true);
					eruda["elements.config.set.ok"] = true;
					console.log("eruda", "elements config", "was updated.");
				}
				if(eruda.get("sources") && eruda.get("sources").config && eruda.get("sources").config.set && !eruda["sources.config.set.ok"])
				{
					// https://github.com/liriliri/eruda/blob/master/doc/TOOL_API.md#sources
					eruda.get("sources").config.set("showLineNum", true);
					eruda.get("sources").config.set("formatCode", true);
					eruda.get("sources").config.set("indentSize", "3");
					eruda["sources.config.set.ok"] = true;
					console.log("eruda", "sources config", "was updated.");
				}
			}
			if(window.vConsole && (location.protocol !== "file:"))
			{
				if(vConsole.log && vConsole.log.clear)
				{
					if(vConsole.pluginList && vConsole.pluginList.default && vConsole.pluginList.default.compInstance && vConsole.pluginList.default.compInstance.$$ && vConsole.pluginList.default.compInstance.$$.ctx && vConsole.pluginList.default.compInstance.$$.ctx[5] && vConsole.pluginList.default.compInstance.$$.ctx[5].logList)
					{
						if(vConsole.pluginList.default.compInstance.$$.ctx[5].logList.length > 100)
						{
							vConsole.log.clear();
							window.console && console.clear && console.clear();
							console.log("vConsole", "log records", "was cleaned.");
						}
					}
					else
					{
						vConsole.log.clear();
						console.log("vConsole", "else", "log records", "was cleaned.");
					}
				}
				if(vConsole.system && vConsole.system.clear)
				{
					if(vConsole.pluginList && vConsole.pluginList.system && vConsole.pluginList.system.compInstance && vConsole.pluginList.system.compInstance.$$ && vConsole.pluginList.system.compInstance.$$.ctx && vConsole.pluginList.system.compInstance.$$.ctx[5] && vConsole.pluginList.system.compInstance.$$.ctx[5].logList)
					{
						if(vConsole.pluginList.system.compInstance.$$.ctx[5].logList.length > 100)
						{
							vConsole.system.clear();
							console.log("vConsole", "system records", "was cleaned.");
						}
					}
					else
					{
						vConsole.system.clear();
						console.log("vConsole", "else", "system records", "was cleaned.");
					}
				}
				if(vConsole.network && vConsole.network.clear)
				{
					if(vConsole.pluginList && vConsole.pluginList.network && vConsole.pluginList.network.compInstance && vConsole.pluginList.network.compInstance.$$ && vConsole.pluginList.network.compInstance.$$.ctx && vConsole.pluginList.network.compInstance.$$.ctx[1])
					{
						if(Object.keys(vConsole.pluginList.network.compInstance.$$.ctx[1]).length > 100)
						{
							vConsole.network.clear();
							console.log("vConsole", "network records", "was cleaned.");
						}
					}
					else
					{
						vConsole.network.clear();
						console.log("vConsole", "else", "network records", "was cleaned.");
					}
				}
				if(!vConsole["option.set.ok"])
				{
					vConsole.setOption("log.maxLogNumber", 125);
					vConsole.setOption("log.maxNetworkNumber", 125);
					vConsole["option.set.ok"] = true;
					console.log("vConsole", "option", "was updated.");
				}
			}
		}
		catch(e)
		{
			console.warn(e);
		}
		// 网络不可用时不执行，页面不可见时不执行
		if(!parser.isOnline || !parser.isVisible)
		{
			return;
		}
		try
		{
			// 网页统计，本地下不执行以免造成假数据
			if((location.protocol !== "file:") && window.LA && LA.config)
			{
				$.get(("https://v6-widget.51.la/v6/JeaQ7widyBhiJfwS/quote.js?_=" + Date.now() + "&theme=#1690FF,#333333,#1690FF,#1690FF,#FFFFFF,#1690FF,10&f=10&display=0,1,1,1,1,1,1,1").replace(/\#/g, "%23")/**.replace(/\&/g, "%26").replace(/\=/g, "%3D")*/, null, null, "text")
				.done(function($data)
				{
					let newMatchs = $data.match(/r\.innerHTML\=\"(.+?)\"\,/m);
					if(newMatchs && (newMatchs.length >= 2))
					{
						/**
						<p>网站数据概况</p>
						<p>
							<span>0</span><span>1</span>
						</p>
						<p>
							<span>1</span><span>30</span>
						</p>
						<p>
							<span>2</span><span>31</span>
						</p>
						<p>
							<span>3</span><span>96</span>
						</p>
						<p>
							<span>4</span><span>139</span>
						</p>
						<p>
							<span>5</span><span>758</span>
						</p>
						<p>
							<span>6</span><span>1103</span>
						</p>
						*/
						let newHTML = newMatchs[1];
						let newBody = (new DOMParser()).parseFromString(newHTML, "text/html").body;
						let newData = [];
						Array.from(newBody.children).forEach(function($paragraph)
						{
							// 若有两个以上的`<span></span>`
							if($paragraph.querySelectorAll("span").item(1))
							{
								// 添加返回的文本值
								newData.push($paragraph.querySelectorAll("span").item(1).innerText);
							};
						});
						// console.log("newData", newData);
						if(newData.length > 0)
						{
							/**
							<span class="la-widget la-data-widget__container">
								<span>
									<span>最近活跃访客</span><span>0</span>
								</span>
								<span>
									<span>今日访问人数</span><span>29</span>
								</span>
								<span>
									<span>今日访问量</span><span>30</span>
								</span>
								<span>
									<span>昨日访问人数</span><span>96</span>
								</span>
								<span>
									<span>昨日访问量</span><span>139</span>
								</span>
								<span>
									<span>本月访问量</span><span>757</span>
								</span>
								<span>
									<span>总访问量</span><span>1,102</span>
								</span>
							</span>
							*/
							let oldHTML = document.querySelector("[name='la-widget'] [name='la-widget-show'] [name='la-widget-text'] .la-widget.la-data-widget__container");
							if(oldHTML != null)
							{
								let toBankNum = function($num)
								{
									return String($num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
								};
								let oldData = [];
								Array.from(oldHTML.children).forEach(function($span, $i)
								{
									// 若有两个以上的`<span></span>`
									if($span.querySelectorAll("span").item(1))
									{
										// 添加返回的文本值
										oldData.push($span.querySelectorAll("span").item(1).innerText);
										$span.querySelectorAll("span").item(1).innerText = toBankNum(Number(newData[$i]));
									}
								});
								// console.log("oldData", oldData);
								if(oldData.length > 0)
								{
									let newOnline = Number(newData[0]);
									let oldOnline = Number(oldData[0]);
									// 活跃用户增加或活跃用户减少
									if((newOnline > oldOnline) || (newOnline < oldOnline))
									{
										parser.api.tipmsg("当前有 " + newOnline + " 人在线", null, null, 3000);
									}
									sessionStorage.setItem("queslib-online-num", String(newOnline));
								}
							}
						}
					}
				})
				.fail(console.warn);
			}
		}
		catch(e)
		{
			console.warn(e);
		}
		try
		{
			// 热更新、热修复
			if(location.protocol === "file:")
			{
				let s = document.createElement("script");
				s.type = "text/javascript";
				s.charset = "UTF-8";
				s.src = "res/js/web.patcher.js?_=" + Date.now();
				s.onload = s.onerror = s.onabort = s.ontimeout = (function($$e)
				{
					this.remove();
				});
				(location.protocol !== "file:") && (s.crossorigin = "anonymous");
				document.body.appendChild(s);
			}
			else
			{
				$.get("res/js/web.patcher.js?_=" + Date.now(), null, null, "text")
				.done(function($data)
				{
					eval($data);
				})
				.fail(console.warn);
			}
		}
		catch(e)
		{
			console.warn(e);
		}
	}, 30000);
});
parser.api.cnzzPush = (function($arrs)
{
	/**
	this.cnzzPush.datas = this.cnzzPush.datas || [];
	this.cnzzPush.datas.push($arrs.slice(0));
	(typeof(_czc) !== "undefined") && _czc.push && _czc.push($arrs.slice(0));
	return this.cnzzPush.datas;
	*/
	return [];
});
parser.api.getUrlParam = (function($name)
{
	let reg = new RegExp("(^|&)" + $name + "=([^&]*)(&|$)"), r = location.search.substr(1).match(reg);
	return (r && r[2]) || null;
});
parser.api.dump = (function($obj)
{
	if(location.protocol === "file:")
	{
		if($("textarea[name='dump']").length == 0)
		{
			$(`<textarea name="dump" wrap="hard" rows="1" onclick="javascript: this.oninput();" oninput="javascript: this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';" style="display: none; overflow: auto; float: center; margin: 0 auto; border: 0; width: 100%; white-space: pre;" readonly><pre style="word-break: normal; word-wrap: normal; white-space: pre-wrap;" contenteditable>${document.documentElement.outerHTML.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")}</pre></textarea>`).prependTo("main");
		}
		let cache = [];
		return $("textarea[name='dump']").eq(0).val((typeof($obj) !== "string") ? JSON.stringify($obj, function($key, $value)
		{
			if((typeof($value) === "object") && ($value !== null))
			{
				// 避免递归引用异常
				if(cache.includes($value))
				{
					return "*" + $key + "*";
				}
				cache.push($value);
			}
			// 避免网页卡死
			if($value instanceof Uint8Array)
			{
				return "new Uint8Array([" + $value + "])";
			}
			return $value;
		}, "\t") : $obj).show().click();
	}
});
parser.api.download = (function($data, $name, $type, $target)
{
	let objURL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL || window.OURL;
	if(!objURL)
	{
		return null;
	}
	if(typeof($name) === "string")
	{
		$name = decodeURIComponent($name)
		// 编码（进行3次"encodeURIComponent(encodeURIComponent(encodeURIComponent()))"）不可作为路径的字符
		// "/"
		.replace(/\//g, "%25252F")
		// "?"
		.replace(/\?/g, "%25253F")
		// ":"
		.replace(/\:/g, "%25253A")
		// "\"
		.replace(/\\/g, "%25255C");
	}
	// 创建内存引用
	let d = objURL.createObjectURL(new Blob([$data || document.documentElement.outerHTML || (function()
	{
		try
		{
			return (new XMLSerializer()).serializeToString(document);
		}
		catch(e)
		{
			console.warn(e);
		}
		return document.documentElement.innerHTML;
	})()], {type: $type || "application/octet-stream"}));
	let a = document.createElement("a");
	// IE 浏览器
	if(navigator.msSaveOrOpenBlob)
	{
		a = navigator.msSaveOrOpenBlob(d, $name || (parser.api.uuid() + ".bin"));
	}
	else
	{
		a.href = d;
		a.download = $name || (d.toString().match(/([^:\/]+)/g).slice().reverse()[0] + ".bin");
		a.target = $target || "_self";
		a.style.display = "none";
		document.documentElement.appendChild(a);
		a.click();
		setTimeout(function()
		{
			document.documentElement.removeChild(a);
		}, 500);
	}
	// 释放内存引用
	objURL.revokeObjectURL(d);
	return a;
});
parser.api.downloadWithUrl = (function($url, $noreferrer, $target)
{
	let a = document.createElement("a");
	a.href = $url;
	a.target = $target || "_self";
	if($noreferrer)
	{
		a.rel = "noreferrer";
	}
	a.style.display = "none";
	document.documentElement.appendChild(a);
	a.click();
	setTimeout(function()
	{
		document.documentElement.removeChild(a);
	}, 500);
	return a;
});
parser.api.check_answers = (function(_answer_text)
{
	// 纯选择题答案检查
	var chapters = _answer_text.split("\n\n"), answers = [];
	$(chapters).each((_index, _val) => {
		answers[_index] = [];
		_val.replace(/([0-9]{1,})\.([A-Z]{1,})/ig, function(_match, capture_1, capture_2)
		{
			answers[_index].push(capture_2);
		});
	});
	/** 遍历章节元素 */
	$("center[name='chapter']").each((_index, _val) => {
		/** 遍历题目数据 */
		$(JSON.parse(_val.querySelector("button").value)).each(function(_index2, _val2)
		{
			var answer = "";
			/** 遍历每个选项 */
			$("[name=\"" + _val2.name + "\"]").each(function(_index3, _val3)
			{
				if(_val3.checked)
				{
					answer += ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"][_index3];
				}
			});
			if(answer != answers[_index][_index2])
			{
				console.log(`第 ${["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四"][_index]} 章第 ${_index2 + 1} 题答案有误，正确答案为 ${answers[_index][_index2]}，错误选择为 ${answer/** $(_val3).parent().text()*/}`);
			}
		});
	});
});
parser.api.parseTimeToDateStr = (function(_st, _isUTC)
{
	var date = new Date(_st),
	v = (function(_s)
	{
		return (_s < 10) ? ("0" + _s) : _s;
	}),
	str = _isUTC ? (date.getUTCFullYear() + "-" + v(date.getUTCMonth() + 1) + "-" + v(date.getUTCDate()) + " " + v(date.getUTCHours()) + ":" + v(date.getUTCMinutes()) + ":" + v(date.getUTCSeconds()) + ((date.getUTCMilliseconds() == 0) ? "" : (" " + date.getUTCMilliseconds()))) : (date.getFullYear() + "-" + v(date.getMonth() + 1) + "-" + v(date.getDate()) + " " + v(date.getHours()) + ":" + v(date.getMinutes()) + ":" + v(date.getSeconds()) + ((date.getMilliseconds() == 0) ? "" : (" " + date.getMilliseconds())));
	return str;
});
parser.api.tipmsg = (function($msg, $type, $callback, $timeout)
{
	let colors = {log: "MediumSeaGreen", info: "DodgerBlue", debug: "LightSlateGray", warn: "LightGoldenRodYellow", error: "OrangeRed"};
	this.tipmsg.queues = this.tipmsg.queues || [];
	let el = $(`<strong id="tip-msg-${parser.api.uuid()}" style="display: none; position: fixed; top: ${50 * (this.tipmsg.queues.length + 1) / 2}px; left: -5px; right: -5px; width: 100%; z-index: 9999; float: center; margin: 0 auto; text-align: center;"></strong>`).appendTo("body");
	this.tipmsg.queues.push(el.get(0));
	el.html($msg)
	.css("color", ($type && colors[$type]) || colors["log"])
	.stop(true, true)
	.fadeIn(500)
	.delay($timeout || 2000)
	.fadeOut(500, function()
	{
		$callback && $callback();
		el.remove();
		parser.api.tipmsg.queues.shift();
	});
});
parser.api.sleep = (function(_time)
{
	var start = (new Date()).getTime();
	while(((new Date()).getTime() - start) <= _time)
	{
		continue;
	}
});
parser.api.delay = (function(_delay)
{
	return (new Promise(function(_resolve, _reject)
	{
		setTimeout(_resolve, _delay);
	}))
	.catch(function($e)
	{
		console.warn($e);
		throw $e;
	});
});
parser.api.translateToBinaryString = (function(_text)
{
	var out;
	out = "";
	for(i = 0; i < _text.length; i++)
	{
		out += String.fromCharCode(_text.charCodeAt(i) & 0xff);
	}
	return out;
});
parser.api.base64ToUint8Array = (function(_str)
{
	var padding = "=".repeat((4 - _str.length % 4) % 4);
	var base64 = (_str + padding).replace(/\-/g, "+").replace(/_/g, "/");
	var rawData = atob(base64);
	var bytes = new Uint8Array(rawData.length);
	for(var i = 0; i < rawData.length; ++i)
	{
		bytes[i] = rawData.charCodeAt(i);
	}
	return bytes;
});
parser.api.arrayBufferToBase64 = (function(_ab)
{
	return btoa(parser.api.uint8ArrayToString(new Uint8Array(_ab)));
	/**
	var reader = new FileReader();
	reader.onload = (function(e)
	{
		var base64 = reader.result || e.target.result;
		console.log(base64 = base64.split(",").slice(-1)[0]);
	});
	reader.readAsDataURL(new Blob([_ab]));
	*/
});
parser.api.uint8ArrayToString = (function(_u8a)
{
	var str = "";
	for(var i = 0; i < _u8a.byteLength; i++)
	{
		str += String.fromCharCode(_u8a[i]);
	}
	return str;
});
parser.api.uuid = (function()
{
	var S4 = (function()
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	});
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
});
// 文本相似度计算 parser.api.dump((parser.api.similar("", "", 2) * 100) + "%");
parser.api.similar = (function(s, t, f)
{
	if(!s || !t)
	{
		return 0;
	}
	var l = (s.length > t.length) ? s.length : t.length;
	var n = s.length;
	var m = t.length;
	var d = [];
	f = f || 3;
	var min = (function(a, b, c)
	{
		return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
	});
	var i, j, si, tj, cost;
	if(n === 0)
	{
		return m;
	}
	if(m === 0)
	{
		return n;
	}
	for(i = 0; i <= n; i++)
	{
		d[i] = [];
		d[i][0] = i;
	}
	for(j = 0; j <= m; j++)
	{
		d[0][j] = j;
	}
	for(i = 1; i <= n; i++)
	{
		si = s.charAt(i - 1);
		for(j = 1; j <= m; j++)
		{
			tj = t.charAt(j - 1);
			if(si === tj)
			{
				cost = 0;
			}
			else
			{
				cost = 1;
			}
			d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
		}
	}
	let res = (1 - (d[n][m] / l));
	return res.toFixed(f);
});
// Changes XML to JSON https://davidwalsh.name/convert-xml-json
parser.api.xmlToJson = (function(_xml)
{
	var obj = {};
	if(_xml.nodeType == 1)
	{
		// ELEMENT_NODE
		if(_xml.attributes)
		{
			if(_xml.attributes.length > 0)
			{
				obj["@attributes"] = {};
				for(var j = 0; j < _xml.attributes.length; j++)
				{
					var attribute = _xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		}
	}
	else if(_xml.nodeType == 3)
	{
		// TEXT_NODE #text
		return obj = ((_xml.nodeValue == "\n") || (_xml.nodeValue == "\r\n")) ? undefined : _xml.nodeValue;
	}
	else if(_xml.nodeType == 4)
	{
		// DOCUMENT_POSITION_FOLLOWING #cdata-section
		return obj = _xml.data;
	}
	else if(_xml.nodeType == 9)
	{
		// DOCUMENT_NODE
		obj["@attributes"] = {version: _xml.xmlVersion, encoding: _xml.xmlEncoding};
	}
	else
	{
		console.warn("存在未处理的XML节点类型", _xml.nodeType);
	}
	// do children
	if(_xml.hasChildNodes())
	{
		for(var i = 0; i < _xml.childNodes.length; i++)
		{
			var item = _xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if(typeof(obj[nodeName]) == "undefined")
			{
				obj[nodeName] = parser.api.xmlToJson(item);
			}
			else
			{
				if(typeof(obj[nodeName].push) == "undefined")
				{
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(parser.api.xmlToJson(item));
			}
		}
	}
	return obj;
});
parser.api.xmlToJsonNoAttrs = (function(_xml)
{
	var obj = {};
	if(_xml.children.length > 0)
	{
		for(var i = 0; i < _xml.children.length; i++)
		{
			var item = _xml.children.item(i);
			var nodeName = item.nodeName;
			if(typeof(obj[nodeName]) == "undefined")
			{
				obj[nodeName] = parser.api.xmlToJsonNoAttrs(item);
			}
			else
			{
				if(typeof(obj[nodeName].push) == "undefined")
				{
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(parser.api.xmlToJsonNoAttrs(item));
			}
		}
	}
	else
	{
		obj = _xml.textContent;
	}
	return obj;
});
parser.api.getMatchValOr = (function($match, $index, $default)
{
	if($match)
	{
		return $match[$index];
	}
	return $default;
});
// 简单文本试题解析
parser.txt.simple = (function($title, $data)
{
	function matchValueOr($$match, $$index, $$default)
	{
		if($$match)
		{
			return $$match[$$index];
		}
		return $$default;
	}
	function addOtherMatch($$type, $$line, $$obj)
	{
		if(!$$obj || !$$line)
		{
			return;
		}
		if(parser.re._answer_begin.test($$line))
		{
			$$obj.answer = String($$line.match(parser.re._answer_begin)[2]).trim();
		}
		else if(parser.re._coeffic_begin.test($$line))
		{
			$$obj.coeffic = String($$line.match(parser.re._coeffic_begin)[2]).trim();
		}
		else if(parser.re._analysis_begin.test($$line))
		{
			$$obj.analysis = String($$line.match(parser.re._analysis_begin)[2]).trim();
		}
		else
		{
			console.warn("文本解析", $$type, "未知选项", $$line);
		}
	}
	function choicesParser($$type, $$questr, $$arrs, $$logtype)
	{
		let arrs = [];
		if(!$$questr)
		{
			return arrs;
		}
		let ques = Array.isArray($$questr) ? $$questr : $$questr.trim().split("\n\n");
		for(let q = 0; q < ques.length; q++)
		{
			let lines = ques[q].trim().split("\n");
			let title = (function()
			{
				// 兼容答案在单独第一行的特殊情况
				if(parser.re._answer_aline.test(lines[0].trim()))
				{
					if((lines[0].trim().split("").length > 1) && !(/多/).test($$type || $$logtype))
					{
						console.warn("choicesParser", "题型与答案数不匹配", $$type || $$logtype, lines[0], lines, arguments);
					}
					lines.push("参考答案：" + lines[0].trim());
					lines = lines.slice(1);
				}
				return lines[0].trim().replace(parser.re.quesnum, "").trim();
			})();
			lines = lines.slice(1);
			let opts = [];
			let que = {
				type: $$type ? $$type : undefined,
				title: title,
				options: [],
				answer: undefined,
				coeffic: undefined,
				analysis: undefined
			};
			let hasAnswer = false;
			for(let l = 0; l < lines.length; l++)
			{
				// 以字母开头为选项
				if(parser.re._optname.test(lines[l].trim()))
				{
					que.options.push(
					{
						name: String(lines[l].trim().match(parser.re._optname)[1]).trim(),
						title: lines[l].trim().replace(parser.re._optname, "").trim().replace(parser.re._answer_ended, "").trim(),
						right: parser.re._answer_ended.test(lines[l].trim())
					});
					// 其他标注答案方法
					if(parser.re._answer_ended.test(lines[l].trim()))
					{
						hasAnswer = true;
					}
				}
				else
				{
					addOtherMatch($$type, lines[l].trim(), que);
				}
			}
			if(que.answer)
			{
				for(let o = 0; o < que.options.length; o++)
				{
					if(que.answer.split("").includes(que.options[o].name))
					{
						que.options[o].right = true;
					}
				}
			}
			else if(hasAnswer)
			{
				for(let o = 0; o < que.options.length; o++)
				{
					if(que.options[o].right)
					{
						if(!que.answer)
						{
							que.answer = "";
						}
						que.answer += que.options[o].name;
					}
				}
			}
			else
			{
				console.warn("文本解析", $$type || $$logtype, "答案未知", ques[q].trim());
			}
			$$arrs && $$arrs.push(que);
			arrs.push(que);
		}
		return arrs;
	}
	let all = {};
	all["name"] = $title && decodeURIComponent($title);
	all["questions"] = [];
	if(!$data || ($data.trim() === ""))
	{
		return all;
	}
	let data = $data.split("\n\n\n");
	for(let i = 0; i < data.length; i++)
	{
		let type = parser.type.default, isDefault = true;
		let questr = data[i].trim().replace(parser.re._type, function($$match, $$type, $$offset, $$str)
		{
			// 题型
			type = $$type, isDefault = false;
			return "";
		}).replace(parser.re._chapter, function($$match, $$chapter, $$offset, $$str)
		{
			// 章节描述
			console.log("章节", all["name"], $$chapter);
			return "";
		}).replace(parser.re._note, function($$match, $$note, $$offset, $$str)
		{
			// 注释信息
			console.log("注释", all["name"], $$note);
			return "";
		}).trim();
		if(isDefault)
		{
			console.warn("未匹配到题型", "使用默认题型", type, data[i], data, arguments);
		}
		if(questr !== "")
		{
			// 单选题 多选题
			if(parser.type.choices.alone.includes(type))
			{
				choicesParser(type, questr, all["questions"]);
			}
			// 共用题干单选题
			else if(parser.type.choices.share.title.includes(type))
			{
				let ques = questr.split("\n\n");
				let title = ques[0].trim().replace(parser.re.quesnum, "").trim();
				ques = ques.slice(1);
				all["questions"].push(
				{
					type: type,
					title: title,
					children: choicesParser(null, ques, null, type)
				});
			}
			// 共用答案单选题
			else if(parser.type.choices.share.answer.includes(type))
			{
				let ques = questr.split("\n\n");
				let title = ques[0].trim().replace(parser.re.quesnum, "").trim();
				ques = ques.slice(1);
				let options = [];
				let children = [];
				title.split("\n").forEach(function($$line, $$index, $$lines)
				{
					options.push(
					{
						name: String($$line.trim().match(parser.re._optname)[1]).trim(),
						title: $$line.trim().replace(parser.re._optname, "").trim()
					});
				});
				ques.forEach(function($$que, $$index, $$ques)
				{
					let q = $$que.trim().split("\n");
					let t = (function()
					{
						// 兼容答案在单独第一行的特殊情况
						if(parser.re._answer_aline.test(q[0].trim()))
						{
							if(q[0].trim().split("").length > 1)
							{
								console.warn("共用答案单选题答案数量过多", q[0], q, arguments);
							}
							q.push("参考答案：" + q[0].trim());
							q = q.slice(1);
						}
						return q[0].trim().replace(parser.re.quesnum, "").trim();
					})();
					q = q.slice(1);
					let o = {
						type: undefined,
						title: t,
						answer: undefined,
						coeffic: undefined,
						analysis: undefined
					};
					q.forEach(function($$$line, $$$index, $$$lines)
					{
						addOtherMatch(type, $$$line.trim(), o);
					});
					children.push(o);
				});
				all["questions"].push(
				{
					type: type,
					options: options,
					children: children
				});
			}
			// 文字-填空题 文字-作答题
			else if(parser.type.answers.fill.includes(type) || parser.type.answers.word.includes(type))
			{
				questr.split("\n\n").forEach(function($$line, $$index, $$lines)
				{
					$$line = $$line.trim().replace(parser.re._note, function($$$match, $$$note, $$$offset, $$$str)
					{
						// 注释信息
						console.log("注释", all["name"], $$$note);
						return "";
					}).trim();
					let o = {
						type: type,
						title: $$line.trim().replace(parser.re.quesnum, "").trim().replace(parser.re._answer, "").trim().replace(parser.re._coeffic, "").trim().replace(parser.re._analysis, "").trim(),
						coeffic: matchValueOr($$line.trim().match(parser.re._coeffic), 1),
						analysis: matchValueOr($$line.trim().match(parser.re._analysis), 1)
					};
					let answer = matchValueOr($$line.trim().match(parser.re._answer), 1);
					// 文字-填空题
					if(parser.type.answers.fill.includes(type))
					{
						o.answers = (function()
						{
							let answers = [];
							answer && answer.trim().split("\n").forEach(function($$$line, $$$index, $$$lines)
							{
								answers.push($$$line.trim());
							});
							return answers;
						})();
					}
					// 文字-作答题
					else
					{
						o.answer = answer;
					}
					all["questions"].push(o);
				});
			}
			else
			{
				console.warn("文本解析", "未知题型", type);
			}
		}
	}
	(location.protocol === "file:") && console.log("›plain-txt", all);
	return all;
});
parser.json.forceToObj = (function($json, $default)
{
	// 可能返回 Object{} 或 Array[]
	let obj = $default || {};
	if(typeof($json) !== "object")
	{
		try
		{
			obj = JSON.parse($json);
		}
		catch(e)
		{
			try
			{
				obj = (new Function("return " + $json + ";")).apply(null);
			}
			catch(ee)
			{
				try
				{
					obj = eval("(" + $json + ")");
				}
				catch(eee)
				{
					console.warn(e, ee, eee);
				}
			}
		}
		if(!obj || (typeof(obj) !== "object"))
		{
			return $default || {};
		}
	}
	else
	{
		obj = $json;
	}
	return obj;
});
// 云课堂智慧职教APP-职教云JSON试题解析
parser.json.icveappzjy2 = (function($title, $json, $uniqueReference, $useStudentAnswer/** 是否使用学生回答的答案（在系统提供的答案是错误的情况下很有用） */)
{
	if($useStudentAnswer)
	{
		console.log("职教云APP试题解析", "使用学生回答的答案", arguments);
	}
	let all = {};
	all["name"] = $title && decodeURIComponent($title);
	all["questions"] = [];
	$json = parser.json.forceToObj($json, {});
	if($json.data)
	{
		if($json.data.homeworkTitle || $json.data.examTitle)
		{
			all["name"] = $json.data.homeworkTitle || $json.data.examTitle;
			$json.data.questions.forEach(function($$que, $$i, $$ques)
			{
				if($uniqueReference && (typeof($$que.questionId) === "string"))
				{
					// 去重结果
					if(!Array.isArray($uniqueReference.k))
					{
						$uniqueReference.k = [];
					}
					// 原有题数
					if(!Array.isArray($uniqueReference.origin))
					{
						$uniqueReference.origin = [];
					}
					// 已去题数
					if(!Array.isArray($uniqueReference.culled))
					{
						$uniqueReference.culled = [];
					}
					// 去重结果
					if(typeof($uniqueReference.kv) !== "object")
					{
						$uniqueReference.kv = {};
					}
					$uniqueReference.origin.push($$que.questionId);
					if($uniqueReference.kv[$$que.questionId])
					{
						// use console.info
						console.info("JSON试题解析重复过滤", "当前", $$que, "已有", $uniqueReference.kv[$$que.questionId], $uniqueReference);
						$uniqueReference.culled.push($$que.questionId);
						return;
					}
					else
					{
						$uniqueReference.k.push($$que.questionId);
						$uniqueReference.kv[$$que.questionId] = $$que;
					}
				}
				else if($uniqueReference)
				{
					console.warn("JSON试题解析重复过滤", "受阻", typeof($$que.questionId), $$que.questionId, $$que);
				}
				let dataJson = parser.json.forceToObj($$que.dataJson, []);
				if($$que.queTypeName === "单选题")
				{
					all["questions"].push(
					{
						type: $$que.queTypeName,
						title: $$que.title,
						options: (function()
						{
							let opts = [];
							dataJson.forEach(function($$$opt, $$$i, $$$opts)
							{
								opts[$$$opt.SortOrder] = (
								// opts.push(
								{
									name: parser.const.optionNames[$$$opt.SortOrder/**$$$i*/],
									title: $$$opt.Content && $$$opt.Content.trim(),
									right: $useStudentAnswer ? (String($$$opt.SortOrder) === String($$que.studentAnswer)) : $$$opt.IsAnswer
								});
							});
							return opts;
						})(),
						answer: $useStudentAnswer ? ($$que.studentAnswer ? parser.const.optionIndex[$$que.studentAnswer] : undefined) : ($$que.answer ? parser.const.optionIndex[$$que.answer] : undefined),
						coeffic: undefined,
						analysis: ($$que.resultAnalysis && ($$que.resultAnalysis.trim() !== "") && ($$que.resultAnalysis.trim() !== "无")) ? $$que.resultAnalysis.trim() : undefined
					});
				}
				// 多选题
				// 判断题
				// 问答题
				// 填空题(客观)
				else
				{
					console.warn("JSON解析", "未知题型", $$que.queTypeName);
				}
			});
		}
		else
		{
			console.warn("JSON解析", "未处理子数据", $json.data);
		}
	}
	else
	{
		console.warn("JSON解析", "未处理数据", $json);
	}
	(location.protocol === "file:") && console.log("›icveappzjy2-json", all);
	return all;
});
// 云课堂智慧职教WEB-职教云JSON试题解析
parser.json.icvewebzjy2 = (function($title, $json, $uniqueReference, $useStudentAnswer/** 是否使用学生回答的答案（在系统提供的答案是错误的情况下很有用） */)
{
	if($useStudentAnswer)
	{
		console.log("职教云APP试题解析", "使用学生回答的答案", arguments);
	}
	let all = {};
	all["name"] = $title && decodeURIComponent($title);
	all["questions"] = [];
	//$json = parser.json.forceToObj($json, {});
	/**if($json.data)
	{
		if($json.homework.Title && $json.redisData)
		{*/
			all["name"] = "内科补考";
			let redisData = {
   "code": 1,
   "questions": [
      {
         "orderBy": 3048,
         "questionId": "yzsdawcumqbkc7vspfxy7q",
         "Title": "<p>宁先生，70岁，因患肺癌行多次放疗。护士进行皮肤护理正确的是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"保持皮肤清洁干燥\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肥皂水清洗\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"热敷理疗\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"外用药物\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"按摩\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 37,
         "answerList": [
            {
               "Content": "外用药物",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "按摩",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肥皂水清洗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "保持皮肤清洁干燥",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "热敷理疗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1512,
         "questionId": "fr8bavrqqlbhi7tte16wg",
         "Title": "某支气管哮喘病人在哮喘发作过程中，突然出现极度呼吸困难，严重发绀，右胸剧痛。查：右胸叩诊鼓音，呼吸音消失。对此病人应及时采取哪项措施？",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"经鼻吸痰\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"加大吸氧流量\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"及时进行排气减压\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"补充液体促进排痰\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"止痛\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 100,
         "answerList": [
            {
               "Content": "经鼻吸痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "补充液体促进排痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "止痛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "加大吸氧流量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "及时进行排气减压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1765,
         "questionId": "km0bavrhyhkyklyaztmq",
         "Title": "某支气管哮喘病人在哮喘发作过程中，突然出现极度呼吸困难，严重发绀，右胸剧痛。查：右胸叩诊鼓音，呼吸音消失。对此病人应及时采取哪项措施？",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"经鼻吸痰\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"加大吸氧流量\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"及时进行排气减压\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"补充液体促进排痰\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"止痛\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 181,
         "answerList": [
            {
               "Content": "补充液体促进排痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "经鼻吸痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "及时进行排气减压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "止痛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "加大吸氧流量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1510,
         "questionId": "fr8bavrbibdpskaaggvg",
         "Title": "某支气管哮喘病人在哮喘发作过程中，突然出现极度呼吸困难，严重发绀，右胸剧痛。查：右胸叩诊鼓音，呼吸音消失 发生这种情况，你考虑最有可能是发生了",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管阻塞引起的窒息\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"重症哮喘\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺栓塞\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 98,
         "answerList": [
            {
               "Content": "支气管阻塞引起的窒息",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "重症哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1758,
         "questionId": "km0bavrw4dd7jv8zdmtlg",
         "Title": "关于支气管扩张的叙述，下列哪项有误",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"多在中、老年期起病\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"主要表现为慢性咳嗽、大量脓痰\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"反复咯血及继发肺部感染\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"病变部位可听到局限性持久存在的湿啰音\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"x线胸片可见蜂窝状或卷发样阴影\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 174,
         "answerList": [
            {
               "Content": "病变部位可听到局限性持久存在的湿啰音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "多在中、老年期起病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "反复咯血及继发肺部感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "x线胸片可见蜂窝状或卷发样阴影",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "主要表现为慢性咳嗽、大量脓痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1707,
         "questionId": "km0bavrcrdmd2qbqy2ypw",
         "Title": "病人男性，有吸烟史20年，近年来反复出现咳嗽咯痰，冬春季加剧，早晚加重，并常有白色黏痰。近日因受凉后发热并咳脓痰此病人最易出现的并发症是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"慢性阻塞性肺气肿\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支气管扩张\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心力衰竭\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 148,
         "answerList": [
            {
               "Content": "慢性阻塞性肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管扩张",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1506,
         "questionId": "fr8bavrqlfcptis7hpq",
         "Title": "男性，70岁，慢性肺心病人，已发展出现颈静脉怒张、肝大、肝门静脉回流征(+)、腹水、下肢浮肿，何故",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"门静脉高压\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"低蛋白血症\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"右心衰竭\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心包积液\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"慢性肝炎\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 94,
         "answerList": [
            {
               "Content": "门静脉高压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心包积液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性肝炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低蛋白血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "右心衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1672,
         "questionId": "km0bavrbprj5t2utdoxcq",
         "Title": "对咳嗽、咳痰患者，护理措施错误的是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"保持室内空气新鲜，温、湿度适宜\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"咳脓痰者注意口腔护理\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"痰稠不易咳出，鼓励多饮水，施行雾化吸入\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"痰多可在饭后行体位引流，痰多且无力咳出者\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"帮助翻身拍背\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 128,
         "answerList": [
            {
               "Content": "保持室内空气新鲜，温、湿度适宜",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "咳脓痰者注意口腔护理",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰稠不易咳出，鼓励多饮水，施行雾化吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "帮助翻身拍背",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰多可在饭后行体位引流，痰多且无力咳出者",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1676,
         "questionId": "km0bavrfpffogo7577ia",
         "Title": "指导肺气肿患者作腹式呼吸锻炼时，下列哪项不正确",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"取立位，吸气时尽力挺腹，胸部不动\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"呼气时腹部内陷，尽量将气呼出\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"吸气与呼气时间之比为2：1或3：1\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"用鼻吸气，用口呼气，要求深吸缓呼，不可用力，每日锻炼2次\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"每次10-20min，每分钟呼吸保持在7-8次\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 132,
         "answerList": [
            {
               "Content": "取立位，吸气时尽力挺腹，胸部不动",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼气时腹部内陷，尽量将气呼出",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "吸气与呼气时间之比为2：1或3：1",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "每次10-20min，每分钟呼吸保持在7-8次",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "用鼻吸气，用口呼气，要求深吸缓呼，不可用力，每日锻炼2次",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3035,
         "questionId": "yzsdawcunptgeyxxbuuumw",
         "Title": "<p>老年患者突然发生寒战、高热、咳嗽、咳痰，痰粘稠，砖红色，胶冻状，引起感染最可能的病原菌是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"克雷白杆菌\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"流感嗜血杆菌\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"嗜肺军团杆菌\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"葡萄球菌\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"铜绿假单胞菌\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 24,
         "answerList": [
            {
               "Content": "葡萄球菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "铜绿假单胞菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "流感嗜血杆菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "克雷白杆菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "嗜肺军团杆菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1775,
         "questionId": "lc0bavr9bndt250qftkza",
         "Title": "男性，68岁，有吸烟史30余年，出现慢性咳嗽、咯痰已20多年近5年来明显加剧，已常年不断，伴有喘息和呼吸困难，且以冬春季更甚。3天前因受凉感冒而致发热、剧咳、咯多量黄脓痰、气急、发绀，今晨起又出现意识模糊，躁动不安，送医院急诊并急测血气结果为动脉血氧分压6．9kPa，二氧化碳分压8kPa。此病人目前最确切的医疗诊断是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"慢性支气管炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"慢支肺气肿合并呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"上呼吸道感染\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管哮喘\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 191,
         "answerList": [
            {
               "Content": "上呼吸道感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性支气管炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢支肺气肿合并呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1674,
         "questionId": "km0bavrr5hbwfd9nf3fvg",
         "Title": "慢性支气管炎的临床分型有",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"单纯型、喘息型\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"单纯型、喘息型、混合型\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"急性型、慢性迁延型\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"急性型、慢性型、迁延型\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"急性型、慢性型、反复发作型\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 130,
         "answerList": [
            {
               "Content": "单纯型、喘息型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "单纯型、喘息型、混合型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "急性型、慢性迁延型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "急性型、慢性型、反复发作型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "急性型、慢性型、迁延型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3025,
         "questionId": "yzsdawcu25xa6ch8psownq",
         "Title": "<p>孙先生，46岁，哮喘重度发作。护理查体；端坐呼吸、发绀、烦燥不安、恐惧，下列护理措不正确的是</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"协助采取舒适体位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"陪伴病人床旁，安慰病人\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"给予背部按摩\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"提供良好的心理支持\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"给予吗啡镇静\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 14,
         "answerList": [
            {
               "Content": "提供良好的心理支持",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给予背部按摩",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给予吗啡镇静",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "协助采取舒适体位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "陪伴病人床旁，安慰病人",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1515,
         "questionId": "fr8bavrfznnn8spcrhhdw",
         "Title": "胸膜腔闭式引流的引流管脱出时应首先",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"通知医师紧急处理\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"给患者吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"嘱患者缓慢呼吸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"将脱出的引流管重新置入\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"用手指捏闭引流口周围皮肤\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 103,
         "answerList": [
            {
               "Content": "通知医师紧急处理",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "将脱出的引流管重新置入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "用手指捏闭引流口周围皮肤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给患者吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "嘱患者缓慢呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1681,
         "questionId": "km0bavrrpjkqzyndz8lww",
         "Title": "慢性喘息型支气管炎的特点",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"呼气性呼吸困难，双肺布满哮鸣音\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"端坐呼吸，双肺底水泡音\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"呼气性呼吸困难，两肺散在干、湿性罗音\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"吸气性呼吸困难，呼吸音低\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"进行性呼吸困难，咳嗽，痰中带血\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 137,
         "answerList": [
            {
               "Content": "呼气性呼吸困难，双肺布满哮鸣音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "端坐呼吸，双肺底水泡音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼气性呼吸困难，两肺散在干、湿性罗音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "进行性呼吸困难，咳嗽，痰中带血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "吸气性呼吸困难，呼吸音低",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 2554,
         "questionId": "mmapaimrrzzh8xpgz1wh1q",
         "Title": "患者，男性，68岁，因近日咳嗽咳痰气急明显，又出现神志不清发绀而入院。既往有肺气肿病史。动脉血气分析pH；731，PaO252mmHg，PaCO261mmHg，应给予患者；",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"高浓度高流量持续吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"高浓度高流量间歇吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"低浓度低流量持续吸氧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"低浓度低流量间歇吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"酒精湿化吸氧\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 198,
         "answerList": [
            {
               "Content": "高浓度高流量间歇吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低浓度低流量间歇吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低浓度低流量持续吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高浓度高流量持续吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "酒精湿化吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1485,
         "questionId": "fr8bavr5ahplrw9pq3icw",
         "Title": "慢性肺心病急性加重期病人应慎用",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"抗生素\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"祛痰剂\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"平喘药\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"镇静剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"呼吸兴奋剂\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 73,
         "answerList": [
            {
               "Content": "抗生素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "祛痰剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "镇静剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "平喘药",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1489,
         "questionId": "fr8bavrmotoclr3xrlszg",
         "Title": "肺源性心脏病呼吸衰竭时应给予",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"高流量持续吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"高流量间竭吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"低流量间竭吸氧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"低流量持续吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"低流量混有二氧化碳的氧吸入\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 77,
         "answerList": [
            {
               "Content": "高流量持续吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高流量间竭吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低流量持续吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低流量混有二氧化碳的氧吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低流量间竭吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1499,
         "questionId": "fr8bavreoncd5pnw9tqxw",
         "Title": "慢性肺心病呼吸衰竭，用鼻导管持续给氧的氧浓度应为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"25-30%\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"30-50%\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"50-65%\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"&gt;65%\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"&lt;25%\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 87,
         "answerList": [
            {
               "Content": "25-30%",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "30-50%",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "&gt;65%",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "&lt;25%",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "50-65%",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1509,
         "questionId": "fr8bavra41njkanhtneq",
         "Title": "<p>张力性气胸主要的病理生理变化是</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"纵隔向健侧移位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"纵隔扑动\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"胸壁反常呼吸运动\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺内气体对流\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"连枷胸\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 97,
         "answerList": [
            {
               "Content": "纵隔向健侧移位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺内气体对流",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "连枷胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "纵隔扑动",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸壁反常呼吸运动",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3037,
         "questionId": "yzsdawcuu71glcksdbzha",
         "Title": "<p>廖先生，23岁。每年春暖花开时哮喘发作，有一次看电影时看到银幕上满园春色，突然哮喘发作。主要的护理措施应是：</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"嘱病人休息\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"氧气吸入\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"补液\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"使用支气管舒张剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"心理护理\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 26,
         "answerList": [
            {
               "Content": "使用支气管舒张剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心理护理",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "氧气吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "嘱病人休息",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "补液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1755,
         "questionId": "km0bavr7j5fvnvzctcgkq",
         "Title": "支气管扩张确诊依靠",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"CT\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"痰液培养\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"胸透\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"咯血量\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"发热\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 171,
         "answerList": [
            {
               "Content": "咯血量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "CT",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸透",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "发热",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰液培养",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1753,
         "questionId": "km0bavrckjoohmh9tdoq",
         "Title": "男性，65岁，患支气管扩张已40年，每天咳痰约500ml，近日痰中带血，为预防咯血窒息给予护理措施，其中何项不妥",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"不宜屏气\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"注意观察有否窒息先兆\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"出现窒息立即清理咽喉积血\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"可用镇咳剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"严重者气管切开\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 169,
         "answerList": [
            {
               "Content": "可用镇咳剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "不宜屏气",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "出现窒息立即清理咽喉积血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "严重者气管切开",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "注意观察有否窒息先兆",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1770,
         "questionId": "lc0bavrikvi9edycpxg",
         "Title": "某人于夜间突然发生呼吸困难而惊醒，坐起后约半小时呼吸困难缓解，如此发作约半月就医，经检查肺无异常，但心尖区有收缩期杂音，应考虑",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺气肿\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"左心衰竭早期\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 186,
         "answerList": [
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "左心衰竭早期",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1709,
         "questionId": "km0bavryqrce7whwqrm1w",
         "Title": "患者，男性，89岁，患慢性支气管炎17年，近两周来急性发作入院，患者入院后出现频繁咳嗽、咳痰，痰稠不易咳出，2分钟前夜班护士发现患者剧烈咳嗽，突然呼吸极度困难，喉部有痰鸣音，表情恐怖，两手乱抓。  护士应判断患者最可能发生了",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"急性心肌梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"患者从噩梦中惊醒\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"出现急性心力衰竭\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸道痉挛导致缺氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"痰液堵塞气道导致窒息\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 150,
         "answerList": [
            {
               "Content": "急性心肌梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "患者从噩梦中惊醒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "出现急性心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰液堵塞气道导致窒息",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸道痉挛导致缺氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3042,
         "questionId": "yzsdawcuuytcklqpgc2iq",
         "Title": "<p>胡先生，78岁．反复咳嗽、喘息20年，5年前诊断为COPD，2天前合并肺部感染入院，目前患者的医疗诊断是肺源性心脏病，对该患者最重要的治疗措施是（  ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"立即静点氨茶碱和地塞米松\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"立即静脉注射速尿，消除水肿\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"积极抗感染，保持呼吸道通畅\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"立即吸氧，静点呼吸兴奋剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"纠正心律失常\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 31,
         "answerList": [
            {
               "Content": "立即吸氧，静点呼吸兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "纠正心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即静脉注射速尿，消除水肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即静点氨茶碱和地塞米松",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "积极抗感染，保持呼吸道通畅",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1710,
         "questionId": "km0bavrz7hmkdmedmj57g",
         "Title": "病人男性，有吸烟史20年，近年来反复出现咳嗽咯痰，冬春季加剧，早晚加重，并常有白色黏痰。近日因受凉后发热并咳脓痰。此病人应采用的首要治疗方案为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"控制感染\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"平喘\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"止咳\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"6祛痰\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"氧气吸入\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 151,
         "answerList": [
            {
               "Content": "控制感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "平喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "止咳",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "氧气吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "6祛痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1493,
         "questionId": "fr8bavr8q5dxx2ncyzztw",
         "Title": "男性，46岁，咳嗽、咳痰多年，近来呼吸困难加重并伴双下肢浮肿，心电图显示右室肥大，应考虑为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"风湿性心脏病\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"冠心病\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"慢性肺源性心脏病\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"慢性支气管炎\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"阻塞性肺气肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 81,
         "answerList": [
            {
               "Content": "风湿性心脏病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "冠心病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性支气管炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "阻塞性肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性肺源性心脏病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3054,
         "questionId": "yzsdawcu4j1kyma1nxtxog",
         "Title": "<p>夏先生，46岁，一位急性上呼吸道感染患者，在对其进行有关预防措施指导时，护士的下列说法中，不当的是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"避免过度劳累\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"避免到人多拥挤的场所\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"坚持规律体育锻炼\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"保持环境整洁，空气清新\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"接种疫苗后可产生终生免疫力\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 43,
         "answerList": [
            {
               "Content": "保持环境整洁，空气清新",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "接种疫苗后可产生终生免疫力",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免到人多拥挤的场所",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免过度劳累",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "坚持规律体育锻炼",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1777,
         "questionId": "lc0bavrkjfosysjzt63g",
         "Title": "某支气管哮喘病人在哮喘发作过程中，突然出现极度呼吸困难，严重发绀，右胸剧痛。查：右胸叩诊鼓音，呼吸音消失 发生这种情况，你考虑最有可能是发生了",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管阻塞引起的窒息\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"重症哮喘\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺栓塞\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 193,
         "answerList": [
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管阻塞引起的窒息",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "重症哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1486,
         "questionId": "fr8bavr8a5d8ufq9sdsxa",
         "Title": "肺源性心脏病肺动脉高压形成的最主要因素是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"继发性红细胞增多\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"血液黏稠度增加\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"血容量增加\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺部毛细血管微小栓子形成\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"缺氧及二氧化碳潴留引起肺小血管收缩痉挛\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 74,
         "answerList": [
            {
               "Content": "继发性红细胞增多",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血液黏稠度增加",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺部毛细血管微小栓子形成",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "缺氧及二氧化碳潴留引起肺小血管收缩痉挛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血容量增加",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3024,
         "questionId": "yzsdawcujqbhugpocuaa",
         "Title": "<p>苏女士，63岁，反复发作呼气性呼吸困难5年，引起呼气性呼吸困难最常见的病因是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管异物\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺栓塞\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺动脉高压\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"气胸\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"小支气管痉挛\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 13,
         "answerList": [
            {
               "Content": "气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺动脉高压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "小支气管痉挛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管异物",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1494,
         "questionId": "fr8bavruzngp6anrzvoia",
         "Title": "慢性肺心病患者死亡的主要原因是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"电解质紊乱\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"中毒性休克\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心律失常\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"右心衰竭\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 82,
         "answerList": [
            {
               "Content": "电解质紊乱",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "中毒性休克",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "右心衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 20,
         "questionId": "z9n5aaqrgarp50ynoexqa",
         "Title": "<p><span style=\";font-family:宋体;font-size:16px\">关先生</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">，</span>60<span style=\"font-family:宋体\">岁</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">有慢性支气管炎、阻塞性肺气肿病史</span>10<span style=\"font-family:宋体\">余年，近</span><span style=\"font-family:Times New Roman\">3</span><span style=\"font-family:宋体\">年来反复双下肢</span></span><span style=\";font-family:宋体;font-size:16px\">水</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">肿，此次病情加重，口唇发绀，神志恍惚，双下肺闻</span></span><span style=\";font-family:宋体;font-size:16px\">及</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">干</span></span><span style=\";font-family:宋体;font-size:16px\">性</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">湿</span></span><span style=\";font-family:宋体;font-size:16px\">啰</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">音，</span>120<span style=\"font-family:宋体\">次</span><span style=\"font-family:Times New Roman\">/</span><span style=\"font-family:宋体\">分，有早搏</span></span><span style=\";font-family:宋体;font-size:16px\">。</span></p><p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">判断该病人有无低氧，下列指标最</span></span><span style=\";font-family:宋体;font-size:16px\">主要的是</span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">肺功能中的</span></span><span style=\\\";font-family:宋体;font-size:16px\\\">FEV</span><sub><span style=\\\";font-family:宋体;font-size:16px;vertical-align:sub\\\">1&nbsp;</span></sub></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">动脉血氧含量</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">动脉血氧分压</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">静脉血氧分压</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">动脉血氧饱和度</span></span></p><p><br></p>\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 64,
         "answerList": [
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">静脉血氧分压</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">肺功能中的</span></span><span style=\";font-family:宋体;font-size:16px\">FEV</span><sub><span style=\";font-family:宋体;font-size:16px;vertical-align:sub\">1&nbsp;</span></sub></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">动脉血氧分压</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">动脉血氧饱和度</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">动脉血氧含量</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3027,
         "questionId": "yzsdawcuiilbogtzwzljqw",
         "Title": "<p>卫先生，28岁，因急性支气管炎入院。咳嗽剧烈，咳脓性痰，量较多，咳嗽时胸痛。查体：T37.8℃，P98次/分，R20次/分，目前该患者最主要的护理问题是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"疼痛\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"体温过高\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"知识缺乏\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"清理呼吸道无效\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"气体交换受损\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 16,
         "answerList": [
            {
               "Content": "清理呼吸道无效",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "知识缺乏",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气体交换受损",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "疼痛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体温过高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1592,
         "questionId": "gr8bavri6xajkyxnqj8xw",
         "Title": "病人女性，17岁，由于考大学复习功课，非常疲劳，自觉乏力，干咳，无痰，盗汗明显。临床怀疑肺结核做结核菌素试验观察结果的时间是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"0．5～1h\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"12～24h\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"24～48h\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"48～72h\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"4～8周\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 116,
         "answerList": [
            {
               "Content": "0．5～1h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "48～72h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "4～8周",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "12～24h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "24～48h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3012,
         "questionId": "yzsdawcuwata9sjmhqo06g",
         "Title": "<p>当病人出现急性肺水肿咳粉红色泡沫痰时，面罩吸氧的湿化液应选用</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"无菌蒸馏水\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"无菌生理盐水\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"10％～30％乙醇\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"30％～50％乙醇\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"50％～70％乙醇\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 1,
         "answerList": [
            {
               "Content": "30％～50％乙醇",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "10％～30％乙醇",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "50％～70％乙醇",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "无菌蒸馏水",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "无菌生理盐水",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1490,
         "questionId": "fr8bavr4avjeksudooqxq",
         "Title": "肺心病呼吸衰竭最确切的诊断根据是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"发绀、呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"精神、神经经症状\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"二氧化碳结合力明显升\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"PaC02&gt;6．66kPa，Pa02&lt;7．99kPa\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺通气功能明显减退\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 78,
         "answerList": [
            {
               "Content": "发绀、呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "精神、神经经症状",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "PaC02&gt;6．66kPa，Pa02&lt;7．99kPa",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺通气功能明显减退",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "二氧化碳结合力明显升",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3041,
         "questionId": "yzsdawcukktgvkzlpw66a",
         "Title": "<p>某呼吸衰竭病人，应用辅助呼吸和呼吸兴奋剂过程中，出现恶心、呕吐、烦躁、面颊潮红、肌肉颤动等现象应考虑（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺性脑病先兆\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"通气量不足\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"呼吸兴奋剂过量\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸性碱中毒\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"痰液阻塞\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 30,
         "answerList": [
            {
               "Content": "呼吸性碱中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰液阻塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "通气量不足",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺性脑病先兆",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸兴奋剂过量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1504,
         "questionId": "fr8bavrxbvht47lcbglxq",
         "Title": "某男性老年人，慢性咳嗽、咳痰12年。近2年来劳动时出现气短，偶有踝部水肿，门诊以慢性支气管炎合并慢性阻塞性肺气肿收入院。体检评估时胸部阳性体征可表现为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"扁平胸\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"语颤减弱\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"语颤增强\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心浊音界扩大\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"呼气期缩短\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 92,
         "answerList": [
            {
               "Content": "扁平胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心浊音界扩大",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼气期缩短",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "语颤减弱",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "语颤增强",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1439,
         "questionId": "fr8bavrcqvndwpys6bnkq",
         "Title": "胸膜腔闭式引流的引流管脱出时应首先",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"通知医师紧急处理\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"给患者吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"嘱患者缓慢呼吸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"将脱出的引流管重新置入\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"用手指捏闭引流口周围皮肤\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 68,
         "answerList": [
            {
               "Content": "通知医师紧急处理",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给患者吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "将脱出的引流管重新置入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "用手指捏闭引流口周围皮肤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "嘱患者缓慢呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1708,
         "questionId": "km0bavrh7xhysnj6fujq",
         "Title": "某男性老年人，慢性咳嗽、咳痰12年。近2年来劳动时出现气短，偶有踝部水肿，门诊以慢性支气管炎合并慢性阻塞性肺气肿收入院。若该病人病情反复发作且出现肺动脉瓣第二心音亢进，则提示该病人 有",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"右心衰竭\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"左心衰竭\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺动脉高压\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"周围循环衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"主动脉压升高\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 149,
         "answerList": [
            {
               "Content": "右心衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "左心衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺动脉高压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "主动脉压升高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "周围循环衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1483,
         "questionId": "fr8bavrr55bhg6ptj3m6g",
         "Title": "诊断肺源性心脏病的主要依据是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"发绀\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"两肺干湿罗音及肺气肿体征\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺动脉高压及右心室增大征象\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"高碳酸血症\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 71,
         "answerList": [
            {
               "Content": "发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺动脉高压及右心室增大征象",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高碳酸血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "两肺干湿罗音及肺气肿体征",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1716,
         "questionId": "km0bavr74zgzgn4ympmza",
         "Title": "某男性病人，52岁，患COPD15年。近3天因急性上感病情加重，体温37.8℃，神志恍惚，昼睡夜醒，气促、不能平卧，痰色黄、粘稠、不易咳出。血气分析示PaO2 56mmHg、PaCO2 67mmHg。氧疗时给氧浓度和氧流量应为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"29％，2L/min\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"33％，3L/min\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"37％，4L/min\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"41％，5L/min\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"45％，6L/min\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 157,
         "answerList": [
            {
               "Content": "29％，2L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "33％，3L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "37％，4L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "45％，6L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "41％，5L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1689,
         "questionId": "km0bavr4inhp3lp0moq",
         "Title": "张先生，28岁。因淋雨受凉后突起畏寒、高热，右侧胸痛伴咳嗽，咯少量铁锈色痰。体温39℃，胸部x线摄片见左下肺野大片模糊阴影。血白细胞计数15³10的9次方／L。神志清楚，血压100／78mmHg，心率100次／mim。最可能的诊断是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"结核性胸膜炎\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺炎球菌肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺炎伴中毒性休克\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"急性原发性肺脓肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 145,
         "answerList": [
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核性胸膜炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎球菌肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "急性原发性肺脓肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎伴中毒性休克",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1763,
         "questionId": "km0bavrf49bfzj64qp7w",
         "Title": "病人，男性，23岁，患支气管扩张症，间断咯血，近日来因受凉咳大量黄色浓痰，入院治疗  导致本病人支气管扩张的可能因素是幼年时患过",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"百日咳\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"猩红热\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"水痘\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"腮腺炎\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"风疹\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 179,
         "answerList": [
            {
               "Content": "腮腺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "百日咳",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "水痘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "风疹",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "猩红热",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1712,
         "questionId": "km0bavrfkxoabchqfrvw",
         "Title": "患者，男性，89岁，患慢性支气管炎17年，近两周来急性发作入院，患者入院后出现频繁咳嗽、咳痰，痰稠不易咳出，2分钟前夜班护士发现患者剧烈咳嗽，突然呼吸极度困难，喉部有痰鸣音，表情恐怖，两手乱抓。  此时护士最恰当的处理是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"立即通知医师\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"给氧气吸予入\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"应用呼吸兴奋剂\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"立即清除呼吸道痰液\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"立即配合医生行气管插管\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 153,
         "answerList": [
            {
               "Content": "立即通知医师",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给氧气吸予入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "应用呼吸兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即配合医生行气管插管",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即清除呼吸道痰液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3033,
         "questionId": "yzsdawcue4bbb1ozeoynbg",
         "Title": "<p>马女士，80岁。慢性阻塞性肺疾病20余年。今因“咳嗽，咳痰加重”住院，夜间因烦躁难以入眠，自服地西泮5mg后入睡，晨起呼之不应，呼吸浅促。出现上述表现的最可能原因是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"地西泮的镇静作用\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"地西泮过敏\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"地西泮抑制呼吸中枢\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"地西泮中毒\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"地西泮的镇咳作用\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 22,
         "answerList": [
            {
               "Content": "地西泮中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "地西泮的镇咳作用",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "地西泮过敏",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "地西泮的镇静作用",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "地西泮抑制呼吸中枢",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1711,
         "questionId": "km0bavrkp9atwhar4hpw",
         "Title": "张女士，65岁，慢性咳嗽10年，近3年出现气喘，且逐渐加重。双肺散在哮呜音。最可能的诊断是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"阻塞性肺气肿\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"喘息型慢性支气管炎\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"单纯型慢性支气管炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管肺癌\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 152,
         "answerList": [
            {
               "Content": "阻塞性肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "喘息型慢性支气管炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "单纯型慢性支气管炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管肺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1748,
         "questionId": "km0bavrlppishpb6wjdwa",
         "Title": "支气管扩张胸透时可见何特征",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"球形阴影\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"厚壁空洞\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"云絮样阴影\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"卷发状阴影\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"球形阴影\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 164,
         "answerList": [
            {
               "Content": "球形阴影",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "厚壁空洞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "云絮样阴影",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "球形阴影",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "卷发状阴影",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1565,
         "questionId": "gr8bavr9lnmd78m9jkvpa",
         "Title": "最常见的成人继发性肺结核类型是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"原发型肺结核\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"浸润型肺结核\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"血行播散型肺结核\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"慢性纤维空洞型肺结核\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"结核性胸膜炎\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 113,
         "answerList": [
            {
               "Content": "原发型肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性纤维空洞型肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核性胸膜炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "浸润型肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血行播散型肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 2555,
         "questionId": "mmapaimrqqvfjlylwheyvq",
         "Title": "患者男性，60岁，有慢性支气管炎阻塞性肺气肿病史10余年，近3年来反复双下肢水肿，此次病情加重，口唇发绀，神志恍惚，双下肺闻干湿啰音，心率120次／分，有早搏。确定该患者有无呼吸衰竭，下列哪项最有意义",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"动脉血气分析\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"发绀\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"神志变化\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心律失常\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"呼吸困难\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 199,
         "answerList": [
            {
               "Content": "发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "神志变化",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "动脉血气分析",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 2552,
         "questionId": "mmapaimrxzlf5kkszsp6hg",
         "Title": "患者男性，75岁，诊断为Ⅱ型呼吸衰竭，表现为呼吸困难，发绀明显，血气分析结果为Pa0250mmHgPaCO276mmHg，该患者的氧疗方式足应",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"2～4L／min鼻导管吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"2～4L／min间歇吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"1～2L／min持续鼻导管吸氧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"低流量间歇吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"4～6L／min酒精湿化吸氧\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 196,
         "answerList": [
            {
               "Content": "低流量间歇吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "2～4L／min鼻导管吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "1～2L／min持续鼻导管吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "4～6L／min酒精湿化吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "2～4L／min间歇吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3023,
         "questionId": "yzsdawcukopanie0pwxb8q",
         "Title": "<p>莫女士，39岁，诊断支气管哮喘,快速静脉注射某药后，出现了头晕、心悸、心律失常、血压剧降，此药物可能是</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"沙丁胺醇\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"氨茶碱\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"异丙基阿托品\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"地塞米松\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"色甘酸钠\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 12,
         "answerList": [
            {
               "Content": "地塞米松",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "异丙基阿托品",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "色甘酸钠",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "沙丁胺醇",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "氨茶碱",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3031,
         "questionId": "yzsdawcuazvnjqb1ab3ww",
         "Title": "<p>蒋先生，60岁。 COPD病史。近年来多次在冬季发生肺炎，为减少患病概率，可以嘱患者在易发病季节（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"接种卡介苗\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"接种流感疫苗\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"注射免疫球蛋白\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"服用抗生素\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"在家中不要外出\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 20,
         "answerList": [
            {
               "Content": "服用抗生素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "在家中不要外出",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "接种流感疫苗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "接种卡介苗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "注射免疫球蛋白",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1503,
         "questionId": "fr8bavru5naxmc52mymfw",
         "Title": "肺心病急性加重期的关键治疗措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"改善呼吸功能\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"控制呼吸道感染\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"利尿减轻心负荷\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"给洋地黄制剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"控制心律失常\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 91,
         "answerList": [
            {
               "Content": "改善呼吸功能",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给洋地黄制剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "控制心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "控制呼吸道感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "利尿减轻心负荷",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3032,
         "questionId": "yzsdawcuey9id8cl5fjrfw",
         "Title": "<p>张先生，48岁，支气管肺癌。病理组织报告为“鳞状细胞癌”。患者治疗过程中，白细胞低于多少时应停止化疗或减量</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"6.5×109/L\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"5.5×109/L\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"4.5×109/L\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"3.5×109/L\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"2.5×109/L\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 21,
         "answerList": [
            {
               "Content": "3.5×109/L",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "2.5×109/L",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "5.5×109/L",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "6.5×109/L",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "4.5×109/L",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1507,
         "questionId": "fr8bavrrz1ekonu2vipca",
         "Title": "男性，62岁。咳嗽30年，近日咳大量脓痰，憋气，下肢水肿。本病最主要的治疗原则是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"扩张支气管\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"低浓度吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"消除肺部感染\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"治疗心力衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"祛痰药\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 95,
         "answerList": [
            {
               "Content": "扩张支气管",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "治疗心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "祛痰药",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低浓度吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "消除肺部感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1521,
         "questionId": "fr8bavrelxfbuj7al4fvg",
         "Title": "肺癌中恶性程度最高的一种组织类型是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"鳞状上皮细胞癌\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"小细胞未分化癌\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"大细胞未分化癌\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"腺癌\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺泡癌\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 109,
         "answerList": [
            {
               "Content": "鳞状上皮细胞癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "腺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺泡癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "小细胞未分化癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "大细胞未分化癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1680,
         "questionId": "km0bavr0lngycmjuinhnq",
         "Title": "某男性病人，52岁，患COPD15年。近3天因急性上感病情加重，体温37.8℃，神志恍惚，昼睡夜醒，气促、不能平卧，痰色黄、粘稠、不易咳出。血气分析示PaO2 56mmHg、PaCO2 67mmHg。护理诊断不包括",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"气体交换受损\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"活动无耐力\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"体温过高\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"清理呼吸道无效\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"体液过多\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 136,
         "answerList": [
            {
               "Content": "气体交换受损",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "活动无耐力",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体温过高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体液过多",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "清理呼吸道无效",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1640,
         "questionId": "km0bavrcq9klph8lfww",
         "Title": "护理重症哮喘者时，下列哪项不妥",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"守护在床边\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"加强心理护理\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"安排舒适的半卧位或坐位\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"给予低流量鼻导管吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"勿勉强进食\",\"IsAnswer\":null},{\"SortOrder\":5,\"Content\":\"限止水的摄入\",\"IsAnswer\":null},{\"SortOrder\":6,\"Content\":\"痰多黏稠者可作药物雾化\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 125,
         "answerList": [
            {
               "Content": "守护在床边",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给予低流量鼻导管吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "勿勉强进食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰多黏稠者可作药物雾化",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 6,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "限止水的摄入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 5,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "加强心理护理",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "安排舒适的半卧位或坐位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3022,
         "questionId": "yzsdawcufqthpy2obu7dhw",
         "Title": "<p>治疗急性呼吸窘迫综合征（ARDS）最有效的措施为（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"持续高浓度吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"应用呼气末正压通气\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"持续低浓度吸氧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"迅速应用糖皮质激素\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"应用正压机械通气\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 11,
         "answerList": [
            {
               "Content": "迅速应用糖皮质激素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "持续低浓度吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "应用正压机械通气",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "持续高浓度吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "应用呼气末正压通气",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 11,
         "questionId": "z9n5aaqrfkvedmnzrsqzjq",
         "Title": "<p style=\"line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">男性，</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">72</span><span style=\";font-family:宋体;font-size:16px\">岁，慢性</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">2</span><span style=\";font-family:宋体;font-size:16px\">型呼吸衰竭，近来呼吸困难明显，伴头痛、昼睡夜醒，伴神志恍惚、肌肉抽搐等，应考虑并发</span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"脑疝\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"脑瘤\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"脑炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸性酸中毒\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺性脑病\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 55,
         "answerList": [
            {
               "Content": "脑瘤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺性脑病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸性酸中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑疝",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1436,
         "questionId": "fr8bavrr4degk190s2q",
         "Title": "某支气管哮喘病人在哮喘发作过程中，突然出现极度呼吸困难，严重发绀，右胸剧痛。查：右胸叩诊鼓音，呼吸音消失。对此病人应及时采取哪项措施？",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"经鼻吸痰\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"加大吸氧流量\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"及时进行排气减压\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"补充液体促进排痰\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"止痛\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 65,
         "answerList": [
            {
               "Content": "经鼻吸痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "加大吸氧流量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "补充液体促进排痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "止痛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "及时进行排气减压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3013,
         "questionId": "yzsdawcuybdp2ksempwdjq",
         "Title": "<p>确诊支气管扩张的最佳选择是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"反复咯血、慢性咳嗽及大量浓痰\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"纤维支气管镜检查\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"胸部平片见肺纹理粗乱呈卷发样\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管碘油造影\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"高分辨率CT\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 2,
         "answerList": [
            {
               "Content": "支气管碘油造影",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸部平片见肺纹理粗乱呈卷发样",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高分辨率CT",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "反复咯血、慢性咳嗽及大量浓痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "纤维支气管镜检查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1484,
         "questionId": "fr8bavro5ploh54u6bpqa",
         "Title": "肺心病急性加重期的治疗关键是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"低流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"利用呼吸机改善呼吸功能\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"强心、利尿\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"积极控制感染、解除支气管痉挛、改善通气功能\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"纠正电解质紊乱\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 72,
         "answerList": [
            {
               "Content": "低流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "利用呼吸机改善呼吸功能",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "积极控制感染、解除支气管痉挛、改善通气功能",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "纠正电解质紊乱",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "强心、利尿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1687,
         "questionId": "km0bavrt49euazavbhyzw",
         "Title": "按病因学分类，临床上最常见的肺炎是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"细菌性肺炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"病毒性肺炎\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支原体肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺炎\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"衣原体肺炎\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 143,
         "answerList": [
            {
               "Content": "细菌性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "病毒性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支原体肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "衣原体肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1497,
         "questionId": "fr8bavraqxaqkvlyppza",
         "Title": "慢性肺心病引起右心衰竭的最主要原因",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺动脉高压\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"心肌收缩力降低\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"心室充盈受限\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心律失常\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"酸碱平衡失调\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 85,
         "answerList": [
            {
               "Content": "肺动脉高压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心肌收缩力降低",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "酸碱平衡失调",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心室充盈受限",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3020,
         "questionId": "yzsdawcu3b1i77tcm1v0og",
         "Title": "<p>Ⅱ型呼吸衰竭给氧流量是（  ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"1-2L/分\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"3-4L/分\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"4-6L/分\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"6-8L/分\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"8-10L/分\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 9,
         "answerList": [
            {
               "Content": "6-8L/分",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "4-6L/分",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "8-10L/分",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "1-2L/分",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "3-4L/分",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 4,
         "questionId": "z9n5aaqrzyzemw196klnbw",
         "Title": "<p style=\"line-height:150%\"><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">Ⅱ<span style=\"font-family:宋体\">型呼吸衰竭病人吸氧最适宜的流量为</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"1～2L/min&nbsp;\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"2～4L/min&nbsp;\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"4～6L/min\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"6～8L/min\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"﹥8L/min\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 49,
         "answerList": [
            {
               "Content": "2～4L/min&nbsp;",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "4～6L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "﹥8L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "6～8L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "1～2L/min&nbsp;",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 17,
         "questionId": "z9n5aaqraqxae6b3jx4ubw",
         "Title": "<p><span style=\";font-family:宋体;font-size:16px\"><span style=\"font-family:宋体\">孙先生，</span>62<span style=\"font-family:宋体\">岁。</span></span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">呼吸衰竭，进行氧疗过程中出现呼吸困难缓解、心率减慢、发绀减轻，表明</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">缺氧不伴有</span>C</span><span style=\\\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\\\">O</span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">潴留</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">缺氧伴有</span>C</span><span style=\\\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\\\">O</span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">潴留</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">需加用呼吸兴奋剂</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">需调整给氧浓度和流量</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">氧疗有效，维持原治疗方案</span></span></p><p><br></p>\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 61,
         "answerList": [
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">需调整给氧浓度和流量</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">缺氧不伴有</span>C</span><span style=\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\">O</span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">潴留</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">需加用呼吸兴奋剂</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">氧疗有效，维持原治疗方案</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">缺氧伴有</span>C</span><span style=\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\">O</span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">潴留</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1675,
         "questionId": "km0bavrhqpc0civqs5ugq",
         "Title": "慢性支气管炎的诊断标准是在排除其他心肺疾病后",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"咳嗽、咳痰持续半年以上\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"咳嗽、咳痰伴喘息持续半年以上\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"咳嗽、咳痰伴喘息反复发作每年2个月，连续2年或2年以上\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"咳嗽、咳痰伴喘息反复发作每年至少3个月，连续2年或2年以上\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"咳嗽、咳痰伴喘息反复发作连续2年或2年以上\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 131,
         "answerList": [
            {
               "Content": "咳嗽、咳痰持续半年以上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "咳嗽、咳痰伴喘息持续半年以上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "咳嗽、咳痰伴喘息反复发作每年2个月，连续2年或2年以上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "咳嗽、咳痰伴喘息反复发作连续2年或2年以上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "咳嗽、咳痰伴喘息反复发作每年至少3个月，连续2年或2年以上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1492,
         "questionId": "fr8bavrqy5e0egs6jwyg",
         "Title": "下列哪种并发症是慢性肺心病死亡的首要原因",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺性病脑\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"心律失常\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"休克\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"消化道出血\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"播散性血管内凝血\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 80,
         "answerList": [
            {
               "Content": "肺性病脑",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "消化道出血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "播散性血管内凝血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "休克",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1636,
         "questionId": "km0bavr1bja2hhfoziwya",
         "Title": "对支气管哮喘病人作保健指导，错误的是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"居室适当放置花草\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"让病人心情愉悦\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"避免进食可能致敏的食物(如鱼、虾、蛋)\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"避免刺激性气体吸入\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"避免过度劳累或情绪激动等诱发因素\",\"IsAnswer\":null},{\"SortOrder\":5,\"Content\":\"气候变化时注意保暖\",\"IsAnswer\":null},{\"SortOrder\":6,\"Content\":\"避免呼吸道感染\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 121,
         "answerList": [
            {
               "Content": "居室适当放置花草",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免刺激性气体吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免过度劳累或情绪激动等诱发因素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免呼吸道感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 6,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气候变化时注意保暖",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 5,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "让病人心情愉悦",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免进食可能致敏的食物(如鱼、虾、蛋)",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3026,
         "questionId": "yzsdawcun7po8hrpbrcbq",
         "Title": "<p>石先生，75岁，因“发热、反复咳嗽并伴有脓性痰液2周”入院，诊断为急性支气管炎。易加重病情的药物是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"可待因\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"必嗽平\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"复方甘草合剂\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"复方氯化铵\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"沐舒坦\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 15,
         "answerList": [
            {
               "Content": "复方氯化铵",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "复方甘草合剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "沐舒坦",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "可待因",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "必嗽平",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1440,
         "questionId": "fr8bavrgq5olg2nn1estg",
         "Title": "开放性气胸患者呼吸困难最主要的急救措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"补输血液\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气管插管行辅助呼吸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"立即剖胸探查\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"迅速封闭胸部伤口\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 69,
         "answerList": [
            {
               "Content": "吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "补输血液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即剖胸探查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "迅速封闭胸部伤口",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气管插管行辅助呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1,
         "questionId": "z9n5aaqrijfm4hrotmhoqa",
         "Title": "<p style=\"line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">钱女士，</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">68</span><span style=\";font-family:宋体;font-size:16px\">岁。诊断为慢性支气管炎、阻塞性肺气肿合并呼吸衰竭。在应用呼吸机辅助呼吸时，突然出现烦躁不安、皮肤潮红、温暖多汗，球结膜充血。护士应立即</span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"提高吸氧浓度\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"增加呼吸频率\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"检查呼吸道是否通畅\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"停止吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"关闭呼吸机\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 46,
         "answerList": [
            {
               "Content": "停止吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "关闭呼吸机",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "增加呼吸频率",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "提高吸氧浓度",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "检查呼吸道是否通畅",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3015,
         "questionId": "yzsdawcullxblcgdup6olg",
         "Title": "<p>确诊肺结核的依据是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"结核中毒症状\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"血沉增快\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"结核菌素试验阳性\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"痰检找到结核菌\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"胸部X线片示浸润性改变\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 4,
         "answerList": [
            {
               "Content": "痰检找到结核菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核菌素试验阳性",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸部X线片示浸润性改变",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核中毒症状",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血沉增快",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1757,
         "questionId": "km0bavrblhfjikzjljya",
         "Title": "支气管扩张患者作体位引流的时间宜选择于",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"早上\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"中午\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"晚间\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"饭前\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"饭后\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 173,
         "answerList": [
            {
               "Content": "饭前",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "早上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "晚间",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "饭后",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "中午",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3,
         "questionId": "z9n5aaqrfydpmq5q1pawqa",
         "Title": "<p style=\"text-indent:32px;line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">张先生</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">，</span>75<span style=\"font-family:宋体\">岁</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">有慢性支气管炎病史</span>20<span style=\"font-family:宋体\">年。</span></span><span style=\";font-family:宋体;font-size:16px\">1</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">周前受凉后再次出现咳嗽、咳白色</span></span><span style=\";font-family:宋体;font-size:16px\">黏</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">痰，伴有呼吸困难、胸闷、乏力。以慢性支气管炎合并慢性阻塞性肺气肿入院治疗，</span></span><span style=\"font-family: 宋体;\">病人</span><span style=\"font-family: &quot;Times New Roman&quot;;\"><span style=\"font-family:宋体\">最主要的护理诊断</span>/<span style=\"font-family:宋体\">问题是</span></span></p><p style=\"text-indent:32px;line-height:150%\"><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\"></span></span><br/></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"体液过多\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"清理呼吸道无效\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"生活自理能力缺陷\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"营养失调，低于机体需要量\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺脓肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 48,
         "answerList": [
            {
               "Content": "清理呼吸道无效",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "生活自理能力缺陷",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺脓肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "营养失调，低于机体需要量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体液过多",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3038,
         "questionId": "yzsdawcumb9edzdu2uxdaa",
         "Title": "<p>王女士患肺结核在家疗养，但痰中仍凝有结核菌，对其痰液最简便有效的处理方法为（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"用锅煮沸\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"深埋\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"焚烧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"酒精浸泡\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"洗涤剂浸泡\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 27,
         "answerList": [
            {
               "Content": "酒精浸泡",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "洗涤剂浸泡",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "深埋",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "用锅煮沸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "焚烧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1683,
         "questionId": "km0bavrlqbfyqiuw8hboq",
         "Title": "患者男性，36岁，平素体健。淋雨后发热，咳嗽2天，右上腹痛伴气急、恶心1天。为明确诊断，应进行的检查是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"血常规\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"血细胞涂片\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"血气分析\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"痰涂片或培养\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺功能测定\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 139,
         "answerList": [
            {
               "Content": "血常规",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血细胞涂片",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血气分析",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺功能测定",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰涂片或培养",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1498,
         "questionId": "fr8bavrokdlr6iqgspkeg",
         "Title": "男性病人，73岁，COPD史15年，肺心病5年，体质虚弱，近日来因上感现大量脓痰不易咳出，神志恍惚，昏睡。护士为其清理呼吸道最适宜的护理措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"指导有效咳嗽\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"湿化呼吸道\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"体位引流\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"机械吸痰\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"胸部叩击\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 86,
         "answerList": [
            {
               "Content": "指导有效咳嗽",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "湿化呼吸道",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "机械吸痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸部叩击",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体位引流",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1488,
         "questionId": "fr8bavryolp6clqugayqw",
         "Title": "肺源性心脏病的首要死亡原因是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"休克\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺性脑病\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"上消化道出血\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"水、电解质平衡失调\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"心律失常\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 76,
         "answerList": [
            {
               "Content": "休克",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺性脑病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "水、电解质平衡失调",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "上消化道出血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1639,
         "questionId": "km0bavrfy5gs9rmu7oj6g",
         "Title": "哮喘持续状态是指哮喘发作严重，持续多长时间以上",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"6h\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"12h\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"24h\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"48h\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"72h\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 124,
         "answerList": [
            {
               "Content": "6h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "48h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "72h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "12h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "24h",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3056,
         "questionId": "yzsdawcuyovimohb1fxvpw",
         "Title": "<p>某支气管哮喘患者，每当发作就自用沙丁胺醇喷雾吸入，护士应告诫患者，如用量过大可能会出现（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心动过缓、腹泻\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"食欲减退、恶心呕吐\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"血压升高、心动过速\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"皮疹、发热\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肝、肾功能异常\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 45,
         "answerList": [
            {
               "Content": "皮疹、发热",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肝、肾功能异常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "食欲减退、恶心呕吐",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心动过缓、腹泻",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血压升高、心动过速",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1495,
         "questionId": "fr8bavrkatopn4y7bpxg",
         "Title": "男性，62岁。咳嗽30年，近日咳大量脓痰，憋气，下肢水肿。首先应考虑何病",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管扩张症\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺心病\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"慢性肺脓疡\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺部感染\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 83,
         "answerList": [
            {
               "Content": "支气管扩张症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺心病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性肺脓疡",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺部感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1511,
         "questionId": "fr8bavrqivbktji5ga",
         "Title": "林先生，70岁。慢性支气管炎、肺气肿病史多年，今日中午进餐时米粒呛入气管引起剧烈咳嗽后，突然呼吸困难，伴右胸刺痛，逐渐加重。最可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心肌梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺栓塞\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"胸腔积液\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管阻塞\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 99,
         "answerList": [
            {
               "Content": "心肌梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸腔积液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管阻塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1437,
         "questionId": "fr8bavrarpkm9sob1tzva",
         "Title": "某支气管哮喘病人在哮喘发作过程中，突然出现极度呼吸困难，严重发绀，右胸剧痛。查：右胸叩诊鼓音，呼吸音消失 发生这种情况，你考虑最有可能是发生了",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管阻塞引起的窒息\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"重症哮喘\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺栓塞\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 66,
         "answerList": [
            {
               "Content": "支气管阻塞引起的窒息",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "重症哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1593,
         "questionId": "gr8bavrplvamo4p09bqkg",
         "Title": "吴先生，30岁.因突然咳血痰而来门诊，胸部x片示右上肺薄壁空洞及周围有少许渗出病灶.给予利福平+异烟肼+乙胺丁醇治疗 该病人属哪种肺结核",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"该病人属哪种肺结核\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"Ⅱ型\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"Ⅲ型\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"Ⅳ型\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"V型\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 117,
         "answerList": [
            {
               "Content": "该病人属哪种肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅳ型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "V型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅱ型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅲ型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1776,
         "questionId": "lc0bavrv7vgzc5dbeioma",
         "Title": "男性，68岁，有吸烟史30余年，出现慢性咳嗽、咯痰已20多年近5年来明显加剧，已常年不断，伴有喘息和呼吸困难，且以冬春季更甚。3天前因受凉感冒而致发热、剧咳、咯多量黄脓痰、气急、发绀，今晨起又出现意识模糊，躁动不安，送医院急诊并急测血气结果为动脉血氧分压6．9kPa，二氧化碳分压8kPa。病人应采用的卧位为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"半坐卧位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"头低脚高位\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"平卧位\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"俯卧位\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"胸卧位\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 192,
         "answerList": [
            {
               "Content": "俯卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "半坐卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "平卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "头低脚高位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3021,
         "questionId": "yzsdawculrpmpb5fl0l0g",
         "Title": "<p>异烟肼用量过大会引起（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"眩晕、听力障碍\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"末梢神经炎及肝损害\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"粒细胞减少\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"胃肠道不适，尿酸血症\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"过敏反应\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 10,
         "answerList": [
            {
               "Content": "胃肠道不适，尿酸血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "粒细胞减少",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "过敏反应",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "眩晕、听力障碍",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "末梢神经炎及肝损害",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1749,
         "questionId": "km0bavrh7rfzzhgsrllw",
         "Title": "支气管扩张的临床特点",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"黄痰\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"大量脓痰久置后分三层\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"铁锈色痰\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"粉红泡沫痰\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"绿痰\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 165,
         "answerList": [
            {
               "Content": "粉红泡沫痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "黄痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "铁锈色痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "绿痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "大量脓痰久置后分三层",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3044,
         "questionId": "yzsdawcuelnjq47ffcfclw",
         "Title": "<p>王女士，60岁。行肺段切除术后2小时，自觉胸闷，呼吸急促，测血压、脉搏均正常，见水封瓶内有少量淡红色液体，水封瓶长玻璃管内的水柱不波动。考虑为（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"引流管阻塞\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺水肿\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"胸腔内出血\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸中枢抑制\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"开放性气胸\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 33,
         "answerList": [
            {
               "Content": "呼吸中枢抑制",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "开放性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺水肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "引流管阻塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸腔内出血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3014,
         "questionId": "yzsdawcuc6tbqxh16ehkq",
         "Title": "<p>快速静脉注射氨茶碱可导致的最严重的后果是</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"恶心呕吐\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"心律失常\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"头痛\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"失眠\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"死亡\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 3,
         "answerList": [
            {
               "Content": "失眠",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "头痛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "死亡",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "恶心呕吐",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1524,
         "questionId": "fr8bavr6zhifmlscrvphg",
         "Title": "张力性气胸主要的病理生理变化是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"纵隔向健侧移位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"纵隔扑动\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"胸壁反常呼吸运动\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺内气体对流\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"连枷胸\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 112,
         "answerList": [
            {
               "Content": "纵隔向健侧移位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺内气体对流",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "连枷胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "纵隔扑动",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸壁反常呼吸运动",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1686,
         "questionId": "km0bavrl6lns2iyfazuaa",
         "Title": "肺炎球菌肺炎患者首选的治疗是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"青霉素G\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"链霉素\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"氯霉素\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"庆大霉素\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"四环素\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 142,
         "answerList": [
            {
               "Content": "青霉素G",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "链霉素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "氯霉素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "四环素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "庆大霉素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1679,
         "questionId": "km0bavrolnemf2sxzybq",
         "Title": "阻塞性肺气肿的主要治疗措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"病因治疗\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"预防并发症的发生\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"改善呼吸功能\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"应用支气管舒张剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"长期应用抗菌药物\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 135,
         "answerList": [
            {
               "Content": "病因治疗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "预防并发症的发生",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "改善呼吸功能",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "长期应用抗菌药物",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "应用支气管舒张剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1517,
         "questionId": "fr8bavrfz5ewu3kafmgg",
         "Title": "开放性气胸患者呼吸困难最主要的急救措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"补输血液\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气管插管行辅助呼吸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"立即剖胸探查\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"迅速封闭胸部伤口\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 105,
         "answerList": [
            {
               "Content": "吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即剖胸探查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "迅速封闭胸部伤口",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "补输血液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气管插管行辅助呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1718,
         "questionId": "km0bavrokppvlsekkutpw",
         "Title": "患者60岁，男性，咳嗽10余年，近5年出现气喘、双肺广泛哮鸣音及肺底啰音，可能的诊断",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"支气管扩张症\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺结核\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管肺癌\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"慢阻肺\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 159,
         "answerList": [
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管扩张症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢阻肺",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管肺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1754,
         "questionId": "km0bavrk7hdtxz2tdhlua",
         "Title": "胡先生，30岁。患支气管扩张已10余年。1周来因受凉咳嗽、咳痰 加重，痰呈脓性，每日约500ml，体温37.8℃。  此病人基本病因最可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管先天发育不良\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"支气管防御功能退化\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支气管平滑肌痉挛\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管感染及阻塞\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管变态反应性炎症\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 170,
         "answerList": [
            {
               "Content": "支气管感染及阻塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管先天发育不良",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管平滑肌痉挛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管变态反应性炎症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管防御功能退化",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3019,
         "questionId": "yzsdawcufqtn6su4dcvftq",
         "Title": "<p>慢性支气管炎咳痰特点，错误的是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"常为白色、泡沫样痰\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"合并感染时转为黏液脓性痰\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"清晨时痰量较多\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"常为粉红色泡沫样痰\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"体位变动时可刺激排痰\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 8,
         "answerList": [
            {
               "Content": "常为粉红色泡沫样痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "清晨时痰量较多",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体位变动时可刺激排痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "常为白色、泡沫样痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "合并感染时转为黏液脓性痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1520,
         "questionId": "fr8bavrpqpnvmz25duspa",
         "Title": "病人持续痰中带血丝，首先考虑的疾病是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"原发性支气管肺癌\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺气肿\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺水肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 108,
         "answerList": [
            {
               "Content": "原发性支气管肺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺水肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1678,
         "questionId": "km0bavrzbfajt1qdlysxw",
         "Title": "慢性支气管炎最重要的病因是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"过敏\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"感染\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"大气污染\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"寒冷气候\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"呼吸道防御功低下\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 134,
         "answerList": [
            {
               "Content": "过敏",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "大气污染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸道防御功低下",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "寒冷气候",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3049,
         "questionId": "yzsdawcuzobodo4bgq7l8g",
         "Title": "<p>黄先生，36岁，反复支气管哮喘发作，准备给予糖皮质激素治疗，其给药途径最好选用</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肌内注射\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"口服\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气雾吸入\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"静脉注射\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"静脉滴注\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 38,
         "answerList": [
            {
               "Content": "静脉注射",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "静脉滴注",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "口服",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肌内注射",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气雾吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1764,
         "questionId": "km0bavr5anpjq5u9apfw",
         "Title": "支气管扩张患者的病变部位在下叶后基底段，作体位引流应取哪种体位",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"平卧位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"俯卧位，腰臀部抬高\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"仰卧位，腰部抬高\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"左侧卧位，腰部抬高\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"右侧卧位，腰部抬高\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 180,
         "answerList": [
            {
               "Content": "左侧卧位，腰部抬高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "平卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "仰卧位，腰部抬高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "右侧卧位，腰部抬高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "俯卧位，腰臀部抬高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1491,
         "questionId": "fr8bavrn7lkecsocifbag",
         "Title": "慢性肺心病发生心衰时，治疗首选是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"利尿剂\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"血管扩张剂\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"控制心律失常\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"控制感染\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"在控制感染的基础上控制好心力衰竭\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 79,
         "answerList": [
            {
               "Content": "利尿剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血管扩张剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "控制感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "在控制感染的基础上控制好心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "控制心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1518,
         "questionId": "fr8bavr4hehb5dtkmrrw",
         "Title": "支气管肺癌最常见的早期症状是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"发热\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"大量脓臭痰\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"刺激性呛咳\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"胸闷\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"气急\",\"IsAnswer\":null},{\"SortOrder\":5,\"Content\":\"胸痛\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 106,
         "answerList": [
            {
               "Content": "发热",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸闷",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气急",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸痛",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 5,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "大量脓臭痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "刺激性呛咳",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1719,
         "questionId": "km0bavrqppmjds7ba9log",
         "Title": "患者男性，50岁，慢性支气管炎、肺气肿病史多年，于阵咳后突然出现呼吸困难，右胸刺痛，逐渐加重，最可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"急性心肌梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"慢支急性发作\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"胸腔积液\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 160,
         "answerList": [
            {
               "Content": "急性心肌梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢支急性发作",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸腔积液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 2556,
         "questionId": "mmapaimr2jjnbchm2numvw",
         "Title": "患者男性，53岁。慢性咳嗽咳痰病史20余年，近3日来咳嗽咳痰加重，伴呼吸困难发绀发热表情淡漠嗜睡。血气分析PaO245mmHg，PaC0270mmHg。最确切的诊断是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心力衰竭\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺性脑病\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"代谢性酸中毒\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"ARDS\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 200,
         "answerList": [
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "代谢性酸中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺性脑病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "ARDS",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1501,
         "questionId": "fr8bavru55c1jdusdlgtq",
         "Title": "慢性肺源性心脏病患者右心衰竭时，首选的治疗措施为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"用利尿剂降低心脏前负荷，用洋地黄药物增加心脏泵功能，用血管扩张剂降低右心前后负荷\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"控制呼吸道感染\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"改善呼吸功能\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"纠正缺氧和二氧化碳潴留\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"气管插管机械通气\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 89,
         "answerList": [
            {
               "Content": "用利尿剂降低心脏前负荷，用洋地黄药物增加心脏泵功能，用血管扩张剂降低右心前后负荷",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "控制呼吸道感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "纠正缺氧和二氧化碳潴留",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气管插管机械通气",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "改善呼吸功能",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3052,
         "questionId": "yzsdawcu6prifqjrjze1ka",
         "Title": "<p>莫女士，65岁，诊断为COPD，该病人为改善肺功能进行缩唇呼吸训练时，要求蜡烛火焰距离病人口</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"10-15cm\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"15-20cm\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"20-25cm\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"25-30cm\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"30-35cm\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 41,
         "answerList": [
            {
               "Content": "25-30cm",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "30-35cm",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "15-20cm",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "10-15cm",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "20-25cm",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1746,
         "questionId": "km0bavrlrjijxpxmfcvw",
         "Title": "支气管扩张病人反复大咯血的主要原因是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺动脉高压\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺静脉高压\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支气管过度扩张\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管先天性发育缺损\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"感染引起支气管内肉芽组织或血瘤破裂\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 162,
         "answerList": [
            {
               "Content": "肺动脉高压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺静脉高压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管过度扩张",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "感染引起支气管内肉芽组织或血瘤破裂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管先天性发育缺损",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3051,
         "questionId": "yzsdawcuy4ndwnshdzbvg",
         "Title": "<p>陈先生，30岁，低热1月余，咳痰带血五天，三年前患过胸膜炎，X线胸片示左肺尖密度不均阴影，ESR 30mm/h，WBC 8.0×109/L。为明确诊断，下列哪项检查最为重要（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"PPD试验\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"痰检抗酸杆菌\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"痰检癌细胞\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"痰细菌培养\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"胸部CT\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 40,
         "answerList": [
            {
               "Content": "痰细菌培养",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸部CT",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰检抗酸杆菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "PPD试验",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰检癌细胞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1761,
         "questionId": "km0bavrlojnfkqwprzw1q",
         "Title": "支气管扩张肺部可听到",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"鼾音\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"管型呼吸音\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"捻发音\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"哮鸣音\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"患处固定湿啰音\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 177,
         "answerList": [
            {
               "Content": "哮鸣音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "鼾音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "捻发音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "患处固定湿啰音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "管型呼吸音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1638,
         "questionId": "km0bavryahiilljwyrryg",
         "Title": "支气管哮喘患者应禁忌使用以下哪类药物",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"β1肾上腺素能受体兴奋剂\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"β2肾上腺素能受体兴奋剂\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"β肾上腺素能受体阻滞剂\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"α肾上腺素能受体兴奋剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"α肾上腺素能受体阻滞剂\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 123,
         "answerList": [
            {
               "Content": "β1肾上腺素能受体兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "α肾上腺素能受体兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "α肾上腺素能受体阻滞剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "β2肾上腺素能受体兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "β肾上腺素能受体阻滞剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1774,
         "questionId": "lc0bavrbj9knlyghogg9w",
         "Title": "男性，60岁，有高血压病史，于夜间发生阵发性呼吸困难伴喘鸣，并咳粉红色泡沫样痰，应考虑为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"心源性哮喘\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气管异物\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺气肿\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺气肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 190,
         "answerList": [
            {
               "Content": "肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气管异物",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心源性哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1442,
         "questionId": "fr8bavr8l5dpbgqpypw",
         "Title": "林先生，70岁。慢性支气管炎、肺气肿病史多年，今日中午进餐时米粒呛入气管引起剧烈咳嗽后，突然呼吸困难，伴右胸刺痛，逐渐加重。最可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心肌梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺栓塞\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"胸腔积液\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管阻塞\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 70,
         "answerList": [
            {
               "Content": "心肌梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸腔积液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管阻塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1566,
         "questionId": "gr8bavr07nihnpfudz6kw",
         "Title": "肺结核最主要的传染源是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"结核菌污染的食物\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"结核菌污染的食物\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"结核菌感染的猪\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"排菌的肺结核患者\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"痰菌阴性的肺结核患者\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 114,
         "answerList": [
            {
               "Content": "结核菌污染的食物",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "排菌的肺结核患者",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰菌阴性的肺结核患者",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核菌污染的食物",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核菌感染的猪",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1519,
         "questionId": "fr8bavr8areoq0i8tjjvw",
         "Title": "与支气管肺癌发病密切相关的最重的危险因素是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"大气污染\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"长期吸烟\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"在石棉矿工作\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"遗传因素\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"超强阳性\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 107,
         "answerList": [
            {
               "Content": "大气污染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "遗传因素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "超强阳性",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "长期吸烟",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "在石棉矿工作",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1508,
         "questionId": "fr8bavrrtpuiprjomxza",
         "Title": "具备以下何项可确诊慢性肺心病",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"双肺满布湿罗音+咳白色泡沫痰\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"双肺哮鸣音+呼气性呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺动脉瓣区第二心音亢进+心尖搏动在剑突下\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心尖区舒张期杂音+两肺下部湿罗音\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"左侧胸骨旁第3肋-第4肋舒张期杂音\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 96,
         "answerList": [
            {
               "Content": "双肺满布湿罗音+咳白色泡沫痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心尖区舒张期杂音+两肺下部湿罗音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "左侧胸骨旁第3肋-第4肋舒张期杂音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "双肺哮鸣音+呼气性呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺动脉瓣区第二心音亢进+心尖搏动在剑突下",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1717,
         "questionId": "km0bavr74lb2pusvcbc7q",
         "Title": "林先生，70岁。慢性支气管炎、肺气肿病史多年，今日中午进餐时米粒呛入气管引起剧烈咳嗽后，突然呼吸困难，伴右胸刺痛，逐渐加重。最可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心肌梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺栓塞\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"胸腔积液\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管阻塞\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 158,
         "answerList": [
            {
               "Content": "心肌梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管阻塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸腔积液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1438,
         "questionId": "fr8bavr1yhhcyfbzuarpq",
         "Title": "患者男性，50岁，慢性支气管炎、肺气肿病史多年，于阵咳后突然出现呼吸困难，右胸刺痛，逐渐加重，最可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"急性心肌梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"慢支急性发作\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"胸腔积液\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 67,
         "answerList": [
            {
               "Content": "急性心肌梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢支急性发作",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸腔积液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1766,
         "questionId": "lc0bavr6irfvctzfniq",
         "Title": "患者，男性，78岁。慢性咳嗽、咳痰20余年，近5年来活动后气急，1周前感冒后痰多，气急加剧，近2天来嗜睡。化验：白细胞18.6×109/L，中性粒细胞0.9，动脉血pH 7.29，PaC02 80mmHg，PaO248mmHg。某病人出现头胀、神志恍惚、躁狂、谵语，应考虑",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"呼吸性酸中毒\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺性脑病\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"窒息先兆\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"休克早期\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"脑疝出现\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 182,
         "answerList": [
            {
               "Content": "休克早期",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸性酸中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "窒息先兆",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑疝出现",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺性脑病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1714,
         "questionId": "km0bavrlq9joean8mfua",
         "Title": "史先生，60岁，慢支肺气肿病史20年，近2周来出现发热、咳嗽、咯大量黏液脓痰，伴心悸、气喘，查呼吸急促、发绀明显，颈静脉怒张、下肢浮肿。该病人氧疗时，给氧浓度和氧流量应为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"29％,2L／min\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"33％,3L／min\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"37％，4L/min\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"41％,5L／min\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"45％,6L／min\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 155,
         "answerList": [
            {
               "Content": "29％,2L／min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "33％,3L／min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "37％，4L/min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "45％,6L／min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "41％,5L／min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1500,
         "questionId": "fr8bavrjzjcycpuftztw",
         "Title": "女性，67岁。有肺心病病史20年，此次患肺炎，2周来咳嗽、咳痰，今晨呼吸困难加重，烦躁不安，神志恍惚。查体：体温37.4℃，脉搏110/min，呼吸36/min、节律不整，口唇发绀，两肺底闻及细湿啰音，心(一)，腹(一)，血压正常。  何种卧位可减轻病人的呼吸困难",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"平卧位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"右侧卧位\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"左侧卧位\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"半卧位\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"头低脚高位\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 88,
         "answerList": [
            {
               "Content": "平卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "右侧卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "半卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "头低脚高位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "左侧卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1505,
         "questionId": "fr8bavrebbhl9zpumkq",
         "Title": "慢性阻塞性肺病合并心衰时，在用利尿剂治疗过程中易发生哪种电解质紊乱",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"低钠血症\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"高钾低氯血症\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"低钙血症\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"低钾、低氯血症\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"高钙血症\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 93,
         "answerList": [
            {
               "Content": "低钠血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低钾、低氯血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高钙血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高钾低氯血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低钙血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3030,
         "questionId": "yzsdawcuio9ia7gq3vobq",
         "Title": "<p>肖先生，肺癌大咯血，咯血过程中突然停止，表情恐怖、张口瞪目、大汗淋漓、发绀，此时护士应立即采取（）体位。</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"俯卧位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"侧卧位\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"头高足低位\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"头低足高位，头偏向一侧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"以上均不是\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 19,
         "answerList": [
            {
               "Content": "头低足高位，头偏向一侧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "以上均不是",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "侧卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "俯卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "头高足低位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1671,
         "questionId": "km0bavryl9daxnykdtvkq",
         "Title": "以下护理胸痛患者的措施中哪项不妥",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"适当安慰，消除其紧张情绪\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"指导患者取患侧卧位，用宽胶布于患者吸气末紧贴在患侧胸部\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"按医嘱给小剂量的镇静剂和止痛剂\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"根据不同病因采取相应护理措施\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 127,
         "answerList": [
            {
               "Content": "适当安慰，消除其紧张情绪",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "根据不同病因采取相应护理措施",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "指导患者取患侧卧位，用宽胶布于患者吸气末紧贴在患侧胸部",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "按医嘱给小剂量的镇静剂和止痛剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1750,
         "questionId": "km0bavrc55cyfrmh2eia",
         "Title": "青年女性患者，患支气管扩张多年，常反复咯血.就诊时又因剧咳而致大咯血，在观察中突然发现咯血中止，病人表情恐怖，张口瞪目，两手乱抓，应考虑发生直列何种紧急状况而需立即抢救",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"窒息\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"休克\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"心力衰竭\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 166,
         "answerList": [
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "休克",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "窒息",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3046,
         "questionId": "yzsdawcuspvmnmkux82bqw",
         "Title": "<p>朱先生，65岁，支气管扩张。今日劳作后出现恶心、胸闷，反复咯血，24小时出血量约800ml。目前患者饮食应（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"禁食\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"流质饮食\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"半流质饮食\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"软质饮食\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"普通饮食\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 35,
         "answerList": [
            {
               "Content": "软质饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "普通饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "流质饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "禁食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "半流质饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1682,
         "questionId": "km0bavrni5ijgcqnnnedg",
         "Title": "某青年患者，突然寒战，高热达40％，伴有咳嗽、胸痛，2h前服阿司匹林，出大汗后热退，血压10．6／6．5kPa，脉搏102次／min，神志清，四肢暖，白细胞20³10的9次方／L，胸片为右上肺大片状阴影，呈段分布。诊断为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"休克型肺炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"葡萄球菌性肺炎\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"克雷伯杆菌肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺脓肿\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺炎球菌性肺炎\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 138,
         "answerList": [
            {
               "Content": "休克型肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "葡萄球菌性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "克雷伯杆菌肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎球菌性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺脓肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1677,
         "questionId": "km0bavrekpbm60j8d9mya",
         "Title": "某男性病人，52岁，患COPD15年。近3天因急性上感病情加重，体温37.8℃，神志恍惚，昼睡夜醒，气促、不能平卧，痰色黄、粘稠、不易咳出。血气分析示PaO2 56mmHg、PaCO2 67mmHg。考虑此病人发生了",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"电解质紊乱\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"呼吸性酸中毒\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"脑疝先兆\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺性脑病\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"自发性气胸\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 133,
         "answerList": [
            {
               "Content": "电解质紊乱",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸性酸中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑疝先兆",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺性脑病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 9,
         "questionId": "z9n5aaqruz9beqwsorb3bg",
         "Title": "<p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">慢性呼吸衰竭缺氧的典型表现是</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"发绀\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"烦躁不安\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心率增快\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"定向力障碍\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 53,
         "answerList": [
            {
               "Content": "呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "烦躁不安",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "定向力障碍",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心率增快",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1713,
         "questionId": "km0bavrma5ihsedttdhg",
         "Title": "某男性老年人，慢性咳嗽、咳痰12年。近2年来劳动时出现气短，偶有踝部水肿，门诊以慢性支气管炎合并慢性阻塞性肺气肿收入院。对上述病人进行哪些检查有助于确诊",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心电图\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"胸部X线检查\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"痰液检查\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"血气分析\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"脑脊液检查\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 154,
         "answerList": [
            {
               "Content": "心电图",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸部X线检查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰液检查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑脊液检查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血气分析",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3043,
         "questionId": "yzsdawcueqzf75ius7nkia",
         "Title": "<p>钟先生，38岁。受凉后突发高热、寒战伴右侧胸痛1天，胸部透视右中肺大片浅淡阴影。诊断为右下肺炎，给予抗生素治疗，正确的疗程时间是</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"10-14天\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"3-4天\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"7-10天\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"5-7天\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"8-10天\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 32,
         "answerList": [
            {
               "Content": "5-7天",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "8-10天",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "3-4天",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "10-14天",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "7-10天",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1768,
         "questionId": "lc0bavryk1nccsi0bnia",
         "Title": "患者，男性，78岁。慢性咳嗽、咳痰20余年，近5年来活动后气急，1周前感冒后痰多，气急加剧，近2天来嗜睡。化验：白细胞18.6×109/L，中性粒细胞0.9，动脉血pH 7.29，PaC02 80mmHg，PaO248mmHg。若经药物治疗无效，患者自主呼吸停止，应立即给予",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"气管切开+机械通气\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"清理呼吸道\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气管插管+机械通气\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"高浓度的吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"体外心脏按压\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 184,
         "answerList": [
            {
               "Content": "高浓度的吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气管切开+机械通气",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气管插管+机械通气",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体外心脏按压",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "清理呼吸道",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 8,
         "questionId": "z9n5aaqrx4lnvyalpo2sia",
         "Title": "<p style=\"text-indent:32px;line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">关先生</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">，</span>60<span style=\"font-family:宋体\">岁</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">有慢性支气管炎、阻塞性肺气肿病史</span>10<span style=\"font-family:宋体\">余年，近</span><span style=\"font-family:Times New Roman\">3</span><span style=\"font-family:宋体\">年来反复双下肢</span></span><span style=\";font-family:宋体;font-size:16px\">水</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">肿，此次病情加重，口唇发绀，神志恍惚，双下肺闻</span></span><span style=\";font-family:宋体;font-size:16px\">及</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">干</span></span><span style=\";font-family:宋体;font-size:16px\">性</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">湿</span></span><span style=\";font-family:宋体;font-size:16px\">啰</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">音，</span>120<span style=\"font-family:宋体\">次</span><span style=\"font-family:Times New Roman\">/</span><span style=\"font-family:宋体\">分，有早搏</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">&nbsp;</span></p><p style=\"line-height:150%\"><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">确定该病人有无呼吸衰竭，下列最有意义</span></span><span style=\";font-family:宋体;font-size:16px\">的是</span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"动脉血气分析\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"发绀\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"神志变化\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心律失常\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"呼吸困难\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 52,
         "answerList": [
            {
               "Content": "发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "神志变化",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "动脉血气分析",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1752,
         "questionId": "km0bavrakleht7ahspexa",
         "Title": "支气管扩张患者的咳嗽特点为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"晨起及晚间躺下时较重\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"常出现刺激性干咳\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"有时呈阵发性呛咳\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"后期咳嗽加重并伴喘鸣声\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"严重者出现呼气性呼吸困难\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 168,
         "answerList": [
            {
               "Content": "后期咳嗽加重并伴喘鸣声",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "晨起及晚间躺下时较重",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "有时呈阵发性呛咳",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "严重者出现呼气性呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "常出现刺激性干咳",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1523,
         "questionId": "fr8bavr5ijbtvbpscoqxa",
         "Title": "带金属音的刺激性咳嗽应考虑",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管肺癌\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"胸膜炎\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"左心衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管扩张\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 111,
         "answerList": [
            {
               "Content": "支气管肺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "左心衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管扩张",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸膜炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3040,
         "questionId": "yzsdawcuj4xlwr3abfiyw",
         "Title": "<p>覃先生，男，33岁。干咳、胸痛，以自发性气胸入院，经积极治疗后已痊愈准备出院，护士告诉患者为预防复发最重要的是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"戒烟\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"清淡饮食\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"避免屏气用力\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"积极锻炼身体\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"保持情绪稳定\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 29,
         "answerList": [
            {
               "Content": "积极锻炼身体",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "保持情绪稳定",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "清淡饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "戒烟",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免屏气用力",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1487,
         "questionId": "fr8bavrzpnpvzd5d21epg",
         "Title": "慢性肺源性心脏病最常见的病因是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"支气管扩张\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"COPD\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺小动脉栓塞\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"Ⅳ型肺结核严重的胸廓\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"脊柱畸形\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 75,
         "answerList": [
            {
               "Content": "支气管扩张",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "COPD",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅳ型肺结核严重的胸廓",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脊柱畸形",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺小动脉栓塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3036,
         "questionId": "yzsdawcuo71pq8xqfwkm1g",
         "Title": "<p>陆先生，26岁。突然畏寒、发热伴胸痛1日，胸部摄片示右中肺有大片高密度影。诊断为肺炎球菌肺炎。若患者体温突然下降，脉搏细速，血压下降，应特别警惕发生（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"晕厥\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"昏迷\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"心律失常\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"休克\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"惊厥\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 25,
         "answerList": [
            {
               "Content": "休克",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "惊厥",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "昏迷",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "晕厥",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心律失常",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 13,
         "questionId": "z9n5aaqrmi5g1ljx7tp1zg",
         "Title": "<p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">慢性呼吸衰竭病人发生肺性脑病的先兆症状是</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"出现呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"出现发绀\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"出现消化系统症状\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"出现循环系统症状\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"出现精神神经症状\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 57,
         "answerList": [
            {
               "Content": "出现发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "出现消化系统症状",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "出现精神神经症状",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "出现循环系统症状",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "出现呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1688,
         "questionId": "km0bavrpafindpjldjrq",
         "Title": "青年女性患者于受凉淋雨后突发寒战、高热、胸痛、咳嗽、气急、咯铁锈色痰，体检左下肺有实变体征及湿罗音，治疗用药应首选",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"安乃近\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"地塞米松\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"青霉素\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"棕色合剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"氨茶碱\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 144,
         "answerList": [
            {
               "Content": "安乃近",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "地塞米松",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "青霉素",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "氨茶碱",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "棕色合剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1747,
         "questionId": "km0bavrlifnprn3oe4o9g",
         "Title": "支气管扩张病人体位引流合理的体位是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"任何体位均可\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"采取病人感觉舒适的体位\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"患侧位于低处，引流支气管开口朝上\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"患侧位于水平位，引流支气管开口水平位\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"患侧位于高处，引流支气管开口朝下\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 163,
         "answerList": [
            {
               "Content": "任何体位均可",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "采取病人感觉舒适的体位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "患侧位于低处，引流支气管开口朝上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "患侧位于高处，引流支气管开口朝下",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "患侧位于水平位，引流支气管开口水平位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1690,
         "questionId": "km0bavruk1p10s5inwabw",
         "Title": "患者男性，36岁，平素体健。淋雨后发热，咳嗽2天，右上腹痛伴气急、恶心1天。除考虑急腹症外，重点鉴别的疾病是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"链球菌肺炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"自发性气胸\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"膈神经麻痹\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺梗死\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺结核\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 146,
         "answerList": [
            {
               "Content": "链球菌肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "自发性气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "膈神经麻痹",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 6,
         "questionId": "z9n5aaqrhalovmevryasuq",
         "Title": "<p><br/></p><p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">慢性呼吸衰竭病人出现烦躁不安、夜间失眠，</span></span><strong><span style=\"text-decoration:underline;\"><span style=\"font-family: &#39;Times New Roman&#39;;font-size: 16px\"><span style=\"font-family:宋体\">禁用</span></span></span></strong></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"祛痰剂\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"麻醉剂&nbsp;\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"利尿剂\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"呼吸兴奋剂\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"支气管舒张剂\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 50,
         "answerList": [
            {
               "Content": "麻醉剂&nbsp;",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "利尿剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管舒张剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "祛痰剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3016,
         "questionId": "yzsdawcukknhufuhl1useg",
         "Title": "<p>支气管哮喘的临床表现，下列哪项是错误的（  ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"呼气性呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"两肺满布哮鸣音\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"心浊音界缩小\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"三凹症\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"发绀\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 5,
         "answerList": [
            {
               "Content": "三凹症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心浊音界缩小",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼气性呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "两肺满布哮鸣音",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1684,
         "questionId": "km0bavrralbfmjdiogwqw",
         "Title": "按病理分类婴幼儿最常见的肺炎是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"大叶性肺炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"支气管肺炎\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"间质性肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"干酪性肺炎\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"原虫性肺炎\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 140,
         "answerList": [
            {
               "Content": "大叶性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "间质性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "原虫性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "干酪性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3018,
         "questionId": "yzsdawcub4pjuioodwaxdg",
         "Title": "<p>休克型肺炎最突出的表现是</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"体温39°C以上\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"血压降到80/50mmHg\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"恶心呕吐\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"少尿或无尿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 7,
         "answerList": [
            {
               "Content": "恶心呕吐",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "少尿或无尿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体温39°C以上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "血压降到80/50mmHg",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 12,
         "questionId": "z9n5aaqrza9ajmkarbbejq",
         "Title": "<p style=\"text-indent:32px;line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">张先生</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">，</span>75<span style=\"font-family:宋体\">岁</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">有慢性支气管炎病史</span>20<span style=\"font-family:宋体\">年。</span></span><span style=\";font-family:宋体;font-size:16px\">1</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">周前受凉后再次出现咳嗽、咳白色</span></span><span style=\";font-family:宋体;font-size:16px\">黏</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">痰，伴有呼吸困难、胸闷、乏力。以慢性支气管炎合并慢性阻塞性肺气肿入院治疗</span></span></p><p style=\"line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">病人</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">最可能出现的并发症是</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心力衰竭\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"DIC\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"上消化道出血\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"急性肾衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 56,
         "answerList": [
            {
               "Content": "DIC",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "上消化道出血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "急性肾衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1595,
         "questionId": "gr8bavro4bl5lovvwdgdq",
         "Title": "患者，30岁，患浸润型肺结核2年，给链霉素0．5g肌注，2次／天，口服异烟肼、利福平治疗半年，近来自诉耳鸣，听力下降，可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺结核临床症状\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"链霉素对听神经损害\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"异烟肼对听神经损害\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"利福平时听神经损害\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"异烟肼对周围神经损害\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 119,
         "answerList": [
            {
               "Content": "肺结核临床症状",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "利福平时听神经损害",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "异烟肼对周围神经损害",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "链霉素对听神经损害",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "异烟肼对听神经损害",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3055,
         "questionId": "yzsdawcuaqpldwbyp9ltwq",
         "Title": "<p>莫先生，75岁。咳嗽、咳痰、喘息30余年，5年来间断加重，伴有双下肢水肿，一周来咳喘并下肢水肿加重伴有嗜睡入院。以下检查对诊断具有重要意义的是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"MRI检查\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"心电图\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"脑电图\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"血气分析\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"痰培养\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 44,
         "answerList": [
            {
               "Content": "血气分析",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰培养",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心电图",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "MRI检查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑电图",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 2553,
         "questionId": "mmapaimr745mjgwmocmnjq",
         "Title": "慢性肺源性心脏病患者发生呼吸衰竭时，给予低浓度氧疗的依据是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"便于应用呼吸兴奋剂\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"慢性呼吸衰竭时，呼吸中枢对C02的刺激仍很敏感\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"缺02是维持病人呼吸的重要刺激因子\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"氧浓度大于30%易引起氧中毒\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"高浓度氧疗容易使病人呼吸兴奋\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 197,
         "answerList": [
            {
               "Content": "氧浓度大于30%易引起氧中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "便于应用呼吸兴奋剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "缺02是维持病人呼吸的重要刺激因子",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高浓度氧疗容易使病人呼吸兴奋",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性呼吸衰竭时，呼吸中枢对C02的刺激仍很敏感",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1567,
         "questionId": "gr8bavrokhmp1aewctlwq",
         "Title": "肺结核的主要感染途径是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"呼吸道\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"消化道\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"泌尿道\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"皮肤\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"淋巴道\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 115,
         "answerList": [
            {
               "Content": "呼吸道",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "皮肤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "淋巴道",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "消化道",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "泌尿道",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3039,
         "questionId": "yzsdawcufbbodyasjhn6pq",
         "Title": "<p>钟先生，60岁，肺癌晚期，突然出现突然头痛、呕吐、昏迷、抽搐，应考虑（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"脑转移\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"脑卒中\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"低血糖反应\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"高血压急症\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"低钠血症\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 28,
         "answerList": [
            {
               "Content": "高血压急症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低钠血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑卒中",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "脑转移",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低血糖反应",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1756,
         "questionId": "km0bavrzljppaulinqskw",
         "Title": "患者，30岁.常常在晨起及晚间躺下时咳大量脓痰，伴少量鲜血，并且痰液放置后分三层，可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"慢性支气管炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺癌\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺结核\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管扩张\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺气肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 172,
         "answerList": [
            {
               "Content": "支气管扩张",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性支气管炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺气肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1771,
         "questionId": "lc0bavrvzxkufoqsohjiq",
         "Title": "男性，68岁，有吸烟史30余年，出现慢性咳嗽、咯痰已20多年近5年来明显加剧，已常年不断，伴有喘息和呼吸困难，且以冬春季更甚。3天前因受凉感冒而致发热、剧咳、咯多量黄脓痰、气急、发绀，今晨起又出现意识模糊，躁动不安，送医院急诊并急测血气结果为动脉血氧分压6．9kPa，二氧化碳分压8kPa。给病人的正确吸氧方式应为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"持续低流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"间断低流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"持续高流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"间断高流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"间断中流量吸氧\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 187,
         "answerList": [
            {
               "Content": "间断高流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "持续低流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "持续高流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "间断中流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "间断低流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 14,
         "questionId": "z9n5aaqrk5tnigwstrds4g",
         "Title": "<p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">纠正缺氧、缓解呼吸困难最有效措施是</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"用药\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"空气新鲜\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"温度适宜\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"合理氧疗\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"采取适宜体位\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 58,
         "answerList": [
            {
               "Content": "空气新鲜",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "温度适宜",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "采取适宜体位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "合理氧疗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "用药",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1673,
         "questionId": "km0bavreyjogfme5s4tzg",
         "Title": "呼吸系病胸痛最佳体位是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"平卧位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"半卧位\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"端坐位\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"患侧卧位\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"健侧卧位\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 129,
         "answerList": [
            {
               "Content": "平卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "半卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "端坐位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "健侧卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "患侧卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1516,
         "questionId": "fr8bavrxzfiqvwnyoetg",
         "Title": "胸膜腔闭式引流的引流管脱出时应首先",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"通知医师紧急处理\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"给患者吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"嘱患者缓慢呼吸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"将脱出的引流管重新置入\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"用手指捏闭引流口周围皮肤\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 104,
         "answerList": [
            {
               "Content": "通知医师紧急处理",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "将脱出的引流管重新置入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "用手指捏闭引流口周围皮肤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给患者吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "嘱患者缓慢呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1596,
         "questionId": "gr8bavrsa1mbxjxqpxlva",
         "Title": "施女士，22岁，近2个月来午后低热、咳嗽、痰中带血、纳差、无力、消瘦，用消炎镇咳剂无效，痰中2次找到结核菌，胸部x线检查示右肺尖片状模糊  阴影。临床诊断肺结核 按结核病分型，应诊断为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"I型\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"Ⅱ型\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"Ⅲ型\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"Ⅳ型\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"V型\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 120,
         "answerList": [
            {
               "Content": "I型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅳ型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "V型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅱ型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅲ型",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1767,
         "questionId": "lc0bavr955prgvhec16dg",
         "Title": "某青年患者，突然寒战，高热达40℃，伴有咳嗽、胸痛，2h前服阿司匹林，出大汗后热退，血压10．6／6．5kPa，脉搏102次／min，神志清，四肢暖，白细胞20³109／L，胸片为右上肺大片状阴影，呈段分布，诊断为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"休克型肺炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"葡萄球菌性肺炎\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"克雷白杆菌肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺脓肿\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺炎球菌性肺炎\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 183,
         "answerList": [
            {
               "Content": "肺脓肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "休克型肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "克雷白杆菌肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎球菌性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "葡萄球菌性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1594,
         "questionId": "gr8bavrsqfgbtrbgcialg",
         "Title": "张先生的夫人疑患肺结核                                                        王护士按医嘱给张夫人做结核菌素试验，操作错误的一项是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"进针前使注射器和针头处于与病人皮肤几乎平行的位置\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"进针时针头斜面向上\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"进针后抽动注射器活塞看有无回血\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"注射药液后，按揉注射部位\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"48h后观察结果\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 118,
         "answerList": [
            {
               "Content": "进针前使注射器和针头处于与病人皮肤几乎平行的位置",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "注射药液后，按揉注射部位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "48h后观察结果",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "进针时针头斜面向上",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "进针后抽动注射器活塞看有无回血",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1685,
         "questionId": "km0bavruqxixezk0jba",
         "Title": "<p>患者，男，40岁.一天来发烧、咳嗽、胸痛、头晕.面色苍白，神志清，血压4.3/6．7kPa，脉搏140次／min，血白细胞数21³109／L，腹部(一)，胸片右上肺大片密度均匀阴影，诊断为</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"休克性肺炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"支气管扩张合并感染\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支原体肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"结核性胸膜炎\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺脓肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 141,
         "answerList": [
            {
               "Content": "休克性肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管扩张合并感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支原体肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺脓肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核性胸膜炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1514,
         "questionId": "fr8bavruivitooaub0nw",
         "Title": "患者男性，50岁，慢性支气管炎、肺气肿病史多年，于阵咳后突然出现呼吸困难，右胸刺痛，逐渐加重，最可能是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"急性心肌梗死\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"慢支急性发作\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气胸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"胸腔积液\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 102,
         "answerList": [
            {
               "Content": "急性心肌梗死",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "胸腔积液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢支急性发作",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气胸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1811,
         "questionId": "lc0bavrn7vavghaax7mmw",
         "Title": "肺结核的主要传染源是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"原发型肺结核病人\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺内有空洞的肺结核病人\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"痰中排菌的肺结核病人\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"血行播散型肺结核病人\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"结核性胸膜炎病人\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 195,
         "answerList": [
            {
               "Content": "血行播散型肺结核病人",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "原发型肺结核病人",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰中排菌的肺结核病人",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核性胸膜炎病人",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺内有空洞的肺结核病人",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1751,
         "questionId": "km0bavrcivdvylld70lq",
         "Title": "病人，男性，23岁，患支气管扩张症，间断咯血，近日来因受凉咳大量黄色浓痰，入院治疗 护士指导病人做体位引流时应避免",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"在饭后一小时进行\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"引流前做生理盐水超声雾化\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"引流同时作胸部叩击\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"引流后可给治疗性雾化吸入\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"每次引流15~20min\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 167,
         "answerList": [
            {
               "Content": "引流后可给治疗性雾化吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "在饭后一小时进行",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "引流同时作胸部叩击",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "每次引流15~20min",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "引流前做生理盐水超声雾化",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1762,
         "questionId": "km0bavr3o1j1wamkuwoza",
         "Title": "病人，男性，23岁，患支气管扩张症，间断咯血，近日来因受凉咳大量黄色浓痰，入院治疗  根据病情病人目前最主要的护理诊断是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"气体交换受损\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"低效性呼吸型态\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"清理呼吸道无效\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"营养失调：低于机体需要量\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"潜在并发症：窒息\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 178,
         "answerList": [
            {
               "Content": "营养失调：低于机体需要量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气体交换受损",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "清理呼吸道无效",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "潜在并发症：窒息",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低效性呼吸型态",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3045,
         "questionId": "yzsdawcugi5nclluyitmyw",
         "Title": "<p>冯先生，25岁。咳嗽、咳痰2周，结核菌素试验（1：2000稀释度）阳性。真确的解释是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"现在为活动性肺结核\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"可排除结核病\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"曾有结核菌感染\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"需做胸部CT检查\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"需用抗结核化疗\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 34,
         "answerList": [
            {
               "Content": "需做胸部CT检查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "需用抗结核化疗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "可排除结核病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "现在为活动性肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "曾有结核菌感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1810,
         "questionId": "lc0bavrqqvd2x4l7z9vg",
         "Title": "咯血最常见的病因是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"慢性支气管炎\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"慢性肺源性心脏病\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺炎\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"肺结核\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 194,
         "answerList": [
            {
               "Content": "肺结核",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性支气管炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "慢性肺源性心脏病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1760,
         "questionId": "km0bavrrzkbfp9cw5tzw",
         "Title": "支气管扩张发生大咯血首要的护理措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"保持呼吸道通畅\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"静脉输液\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"止血药的应用\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"抗休克治疗\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"抗休克治疗\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 176,
         "answerList": [
            {
               "Content": "抗休克治疗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "保持呼吸道通畅",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "止血药的应用",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "抗休克治疗",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "静脉输液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1522,
         "questionId": "fr8bavr64pjumt5g2g20g",
         "Title": "临床上最常见的肺癌是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"鳞癌\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"小细胞未分化癌\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"腺癌\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"大细胞癌\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺泡癌\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 110,
         "answerList": [
            {
               "Content": "鳞癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "大细胞癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺泡癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "小细胞未分化癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "腺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3028,
         "questionId": "yzsdawcutbbo3beeqvc8ga",
         "Title": "<p>茂先生，72岁，有慢性咳喘史25年，近日感冒后病情加重，夜间咳嗽频繁，痰量多。查体：神志清，口唇轻度发绀，桶状胸，双肺叩诊过清音，呼吸音低，动脉血气分析：PaO2 85mmHg，PaC02 45mmHg，经治疗后病情缓解，此病人在家休养时不正确的做法是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"进行缩唇腹式呼吸\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"避免吸人有害气体\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"避免到人群密集的场合\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"重视营养摄入\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"长期使用抗生素预防感染\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 17,
         "answerList": [
            {
               "Content": "重视营养摄入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免到人群密集的场合",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "长期使用抗生素预防感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "进行缩唇腹式呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "避免吸人有害气体",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1513,
         "questionId": "fr8bavrxrlgxnj2kbjvw",
         "Title": "开放性气胸患者呼吸困难最主要的急救措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"补输血液\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"气管插管行辅助呼吸\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"立即剖胸探查\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"迅速封闭胸部伤口\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 101,
         "answerList": [
            {
               "Content": "吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即剖胸探查",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "迅速封闭胸部伤口",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "补输血液",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "气管插管行辅助呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 19,
         "questionId": "z9n5aaqroodorefexkyava",
         "Title": "<p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">慢性呼吸衰竭病人最早最突出的症状是</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"咳嗽\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"发绀\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"烦躁不安\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"嗜睡\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 63,
         "answerList": [
            {
               "Content": "烦躁不安",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "咳嗽",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "嗜睡",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3053,
         "questionId": "yzsdawcuijbncx4pccgmtw",
         "Title": "<p>刘先生，男，71岁。因克雷伯杆菌肺炎并发败血症入院，入院后为及时发现并处理感染性休克，护士应密切观察的项目中不包括（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心率、脉搏\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"咳痰量、性质及气味\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"皮肤、黏膜有无发绀、肢端温度\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"有无尿量减少\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"精神和意志状态\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 42,
         "answerList": [
            {
               "Content": "有无尿量减少",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "精神和意志状态",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "咳痰量、性质及气味",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心率、脉搏",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "皮肤、黏膜有无发绀、肢端温度",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 7,
         "questionId": "z9n5aaqrs5jifcuawjb1aa",
         "Title": "<p style=\"line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">董先生，</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">71</span><span style=\";font-family:宋体;font-size:16px\">岁，因呼吸衰竭急诊入院，给予尼可刹米</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">3.75g</span><span style=\";font-family:宋体;font-size:16px\">加入</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">500ml</span><span style=\";font-family:宋体;font-size:16px\">液体中静滴，在护理过程中发现病人出现恶心、烦躁、颜面潮红。护士应采取的措施是</span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"继续观察病情\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"机械吸痰\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"机械通气\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"调快滴速\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"调慢滴速并及时报告医生\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 51,
         "answerList": [
            {
               "Content": "机械吸痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "机械通气",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "调慢滴速并及时报告医生",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "调快滴速",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "继续观察病情",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3017,
         "questionId": "yzsdawcumkvcjexliex00a",
         "Title": "<p>慢性呼吸衰竭缺氧的典型表现是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"发绀\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"烦躁不安\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心率增快\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"定向力障碍\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 6,
         "answerList": [
            {
               "Content": "心率增快",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "烦躁不安",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "定向力障碍",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "发绀",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3050,
         "questionId": "yzsdawcumpdowpdlb9lva",
         "Title": "<p>张先生，男性，80岁，因慢性阻塞性肺疾病并发感染住院，患者出现下列哪种表现提示为肺性脑病先兆（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"瞳孔不等大\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"心率加快，血压升高\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"呼吸急促\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"烦躁，嗜睡\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"尿量减少\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 39,
         "answerList": [
            {
               "Content": "烦躁，嗜睡",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "尿量减少",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心率加快，血压升高",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "瞳孔不等大",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸急促",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1773,
         "questionId": "lc0bavrpy1iykes5mpj2q",
         "Title": "呼吸衰竭患者出现下列哪种情况可考虑使用呼吸兴奋剂",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"吸氧后仍有呼吸困难\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"吸氧后仍有嗜睡、神志恍惚现象\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"吸氧后心率增快、血压下降明显\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"吸氧后呼吸明显受到抑制，通气量不足时\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"导致呼吸衰竭的原发病因为COPD\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 189,
         "answerList": [
            {
               "Content": "吸氧后呼吸明显受到抑制，通气量不足时",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "吸氧后仍有呼吸困难",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "吸氧后心率增快、血压下降明显",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "导致呼吸衰竭的原发病因为COPD",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "吸氧后仍有嗜睡、神志恍惚现象",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1637,
         "questionId": "km0bavrjznbr3y7stmza",
         "Title": "哮喘持续状态病人的护理不正确的是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"保持有效吸氧\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"保持呼吸道通畅\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"加快输液速度，以纠正脱水，防止痰液黏塞\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"专人护理，消除病人紧张恐惧心理\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"严密观察血压、脉搏、呼吸及神志的变化\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 122,
         "answerList": [
            {
               "Content": "保持有效吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "专人护理，消除病人紧张恐惧心理",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "严密观察血压、脉搏、呼吸及神志的变化",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "保持呼吸道通畅",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "加快输液速度，以纠正脱水，防止痰液黏塞",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 16,
         "questionId": "z9n5aaqrhqbnqwgfzt8voq",
         "Title": "<p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">呼吸衰竭的诊断标准是</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">PaO2<span style=\\\"font-family:宋体\\\">﹤</span><span style=\\\"font-family:Times New Roman\\\">30mm</span></span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g<span style=\\\"font-family:宋体\\\">，</span><span style=\\\"font-family:Times New Roman\\\">PaCO2</span><span style=\\\"font-family:宋体\\\">﹥</span><span style=\\\"font-family:Times New Roman\\\">80mm</span></span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g</span><span style=\\\";font-family:宋体;font-size:16px\\\">&nbsp;</span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">PaO2<span style=\\\"font-family:宋体\\\">﹤</span><span style=\\\"font-family:Times New Roman\\\">40mm</span></span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g<span style=\\\"font-family:宋体\\\">，</span><span style=\\\"font-family:Times New Roman\\\">PaCO2</span><span style=\\\"font-family:宋体\\\">﹥</span><span style=\\\"font-family:Times New Roman\\\">70mm</span></span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g</span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">PaO</span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">﹤</span></span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">50mm</span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g<span style=\\\"font-family:宋体\\\">，</span><span style=\\\"font-family:Times New Roman\\\">PaCO</span></span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">﹥</span></span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">60mm</span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g</span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">PaO</span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">﹤</span></span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">60mm</span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g<span style=\\\"font-family:宋体\\\">，</span><span style=\\\"font-family:Times New Roman\\\">PaCO</span></span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">﹥</span></span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">50mm</span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g</span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">PaO</span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">﹤</span></span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">70mm</span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g<span style=\\\"font-family:宋体\\\">，</span><span style=\\\"font-family:Times New Roman\\\">PaCO</span></span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">﹥</span></span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">40mm</span><span style=\\\";font-family:宋体;font-size:16px\\\">H</span><span style=\\\";font-family:'Times New Roman';font-size:16px\\\">g</span></p><p><br></p>\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 60,
         "answerList": [
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\">PaO</span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">﹤</span></span><span style=\";font-family:'Times New Roman';font-size:16px\">60mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g<span style=\"font-family:宋体\">，</span><span style=\"font-family:Times New Roman\">PaCO</span></span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">﹥</span></span><span style=\";font-family:'Times New Roman';font-size:16px\">50mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g</span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\">PaO2<span style=\"font-family:宋体\">﹤</span><span style=\"font-family:Times New Roman\">30mm</span></span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g<span style=\"font-family:宋体\">，</span><span style=\"font-family:Times New Roman\">PaCO2</span><span style=\"font-family:宋体\">﹥</span><span style=\"font-family:Times New Roman\">80mm</span></span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g</span><span style=\";font-family:宋体;font-size:16px\">&nbsp;</span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\">PaO</span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">﹤</span></span><span style=\";font-family:'Times New Roman';font-size:16px\">50mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g<span style=\"font-family:宋体\">，</span><span style=\"font-family:Times New Roman\">PaCO</span></span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">﹥</span></span><span style=\";font-family:'Times New Roman';font-size:16px\">60mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g</span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\">PaO</span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">﹤</span></span><span style=\";font-family:'Times New Roman';font-size:16px\">70mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g<span style=\"font-family:宋体\">，</span><span style=\"font-family:Times New Roman\">PaCO</span></span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">﹥</span></span><span style=\";font-family:'Times New Roman';font-size:16px\">40mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g</span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\">PaO2<span style=\"font-family:宋体\">﹤</span><span style=\"font-family:Times New Roman\">40mm</span></span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g<span style=\"font-family:宋体\">，</span><span style=\"font-family:Times New Roman\">PaCO2</span><span style=\"font-family:宋体\">﹥</span><span style=\"font-family:Times New Roman\">70mm</span></span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:'Times New Roman';font-size:16px\">g</span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1769,
         "questionId": "lc0bavrsphpriikz84cdg",
         "Title": "患者男性，70岁，长期吸烟，2个月来声音嘶哑，痰中带血，低热乏力，少量黏痰，血象正常，曾有结核病接触史，胸部x线检查左肺上野有一直径3cm密度较高的球形阴影，最可能的诊断是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"结核瘤\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"炎性假瘤\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"原发性中心型肺癌\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"错构瘤\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"淋巴瘤\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 185,
         "answerList": [
            {
               "Content": "错构瘤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "结核瘤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "原发性中心型肺癌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "淋巴瘤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "炎性假瘤",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1720,
         "questionId": "km0bavryzcoxfpvdeibg",
         "Title": "史先生，60岁，慢支肺气肿病史20年，近2周来出现发热、咳嗽、咯大量黏液脓痰，伴心悸、气喘，查呼吸急促、发绀明显，颈静脉怒张、下肢浮肿。做心电图时可出现",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"P波高尖\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"P波低平\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"P波倒置\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"P波增宽\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"P波消失\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 161,
         "answerList": [
            {
               "Content": "P波高尖",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "P波低平",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "P波倒置",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "P波消失",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "P波增宽",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3029,
         "questionId": "yzsdawcukypjiwpkkybsg",
         "Title": "<p>顾女士，58岁，患慢性阻塞性肺疾病多年，现体重下降明显。应给予</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"高热量、低蛋白、高脂肪饮食\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"低热量、高蛋白、高维生素饮食\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"高热量、高蛋白、高维生素饮食\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"高热量、低蛋白、高维生素饮食\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"低热量、低蛋白、高维生素饮食\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 18,
         "answerList": [
            {
               "Content": "高热量、低蛋白、高维生素饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低热量、低蛋白、高维生素饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低热量、高蛋白、高维生素饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高热量、低蛋白、高脂肪饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高热量、高蛋白、高维生素饮食",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1502,
         "questionId": "fr8bavrv5nbstzcsvfycw",
         "Title": "女性，67岁。有肺心病病史20年，此次患肺炎，2周来咳嗽、咳痰，今晨呼吸困难加重，烦躁不安，神志恍惚。查体：体温37.4℃，脉搏110/min，呼吸36/min、节律不整，口唇发绀，两肺底闻及细湿啰音，心(一)，腹(一)，血压正常。  此时对病人的治疗哪项不宜",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"静脉滴注氯化钾\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"给予镇静药\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"低流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"给呼吸兴奋药\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"使用人工呼吸器\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 90,
         "answerList": [
            {
               "Content": "静脉滴注氯化钾",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给予镇静药",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "给呼吸兴奋药",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "使用人工呼吸器",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1715,
         "questionId": "km0bavryl5n2nm0pnwjda",
         "Title": "病人男性，有吸烟史20年，近年来反复出现咳嗽咳痰，冬春季加剧，早晚加重，并常有白色黏痰。近日因受凉后发热并咳脓痰此病人最有可能的医疗诊断是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"慢性支气管炎急性发作\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"支气管扩张\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"支气管哮喘\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"上呼吸道感染\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"肺脓肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 156,
         "answerList": [
            {
               "Content": "慢性支气管炎急性发作",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管扩张",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支气管哮喘",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺脓肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "上呼吸道感染",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3047,
         "questionId": "yzsdawcuc7pamtfxpv7jqa",
         "Title": "<p>某肺结核患者，突然出现喷射性大咯血，继而突然中断，表情恐怖，大汗淋漓，此时首要的护理措施是（ ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"立即取半卧位\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"加压给氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"立即气管插管\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"人工呼吸\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"保持呼吸道能畅，清除血块\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 36,
         "answerList": [
            {
               "Content": "人工呼吸",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "保持呼吸道能畅，清除血块",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "加压给氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即取半卧位",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "立即气管插管",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 3034,
         "questionId": "yzsdawcu5adfqurpothf0w",
         "Title": "<p>甘先生，60岁，因“呼吸困难一天”门诊收入院，入院后急查动脉血气分析，结果显示PaO2&lt;60mmHg,PaCO2&gt;50mmHg，该病人考虑为（  ）</p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"呼吸性碱中毒\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"代谢性碱中毒\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"Ⅰ型呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"Ⅱ型呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"代谢性酸中毒\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 23,
         "answerList": [
            {
               "Content": "Ⅱ型呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "代谢性酸中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "代谢性碱中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "呼吸性碱中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "Ⅰ型呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1691,
         "questionId": "km0bavrqpvateiqip4gea",
         "Title": "下列细菌感染常见铁锈色痰的是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺炎链球菌\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"肺炎克雷伯杆菌\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"铜绿假单胞菌\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"支原体\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"厌氧菌\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 147,
         "answerList": [
            {
               "Content": "肺炎链球菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺炎克雷伯杆菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "铜绿假单胞菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "厌氧菌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "支原体",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 10,
         "questionId": "z9n5aaqre7nlcil8lvwsw",
         "Title": "<p style=\"text-indent:32px;line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">张先生</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">，</span>75<span style=\"font-family:宋体\">岁</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">有慢性支气管炎病史</span>20<span style=\"font-family:宋体\">年。</span></span><span style=\";font-family:宋体;font-size:16px\">1</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">周前受凉后再次出现咳嗽、咳白色</span></span><span style=\";font-family:宋体;font-size:16px\">黏</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">痰，伴有呼吸困难、胸闷、乏力。以慢性支气管炎合并慢性阻塞性肺气肿入院治疗</span></span></p><p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">氧疗时护理措施正确的是</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"间断吸氧&nbsp;\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"持续低流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"高流量吸氧\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"高浓度吸氧\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"酒精湿化吸氧\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 54,
         "answerList": [
            {
               "Content": "持续低流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高流量吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "酒精湿化吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "高浓度吸氧",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "间断吸氧&nbsp;",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 15,
         "questionId": "z9n5aaqrsrrn8z1c8la5oa",
         "Title": "<p style=\"text-indent:32px;line-height:150%\"><span style=\";font-family:宋体;font-size:16px\">关先生</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">，</span>60<span style=\"font-family:宋体\">岁</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">有慢性支气管炎、阻塞性肺气肿病史</span>10<span style=\"font-family:宋体\">余年，近</span><span style=\"font-family:Times New Roman\">3</span><span style=\"font-family:宋体\">年来反复双下肢</span></span><span style=\";font-family:宋体;font-size:16px\">水</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">肿，此次病情加重，口唇发绀，神志恍惚，双下肺闻</span></span><span style=\";font-family:宋体;font-size:16px\">及</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">干</span></span><span style=\";font-family:宋体;font-size:16px\">性</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">湿</span></span><span style=\";font-family:宋体;font-size:16px\">啰</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">音，</span>120<span style=\"font-family:宋体\">次</span><span style=\"font-family:Times New Roman\">/</span><span style=\"font-family:宋体\">分，有早搏</span></span><span style=\";font-family:宋体;font-size:16px\">。</span></p><p><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">下列与二氧化碳潴留</span></span><strong><span style=\"text-decoration:underline;\"><span style=\"font-family: &#39;Times New Roman&#39;;font-size: 16px\"><span style=\"font-family:宋体\">无关</span></span></span></strong><span style=\";font-family:宋体;font-size:16px\">的是</span></p><p style=\"text-indent:32px;line-height:150%\"><span style=\";font-family:宋体;font-size:16px\"></span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">&nbsp;</span><br/></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"搏动性头痛&nbsp;\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"白天嗜睡\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"贫血貌\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"心率加快\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"球结膜水肿\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 59,
         "answerList": [
            {
               "Content": "心率加快",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "搏动性头痛&nbsp;",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "贫血貌",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "球结膜水肿",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "白天嗜睡",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1670,
         "questionId": "km0bavrrzzjipiyfyx3xw",
         "Title": "排除痰液的护理措施，下列哪项不妥",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"限制水分摄入，以免痰液生成\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"痰黏稠可使用祛痰剂\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"对症使用有效的中成药\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"施行蒸气吸入或药物超声雾化吸入\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"对痰多而无力咳出者助以翻身拍背或导管插入吸痰\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 126,
         "answerList": [
            {
               "Content": "限制水分摄入，以免痰液生成",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "施行蒸气吸入或药物超声雾化吸入",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "对痰多而无力咳出者助以翻身拍背或导管插入吸痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "痰黏稠可使用祛痰剂",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "对症使用有效的中成药",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1759,
         "questionId": "km0bavrg7hbad7ug44aeg",
         "Title": "胡先生，30岁。患支气管扩张已10余年。1周来因受凉咳嗽、咳痰 加重，痰呈脓性，每日约500ml，体温37.8℃。  清除此病人痰液最有效的措施为",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"指导有效咳嗽\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"体位引流\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"湿化呼吸道\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"帮助翻身、拍背\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"鼻导管吸痰\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 175,
         "answerList": [
            {
               "Content": "帮助翻身、拍背",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "指导有效咳嗽",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "湿化呼吸道",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "鼻导管吸痰",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "体位引流",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1772,
         "questionId": "lc0bavrzobd1g5nigqxlw",
         "Title": "纠正缺02和C02潴留最重要的措施是",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"氧气疗法\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"保持气道的通畅\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"增加通气量\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"纠正酸碱平衡失调\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"提高呼吸系统兴奋性\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 188,
         "answerList": [
            {
               "Content": "纠正酸碱平衡失调",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "氧气疗法",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "增加通气量",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "提高呼吸系统兴奋性",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "保持气道的通畅",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 1496,
         "questionId": "fr8bavror9cofqfczzvzg",
         "Title": "男性，62岁。咳嗽30年，近日咳大量脓痰，憋气，下肢水肿。下肢水肿应考虑何故",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"肺心病右心衰竭\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"低蛋白血症\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"摄盐过多\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"下肢静脉血栓\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"合并肾炎\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 84,
         "answerList": [
            {
               "Content": "肺心病右心衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "低蛋白血症",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "下肢静脉血栓",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "合并肾炎",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "摄盐过多",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 18,
         "questionId": "z9n5aaqrbaniiyejckc6ea",
         "Title": "<p style=\"line-height:150%\"><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">慢性呼吸性衰竭急性发作病人，经综合治疗，病情好转，停氧疗。停止吸氧的最主要指标</span></span><span style=\";font-family:宋体;font-size:16px\">是</span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">神志</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">发绀</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">停止吸氧</span>30<span style=\\\"font-family:宋体\\\">分钟后</span><span style=\\\"font-family:Times New Roman\\\">Pa</span></span><span style=\\\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\\\">O</span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\\\">2</span></sub><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">和</span>Pa</span><span style=\\\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\\\">&nbsp;CO</span><sub><span style=\\\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\\\">2</span></sub></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">呼吸频率</span></span></p><p><br></p>\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"<p><span style=\\\";font-family:'Times New Roman';font-size:16px\\\"><span style=\\\"font-family:宋体\\\">气急程度</span></span></p><p><br></p>\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 62,
         "answerList": [
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">呼吸频率</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">神志</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">停止吸氧</span>30<span style=\"font-family:宋体\">分钟后</span><span style=\"font-family:Times New Roman\">Pa</span></span><span style=\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\">O</span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\">2</span></sub><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">和</span>Pa</span><span style=\";font-family:'Times New Roman';font-size:16px;background:#FFFFFF\">&nbsp;CO</span><sub><span style=\";font-family:'Times New Roman';font-size:16px;vertical-align:sub;background:#FFFFFF\">2</span></sub></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">气急程度</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "<p><span style=\";font-family:'Times New Roman';font-size:16px\"><span style=\"font-family:宋体\">发绀</span></span></p><p><br></p>",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      },
      {
         "orderBy": 2,
         "questionId": "z9n5aaqrv6ljlfj2djltxw",
         "Title": "<p><span style=\";font-family:宋体;font-size:16px\">徐先生，</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">53<span style=\"font-family:宋体\">岁。慢性咳嗽、咳痰病史</span><span style=\"font-family:Times New Roman\">20</span><span style=\"font-family:宋体\">余年，近</span><span style=\"font-family:Times New Roman\">3</span><span style=\"font-family:宋体\">日来咳嗽咳痰加重</span></span><span style=\";font-family:宋体;font-size:16px\">。</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\"><span style=\"font-family:宋体\">伴呼吸困难、发绀、发热、表情淡漠、嗜睡、血气分析</span></span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">Pa</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px;background:#FFFFFF\">O</span><sub><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px;vertical-align:sub;background:#FFFFFF\">2</span></sub><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">&nbsp;45mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">g<span style=\"font-family:宋体\">，</span><span style=\"font-family:Times New Roman\">PaC</span></span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px;background:#FFFFFF\">O</span><sub><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px;vertical-align:sub;background:#FFFFFF\">2</span></sub><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">70mm</span><span style=\";font-family:宋体;font-size:16px\">H</span><span style=\";font-family:&#39;Times New Roman&#39;;font-size:16px\">g<span style=\"font-family:宋体\">，最确切的诊断</span></span></p><p><br/></p>",
         "dataJson": "[{\"SortOrder\":0,\"Content\":\"心力衰竭\",\"IsAnswer\":null},{\"SortOrder\":1,\"Content\":\"呼吸衰竭\",\"IsAnswer\":null},{\"SortOrder\":2,\"Content\":\"肺性脑病\",\"IsAnswer\":null},{\"SortOrder\":3,\"Content\":\"代谢性酸中毒\",\"IsAnswer\":null},{\"SortOrder\":4,\"Content\":\"DIC\",\"IsAnswer\":null}]",
         "Answer": "",
         "questionType": 1,
         "resultAnalysis": "",
         "totalScore": 0.50,
         "sortOrder": 47,
         "answerList": [
            {
               "Content": "呼吸衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 1,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "肺性脑病",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 2,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "DIC",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 4,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "代谢性酸中毒",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 3,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            },
            {
               "Content": "心力衰竭",
               "IsAnswer": null,
               "OptionContent": null,
               "OptionSelectContent": null,
               "OptionAnswerContent": null,
               "SortOrder": 0,
               "CaseSensitive": null,
               "AlternativeAnswer": null
            }
         ],
         "questionDoclist": null,
         "queTypeName": "单选题"
      }
   ],
   "match_Answer": {},
   "match_AnswerContent": {},
   "subQuestions": {}
};
			//if(true)return redisData;
			redisData.questions.forEach(function($$que, $$i, $$ques)
			{
				/**if($uniqueReference && (typeof($$que.questionId) === "string"))
				{
					// 去重结果
					if(!Array.isArray($uniqueReference.k))
					{
						$uniqueReference.k = [];
					}
					// 原有题数
					if(!Array.isArray($uniqueReference.origin))
					{
						$uniqueReference.origin = [];
					}
					// 已去题数
					if(!Array.isArray($uniqueReference.culled))
					{
						$uniqueReference.culled = [];
					}
					// 去重结果
					if(typeof($uniqueReference.kv) !== "object")
					{
						$uniqueReference.kv = {};
					}
					$uniqueReference.origin.push($$que.questionId);
					if($uniqueReference.kv[$$que.questionId])
					{
						// use console.info
						console.info("JSON试题解析重复过滤", "当前", $$que, "已有", $uniqueReference.kv[$$que.questionId], $uniqueReference);
						$uniqueReference.culled.push($$que.questionId);
						return;
					}
					else
					{
						$uniqueReference.k.push($$que.questionId);
						$uniqueReference.kv[$$que.questionId] = $$que;
					}
				}
				else if($uniqueReference)
				{
					console.warn("JSON试题解析重复过滤", "受阻", typeof($$que.questionId), $$que.questionId, $$que);
				}*/
				let dataJson = parser.json.forceToObj($$que.dataJson, []);
				if($$que.queTypeName === "单选题")
				{
					all["questions"].push(
					{
						type: $$que.queTypeName,
						title: $$que.Title,
						options: (function()
						{
							let opts = [];
							dataJson.forEach(function($$$opt, $$$i, $$$opts)
							{
								opts[$$$opt.SortOrder] = (
								// opts.push(
								{
									name: parser.const.optionNames[$$$opt.SortOrder/**$$$i*/],
									title: $$$opt.Content && $$$opt.Content.trim(),
									right: $useStudentAnswer ? (String($$$opt.SortOrder) === String($$que.studentAnswer)) : $$$opt.IsAnswer
								});
							});
							return opts;
						})(),
						answer: $useStudentAnswer ? ($$que.studentAnswer ? parser.const.optionIndex[$$que.studentAnswer] : undefined) : ($$que.answer ? parser.const.optionIndex[$$que.answer] : undefined),
						coeffic: undefined,
						analysis: ($$que.resultAnalysis && ($$que.resultAnalysis.trim() !== "") && ($$que.resultAnalysis.trim() !== "无")) ? $$que.resultAnalysis.trim() : undefined
					});
				}
				// 多选题
				// 判断题
				// 问答题
				// 填空题(客观)
				else
				{
					console.warn("JSON解析", "未知题型", $$que.queTypeName);
				}
			});
		/**}
		else
		{
			console.warn("JSON解析", "未处理子数据", $json.data);
		}
	}
	else
	{
		console.warn("JSON解析", "未处理数据", $json);
	}
	(location.protocol === "file:") && console.log("›icveappzjy2-json", all);*/
	return all;
});
// 云课堂智慧职教APP-MOOC学院JSON试题解析
parser.json.icveappmooc = (function($title, $json)
{
	let all = {};
	all["name"] = $title && decodeURIComponent($title);
	all["questions"] = [];
	$json = parser.json.forceToObj($json, {});
	return all;
});
// 人卫图书增值XML试题解析
parser.xml.pmph = (function(_title, _xml)
{
	function handleAnswer($answer)
	{
		if(!$answer || !$answer.trim)
		{
			return undefined;
		}
		// 有时人卫抽风，答案里包含了非大写字母的其他字符😑
		if((/[^A-Z]/).test($answer))
		{
			let originAnswer = $answer;
			$answer = $answer.replace(/[^A-Z]/g, "");
			console.warn.apply(console, ["XML答案处理存在非答案字符", originAnswer + " => " + $answer].concat(Array.prototype.slice.apply(arguments).slice(1)));
		}
		return ($answer.trim() !== "") ? $answer : undefined;
	}
	var parseQue = (function(_que, _typedesc)
	{
		var func = {
			"单选题": (function()
			{
				let answer = handleAnswer(_que.answers, _typedesc, _title, _que);
				return (
				{
					type: "单选题",
					title: _que.desc.trim().replace(parser.re.quesnum, "").trim(),
					options: (function()
					{
						var opts = [];
						_que.options && _que.options.option && Array.from(_que.options.option).forEach(function(_opt, _index, _opts)
						{
							opts.push(
							{
								name: _opt.id,
								title: _opt.desc.trim(),
								right: (_opt.id === answer)
							});
						});
						(_que.options && _que.options.option) || console.warn("XML存在处理失败题型", _que, _que.type, _typedesc);
						return opts;
					})(),
					answer: answer,
					analysis: _que.keypoints ? _que.keypoints.trim().replace(/(^解析：)/, "").trim() : undefined
				});
			}),
			"共用题干单选题": (function()
			{
				return (
				{
					type: "共用题干单选题",
					title: _que.desc.trim().replace(parser.re.quesnum, "").trim(),
					children: (function()
					{
						var arrs = [];
						_que.children && _que.children.question && Array.from(_que.children.question).forEach(function(__que, _index, _ques)
						{
							let answer = handleAnswer(__que.answers, _typedesc, _title, _que, __que);
							arrs.push(
							{
								title: __que.desc.trim().replace(/(（[0-9]{1,}）)|(\([0-9]{1,}\))/, "").trim(),
								options: (function()
								{
									var opts = [];
									Array.from(__que.options.option).forEach(function(_opt, __index, _opts)
									{
										opts.push(
										{
											name: _opt.id,
											title: _opt.desc.trim(),
											right: (_opt.id === answer)
										});
									});
									return opts;
								})(),
								answer: answer,
								analysis: __que.keypoints ? __que.keypoints.trim().replace(/(^解析：)/, "").trim() : undefined
							});
						});
						(_que.children && _que.children.question) || console.warn("XML存在处理失败题型", _que, _que.type, _typedesc);
						return arrs;
					})()
				});
			}),
			"共用答案单选题": (function()
			{
				return (
				{
					type: "共用答案单选题",
					options: (function()
					{
						var opts = [], allopts = _que.desc.trim().replace(parser.re.quesnum, "").trim().split(/\r\n|\r|\n/).slice(1);
						Array.from(allopts).forEach(function(_opt, _index, _opts)
						{
							opts.push(
							{
								name: parser.const.optionNames[_index],
								title: _opt.trim().replace(parser.re.optsnum, "").trim()
							});
						});
						return opts;
					})(),
					children: (function()
					{
						var arrs = [];
						_que.children && _que.children.question && Array.from(_que.children.question).forEach(function(__que, _index, _ques)
						{
							let answer = handleAnswer(__que.answers, _typedesc, _title, _que, __que);
							arrs.push(
							{
								title: __que.desc.trim().replace(/(（[0-9]{1,}）|(\([0-9]{1,}\)))/, "").trim(),
								answer: answer,
								analysis: __que.keypoints ? __que.keypoints.trim().replace(/(^解析：)/, "").trim() : undefined
							});
						});
						(_que.children && _que.children.question) || console.warn("XML存在处理失败题型", _que, _que.type, _typedesc);
						return arrs;
					})()
				});
			})
		};
		switch(_que.type)
		{
			case("1"):
			case("2"):
			{
				let upperType = _typedesc.trim().toUpperCase();
				return (upperType.startsWith("A3") || upperType.startsWith("A4")) ? func["共用题干单选题"]() : func["单选题"]();
			}
			case("3"):
			{
				return func["共用题干单选题"]();
			}
			case("4"):
			{
				return func["共用答案单选题"]();
			}
			default:
			{
				console.warn("XML存在未处理题型", _que, _que.type, _typedesc);
				break;
			}
		}
		return {};
	}), pushQues = (function(_arrs, _ques, _typedesc)
	{
		// 2小题及以上
		if(Array.isArray(_ques))
		{
			return Array.from(_ques).forEach(function(_que, _index, __ques)
			{
				_arrs.push(parseQue(_que, _typedesc));
			});
		}
		else
		{
			// 只有1小题
			return _arrs.push(parseQue(_ques, _typedesc));
		}
	});
	var all = {};
	all["name"] = decodeURIComponent(_title);
	all["questions"] = [];
	var xmldoc = null;
	if(typeof(_xml) == "string")
	{
		var xmler = new DOMParser();
		xmldoc = xmler.parseFromString(_xml.trim(), "text/xml");
	}
	else
	{
		xmldoc = _xml;
	}
	var data = parser.api.xmlToJsonNoAttrs(xmldoc);
	// 2大题及以上
	if(Array.isArray(data.exam.questions))
	{
		Array.from(data.exam.questions).forEach(function(_val, _index, _vals)
		{
			pushQues(all["questions"], _val.question, _val.instructions);
		});
	}
	else
	{
		// 只有1大题
		pushQues(all["questions"], data.exam.questions.question, data.exam.questions.instructions);
	}
	(location.protocol == "file:") && console.log("›pmph-xml", all);
	return all;
});
parser.api.doOrSubmit = (function(_el, _ischoice, _isdo, _startstr, _endstr)
{
	if(!(_el || _el.value))
	{
		return alert("糟糕，数据丢失了，请刷新页面再重试");
	}
	var formatSeconds = (function(_second)
	{
		var s = parseInt(_second);
		var ms = ((_second - s) * 1000).toFixed(0);
		var m = 0;
		var h = 0;
		if(s > 60)
		{
			m = parseInt(s / 60);
			s = parseInt(s % 60);
			if(m > 60)
			{
				h = parseInt(m / 60);
				m = parseInt(m % 60);
			}
		}
		var result = parseInt(ms) + "ms";
		if(s > 0)
		{
			result = parseInt(s) + /** "″" */"s" + result;
		}
		if(m > 0)
		{
			result = parseInt(m) + /** "′" */"m" + result;
		}
		if(h > 0)
		{
			result = parseInt(h) + "h" + result;
		}
		return result;
	});
	var data = (new Function("return " + _el.value + ";")).apply(null);
	if(!data.length)
	{
		return alert("本章节没有可供作答的" + (_ischoice ? "选择" : "文字") + "题");
	}
	if(_ischoice)
	{
		if(_isdo)
		{
			_el.innerText = _endstr, _el.right = {}, _el.error = {}, _el.notdo = {}, _el.starttime = Date.now();
			$(data).each(function(_index, _val)
			{
				$('[name="' + _val.name + '"]').each(function(_index2, _val2)
				{
					$(_val2).removeAttr("disabled checked").prop("disabled", false).prop("checked", false)
					.parent().css({"color": ""}).addClass("option").removeClass("option-right option-error option-notdo");
				});
			});
			parser.api.cnzzPush(["_trackEvent", "题库", _startstr, (new Date(_el.starttime)).toString(), 0, "queslib"]);
			window.vueElPopoverTips && vueElPopoverTips.hide && vueElPopoverTips.hide(_el.closest("[name='chapter']"));
		}
		else
		{
			_el.innerText = _startstr, _el.endedtime = Date.now();
			$(data).each(function(_index, _val)
			{
				$('[name="' + _val.name + '"]').each(function(_index2, _val2)
				{
					$(_val2).attr("disabled", "disabled").prop("disabled", true);
					// 此题还没选出正确答案
					if($('[name="' + _val2.name + '"]:checked').length == 0)
					{
						_el.notdo[_val2.name] = null;
						$('[name="' + _val2.name + '"][value="true"]').each(function(_index3, _val3)
						{
							$(_val3).parent().css({"color": "#fca104"}).addClass("option-notdo");
						});
					}
					else
					{
						if(_val.type.endsWith("多选题"))
						{
							if(_val2.checked)
							{
								if(_val2.value == "false")
								{
									_el.error[_val2.name] = false;
									$(_val2).parent().css({"color": "#d9534f"}).removeClass("option").addClass("option-error");
								}
								else
								{
									_el.right[_val2.name] = true;
								}
							}
							else
							{
								if(_val2.value == "true")
								{
									_el.error[_val2.name] = false;
									$(_val2).parent().css({"color": "#fca104"}).addClass("option-notdo");
								}
							}
							// 最后判断，只要错一题均不计分
							if(_index2 == ($('[name="' + _val2.name + '"]').size() - 1))
							{
								if((_el.error[_val2.name] != null) && (_el.right[_val2.name] != null))
								{
									Reflect.deleteProperty(_el.right, _val2.name);
								}
							}
						}
						else
						{
							if(_val2.checked)
							{
								if((_val2.checked ? "true" : "false") == _val2.value)
								{
									_el.right[_val2.name] = true;
								}
								else
								{
									_el.error[_val2.name] = false;
									// 选择错误
									$(_val2).parent().css({"color": "#d9534f"}).removeClass("option").addClass("option-error");
									// 高亮正确选项
									$('[name="' + _val2.name + '"][value="true"]').each(function(_index3, _val3)
									{
										$(_val3).parent().css({"color": "#5cb85c"}).addClass("option-right");
									});
								}
							}
						}
					}
				});
			});
			let rightNum = Object.keys(_el.right).length,
			errorNum = Object.keys(_el.error).length,
			notdoNum = Object.keys(_el.notdo).length,
			scoreRate  = ((rightNum / data.length) * 100).toFixed(2);
			let msg = ("作答时间：" + parser.api.parseTimeToDateStr(_el.starttime) + "\n提交时间：" + parser.api.parseTimeToDateStr(_el.endedtime) + "\n\n〔单选题〕\n\n\t题数：" + data.length
			+ "\n\n\t做对：" + ((rightNum == 0) ? /** "一题没对哦" */0 : rightNum)
			+ "\n\n\t做错：" + ((errorNum == 0) ? /** "全都做对啦" */0 : errorNum)
			+ ((notdoNum == 0) ? "" : ("\n\n\t未做：" + notdoNum))
			+ "\n\n得分率：" + scoreRate + "%"
			+ "\n\n失分率：" + (100 - scoreRate).toFixed(2) + "%"
			+ "\n\n错题率：" + ((errorNum / data.length) * 100).toFixed(2) + "%"
			+ ((notdoNum == 0) ? "" : ("\n\n未做率：" + ((notdoNum / data.length) * 100).toFixed(2) + "%"))
			+ "\n\n答题用时：" + formatSeconds((_el.endedtime - _el.starttime) / 1000));
			console.log(msg);
			let btns = [];
			rightNum && btns.push(
				{
					caption: "对题", custom_class: "dialog-bg-right", callback: function()
					{
						new $.Zebra_Dialog("功能开发中……", {
							auto_close: 500,
							buttons: false,
							modal: false
						});
					}
			});
			errorNum && btns.push(
				{
					caption: "错题", custom_class: "dialog-bg-error", callback: function()
					{
						new $.Zebra_Dialog("功能开发中……", {
							auto_close: 500,
							buttons: false,
							modal: false
						});
					}
			});
			notdoNum && btns.push(
				{
					caption: "未做", custom_class: "dialog-bg-notdo", callback: function()
					{
						new $.Zebra_Dialog("功能开发中……", {
							auto_close: 500,
							buttons: false,
							modal: false
						});
					}
			});
			new $.Zebra_Dialog(msg.replace(/\n/g, "<br />"), {
				type: "information",
				title: "作答情况",
				buttons: btns,
				center_buttons: true
			});
			parser.api.cnzzPush(["_trackEvent", "题库", _endstr, (new Date(_el.endedtime)).toString(), 0, "queslib"]);
			window.vueElPopoverTips && vueElPopoverTips.show && vueElPopoverTips.show(_el.closest("[name='chapter']"));
		}
	}
	else
	{
		if(_isdo)
		{
			_el.innerText = _endstr, _el.right = {}, _el.error = {}, _el.notdo = {}, _el.textScore = [], _el.starttime = Date.now();
			$(data).each(function(_index, _val)
			{
				$('[name="' + _val.name + '"]').each(function(_index2, _val2)
				{
					$(_val2).removeAttr("readonly").prop("readonly", false).css({"color": "#ffffff"}).val("");
					if(_val.type == "填空题")
					{
						$(_val2)[0].nextElementSibling.style.display = "none";
					}
					else
					{
						$(_val2)[0].nextElementSibling.style.display = "none";
						$(_val2)[0].nextElementSibling.nextElementSibling.style.display = "none";
					}
				});
			});
			parser.api.cnzzPush(["_trackEvent", "题库", _startstr, (new Date(_el.starttime)).toString(), 0, "queslib"]);
		}
		else
		{
			_el.innerText = _startstr, _el.endedtime = Date.now();
			$(data).each(function(_index, _val)
			{
				$('[name="' + _val.name + '"]').each(function(_index2, _val2)
				{
					$(_val2).attr("readonly", "readonly").prop("readonly", true);
					var titleno = 0;
					$(_val2).parent()[0].previousElementSibling.innerText.trim().replace(/^([0-9]{1,})\./, function(_match, _titleno){titleno = _titleno;});
					if(_val.type == "填空题")
					{
						if($(_val2).val() != "")
						{
							if($(_val2).val() == $(_val2)[0].nextElementSibling.value)
							{
								_el.right[_val2.name] = true;
							}
							else
							{
								_el.error[_val2.name] = false;
								$(_val2).css({"color": "#d9534f"});
								$(_val2)[0].nextElementSibling.style.display = "inline";
							}
						}
						else
						{
							_el.notdo[_val2.name] = null;
							$(_val2).val($(_val2)[0].nextElementSibling.value);
							$(_val2).css({"color": "yellow"});
						}
					}
					else
					{
						if($(_val2).val() != "")
						{
							_el.right[_val2.name] = true;
							let delStr = /([\s⓪①②③④⑤⑥⑦⑧⑨⑩，。？！：；…～“”、（）‘’一二三四五六七八九十]+)|(（[零〇一二三四五六七八九十]+）)|(（[0-9]+）)/gm;
							let rate = (parser.api.similar($(_val2).val().replace(delStr, ""), $(_val2)[0].defaultValue.replace(delStr, ""), 2) * 100) + "%";
							_el.textScore.push(titleno + ".〔" + _val.type + "〕答案匹配度	" + rate);
							$(_val2)[0].nextElementSibling.nextElementSibling.style.display = "inline";
							$(_val2)[0].nextElementSibling.nextElementSibling.value = $(_val2)[0].defaultValue;
							
							$(_val2)[0].nextElementSibling.style.display = "inline";
							$(_val2)[0].nextElementSibling.value = _el.textScore[_el.textScore.length - 1];
						}
						else
						{
							_el.notdo[_val2.name] = null;
							$(_val2)[0].value = $(_val2)[0].defaultValue;
							$(_val2).css({"color": "yellow"});
						}
					}
				});
			});
			let rightNum = Object.keys(_el.right).length,
			errorNum = Object.keys(_el.error).length,
			notdoNum = Object.keys(_el.notdo).length,
			scoreRate  = ((rightNum / data.length) * 100).toFixed(2);
			let msg = ("作答时间：" + parser.api.parseTimeToDateStr(_el.starttime) + "\n提交时间：" + parser.api.parseTimeToDateStr(_el.endedtime) + "\n\n题数：" + data.length
			+ "\n\n\t〔填空题〕\n\n\t做对：" + ((rightNum == 0) ? /** "一题没对哦" */0 : rightNum)
			+ "\n\n\t做错：" + ((errorNum == 0) ? /** "全都做对啦" */0 : errorNum)
			+ ((notdoNum == 0) ? "" : ("\n\n\t未做：" + notdoNum))
			+ "\n\n得分率：" + scoreRate + "%"
			+ "\n\n失分率：" + (100 - scoreRate).toFixed(2) + "%"
			+ "\n\n错题率：" + ((errorNum / data.length) * 100).toFixed(2) + "%"
			+ ((notdoNum == 0) ? "" : ("\n\n未做率：" + ((notdoNum / data.length) * 100).toFixed(2) + "%"))
			
			+ "\n\n文字作答题得分率参考：\n\n" + _el.textScore.join("\n")
			
			+ "\n\n\n答题用时：" + formatSeconds((_el.endedtime - _el.starttime) / 1000));
			console.log(msg);
			alert(msg);
			parser.api.cnzzPush(["_trackEvent", "题库", _endstr, (new Date(_el.endedtime)).toString(), 0, "queslib"]);
		}
	}
	return;
});
parser.api.tohtml = (function(_data, _cacheObj)
{
	// (location.protocol === "file:") && parser.api.dump(_data);
	(location.protocol === "file:") && console.log("››tohtml", _data);
	if(_cacheObj)
	{
		_cacheObj.cachedata = _data;
	}
	let allhtml = "",
	// 此章节每道题中选项的 name 值，目前只包括单/多选题型
	choice_quesnames = [], answer_quesnames = [], parse = (function(__data, _isOpen)
	{
		choice_quesnames[choice_quesnames.length] = [];
		answer_quesnames[answer_quesnames.length] = [];
		let htmls = [], html = "";
		html = `${"\t".repeat(4)}<article name="chapter">`;
		html += `\n${"\t".repeat(5)}<details ontoggle="javascript: parser.onToggleDetails(this);"${_isOpen ? " open" : ""}>`;
		html += `\n${"\t".repeat(6)}<summary name="name" oncopy="javascript: return true;">${__data.name}{{chapter_total_quesnum}}</summary>`;
		html += `\n${"\t".repeat(6)}<aside name="doques">`;
		html += `\n${"\t".repeat(7)}<center>`;
		html += `\n${"\t".repeat(8)}<table>`;
		html += `\n${"\t".repeat(9)}<thead>`;
		html += `\n${"\t".repeat(10)}<tr>`;
		html += `\n${"\t".repeat(11)}<th colspan="5"><b name="txt-title-collapse" title="收起章节" onclick="javascript: confirm(this.title + '？') && this.closest('article').querySelector('details summary').click();">${__data.name}</b></th>`;
		html += `\n${"\t".repeat(10)}</tr>`;
		html += `\n${"\t".repeat(9)}</thead>`;
		html += `\n${"\t".repeat(9)}<tfoot>`;
		html += `\n${"\t".repeat(10)}<tr>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-choices" type="button" value="{{chapter_choice_data}}" onclick="javascript: $.LoadingOverlay && $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, true, (this.isdo = (!this.isdo)), '选择题练习', '提交选择题'); this.disabled = false; $.LoadingOverlay && $.LoadingOverlay('hide');" oncopy="javascript: return false;">选择题练习</button></th>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-backfirst" title="返回首题" type="button" onclick="javascript: this.closest('article').scrollIntoView(true);" oncopy="javascript: return false;">⇧</button></th>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-backlast" title="返回尾题" type="button" onclick="javascript: this.closest('article').scrollIntoView(false);" oncopy="javascript: return false;">⇩</button></th>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-answers" type="button" value="{{chapter_answer_data}}" onclick="javascript: $.LoadingOverlay && $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, false, (this.isdo = (!this.isdo)), '文字题作答', '提交文字题'); this.disabled = false; $.LoadingOverlay && $.LoadingOverlay('hide');" oncopy="javascript: return false;">文字题作答</button></th>`;
		html += `\n${"\t".repeat(10)}</tr>`;
		html += `\n${"\t".repeat(9)}</tfoot>`;
		html += `\n${"\t".repeat(8)}</table>`;
		html += `\n${"\t".repeat(7)}</center>`;
		html += `\n${"\t".repeat(6)}</aside>`;
		html += `\n${"\t".repeat(6)}<aside name="questions">`;
		htmls.push(html);
		let getTipsForAnalysisHtml = function($analysis)
		{
			let width = 200;
			try
			{
				width = parseInt(Math.max(400, screen.width, screen.availWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.body.clientWidth, document.body.scrollWidth) * ( 1 / 2 ));
			}
			catch(e)
			{
				console.warn(e);
			}
			return ((typeof($analysis) === "string") && ($analysis.trim() !== "")) ? `<div name="vue-tips-el-popover" style="display: inline;" data-analysis="${$analysis}">&nbsp;<el-popover placement="top" trigger="click" width="${width}" title="参考解析" content="暂无解析。"><i slot="reference" class="el-icon-question" style="color: #2c68ff;"></i><template slot-scope="scope"><div slot="content">{{ analysis }}</div></template></el-popover></div>` : "";
		};
		for(let i = 0; i < __data.questions.length; i++)
		{
			let child = __data.questions[i], uuid = parser.api.uuid();
			// 单选题
			if(parser.type.choices.alone.includes(child.type))
			{
				html = `${"\t".repeat(7)}<section name="question">`;
				html += `\n${"\t".repeat(8)}<dl name="child">`;
				html += `\n${"\t".repeat(9)}<dt name="desc"><span>{{quesnum}}.<small>〔${child.type}〕</small><big>${child.title}</big></span><span><big>${getTipsForAnalysisHtml(child.analysis)}</big></span></dt>`;
				for(let k = 0; k < child.options.length; k++)
				{
					html += `\n${"\t".repeat(9)}<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="${child.type.includes('多') ? 'checkbox' : 'radio'}" name="${uuid}" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="${child.options[k].right ? 'true' : 'false'}"${child.options[k].right ? " checked" : ""} disabled />${child.options[k].name}.${child.options[k].title}</span></dd>`;
				}
				html += `\n${"\t".repeat(8)}</dl>`;
				html += `\n${"\t".repeat(7)}</section>`;
				htmls.push(html);
				choice_quesnames[choice_quesnames.length - 1].push({name: uuid, type: child.type});
			}
			// 共用题干单选题
			if(parser.type.choices.share.title.includes(child.type))
			{
				html = `${"\t".repeat(7)}<section name="question">`;
				html += `\n${"\t".repeat(8)}<dl name="title">`;
				html += `\n${"\t".repeat(9)}<dt name="desc"><span>{{quesnum}}.<small>〔${child.type}〕</small><big>${child.title}</big></span></dt>`;
				html += `\n${"\t".repeat(8)}</dl>`;
				for(let k = 0; k < child.children.length; k++)
				{
					html += `\n${"\t".repeat(8)}<dl name="child">`;
					html += `\n${"\t".repeat(9)}<dt name="desc"><span><small>（${parser.const.quesnumCNs[k]}）</small><big>${child.children[k].title}</big></span><span><big>${getTipsForAnalysisHtml(child.children[k].analysis)}</big></span></dt>`;
					for(let j = 0; j < child.children[k].options.length; j++)
					{
						html += `\n${"\t".repeat(9)}<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="${uuid}" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="${child.children[k].options[j].right ? 'true' : 'false'}"${child.children[k].options[j].right ? " checked" : ""} disabled />${child.children[k].options[j].name}.${child.children[k].options[j].title}</span></dd>`;
					}
					html += `\n${"\t".repeat(8)}</dl>`;
					choice_quesnames[choice_quesnames.length - 1].push({name: uuid, type: child.type});
					uuid = parser.api.uuid();
				}
				html += `\n${"\t".repeat(7)}</section>`;
				htmls.push(html);
			}
			// 共用答案单选题
			if(parser.type.choices.share.answer.includes(child.type))
			{
				html = `${"\t".repeat(7)}<section name="question">`;
				html += `\n${"\t".repeat(8)}<dl name="title">`;
				html += `\n${"\t".repeat(9)}<dt name="desc"><span>{{quesnum}}.<small>〔${child.type}〕</small><big><small>（${parser.const.quesnumCNs[0]}）～（${parser.const.quesnumCNs[child.children.length - 1]}）共用答案</small></big></span></dt>`;
				for(let k = 0; k < child.options.length; k++)
				{
					html += `\n${"\t".repeat(9)}<dd name="option">${child.options[k].name}.${child.options[k].title}</dd>`;
				}
				html += `\n${"\t".repeat(8)}</dl>`;
				for(let k = 0; k < child.children.length; k++)
				{
					html += `\n${"\t".repeat(8)}<dl name="child">`;
					html += `\n${"\t".repeat(9)}<dt name="desc"><span><small>（${parser.const.quesnumCNs[k]}）</small><big>${child.children[k].title}</big></span><span><big>${getTipsForAnalysisHtml(child.children[k].analysis)}</big></span></dt>`;
					html += `\n${"\t".repeat(9)}<ul>`;
					for(let j = 0; j < child.options.length; j++)
					{
						html += `\n${"\t".repeat(10)}<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="${uuid}" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="${(child.options[j].name === child.children[k].answer) ? 'true' : 'false'}"${(child.options[j].name === child.children[k].answer) ? " checked" : ""} disabled />${child.options[j].name}</span></li>`;
					}
					html += `\n${"\t".repeat(9)}</ul>`;
					html += `\n${"\t".repeat(8)}</dl>`;
					choice_quesnames[choice_quesnames.length - 1].push({name: uuid, type: child.type});
					uuid = parser.api.uuid();
				}
				html += `\n${"\t".repeat(7)}</section>`;
				htmls.push(html);
			}
			// 文字填空题
			if(parser.type.answers.fill.includes(child.type))
			{
				if(Array.isArray(child.answers) || (child.answers === null) || (child.answers === undefined))
				{
					html = `<p><span>{{quesnum}}.<small>〔${child.type}〕</small><big>${child.title}</big></span></p>`;
					if(Array.isArray(child.answers) && child.answers.length)
					{
						for(var k = 0; k < child.answers.length; k++)
						{
							html += `<span onclick="javascript: this.querySelector('input').click();" style="display: block; float: center; margin: 0 auto; vertical-align: middle; text-align: center;"><small>（${parser.const.quesnumCNs[k]}）</small><input type="text" name="${uuid}" value="${child.answers[k] ? child.answers[k] : ''}" style="text-align: center; width: 80%; opacity: 0.8; border: 0; background-color: #33B5E5; color: #ffffff;" readonly /><input type="text" value="${child.answers[k] ? child.answers[k] : ''}" style="display: none; text-align: center; width: 80%; opacity: 0.8; border: 0; background-color: #5cb85c; color: #ffffff;" readonly /></span>`;
							html += (k < (child.answers.length - 1)) ? "<br />" : "";
						}
						answer_quesnames[answer_quesnames.length - 1].push({name: uuid, type: child.type});
					}
					htmls.push(html);
				}
			}
			// 文字作答题
			if(parser.type.answers.word.includes(child.type))
			{
				if((typeof(child.answer) === "string") || (child.answer === null) || (child.answer === undefined))
				{
					html = `<p><span>{{quesnum}}.<small>〔${child.type}〕</small><big style="word-break: normal; word-wrap: normal; white-space: pre-wrap;">${child.title}</big></span></p>`;
					if((typeof(child.answer) === "string") && child.answer.length)
					{
						html += `<span onclick="javascript: this.querySelector('textarea').click();" style="display: block; float: center; margin: 0 auto; vertical-align: middle; text-align: center;"><textarea name="${uuid}" wrap="hard" rows="1" onclick="javascript: this.oninput();" oninput="javascript: this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';" style="width: 90%; opacity: 0.8; border: 0; background-color: #33B5E5; color: #ffffff;" readonly>${child.answer.replace(/\<([\/]{0,})([A-Za-z]{1,})([0-9]{0,})([ \/]{0,})\>/g, "")}</textarea><input type="text" value="" style="display: none; text-align: center; width: 90%; opacity: 0.8; border: 0; background-color: #337ab7; color: #ffffff;" readonly /><textarea wrap="hard" rows="1" onclick="javascript: this.oninput();" oninput="javascript: this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';" style="display: none; width: 90%; opacity: 0.8; border: 0; background-color: #5cb85c; color: #ffffff;" readonly></textarea></span>`;
						answer_quesnames[answer_quesnames.length - 1].push({name: uuid, type: child.type});
					}
					htmls.push(html);
				}
			}
		}
		html = `${"\t".repeat(6)}</aside>`;
		html += `\n${"\t".repeat(5)}</details>`;
		html += `\n${"\t".repeat(4)}</article>`;
		htmls.push(html);
		return htmls.join("\n");
	});
	// 多章节
	if(Array.isArray(_data.data))
	{
		for(let i = 0; i < _data.data.length; i++)
		{
			let d = parse(_data.data[i], i == 0);
			allhtml += d ? ("\n" + d) : "";
			allhtml += (i < _data.data.length - 1) ? `\n${"\t".repeat(4)}<hr />` : "";
		}
	}
	// 单章节
	if(Array.isArray(_data.questions))
	{
		let d = parse(_data, true);
		allhtml += d ? ("\n" + d) : "";
	}
	allhtml += `\n${"\t".repeat(3)}`;
	document.title = _data.name;
	let quesnum = 0, choice_chaptersnum = 0, answer_chaptersnum = 0, chapter_total_quesnum = 0;
	allhtml = allhtml.replace(/\{\{quesnum\}\}/g, function(_match, _offset, _string)
	{
		return (quesnum = quesnum + 1);
	}).replace(/\{\{chapter_choice_data\}\}/g, function(_match, _offset, _string)
	{
		let data = JSON.stringify(choice_quesnames[choice_chaptersnum]).replace(/"/g, "'");
		choice_chaptersnum = choice_chaptersnum + 1;
		return data;
	}).replace(/\{\{chapter_answer_data\}\}/g, function(_match, _offset, _string)
	{
		let data = JSON.stringify(answer_quesnames[answer_chaptersnum]).replace(/"/g, "'");
		answer_chaptersnum = answer_chaptersnum + 1;
		return data;
	}).replace(/\{\{chapter_total_quesnum\}\}/g, function(_match, _offset, _string)
	{
		let c = choice_quesnames[chapter_total_quesnum] ? choice_quesnames[chapter_total_quesnum].length : 0;
		let a = answer_quesnames[chapter_total_quesnum] ? answer_quesnames[chapter_total_quesnum].length : 0;
		chapter_total_quesnum = chapter_total_quesnum + 1;
		return "〔共" + (c + a) + "题〕";
	});
	let totalquesnum = 0;
	Array.from(choice_quesnames).forEach(function(_arr, _index, _arrs)
	{
		totalquesnum = totalquesnum + _arr.length;
	});
	Array.from(answer_quesnames).forEach(function(_arr, _index, _arrs)
	{
		totalquesnum = totalquesnum + _arr.length;
	});
	document.title = "〔总" + totalquesnum + "题〕" + document.title;
	if(window.$ && $("select optgroup option:selected").length)
	{
		let regx = /^(〔总([\d]+?)题〕)/;
		$([$("select optgroup option:selected").get(0), $(window.eruda && eruda.util && eruda.util.$ && eruda.util.$.cloneSelect).find("optgroup option:selected").get(0)]).each(function($i, $v)
		{
			if($v)
			{
				let selectedOpt = $v;
				let optText = selectedOpt.text || selectedOpt.label || "";
		selectedOpt.label && (selectedOpt.label = "〔总" + totalquesnum + "题〕" + (regx.test(optText) ? optText.replace(regx, "") : optText));
			}
		});
	}
	return allhtml/*.trim().replace(/^\s+/g, "")*/;
});
// 按题型整理数据
parser.api.adjust = (function(_alldata)
{
	if(localStorage.getItem("queslib-display-mode") === "章节")
	{
		//return _alldata;
	}
	// 以指定个数分割数组，默认以 50 为等分单位
	function chunk_array(arrs, size)
	{
		if(!arrs.length || (size < 1))
		{
			return [];
		}
		if(!size)
		{
			size = 50;
		}
		let start = null, end = null, result = [];
		for(let i = 0; i < Math.ceil(arrs.length / size); i++)
		{
			start = i * size;
			end = start + size;
			result.push(arrs.slice(start, end));
		}
		return result;
	}
	let quesnum = localStorage.getItem("queslib-question-num") ? parseInt(localStorage.getItem("queslib-question-num"), 10) : 50;
	let newdata = {
		name: _alldata.name,
		data: []
	};
	// 测试模式下，每种问题类型只返回每个子分割数组中的首题，其余题将被忽略
	let isTest = false;
	if(localStorage.getItem("queslib-display-mode") === "章节")
	{
		Array.from(_alldata.data)
		.forEach(function($chapter, $i, $all)
		{
			Array.from(chunk_array($chapter.questions, quesnum))
			.forEach(function($split, $i2, $all2)
			{
				isTest ? (($i2 == 0) && newdata.data.push({name: $chapter.name, questions: [$split[0]]})) : newdata.data.push({name: $chapter.name + (($all2.length > 1) ? ("（" + parser.const.quesnumCNs[$i2] + "）") : ""), questions: $split});
			});
		});
	}
	else
	{
		let types = {};
		Array.from(_alldata.data)
		.forEach(function(_chapter, _index, _chapters)
		{
			Array.from(_chapter.questions)
			.forEach(function(_question, __index, _questions)
			{
				if(!types[_question.type])
				{
					types[_question.type] = [];
				}
				types[_question.type].push(_question);
			});
		});
		Array.from(Object.keys(types).sort(function(a, b)
		{
			// 按题名称排序，短的在前，长的在后，相等则根据字母表排序
			return [a.length, b.length].includes("undefined") ? (a - b) : ((a.length == b.length) ? (a - b) : (a.length - b.length));
		}))
		.forEach(function(_type, _index, _types)
		{
			Array.from(chunk_array(types[_type], quesnum))
			.forEach(function(_split, __index, _splits)
			{
				isTest ? ((__index == 0) && newdata.data.push({name: _type, questions: [_split[__index]]})) : newdata.data.push({name: _type + ((_splits.length > 1) ? ("（" + parser.const.quesnumCNs[__index] + "）") : ""), questions: _split});
			});
		});
	}
	return newdata;
});
parser.api.get = (function(_el, _data)
{
	$.LoadingOverlay && $.LoadingOverlay("show");
	localStorage.setItem("queslib-selected-index", _el.selectedIndex);
	let fragment = document.createDocumentFragment();
	let tpl = document.createElement("template");
	// .html(document.createRange().createContextualFragment(html));
	// 优先使用对象缓存数据，以免频繁从网络拉取数据
	if(!localStorage.getItem("queslib-display-mode") && _el.item(_el.selectedIndex).cachedata)
	{
		tpl.innerHTML = parser.api.tohtml(parser.api.adjust(_el.item(_el.selectedIndex).cachedata), _el.item(_el.selectedIndex));
		fragment.appendChild(tpl.content);
		$(document).find("[name='queslib'] main").html(fragment);
		window.vueElPopoverTips && vueElPopoverTips();
	}
	else
	{
		if(typeof(parser.queslib) !== "object")
		{
			return alert("题库数据还未初始化");
		}
		if(typeof(parser.queslib.file) !== "function")
		{
			return alert("题库数据加载器错误");
		}
		if(Array.isArray(_data))
		{
			// 全部满足指定条件即反转数组顺序，从后往前处理
			/**
			if(_data.every(function($val, $i, $arrs)
			{
				return $val.type === "icveappzjy2-json";
			}))
			{
				// 目前已经不需要反转了，作业和考试顺序使用默认
				// _data = _data.slice().reverse();
			}
			*/
			var obj = {};
			obj.name = _el.item(_el.selectedIndex).innerText || _el.item(_el.selectedIndex).label || _el.item(_el.selectedIndex).text;
			obj.data = [];
			// 唯一引用，去除重复用，仅在按题型显示下开启去重
			let uniqueReference = (localStorage.getItem("queslib-display-mode") !== "章节") ? (_el.item(_el.selectedIndex).uniquereference = {
				origin: [],
				culled: [],
				kv: {},
				k: []
			}) : null;
			(_data.length != 0) && Promise.allSettled(_data.map(function(_val, _index, _arr)
			{
				return new Promise(function(_resolve, _reject)
				{
					parser.queslib.file(_val.file) ? parser.queslib.file(_val.file).async("string")
					.then(function(_str)
					{
						let file = _val.file || "";
						// 截取文件名作为章节名称
						let filename = file.substring(file.lastIndexOf("/") + 1);
						filename = filename.substring(0, filename.lastIndexOf("."));
						filename = filename.replace(/^([0-9]+\.)/, "");
						_resolve(
						{
							index: _index,
							type: _val.type,
							name: filename,
							data: _str,
							useStudentAnswer: (/(〔答案纠正〕)|(\.学生答案\.)/).test(_val.file)
						});
					})
					.catch(_reject) : _reject([_index, "文件不存在", _val]);
				});
			}))
			.then(function(_results)
			{
				Array.from(_results).forEach(function(_val, _index, _vals)
				{
					if(_val.status === "fulfilled")
					{
						(location.protocol === "file:") && console.log("››get", Array.prototype.slice.apply(arguments));
						let func = null;
						if(_val.value.type === "plain-txt")
						{
							func = parser.txt.simple;
						}
						else if(_val.value.type === "pmph-xml")
						{
							func = parser.xml.pmph;
						}
						else if(_val.value.type === "icveappzjy2-json")
						{
							func = parser.json.icveappzjy2;
						}
						else if(_val.value.type === "icvewebzjy2-json")
						{
							func = parser.json.icvewebzjy2;
						}
						else
						{
							func = parser.txt.simple;
						}
						// 添加章节数据
						obj.data.push(func(_val.value.name, _val.value.data, uniqueReference, _val.value.useStudentAnswer));
					}
					else
					{
						console.warn("allSettled", _index, _val);
					}
				});
				tpl.innerHTML = parser.api.tohtml(parser.api.adjust(obj), _el.item(_el.selectedIndex));
				fragment.appendChild(tpl.content);
				$(document).find("[name='queslib'] main").html(fragment);
			})
			.catch(console.warn)
			.finally(function()
			{
				window.vueElPopoverTips && vueElPopoverTips();
			});
		}
	}
	$.LoadingOverlay && $.LoadingOverlay("hide");
	parser.api.cnzzPush(["_trackEvent", "题库", "试题切换", _el.selectedOptions.item(0).parentElement.label + "@" + (_el.selectedOptions.item(0).text || _el.selectedOptions.item(0).label), _el.selectedIndex, "queslib"]);
});
parser.api.test = (function($data)
{
	let fragment = document.createDocumentFragment();
	let tpl = document.createElement("template");
	let obj = {};
	obj.name = "解析测试";
	obj.data = [];
	if((Object.prototype.toString.call($data) === "[object Object]") || ((typeof($data) === "string") && (/(^\{)|(^\[)/).test($data)))
	{
		obj.data.push(parser.json.icveappzjy2("JSON数据", $data));
	}
	else if(typeof($data) === "string")
	{
		obj.data.push(((/\<\?xml/).test($data) ? parser.xml.pmph : parser.txt.simple)("文本数据", $data));
	}
	tpl.innerHTML = parser.api.tohtml(parser.api.adjust(obj));
	fragment.appendChild(tpl.content);
	$(document).find("[name='queslib'] main").html(fragment);
});