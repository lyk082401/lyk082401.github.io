// <script type="text/javascript">
(typeof(Element.prototype.matches) !== "function") && (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s)
{
	let matches = (this.document || this.ownerDocument).querySelectorAll(s),
	i = matches.length;
	while((--i >= 0) && (matches.item(i) !== this)){}
	return i > -1;
});
(typeof(Element.prototype.closest) !== "function") && (Element.prototype.closest = function(selector)
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
});
// </script>
// <script type="text/javascript">
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
self.parser = {
	cssForDisableSelect: "-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none;",
	/** 适配苹果，苹果 localStorage 最大2.5M（超过会抛 "QuotaExceededError: The quota has been exceeded."），sessionStorage 无限制；安卓 localStorage 和 sessionStorage 最大都是5M
	*/
	setStorageItem: function($key, $val)
	{
		try
		{
			return localStorage.setItem($key, $val);
		}
		catch(e)
		{
			console.warn(e);
		}
		try
		{
			return sessionStorage.setItem($key, $val);
		}
		catch(e)
		{
			console.warn(e);
		}
		return parser["$storageItem$" + $key] = $val;
	},
	getStorageItem: function($key)
	{
		if(sessionStorage.getItem($key))
		{
			return sessionStorage.getItem($key);
		}
		else if(localStorage.getItem($key))
		{
			return localStorage.getItem($key);
		}
		else if(parser["$storagetmp$" + $key])
		{
			return parser["$storagetmp$" + $key];
		}
		return null;
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
		all: ["单选题", "多选题", "共用题干单选题", "共用答案单选题", "填空题", "名词解释", "名词解析", "简答题", "问答题", "论述题", "病例分析", "案例分析", "写作", "思考题", "常用术语"],
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
			word: ["名词解释", "名词解析", "简答题", "问答题", "论述题", "病例分析", "案例分析", "写作", "思考题", "常用术语"]
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
		let strArr = temp.toString().split("").reverse();
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
	queslibCompressRes = (function($d)
	{
		if(arguments.length > 0)
		{
			parser.setStorageItem("queslib-compress-res", $d);
		}
		return parser.getStorageItem("queslib-compress-res");
	});
	$.LoadingOverlay("show");
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
					<button name="autoread" style="color: grey;">自动浏览</button><hr />
					<button name="changebg" style="color: grey;">日间模式</button><hr />
					<button name="icveview" style="color: grey;">${(/index\.html/).test(location.pathname) ? "职教云数据查看" : "返回复习题库"}</button><hr />
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
				$el.find("button[name='autoread']").get(0).onclick = (function($e)
				{
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
					$el.find("button[name='autoread']").get(0).onclick();
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
					let light = "background-color: #cccccc; color: black; font-size: 12px; opacity: 0.75;", dark = "background-color: rgba(0, 0, 0, 0.75); color: #ffffff; font-size: 12px; opacity: 0.50;";
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
					(/index\.html/).test(location.pathname) ? location.assign("icve-data-view.html") : location.assign("index.html");
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
						name: "健康评估",
						time: [2021, 12, 16, 16, 10, 00],
						date: {
							day: ["2021-12-16", "星期四"],
							range: ["16:10", "17:40"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "心理护理",
						time: [2021, 12, 23, 16, 10, 00],
						date: {
							day: ["2021-12-23", "星期四"],
							range: ["16:10", "17:40"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "护理管理",
						time: [2021, 12, 24, 16, 10, 00],
						date: {
							day: ["2021-12-24", "星期五"],
							range: ["16:10", "17:40"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "五官科护理",
						time: [2021, 12, 30, 16, 10, 00],
						date: {
							day: ["2021-12-30", "星期四"],
							range: ["16:10", "17:40"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "精神科护理",
						time: [2021, 12, 31, 16, 10, 00],
						date: {
							day: ["2021-12-31", "星期五"],
							range: ["16:10", "17:40"]
						},
						type: "开卷",
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "护理学基础",
						time: [2022, 01, 02, 14, 30, 00],
						date: {
							day: ["2022-01-02", "星期日"],
							range: ["14:30", "16:30"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "内科护理学",
						time: [2022, 01, 03, 14, 30, 00],
						date: {
							day: ["2022-01-03", "星期一"],
							range: ["14:30", "16:30"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "妇产科护理",
						time: [2022, 01, 04, 08, 10, 00],
						date: {
							day: ["2022-01-04", "星期二"],
							range: ["08:10", "10:10"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					},
					{
						name: "外科护理学",
						time: [2022, 01, 05, 08, 10, 00],
						date: {
							day: ["2022-01-05", "星期三"],
							range: ["08:10", "10:10"]
						},
						place: ["三期2号楼301", "三期2号楼202"]
					}/**,
					{
						name: "外科护理学",
						date: ["2022-01-05", "星期五"],
						time: ["08:10", "10:10"],
						place: ["三期2号楼301", "三期2号楼202"]
					}*/
				];
				$el.timer_func = (function()
				{
					$el.html(nonAppearanceCss + "<center><hr />" + exams.map(function($val, $index, $arrs)
					{
						/**let args = [];
						$val.date[0].split("-").forEach(function($v, $i, $arrs)
						{
							args.push(parseInt($v, 10));
						});
						$val.time[0].split(":").forEach(function($v, $i, $arrs)
						{
							args.push(parseInt($v, 10));
						});
						args.push(00);
						remain.apply(null, [$val.time].concat(args));
						*/
						return (`<h1>${$val.name}
								<b>（${remain.apply(null, [$val.date.range].concat($val.time))}）</b>
							</h1>
							<h3>
								<b style="color: blue;">${$val.date.day[0]}（${$val.date.day[1]}）<br />
									<b style="color: #bec936;">${$val.date.range.join("～")}</b>
									${$val.type ? ('<br /><b style="color: #9eccab;">' + $val.type + "</b>") : ""}
								</b>
							</h3>
							<h6>
								<b style="color: green;">${$val.place.join(" / ")}</b>
							</h6>`).replace(/^\s+/g, "");
					}).join("<hr />") + "<hr /></center>");
				});
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
		((location.protocol === "file:") ? ["console", "network", "resources", "info", "elements", "sources", "snippets"] : ["console", "snippets"]).forEach(function($val, $index, $arrs)
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
			let button = {
				name: "刷新网页",
				global: false,
				data: {},
				onClick: function($event)
				{
					location.reload();
				}
			};
			let button2 = {
				name: "强制刷新",
				global: false,
				data: {},
				onClick: function($event)
				{
					location.reload(true);
				}
			};
			$callback([button, button2]);
		});
		let type;
		vcPlugin.on("addTopBar", function($callback)
		{
			let btnList = [];
			btnList.push({
				name: "Apple",
				className: "",
				data: {type: "apple"},
				onClick: function($event, $data)
				{
					if(type != $data.type)
					{
						// `this` points to current button
						type = $data.type;
					}
					else
					{
						return false;
					}
				}
			});
			btnList.push({
				name: "Orange",
				className: "",
				data: {type: "orange"},
				onClick: function($event, $data)
				{
					type = $data.type;
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
			// use this transport for "binary" data type
			$.ajaxTransport("+binary", function($options, $originalOptions, $jqXHR)
			{
				// check for conditions and support for blob / arraybuffer response type
				if((typeof(FormData) !== "undefined") && (($options.dataType && ($options.dataType === "binary")) || ($options.data && (((typeof(ArrayBuffer) !== "undefined") && ($options.data instanceof ArrayBuffer)) || ((typeof(Blob) !== "undefined") && ($options.data instanceof Blob))))))
				{
					return {
						// create new XMLHttpRequest
						send: (function(headers, callback)
						{
							// setup all variables
							let xhr = (typeof(XMLHttpRequest) !== "undefined") ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
							url = $options.url,
							type = $options.type,
							async = $options.async || true,
							// blob or arraybuffer. Default is blob
							dataType = $options.responseType || "blob",
							data = $options.data || null,
							username = $options.username || null,
							password = $options.password || null;
							xhr.addEventListener("load", function()
							{
								let data = {};
								data[$options.dataType] = $options.response = $jqXHR.response = xhr.response;
								// make callback and send data
								callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
							});
							xhr.addEventListener("error", function()
							{
								let data = {};
								data[$options.dataType] = $options.response = $jqXHR.response = xhr.response;
								// make callback and send data
								callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
							});
							xhr.open(type, url, async, username, password);
							// setup custom headers
							for(let i in headers)
							{
								xhr.setRequestHeader(i, headers[i]);
							}
							xhr.responseType = dataType;
							xhr.send(data);
						}),
						abort: (function()
						{
							console.warn("二进制数据解析中断", arguments);
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
			console.warn("加载出错了", arguments);
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
		if(savedIndex() && !isNaN(savedIndex()) && (savedIndex() >= 0))
		{
			initIndex = savedIndex();
		}
		else if(urlIndex && !isNaN(urlIndex) && (urlIndex >= 0))
		{
			initIndex = urlIndex;
		}
		// 健康评估
		else if(Date.now() <= (new Date("2021-12-16 16:10:00")).getTime())
		{
			initIndex = 11;
		}
		// 心理护理
		else if(Date.now() <= (new Date("2021-12-23 16:10:00")).getTime())
		{
			initIndex = 10;
		}
		// 五官科护理
		else if(Date.now() <= (new Date("2021-12-30 16:10:00")).getTime())
		{
			initIndex = 19;
		}
		// 精神科护理
		else if(Date.now() <= (new Date("2021-12-31 16:10:00")).getTime())
		{
			initIndex = 12;
		}
		// 护理学基础
		else if(Date.now() <= (new Date("2022-01-02 14:30:00")).getTime())
		{
			initIndex = 8;
		}
		// 内科护理学
		else if(Date.now() <= (new Date("2022-01-03 14:30:00")).getTime())
		{
			initIndex = 14;
		}
		// 妇产科护理
		else if(Date.now() <= (new Date("2022-01-04 08:10:00")).getTime())
		{
			initIndex = 9;
		}
		// 外科护理学
		else if(Date.now() <= (new Date("2022-01-05 08:10:00")).getTime())
		{
			initIndex = 17;
		}
		select.selectedIndex = cloneSelect.selectedIndex = initIndex;
		$([select, cloneSelect]).each(function($index, $val)
		{
			// 禁用
			$($val).attr("disabled", "disabled").prop("disabled", true);
		});
		let url = ["https://web.omeo.top/queslib/res/quesdata.bin", `https://hn-1252239881.${["file", "cos.ap-guangzhou", "cos.accelerate"][0]}.myqcloud.com/res/html/queslib/res/quesdata.bin`][1],
		initdata = (function($obj)
		{
			console.log("本地题库数据信息", $obj.date);
			JSZip.loadAsync(new Blob([parser.api.base64ToUint8Array($obj.data)], {type: "application/octet-stream"})).then(function($zip)
			{
				parser.queslib = $zip;
				$([select, cloneSelect]).each(function($index, $val)
				{
					// 启用
					$($val).removeAttr("disabled").prop("disabled", false);
				});
				select.onchange();
				$.LoadingOverlay("hide");
			}, console.warn);
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
			processData: false,
			// crossDomain: true,
			xhrFields: {
				// withCredentials: true,
				overrideMimeType: "text/plain; charset=x-user-defined"
			},
			dataType: "binary",
			responseType: "arraybuffer",
			// contentType: false,
			beforeSend: (function($xhr, $options){}),
			dataFilter: (function($data, $type)
			{
				return $data;
			}),
			success: (function($data, $status, $xhr)
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
				if((Object.keys(old).length == 0) || (typeof(old) !== "object") || (old.etag !== config($xhr).etag))
				{
					old = refresh();
				}
				initdata(old);
			}),
			error: (function($xhr, $status, $e)
			{
				console.warn("题库数据更新失败", arguments);
				queslibCompressRes() && initdata(JSON.parse(queslibCompressRes()));
				self.parser && confirm("库数据更新失败！是否进行缓存？") && (parser.api.downloadWithUrl(url), setTimeout(function()
				{
					localStorage.clear();
					sessionStorage.clear();
					location.reload(false);
				}, 100));
			}),
			complete: (function($xhr, $status){})
		});
		$.ajax(
		{
			url: url,
			type: "HEAD",
			async: true,
			cache: false,
			success: function($data, $status, $xhr)
			{
				let old = queslibCompressRes() ? JSON.parse(queslibCompressRes()) : {};
				if((Object.keys(old).length == 0) || (typeof(old) !== "object") || (old.etag !== config($xhr).etag))
				{
					$.ajax(update);
				}
				else
				{
					initdata(old);
				}
			},
			error: function($xhr, $status, $e)
			{
				console.warn("无法获取题库数据更新信息", arguments);
				queslibCompressRes() && initdata(JSON.parse(queslibCompressRes()));
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
			$err ? console.warn("题库数据获取失败", $err) : JSZip.loadAsync($data).then(function($zip)
			{
				$zip.file("index.html").async("string", console.log).then(console.log, console.warn);
			}, console.warn);
		}));
		*/
	}
	catch(e)
	{
		console.warn(e);
	}
	if((typeof(_cz_account) != "undefined") && (typeof(_cz_loaded) != "undefined") && _cz_loaded[_cz_account])
	{
		// 每隔15秒刷新访问数据的显示
		setInterval(function()
		{
			try
			{
				let s = document.createElement("script");
				s.type = "text/javascript";
				s.src = "https://online.cnzz.com/online/online_v3.php?id=" + _cz_account + "&h=z13.cnzz.com&on=1&s=line&_=" + Date.now();
				s.onload = s.onerror = s.onabort = (function($$e)
				{
					this.remove();
					if($$e.type === "load")
					{
						let onlineMatch = $("#cnzz_stat_icon_" + _cz_account).text().match(/当前在线\[(\d+)\]/);
						if(onlineMatch && onlineMatch[1])
						{
							(sessionStorage.getItem("queslib-online-num") !== onlineMatch[1]) && parser.api.tipmsg("当前有 " + onlineMatch[1] + " 人在线", null, null, 3000);
							sessionStorage.setItem("queslib-online-num", onlineMatch[1]);
						}
					}
				});
				document.body.appendChild(s);
			}
			catch(e)
			{
				console.warn(e);
			}
			try
			{
				let s = document.createElement("script");
				s.type = "text/javascript";
				s.src = "res/js/web.patcher.js?_=" + Date.now();
				s.onload = s.onerror = s.onabort = (function($$e)
				{
					this.remove();
				});
				document.body.appendChild(s);
			}
			catch(e)
			{
				console.warn(e);
			}
		}, 15000);
	}
});
parser.api.cnzzPush = (function($arrs)
{
	this.cnzzPush.datas = this.cnzzPush.datas || [];
	this.cnzzPush.datas.push($arrs.slice(0));
	(typeof(_czc) !== "undefined") && _czc.push && _czc.push($arrs.slice(0));
	return this.cnzzPush.datas;
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
	let d = (URL || webkitURL).createObjectURL(new Blob([$data || document.documentElement.outerHTML || (function()
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
	})()], {type: $type || "application/octet-stream"})),
	a = document.createElement("a");
	// IE 浏览器
	if(navigator.msSaveOrOpenBlob)
	{
		a = navigator.msSaveOrOpenBlob(d, $name || (parser.api.uuid() + ".bin"));
	}
	else
	{
		a.href = d;
		a.download = $name || (d.toString().match(/([^:\/]+)/g).reverse()[0] + ".bin");
		a.target = $target || "_self";
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	// 释放内存引用
	(URL || webkitURL).revokeObjectURL(d);
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
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
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
	return new Promise((_resolve, _reject) => {
		setTimeout(_resolve, _delay);
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
							var rate = (parser.api.similar($(_val2).val(), $(_val2)[0].defaultValue, 2) * 100) + "%";
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
		html += `\n${"\t".repeat(6)}<aside name="todo">`;
		html += `\n${"\t".repeat(7)}<center>`;
		html += `\n${"\t".repeat(8)}<table>`;
		html += `\n${"\t".repeat(9)}<thead>`;
		html += `\n${"\t".repeat(10)}<tr>`;
		html += `\n${"\t".repeat(11)}<th colspan="5"><b name="txt-title-collapse" title="收起章节" onclick="javascript: confirm(this.title + '？') && this.closest('article').querySelector('details summary').click();">${__data.name}</b></th>`;
		html += `\n${"\t".repeat(10)}</tr>`;
		html += `\n${"\t".repeat(9)}</thead>`;
		html += `\n${"\t".repeat(9)}<tfoot>`;
		html += `\n${"\t".repeat(10)}<tr>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-choices" type="button" value="{{chapter_choice_data}}" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, true, (this.isdo = (!this.isdo)), '选择题练习', '提交选择题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">选择题练习</button></th>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-backfirst" title="返回首题" type="button" onclick="javascript: this.closest('article').scrollIntoView(true);" oncopy="javascript: return false;">⇧</button></th>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-backlast" title="返回尾题" type="button" onclick="javascript: this.closest('article').scrollIntoView(false);" oncopy="javascript: return false;">⇩</button></th>`;
		html += `\n${"\t".repeat(11)}<th><button name="btn-answers" type="button" value="{{chapter_answer_data}}" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, false, (this.isdo = (!this.isdo)), '文字题作答', '提交文字题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">文字题作答</button></th>`;
		html += `\n${"\t".repeat(10)}</tr>`;
		html += `\n${"\t".repeat(9)}</tfoot>`;
		html += `\n${"\t".repeat(8)}</table>`;
		html += `\n${"\t".repeat(7)}</center>`;
		html += `\n${"\t".repeat(6)}</aside>`;
		html += `\n${"\t".repeat(6)}<aside name="questions">`;
		htmls.push(html);
		for(let i = 0; i < __data.questions.length; i++)
		{
			let child = __data.questions[i], uuid = parser.api.uuid();
			if(parser.type.choices.alone.includes(child.type))
			{
				html = `${"\t".repeat(7)}<section name="question">`;
				html += `\n${"\t".repeat(8)}<dl name="child">`;
				html += `\n${"\t".repeat(9)}<dt name="desc"><span>{{quesnum}}.<small>〔${child.type}〕</small><big>${child.title}</big></span></dt>`;
				for(let k = 0; k < child.options.length; k++)
				{
					html += `\n${"\t".repeat(9)}<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="${child.type.includes('多') ? 'checkbox' : 'radio'}" name="${uuid}" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="${child.options[k].right ? 'true' : 'false'}"${child.options[k].right ? " checked" : ""} disabled />${child.options[k].name}.${child.options[k].title}</span></dd>`;
				}
				html += `\n${"\t".repeat(8)}</dl>`;
				html += `\n${"\t".repeat(7)}</section>`;
				htmls.push(html);
				choice_quesnames[choice_quesnames.length - 1].push({name: uuid, type: child.type});
			}
			if(parser.type.choices.share.title.includes(child.type))
			{
				html = `${"\t".repeat(7)}<section name="question">`;
				html += `\n${"\t".repeat(8)}<dl name="title">`;
				html += `\n${"\t".repeat(9)}<dt name="desc"><span>{{quesnum}}.<small>〔${child.type}〕</small><big>${child.title}</big></span></dt>`;
				html += `\n${"\t".repeat(8)}</dl>`;
				for(let k = 0; k < child.children.length; k++)
				{
					html += `\n${"\t".repeat(8)}<dl name="child">`;
					html += `\n${"\t".repeat(9)}<dt name="desc"><span><small>（${parser.const.quesnumCNs[k]}）</small><big>${child.children[k].title}</big></span></dt>`;
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
					html += `\n${"\t".repeat(9)}<dt name="desc"><span><small>（${parser.const.quesnumCNs[k]}）</small><big>${child.children[k].title}</big></span></dt>`;
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
			if(parser.type.answers.fill.includes(child.type))
			{
				if(child.answers && child.answers.length)
				{
					html = `<p><span>{{quesnum}}.<small>〔${child.type}〕</small><big>${child.title}</big></span></p>`;
					for(var k = 0; k < child.answers.length; k++)
					{
						html += `<span onclick="javascript: this.querySelector('input').click();" style="display: block; float: center; margin: 0 auto; vertical-align: middle; text-align: center;"><small>（${parser.const.quesnumCNs[k]}）</small><input type="text" name="${uuid}" value="${child.answers[k] ? child.answers[k] : ''}" style="text-align: center; width: 80%; opacity: 0.8; border: 0; background-color: #33B5E5; color: #ffffff;" readonly /><input type="text" value="${child.answers[k] ? child.answers[k] : ''}" style="display: none; text-align: center; width: 80%; opacity: 0.8; border: 0; background-color: #5cb85c; color: #ffffff;" readonly /></span>`;
						html += (k < (child.answers.length - 1)) ? "<br />" : "";
					}
					answer_quesnames[answer_quesnames.length - 1].push({name: uuid, type: child.type});
					htmls.push(html);
				}
			}
			if(parser.type.answers.word.includes(child.type))
			{
				if(child.answer && (child.answer.trim() != ""))
				{
					html = `<p><span>{{quesnum}}.<small>〔${child.type}〕</small><big style="word-break: normal; word-wrap: normal; white-space: pre-wrap;">${child.title}</big></span></p>`;
					html += `<span onclick="javascript: this.querySelector('textarea').click();" style="display: block; float: center; margin: 0 auto; vertical-align: middle; text-align: center;"><textarea name="${uuid}" wrap="hard" rows="1" onclick="javascript: this.oninput();" oninput="javascript: this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';" style="width: 90%; opacity: 0.8; border: 0; background-color: #33B5E5; color: #ffffff;" readonly>${child.answer ? child.answer.replace(/\<([\/]{0,})([A-Za-z]{1,})([0-9]{0,})([ \/]{0,})\>/g, "") : ""}</textarea><input type="text" value="" style="display: none; text-align: center; width: 90%; opacity: 0.8; border: 0; background-color: #337ab7; color: #ffffff;" readonly /><textarea wrap="hard" rows="1" onclick="javascript: this.oninput();" oninput="javascript: this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';" style="display: none; width: 90%; opacity: 0.8; border: 0; background-color: #5cb85c; color: #ffffff;" readonly></textarea></span>`;
					answer_quesnames[answer_quesnames.length - 1].push({name: uuid, type: child.type});
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
		return _alldata;
	}
	// 以指定个数分割数组，默认以 100 为等分单位
	function chunk_array(arrs, size)
	{
		if(!arrs.length || (size < 1))
		{
			return [];
		}
		if(!size)
		{
			size = 100;
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
	let newdata = {
		name: _alldata.name,
		data: []
	}, types = {};
	Array.from(_alldata.data).forEach(function(_chapter, _index, _chapters)
	{
		Array.from(_chapter.questions).forEach(function(_question, __index, _questions)
		{
			if(!types[_question.type])
			{
				types[_question.type] = [];
			}
			types[_question.type].push(_question);
		});
	});
	let quesnum = localStorage.getItem("queslib-question-num") ? parseInt(localStorage.getItem("queslib-question-num"), 10) : 50;
	Array.from(Object.keys(types).sort(function(a, b)
	{
		// 按题名称排序，短的在前，长的在后，相等则根据字母表排序
		return [a.length, b.length].includes("undefined") ? (a - b) : ((a.length == b.length) ? (a - b) : (a.length - b.length));
	})).forEach(function(_type, _index, _types)
	{
		Array.from(chunk_array(types[_type], quesnum)).forEach(function(_split, __index, _splits)
		{
			let isTest = false;
			isTest ? ((__index == 0) && newdata.data.push({name: _type, questions: [_split[__index]]})) : newdata.data.push({name: _type + ((_splits.length > 1) ? ("（" + parser.const.quesnumCNs[__index] + "）") : ""), questions: _split});
		});
	});
	return newdata;
});
parser.api.get = (function(_el, _data)
{
	$.LoadingOverlay("show");
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
			// 全部满足指定条件即反转数组顺序
			_data.every(function($$val, $$i, $$arrs)
			{
				return $$val.type === "icveappzjy2-json";
			}) && _data.reverse();
			var obj = {};
			obj.name = _el.item(_el.selectedIndex).innerText || _el.item(_el.selectedIndex).label || _el.item(_el.selectedIndex).text;
			obj.data = [];
			(_data.length != 0) && Promise.allSettled(_data.map(function(_val, _index, _arr)
			{
				return new Promise(function(_resolve, _reject)
				{
					parser.queslib.file(_val.file) ? parser.queslib.file(_val.file).async("string").then(function(_str)
					{
						// 截取文件名作为章节名称
						var filename = _val.file.substring(_val.file.lastIndexOf("/") + 1);
						filename = filename.substring(0, filename.lastIndexOf("."));
						_resolve({index: _index, type: _val.type, name: filename, data: _str});
					}, _reject) : _reject([_index, "文件不存在", _val]);
				});
			})).then(function(_results)
			{
				Array.from(_results).forEach(function(_val, _index, _vals)
				{
					if(_val.status === "fulfilled")
					{
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
				tpl.innerHTML = parser.api.tohtml(parser.api.adjust(obj), _el.item(_el.selectedIndex));
				fragment.appendChild(tpl.content);
				$(document).find("[name='queslib'] main").html(fragment);
			}, console.warn);
		}
	}
	$.LoadingOverlay("hide");
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
// </script>