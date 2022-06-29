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
		_optname: /^([A-Z])\./,
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
			if(!$obj.data)
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
			url: url,
			type: "GET",
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
					// 更新一下显示时间，延迟一下网页无响应提示时间，需要预先hook原加载框函数逻辑，否则会导致无法关闭
					$.LoadingOverlay && $.LoadingOverlay("show");
				}
			},
			beforeSend: (function($jqXHR, $options)
			{
				let xhr = ($options && $options.xhr && $options.xhr()) || {};
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
			complete: (function($xhr, $status){})
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
		let type = parser.type.default;
		let questr = data[i].trim().replace(parser.re._type, function($$match, $$type, $$offset, $$str)
		{
			// 题型
			type = $$type;
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
							lines.push("参考答案：" + q[0].trim());
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
parser.json.icveappzjy2 = (function($title, $json)
{
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
								opts.push(
								{
									name: parser.const.optionNames[$$$opt.SortOrder],
									title: $$$opt.Content && $$$opt.Content.trim(),
									right: $$$opt.IsAnswer
								});
							});
							return opts;
						})(),
						answer: $$que.answer ? parser.const.optionIndex[$$que.answer] : undefined,
						coeffic: undefined,
						analysis: ($$que.resultAnalysis && ($$que.resultAnalysis.trim() !== "")) ? $$que.resultAnalysis.trim() : undefined
					});
				}
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
	var parseQue = (function(_que, _typedesc)
	{
		var func = {
			"单选题": (function()
			{
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
								right: (_opt.id == _que.answers)
							});
						});
						(_que.options && _que.options.option) || console.warn("XML存在处理失败题型", _que, _que.type, _typedesc);
						return opts;
					})(),
					answer: (_que.answers && (_que.answers.trim() !== "")) ? _que.answers.trim() : undefined,
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
											right: (_opt.id == __que.answers)
										});
									});
									return opts;
								})(),
								answer: (__que.answers && (__que.answers.trim() !== "")) ? __que.answers.trim() : undefined,
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
							arrs.push(
							{
								title: __que.desc.trim().replace(/(（[0-9]{1,}）|(\([0-9]{1,}\)))/, "").trim(),
								answer: (__que.answers && (__que.answers.trim() !== "")) ? __que.answers.trim() : undefined,
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
				return (_typedesc.trim().toUpperCase().startsWith("A3") || _typedesc.trim().toUpperCase().startsWith("A4")) ? func["共用题干单选题"]() : func["单选题"]();
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
			/**if(_data.every(function($$val, $$i, $$arrs)
			{
				return $$val.type === "icveappzjy2-json";
			}))
			{
				// 目前已经不需要反转了，作业和考试顺序使用默认
				// _data = _data.slice().reverse();
			}*/
			var obj = {};
			obj.name = _el.item(_el.selectedIndex).innerText || _el.item(_el.selectedIndex).label || _el.item(_el.selectedIndex).text;
			obj.data = [];
			let icveappzjy2Datas = [];
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
						_resolve({index: _index, type: _val.type, name: filename, data: _str});
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
							/** icveappzjy2Datas.push(func(_val.value.name, _val.value.data));
							return;*/
						}
						else
						{
							func = parser.txt.simple;
						}
						// 添加章节数据
						obj.data.push(func(_val.value.name, _val.value.data));
					}
					else
					{
						console.warn("allSettled", _index, _val);
					}
				});
				/**
				// 去除重复题目
				function removeRepeat(_params)
				{
					let newresult = null, uniqueId = {}, unique = [], repeat = [];
					for(let i = 0; i < _params.length; i++)
					{
						if(i === 0)
						{
							// 使用JSON解析转化防止对象引用问题
							newresult = JSON.parse(JSON.stringify(_params[i]));
							newresult.data.questions = [];
						}
						for(let questions = _params[i].data.questions, k = 0; k < questions.length; k++)
						{
							if(!uniqueId[questions[k].questionId])
							{
								uniqueId[questions[k].questionId] = questions[k];
								unique.push(questions[k]);
							}
							else
							{
								repeat.push(questions[k]);
							}
						}
					}
					Array.from(Object.values(uniqueId)).forEach(function(_value, _index, _values)
					{
						newresult.data.questions.push(_value);
					});
					// dumpJSON({result: newresult, unique: unique, repeat: repeat});
					return {result: newresult, unique: unique, repeat: repeat};
				}*/
				// (location.protocol === "file:") && console.log("››get icveappzjy2Datas", icveappzjy2Datas/**, removeRepeat(icveappzjy2Datas)*/);
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