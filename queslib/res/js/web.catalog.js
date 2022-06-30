catalog.updateAttr = function($obj, $el)
{
	if(Object.prototype.toString.call($obj) === "[object Object]")
	{
		for(let [k, v] of Object.entries($obj))
		{
			$el.setAttribute(k, v);
		}
	}
};
catalog.updateProp = function($obj, $el)
{
	if(Object.prototype.toString.call($obj) === "[object Object]")
	{
		for(let [k, v] of Object.entries($obj))
		{
			$el[k] = v;
		}
	}
};
catalog.init = function($select)
{
	try
	{
		sessionStorage.getItem("queslib-check-browser") || (/(iPhone|iPad|iPod|iOS)/i).test(navigator.userAgent) && ($select.style.display = "none") && (new $.Zebra_Dialog("网站未适配苹果浏览器，如遇问题请反馈给开发者！", {buttons: ["知道了"], modal: false})) && sessionStorage.setItem("queslib-check-browser", "ok");
		sessionStorage.getItem("queslib-check-ie") || ((!+[1,]) || self.ActiveXObject || self.attachEvent) && (new $.Zebra_Dialog("不推荐使用IE浏览器访问，如遇问题请更换其他浏览器！", {buttons: ["知道了"], modal: false})) && sessionStorage.setItem("queslib-check-ie", "ok");
	}
	catch(e)
	{
		console.warn(e);
	}
	// 清空选项（包括空白节点）
	while($select.childNodes.length)
	{
		$select.removeChild($select.childNodes[0]);
	}
	// 重新添加选项
	catalog.forEach(function($group, $i, $ars)
	{
		console.log("群组", $group.optname);
		$select.append(document.createTextNode("\n" + ("\t").repeat(5)));
		let group = document.createElement("optgroup");
		($group.optname != null) && (group.label = $group.optname);
		// 更新群组的属性和特性
		catalog.updateAttr($group.attr, group), catalog.updateProp($group.prop, group);
		$group.options && $group.options.forEach(function($opt, $i2, $ars2)
		{
			console.log("群组选项", $opt.name);
			group.append(document.createTextNode("\n" + ("\t").repeat(6)));
			let opt = document.createElement("option");
			($opt.name != null) && (opt.label = $opt.name);
			// 更新选项的属性和特性
			catalog.updateAttr($opt.attr, opt), catalog.updateProp($opt.prop, opt);
			$opt.vals && (opt.value = JSON.stringify($opt.vals, null, 0));
			group.append(opt);
			if($i2 == ($ars2.length - 1))
			{
				group.append(document.createTextNode("\n" + ("\t").repeat(5)));
			}
		});
		$select.append(group);
		if($i == ($ars.length - 1))
		{
			// $select.append(document.createTextNode("\n" + ("\t").repeat(4)));
		}
	});
};