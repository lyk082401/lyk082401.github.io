<!DOCTYPE html>
<html lang="zh-CN" style="width: 100%; height: 100%; margin: 0; padding: 0; border: 0; overflow: auto;">
	<head>
		<meta charset="UTF-8" />
		<meta name="referrer" content="always" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<title>梧职院 | 护理专业 | 复习题库</title>
		<!-- ("SRI Hash Generator")["https://www.srihash.org/"] -->
		<script type="text/javascript">
		try
		{
			window.onerror = (function($message, $url, $line, $column, $error)
			{
				console.warn($message, $url, $line, $column, $error);
				$error && Object.getOwnPropertyNames($error).forEach(function($key, $index, $arrs)
				{
					$error["$" + $key] = $error[$key];
				});
				alert(JSON.stringify({message: $message, url: $url, line: $line, column: $column, error: $error}, null, "\t"));
			});
			window.onbeforeunload = window.onunload = (function($e)
			{
				return ($e || window.event || document.event).returnValue = "确定离开当前页面吗？";
			});
		}
		catch(e)
		{
			console.warn(e);
		}
		try
		{
			(function()
			{
				let indent = "\n" + ("\t").repeat(2);
				function appendElement()
				{
					for(let arg of Array.prototype.slice.call(arguments).values())
					{
						// append into "<head></head>"
						document.head.append ? document.head.append(arg) : document.head.appendChild(arg);
					}
				}
				function appendComment()
				{
					for(let arg of Array.prototype.slice.call(arguments).values())
					{
						appendElement(document.createTextNode(indent), document.createComment(arg));
					}
				}
				function dynamicLoad($name, $url, $args)
				{
					return new Promise(function($done, $fail)
					{
						try
						{
							let el = document.createElement($name);
							el.charset = "UTF-8";
							if($name === "script")
							{
								el.type = "text/javascript";
								el.src = $url;
							}
							else if($name === "link")
							{
								el.rel = "stylesheet";
								el.href = $url;
							}
							else
							{
								$args && (typeof($args.fail) === "function") && $args.fail(e);
								$fail(new Error("不支持加载 " + $name));
							}
							($url.startsWith("http://") || $url.startsWith("https://") || $url.startsWith("//")) && (el.crossOrigin = "anonymous");
							if($args && Object.prototype.toString.call($args.attr) === "[object Object]")
							{
								for(let [k, v] of Object.entries($args.attr))
								{
									el.setAttribute(k, v);
								}
							}
							if($args && Object.prototype.toString.call($args.prop) === "[object Object]")
							{
								for(let [k, v] of Object.entries($args.prop))
								{
									el[k] = v;
								}
							}
							el.onload = el.readystatechange = function(e)
							{
								if(!el.readyState || (el.readyState === "complete") || (el.readyState === "loaded"))
								{
									$args && (typeof($args.done) === "function") && $args.done(e);
									$done(e);
								}
								else
								{
									$args && (typeof($args.fail) === "function") && $args.fail(e);
									$fail(e);
								}
								el.onload = el.readystatechange = null;
							};
							el.onerror = el.onabort = function(e)
							{
								$args && (typeof($args.fail) === "function") && $args.fail(e);
								$fail(e);
								el.onerror = el.onabort = null;
							};
							appendElement(el);
						}
						catch(e)
						{
							$args && (typeof($args.fail) === "function") && $args.fail(e);
							$fail(e);
						}
					});
				}
				// Dexie JS
				dynamicLoad("script", "res/cdnjs.cat.net/ajax/libs/dexie/3.2.1/dexie.min.js", {
					attr: {
						"x-url": "https://cdn.staticfile.org/dexie/3.2.1/dexie.min.js"
					},
					prop: {},
					done: console.log,
					fail: console.warn
				});
				/**
				function dynamicCreateElement($arr, $elName, $indent)
				{
					$indent || ($indent = "\n" + ("\t").repeat(2));
					let needfix = document.createElement("div");
					needfix.setAttribute("class", "IE6IE7");
					needfix = (needfix.className === "IE6IE7");
					if(Array.isArray($arr))
					{
						$arr.forEach(function($obj, $i, $$)
						{
							let el = document.createElement($elName);
							let desc = null;
							let onlydesc = false;
							for(let [k, v] of Object.entries($obj))
							{
								if((k === "") && (typeof(v) === "string"))
								{
									desc = v;
									onlydesc = (Object.keys($obj).length == 1);
								}
								// ".?"
								else if((/^\.([\s\S]+)/).test(k) || (k.indexOf(".") != -1))
								{
									// "?"
									k = k.replace(/^\.([\s\S]+)/, "$1");
									// "?.??"
									let kk = k.split(".");
									// ["?", "??"]
									if(kk.length == 2)
									{
										el[kk[0]][kk[1]] = v;
									}
									else
									{
										// ["?"]
										el[k] = v;
									}
								}
								// "x-*" "data-*"
								else if(k.startsWith("x-") || k.startsWith("data-"))
								{
									el.setAttribute(k, v);
								}
								// ":?"
								else if((/^\:([\s\S]+)/).test(k))
								{
									el.setAttribute(k.replace(/^\:([\s\S]+)/, "$1"), v);
								}
								else
								{
									el[k] = v;
								}
							}
							function append(arg)
							{
								for(let arg of Array.prototype.slice.call(arguments).values())
								{
									// append into "<head></head>"
									document.head.append ? document.head.append(arg) : document.head.appendChild(arg);
								}
							}
							if(onlydesc)
							{
								desc && append(document.createTextNode($indent), document.createComment(desc));
							}
							else
							{
								desc && append(document.createTextNode($indent), document.createComment("^ " + desc + " "));
								append(document.createTextNode($indent), el);
								desc && append(document.createTextNode($indent), document.createComment(" " + desc + " $"));
							}
						});
						alert([document.head.outerHTML.substr(11000)])
					}
				}
				*/
				dynamicCreateElement([
					{
						"": "Dexie JS",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/dexie/3.2.1/dexie.min.js",
						// ":x-bak": "https://cdn.staticfile.org/dexie/3.2.1/dexie.min.js",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "Eruda Console",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/eruda/2.4.1/eruda.min.js",
						// ":x-bak": "https://cdn.staticfile.org/eruda/2.4.1/eruda.min.js",
						":onload": "javascript: self.eruda && (eruda._isInit || eruda.init({tool: [], autoScale: true, useShadowDom: true, defaults: {displaySize: 60, transparency: 0.9, theme: 'Dark'}})); /**@close (document.location.protocol === 'file:') || self.eruda && (eruda._isInit && (eruda.destroy && eruda.destroy(), eruda._isInit && (eruda._$el && eruda._$el.remove && eruda._$el.remove()))); */ /**@el (eruda._shadowRoot && $(eruda._$el.parent()).find('#eruda.eruda-container')) || $('#eruda.eruda-container') */",
						// ":x-doc": "https://eruda.liriliri.io/, https://github.com/liriliri/eruda/blob/master/doc/API.md, https://unpkg.com/browse/eruda@2.4.1/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "vConsole",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/vConsole/3.12.1/vconsole.min.js",
						// ":x-bak": "https://cdn.staticfile.org/vConsole/3.12.1/vconsole.min.js",
						":onload": "javascript: self.VConsole && ((self.vConsole && vConsole.isInited) || (self.vConsole = new VConsole({defaultPlugins: ['system', 'network', 'element', 'storage'], 'storage.defaultStorages': ['cookies', 'localStorage', 'sessionStorage'], theme: 'dark', disableLogScrolling: true, 'log.showTimestamps': true, onReady: function(){}}))); /**@close (document.location.protocol === 'file:') || setTimeout(function(){ self.vConsole && (vConsole.isInited && (vConsole.destroy && vConsole.destroy(), vConsole.isInited && (vConsole.$dom && vConsole.$dom.remove && vConsole.$dom.remove()))); }, 1000); */ /**@el $('#__vconsole') */",
						// ":x-doc": "http://wechatfe.github.io/vconsole/demo.html, https://github.com/Tencent/vConsole/blob/dev/README_CN.md, https://unpkg.com/browse/vconsole@3.11.0/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "Vue",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/vue/2.6.14/vue.min.js",
						// ":x-bak": "https://cdn.staticfile.org/vue/2.6.14/vue.min.js",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "Vue vConsole Devtools Plugin",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdn.jsdelivr.net/npm/vue-vconsole-devtools@1.0.5/dist/vue_plugin.js",
						//":onload": "javascript: self.vueVconsoleDevtools.initPlugin(self.vConsole); self.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', self.Vue);",
						// ":crossOrigin": "anonymous",
						defer: true
					},
					{
						"": "JSON Minify",
						type: "text/javascript", charset: "UTF-8",
						src: "res/web.omeo.top/JSON.minify/minify.json.js",
						// ":x-doc": "https://github.com/fkei/JSON.minify/, https://github.com/getify/JSON.minify/tree/javascript/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "JSZip",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/jszip/3.6.0/jszip.min.js",
						// ":x-bak": "https://cdn.staticfile.org/jszip/3.6.0/jszip.min.js",
						// ":x-doc": "https://stuk.github.io/jszip/, sync-mode@https://github.com/Stuk/jszip/issues/375#issuecomment-258969023",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "JSZip Utils",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js",
						// ":x-bak": "https://cdn.staticfile.org/jszip-utils/0.1.0/jszip-utils.min.js",
						// ":x-doc": "http://stuk.github.io/jszip-utils/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": '[if IE]>\n\t\t<script type="text/javascript" charset="UTF-8" src="res/cdnjs.cat.net/ajax/libs/jszip-utils/0.1.0/jszip-utils-ie.min.js" x-bak="https://cdn.staticfile.org/jszip-utils/0.1.0/jszip-utils-ie.min.js" x-doc="http://stuk.github.io/jszip-utils/" x-crossorigin="anonymous"><\/script>\n\t\t<![endif]'
					},
					{
						"": "jQuery",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/jquery/1.12.4/jquery.min.js",
						// ":x-bak": "https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js",
						":onload": "javascript: self.jQuery && jQuery(document).ready(function(){ parser.api.init.apply(this, arguments); eval($(`script[src*='vconsole']`).attr('onload').match(new RegExp('\\\\/\\\\*\\\\*@close(.+?)\\\\*\\\\/'))[1].trim()); });",
						// ":x-doc": "https://www.jquery123.com/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "jQuery Loading Overlay",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/jquery-loading-overlay/2.1.7/loadingoverlay.min.js",
						// ":x-bak": "https://cdn.staticfile.org/jquery-loading-overlay/2.1.7/loadingoverlay.min.js",
						// ":x-doc": "https://gasparesganga.com/labs/jquery-loading-overlay/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "jQuery Easy Loading",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/jquery-easy-loading/2.0.0-rc.2/jquery.loading.min.js",
						// ":x-bak": "https://cdn.staticfile.org/jquery-easy-loading/2.0.0-rc.2/jquery.loading.min.js",
						// ":x-doc": "https://carlosbonetti.github.io/jquery-loading/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "Zepto JS",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/zepto/1.2.0/zepto.min.js",
						// ":x-bak": "https://cdn.staticfile.org/zepto/1.2.0/zepto.min.js",
						// ":x-doc": "https://zeptojs.bootcss.com/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "Lodash JS",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/lodash.js/4.17.21/lodash.min.js",
						// ":x-bak": "https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js",
						// ":x-doc": "https://www.lodashjs.com/",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "Zebra Dialog JS",
						type: "text/javascript", charset: "UTF-8",
						src: "res/cdnjs.cat.net/ajax/libs/zebra_dialog/3.0.5/zebra_dialog.src.min.js",
						// ":x-bak": "https://cdn.staticfile.org/zebra_dialog/3.0.5/zebra_dialog.src.min.js",
						// ":x-doc": "https://stefangabos.github.io/Zebra_Dialog/index.html",
						// ":crossOrigin": "anonymous"
					}
				], "script", "\n" + ("\t").repeat(2));
				dynamicCreateElement([
					{
						"": "Zebra Dialog CSS",
						rel: "stylesheet", charset: "UTF-8",
						href: "res/cdnjs.cat.net/ajax/libs/zebra_dialog/3.0.5/css/classic/zebra_dialog.min.css",
						// ":x-bak": "https://cdn.staticfile.org/zebra_dialog/3.0.5/css/classic/zebra_dialog.min.css",
						// ":x-doc": "https://stefangabos.github.io/Zebra_Dialog/index.html",
						// ":crossOrigin": "anonymous"
					}/**,
					{
						"": "Zebra Dialog CSS",
						rel: "stylesheet", charset: "UTF-8",
						href: "res/cdnjs.cat.net/ajax/libs/zebra_dialog/3.0.5/css/materialize/zebra_dialog.min.css",
						// ":x-bak": "https://cdn.staticfile.org/zebra_dialog/3.0.5/css/materialize/zebra_dialog.min.css",
						// ":x-doc": "https://stefangabos.github.io/Zebra_Dialog/materialize.html",
						// ":crossOrigin": "anonymous"
					},
					{
						"": "Zebra Dialog CSS",
						rel: "stylesheet", charset: "UTF-8",
						href: "res/cdnjs.cat.net/ajax/libs/zebra_dialog/3.0.5/css/flat/zebra_dialog.min.css",
						// ":x-bak": "https://cdn.staticfile.org/zebra_dialog/3.0.5/css/flat/zebra_dialog.min.css",
						// ":x-doc": "https://stefangabos.github.io/Zebra_Dialog/flat.html",
						// ":crossOrigin": "anonymous"
					}*/
				], "link", "\n" + ("\t").repeat(2));
			})();
		}
		catch(e)
		{
			alert(e.stack);
		}
		</script>
		<script type="text/javascript" charset="UTF-8"
			src="res/js/web.tools.js"></script>
		<script type="text/javascript" charset="UTF-8"
			src="res/js/web.plugins.js"></script>
	</head>
	<body style="background-color: rgba(0, 0, 0, 0.75); color: #ffffff; font-size: 12px; opacity: 0.50;">
		<fieldset name="queslib">
			<link rel="stylesheet" charset="UTF-8"
				href="res/css/web.main.css" />
			<script type="text/javascript" charset="UTF-8"
				src="res/js/web.main.js"></script>
			<legend>
				<select style="background-color: #000000; color: #337ab7; border: 0; text-align: center; text-align-last: center; width: 100%; height: 20px;" onchange="javascript: eruda.util.$.cloneSelect.selectedIndex = this.selectedIndex; parser.api.get(this, (new Function('return ' + this.value + ';')).apply(null));" oncopy="javascript: return false;">
					<script type="text/javascript" charset="UTF-8"
						src="res/js/web.catalog.js"
						onload="javascript: catalog.init(this.closest('select'));"></script>
				</select>
			</legend>
			<hr />
			<main oncopy="javascript: self.clipboardData && setTimeout(function()
			{
				let text = clipboardData.getData('text');
				if(text)
				{
					text = text.replace(/^([0-9]{1,})\./g, '\n$1');
					clipboardData.setData('text', text);
				}
			}, 100);">
				<!--article name="chapter">
					<details open="">
						<summary name="name" oncopy="javascript: return false;">单选题〔共1题〕</summary>
						<aside name="todo">
							<center>
								<table>
									<thead>
										<tr>
											<th colspan="5"><b name="txt-title-collapse" title="收起章节" onclick="javascript: confirm(this.title + '？') &amp;&amp; this.closest('article').querySelector('details summary').click();">单选题</b></th>
										</tr>
									</thead>
									<tfoot>
										<tr>
											<th><button name="btn-choices" type="button" value="[{'name':'b7ed39f9-6df8-9ca5-1bda-e07f4f455ca3','type':'单选题'}]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, true, (this.isdo = (!this.isdo)), '选择题练习', '提交选择题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">选择题练习</button></th>
											<th><button name="btn-backfirst" title="返回首题" type="button" onclick="javascript: this.closest('article').scrollIntoView(true);" oncopy="javascript: return false;">⇧</button></th>
											<th><button name="btn-backlast" title="返回尾题" type="button" onclick="javascript: this.closest('article').scrollIntoView(false);" oncopy="javascript: return false;">⇩</button></th>
											<th><button name="btn-answers" type="button" value="[]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, false, (this.isdo = (!this.isdo)), '文字题作答', '提交文字题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">文字题作答</button></th>
										</tr>
									</tfoot>
								</table>
							</center>
						</aside>
						<aside name="questions">
							<section name="question">
								<dl name="child">
									<dt name="desc"><span>1.<small>〔单选题〕</small><big>病人最重要的主观资料是</big></span></dt>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="b7ed39f9-6df8-9ca5-1bda-e07f4f455ca3" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">A.症状</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="b7ed39f9-6df8-9ca5-1bda-e07f4f455ca3" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">B.身体评估</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="b7ed39f9-6df8-9ca5-1bda-e07f4f455ca3" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">C.健康评估记录</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="b7ed39f9-6df8-9ca5-1bda-e07f4f455ca3" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">D.超声检查</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="b7ed39f9-6df8-9ca5-1bda-e07f4f455ca3" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">E.实验室检查</span></dd>
								</dl>
							</section>
						</aside>
					</details>
				</article>
				<hr>
				<article name="chapter">
					<details>
						<summary name="name" oncopy="javascript: return false;">多选题〔共1题〕</summary>
						<aside name="todo">
							<center>
								<table>
									<thead>
										<tr>
											<th colspan="5"><b name="txt-title-collapse" title="收起章节" onclick="javascript: confirm(this.title + '？') &amp;&amp; this.closest('article').querySelector('details summary').click();">多选题</b></th>
										</tr>
									</thead>
									<tfoot>
										<tr>
											<th><button name="btn-choices" type="button" value="[{'name':'2f6c6258-d8bb-6660-b3d0-4968ee26b29a','type':'多选题'}]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, true, (this.isdo = (!this.isdo)), '选择题练习', '提交选择题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">选择题练习</button></th>
											<th><button name="btn-backfirst" title="返回首题" type="button" onclick="javascript: this.closest('article').scrollIntoView(true);" oncopy="javascript: return false;">⇧</button></th>
											<th><button name="btn-backlast" title="返回尾题" type="button" onclick="javascript: this.closest('article').scrollIntoView(false);" oncopy="javascript: return false;">⇩</button></th>
											<th><button name="btn-answers" type="button" value="[]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, false, (this.isdo = (!this.isdo)), '文字题作答', '提交文字题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">文字题作答</button></th>
										</tr>
									</tfoot>
								</table>
							</center>
						</aside>
						<aside name="questions">
							<section name="question">
								<dl name="child">
									<dt name="desc"><span>2.<small>〔多选题〕</small><big>关于主诉，正确的是</big></span></dt>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="checkbox" name="2f6c6258-d8bb-6660-b3d0-4968ee26b29a" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">A.咽痛，发热2天</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="checkbox" name="2f6c6258-d8bb-6660-b3d0-4968ee26b29a" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">B.畏寒、发热、右胸痛、咳嗽、食欲减退、头晕、乏力3天</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="checkbox" name="2f6c6258-d8bb-6660-b3d0-4968ee26b29a" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">C.活动后心悸、气促2年，下肢水肿10天</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="checkbox" name="2f6c6258-d8bb-6660-b3d0-4968ee26b29a" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">D.患糖尿病10年，多饮、多食、多尿、消瘦明显2个月</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="checkbox" name="2f6c6258-d8bb-6660-b3d0-4968ee26b29a" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">E.经检查白血病复发，要求入院化疗</span></dd>
								</dl>
							</section>
						</aside>
					</details>
				</article>
				<hr>
				<article name="chapter">
					<details>
						<summary name="name" oncopy="javascript: return false;">共用题干单选题〔共2题〕</summary>
						<aside name="todo">
							<center>
								<table>
									<thead>
										<tr>
											<th colspan="5"><b name="txt-title-collapse" title="收起章节" onclick="javascript: confirm(this.title + '？') &amp;&amp; this.closest('article').querySelector('details summary').click();">共用题干单选题</b></th>
										</tr>
									</thead>
									<tfoot>
										<tr>
											<th><button name="btn-choices" type="button" value="[{'name':'da1290aa-3e4f-6b79-3537-83a40fd1f935','type':'共用题干单选题'},{'name':'4c1ac854-c8d9-7e7d-9502-124a682964f7','type':'共用题干单选题'}]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, true, (this.isdo = (!this.isdo)), '选择题练习', '提交选择题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">选择题练习</button></th>
											<th><button name="btn-backfirst" title="返回首题" type="button" onclick="javascript: this.closest('article').scrollIntoView(true);" oncopy="javascript: return false;">⇧</button></th>
											<th><button name="btn-backlast" title="返回尾题" type="button" onclick="javascript: this.closest('article').scrollIntoView(false);" oncopy="javascript: return false;">⇩</button></th>
											<th><button name="btn-answers" type="button" value="[]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, false, (this.isdo = (!this.isdo)), '文字题作答', '提交文字题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">文字题作答</button></th>
										</tr>
									</tfoot>
								</table>
							</center>
						</aside>
						<aside name="questions">
							<section name="question">
								<dl name="title">
									<dt name="desc"><span>3.<small>〔共用题干单选题〕</small><big>病人，女性，36岁。因腰痛10天、双下肢水肿3天入院。</big></span></dt>
								</dl>
								<dl name="child">
									<dt name="desc"><span><small>（一）</small><big>评估该病人时，首先应采取的方法为</big></span></dt>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="da1290aa-3e4f-6b79-3537-83a40fd1f935" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">A.问诊</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="da1290aa-3e4f-6b79-3537-83a40fd1f935" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">B.胸腹部评估</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="da1290aa-3e4f-6b79-3537-83a40fd1f935" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">C.肾脏评估</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="da1290aa-3e4f-6b79-3537-83a40fd1f935" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">D.X线检查</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="da1290aa-3e4f-6b79-3537-83a40fd1f935" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">E.尿常规检查</span></dd>
								</dl>
								<dl name="child">
									<dt name="desc"><span><small>（二）</small><big>该病人的主诉最合适的是</big></span></dt>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="4c1ac854-c8d9-7e7d-9502-124a682964f7" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">A.腰痛10天、双下肢水肿3天</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="4c1ac854-c8d9-7e7d-9502-124a682964f7" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">B.腰痛及双下肢水肿3天</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="4c1ac854-c8d9-7e7d-9502-124a682964f7" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">C.腰痛10天并双下肢水肿3天</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="4c1ac854-c8d9-7e7d-9502-124a682964f7" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">D.腰痛10天及双下肢水肿</span></dd>
									<dd name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="4c1ac854-c8d9-7e7d-9502-124a682964f7" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">E.双下肢水肿3天、腰痛10天</span></dd>
								</dl>
							</section>
						</aside>
					</details>
				</article>
				<hr>
				<article name="chapter">
					<details>
						<summary name="name" oncopy="javascript: return false;">共用答案单选题〔共2题〕</summary>
						<aside name="todo">
							<center>
								<table>
									<thead>
										<tr>
											<th colspan="5"><b name="txt-title-collapse" title="收起章节" onclick="javascript: confirm(this.title + '？') &amp;&amp; this.closest('article').querySelector('details summary').click();">共用答案单选题</b></th>
										</tr>
									</thead>
									<tfoot>
										<tr>
											<th><button name="btn-choices" type="button" value="[{'name':'135ce3e0-3ec0-1020-2276-771842abf5e5','type':'共用答案单选题'},{'name':'e7e01679-1dc2-3be5-9dd5-3d6f971a6a52','type':'共用答案单选题'}]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, true, (this.isdo = (!this.isdo)), '选择题练习', '提交选择题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">选择题练习</button></th>
											<th><button name="btn-backfirst" title="返回首题" type="button" onclick="javascript: this.closest('article').scrollIntoView(true);" oncopy="javascript: return false;">⇧</button></th>
											<th><button name="btn-backlast" title="返回尾题" type="button" onclick="javascript: this.closest('article').scrollIntoView(false);" oncopy="javascript: return false;">⇩</button></th>
											<th><button name="btn-answers" type="button" value="[]" onclick="javascript: $.LoadingOverlay('show'); this.disabled = true; parser.api.doOrSubmit(this, false, (this.isdo = (!this.isdo)), '文字题作答', '提交文字题'); this.disabled = false; $.LoadingOverlay('hide');" oncopy="javascript: return false;">文字题作答</button></th>
										</tr>
									</tfoot>
								</table>
							</center>
						</aside>
						<aside name="questions">
							<section name="question">
								<dl name="title">
									<dt name="desc"><span>4.<small>〔共用答案单选题〕</small><big><small>（一）～（二）共用答案</small></big></span></dt>
									<dd name="option">A.弛张热</dd>
									<dd name="option">B.波状热</dd>
									<dd name="option">C.稽留热</dd>
									<dd name="option">D.间歇热</dd>
									<dd name="option">E.不规则热</dd>
								</dl>
								<dl name="child">
									<dt name="desc"><span><small>（一）</small><big>伤寒病人的热型为</big></span></dt>
									<ul>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="135ce3e0-3ec0-1020-2276-771842abf5e5" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">A</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="135ce3e0-3ec0-1020-2276-771842abf5e5" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">B</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="135ce3e0-3ec0-1020-2276-771842abf5e5" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">C</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="135ce3e0-3ec0-1020-2276-771842abf5e5" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">D</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="135ce3e0-3ec0-1020-2276-771842abf5e5" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">E</span></li>
									</ul>
								</dl>
								<dl name="child">
									<dt name="desc"><span><small>（二）</small><big>败血症病人的热型为</big></span></dt>
									<ul>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="e7e01679-1dc2-3be5-9dd5-3d6f971a6a52" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="true" checked="" disabled="">A</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="e7e01679-1dc2-3be5-9dd5-3d6f971a6a52" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">B</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="e7e01679-1dc2-3be5-9dd5-3d6f971a6a52" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">C</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="e7e01679-1dc2-3be5-9dd5-3d6f971a6a52" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">D</span></li>
										<li name="option" onclick="javascript: this.querySelector('input').onclick();"><span class="option"><input type="radio" name="e7e01679-1dc2-3be5-9dd5-3d6f971a6a52" onclick="javascript: this.disabled || (this.checked = !this.checked);" value="false" disabled="">E</span></li>
									</ul>
								</dl>
							</section>
						</aside>
					</details>
				</article-->
			</main>
			<hr />
			<div style="text-align: center; margin: 0 auto; font-size: 10px;">
				<style type="text/css">
				#cnzz_stat_icon_1261167642 a, a.la-widget-container
				{
					text-decoration: none;
				}
				</style>
				<span id="cnzz_stat_icon_1261167642"></span>
				<script type="text/javascript" charset="UTF-8"
					src="https://s11.cnzz.com/z_stat.php?id=1261167642&online=1&show=line"
					onload="javascript: parser.api.cnzzPush(['_setCustomVar', '浏览器标识', navigator.userAgent, 0]); parser.api.cnzzPush(['_trackEvent', '题库', '浏览器标识', navigator.userAgent, 0, 'queslib']);"></script>
				<br />
				<script id="LA_COLLECT" type="text/javascript" charset="UTF-8" src="https://sdk.51.la/js-sdk-pro.min.js" onload="javascript: self.LA && LA.init({id: 'JeaQ7widyBhiJfwS', ck: 'JeaQ7widyBhiJfwS'});"></script><script id="LA-DATA-WIDGET" type="text/javascript" charset="UTF-8" src="https://v6-widget.51.la/v6/JeaQ7widyBhiJfwS/quote.js?theme=#1690FF,#333333,#1690FF,#1690FF,#FFFFFF,#1690FF,10&f=10&display=0,1,1,1,1,1,1,1" onload="javascript: this.la = document.querySelector('span.la-widget.la-data-widget__container'); this.la.outerHTML = `<a class='la-widget-container' href='https://v6.51.la/s/49r3cCTTzEv9Gdy' target='_blank'>` + this.la.outerHTML + '</a>';" crossorigin="anonymous"></script>
				<script type="text/javascript">document.write('<script type="text/javascript" charset="UTF-8" src="https://us2.centcount.com/ca.php?sid=2204110000001001&ct=' + (new Date).getTime() + "&HTTP_REFERER=" + encodeURIComponent(location.href) + `" onload="javascript:;"><\/script>`);/** <a href="http://www.centcount.com/visitor.php?id=2204110000001&siteid=2204110000001001" target="_blank"></a> */</script>
			</div>
			<hr />
		</fieldset>
	</body>
</html>