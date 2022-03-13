/**
 * mtr
 * https://www.itmtr.cn
 * @param {Object} l 元素选择器 #id .claas 用于定位树
 * 用于模糊查询ztree节点
 */
var MtrSearchZTree = function(l){
	
	var location = l || ".ztree";
	
	//所有元素
	var nodesAll = {};
	
	//需要显示的元素
	var showNodesAll = {};
	
	//当前输入的关键字
	var keywords = "";
	
	//查找匹配的节点
	function filterFunc(node) {
		if(node.name.indexOf(keywords) != -1){
			return true;
		} else{
			return false;
		}
	}
	
	// 查找父级
    function findParent(ztreeObj, node, showNodes) {
        ztreeObj.expandNode(node, true, false, false);
        var pNode = node.getParentNode();
        if (pNode != null) {
            showNodes.push(pNode);
            findParent(ztreeObj, pNode, showNodes);
        }
    }
	
	//给绑定事件
	function bindingZTree(id){
		$("#"+id+"Keyword").on("input change",function(e){
			keywords = $(this).val();
			var ztreeObj = $.fn.zTree.getZTreeObj(id);
			if(keywords){
				var showNodes = showNodesAll[id];
				//隐藏所有节点，注意：使用hideNodes（）方法时需要引包jquery.ztree.exhide-3.5.min.js
				ztreeObj.hideNodes(nodesAll[id]);
				//获取不符合条件的子父结点
				showNodes = ztreeObj.getNodesByFilter(filterFunc);
				//将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。 也就是为了返回子节点
				showNodes = ztreeObj.transformToArray(showNodes);
				//查找父节点
				for (var n in showNodes) {
					if (showNodes.hasOwnProperty(n)){
						findParent(ztreeObj, showNodes[n],showNodes);
					}
				}
				//显示匹配的节点，注意：使用showNodes（）方法时需要引包jquery.ztree.exhide-3.5.min.js
				ztreeObj.showNodes(showNodes);
				//把当前显示的的元素保存
				showNodesAll[id] = showNodes;
			}else{
				//显示所有节点
				ztreeObj.showNodes(nodesAll[id]);
				//折叠所有节点
				ztreeObj.expandAll(false);
			}
		});
	}
	
	function setAllNodes(id){
		//保存全部节点
		var ztreeObj = $.fn.zTree.getZTreeObj(id);
		var nodes = ztreeObj.getNodes();
		nodesAll[id] = ztreeObj.transformToArray(nodes);
		//初始为空
		showNodesAll[id] = [];
	}
	
	function initSearchZTree(){
		var ztrees = $(location);
		for(let i = 0; i < ztrees.length; i++){
			var ztree = ztrees.eq(i);
			var ztreeId = ztree.attr("id");
			//删除原有的输入框
			ztree.children("input").remove();
			//插入input输入框
			var html =  '<input id="'+ztreeId+'Keyword" type="text" class="form-control" placeholder="请输入关键字...">';
			ztree.prepend(html);
			//初始化节点保存
			setAllNodes(ztreeId);
			//绑定事件
			bindingZTree(ztreeId);
		}
	}
	
	//初始化
	initSearchZTree();
	
	return {
		getshowNodesById : function(id){
			if(id){
				return showNodesAll[id];
			}
		},
		getshowNodes(){
			return showNodesAll;
		}
	}
}