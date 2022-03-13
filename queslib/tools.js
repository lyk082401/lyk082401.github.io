(function(f, g)
{
	// https://cdnjs.cat.net/ajax/libs/markdown-it/12.3.2/markdown-it.min.js
	// https://cdnjs.cat.net/ajax/libs/highlight.js/11.5.0/highlight.min.js
	g.tools = f.bind(f)(g);
	console.info(Dexie)
})(function(self)
{
	/**
	tools.idb("testdb2", ["tab1", "tab2", "tab3"], 1).tab("tab1").then(function([store, e])
	{
		console.log(arguments[0]);
		Object.create({
			// 获取数据
			get: function()
			{
				store.get("qq").then(function([data, e])
				{
					console.log(arguments[0]);
				}, console.warn);
			},
			// 添加数据
			add: function()
			{
				store.add("qq", "460437762").then(function([data, e])
				{
					console.log(arguments[0]);
				}, console.warn);
			},
			// 修改数据
			put: function()
			{
				store.put("qq", "138636138").then(function([data, e])
				{
					console.log(arguments[0]);
				}, console.warn);
			},
			// 删除数据
			del: function()
			{
				store.del("qq").then(function([data, e])
				{
					console.log(arguments[0]);
				}, console.warn);
			}
		}).add();
	}, console.warn);
	*/
	// Indexed DB
	this.idb = function($Db = undefined, $Tabs = [undefined], $Ver = 1)
	{
		// https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB https://demo.agektmr.com/storage/
		let dbapi = {
			// 选择表
			tab: function($Tab = undefined)
			{
				return new Promise(function($Resolve, $Reject)
				{
					let dbobj = null;
					let dbtable = String($Tab);
					let dbtables = Array.isArray($Tabs) ? $Tabs : [$Tabs];
					let dbstore = {
						main: function(mode, method, args)
						{
							let params = Array.prototype.slice.call(arguments, 2);
							return new Promise(function(resolve, reject)
							{
								let t = dbobj.transaction(dbtables, mode);
								t.oncomplete = t.onerror = t.onabort = function(e)
								{
									// (IDBTransaction)e.target
									(e.type.includes("complete") ? console.info : console.warn)(`[db][${method}][transaction]`, e.type, e.target, e);
									e.type.includes("complete") || reject([e.target.error, e]);
								};
								let s = t.objectStore(dbtable);
								let r = s[method].apply(s, params);
								r.onsuccess = r.onerror = function(e)
								{
									// (IDBRequest)e.target
									(e.type.includes("success") ? console.info : console.warn)(`[db][${method}][transaction][objectStore]`, e.type, e.target, e);
									e.type.includes("success") ? resolve([e.target.result, e]) : reject([e.target.error, e]);
								};
							});
						},
						// 获取数据
						get: function(key)
						{
							return this.main("readonly", "get", key);
						},
						// 添加数据
						add: function(key, val)
						{
							return this.main("readwrite", "add", val, key);
						},
						// 修改数据
						put: function(key, val)
						{
							return this.main("readwrite", "put", val, key);
						},
						// 删除数据
						del: function(key)
						{
							return this.main("readwrite", "delete", key);
						},
						// 关闭数据库
						close: function()
						{
							return dbobj.close();
						}
					};
					let dbimpl = null;
					try
					{
						dbimpl = indexedDB.open($Db, $Ver);
					}
					catch(e)
					{
						$Reject([e, null]);
					}
					dbimpl.onupgradeneeded = dbimpl.onblocked = dbimpl.onsuccess = dbimpl.onerror = function(e)
					{
						// (IDBOpenDBRequest)e.target
						(Array.from(["upgradeneeded", "success"]).includes(e.type) ? console.info : console.warn)(`[db][impl]`, e.type, e.target, e);
						e.target.result && (dbobj = e.target.result);
						e.target.result.onversionchange = e.target.result.onclose = e.target.result.onabort = e.target.result.onerror = function(e)
						{
							(["versionchange", "close"].includes(e.type) ? console.info : console.warn)(`[db][impl][database]`, e.type, e.target, e);
						};
						let retobj = {
							status: e.target.readyState,
							db: e.target.result,
							name: e.target.result.name,
							impl: e.target,
							table: dbtable,
							tables: e.target.result.objectStoreNames,
							version: e.target.result.version
						};
						if(e.type.includes("upgradeneeded"))
						{
							dbtables.forEach(function(tab, i, arrs)
							{
								// 不存在其中任意一个存储表时，即执行创建（后续只可通过变更版本号来更新它，否则会出现异常）
								if(!e.target.result.objectStoreNames.contains(String(tab)))
								{
									try
									{
										// (IDBObjectStore)os
										let os = e.target.result.createObjectStore(String(tab)/**, {
											autoIncrement: true,
											keyPath: "id"
										}*/);
										console.info(`[db][impl][createObjectStore]`, os.name, os);
									}
									catch(ex)
									{
										$Reject([ex, e]);
									}
								}
							});
							retobj = Object.assign(retobj, {
								oldVersion: e.oldVersion,
								newVersion: e.newVersion,
								dataLoss: e.dataLoss,
								dataLossMessage: e.dataLossMessage,
								tables: e.target.result.objectStoreNames
							});
							(e.dataLoss && (e.dataLoss !== "none")) && console.warn(`[db][impl][dataLoss]`, retobj);
						}
						else
						{
							if(e.type.includes("success"))
							{
								$Resolve([Object.assign(dbstore, retobj), e]);
							}
							else
							{
								$Reject([e.target.error, e]);
							}
						}
					};
				});
			}
		};
		// 获取全部表
		dbapi.tab.list = function(){};
		// 删除表
		dbapi.tab.del = function(tabName){};
		return dbapi;
	};
	// 获取全部数据库
	this.idb.list = function(){};
	// 删除数据库
	this.idb.del = function(dbName){};
	
	// @Deprecated Web SQL 已弃用
	this.sql = function(sqlName = undefined, ver = "1.0.0", desc = "Web SQL", size = 128 * 1024 * 1024, callback)
	{
		// https://www.runoob.com/html/html5-web-sql.html
		let sqlimpl = openDatabase(sqlName, ver, desc, size, callback || function(sql)
		{
			sql.changeVersion(sql.version, "1.0.1", function(t)
			{
				t.executeSql("CREATE TABLE TestTab (id, name)");
			}, console.warn);
		});
		return sqlimpl;
	};
	
	this.browser = {};
	this.browser.storage = function()
	{
		return new Promise(function(resolve, reject)
		{
			navigator.storage.estimate().then(function(estimate)
			{
				resolve(estimate);
			}, reject);
		});
	};
	
	function arrayBufferToBlob(buffer, type) {
  return new Blob([buffer], {type: type});
}

function blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      resolve(reader.result);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(blob);
  });
}
	return this;
}, this || self);

$.await || ($.await = function(time)
{
	return $.Deferred(function(d)
	{
		setTimeout(d.resolve, time);
	});
});

$.async || ($.async = function(fn, time)
{
	let d = $.Deferred();
	setTimeout(function()
	{
		d.resolve(fn && fn.call && fn());
	}, time || 0);
	return d.promise();
});

self.console && Object.entries({
	log: console.log,
	info: console.info,
	warn: console.warn,
	error: console.error,
	debug: console.debug
}).forEach(function(entries, i, allentries)
{
	console[entries[0]] = function()
	{
		console.moments = function times(time = +new Date())
		{
			let date = new Date(time - new Date().getTimezoneOffset() * 60 * 1000);
			return date.toJSON().slice(0, 19).replace("T", " ").concat(" ").concat(String(time).slice(-3));
		};
		entries[1].apply(console, ["[" + entries[0].toUpperCase() + "][" + console.moments().split(/-\d+\s+/)[1] + "][" + String(arguments.length) + "]"].concat(Array.prototype.slice.call(arguments)));
	};
});
/**
$.jQueryDeferredOld = $.Deferred.prototype.constructor;

$.jQueryDeferredOld.invokeStacks = [];

$.Deferred = function(resolver)
{
	let args = arguments;
	try
	{
		throw new Error();
	}
	catch(e)
	{
		$.jQueryDeferredOld.invokeStacks.push({args: args, stack: e});
	}
	try
	{
		if((!args.length && (resolver == null)) || resolver.call)
		{
			return $.jQueryDeferredOld.apply($.jQueryDeferredOld, args);
		}
		else
		{
			return $.jQueryDeferredOld.apply($.jQueryDeferredOld, [function(d)
			{
				setTimeout(function()
				{
					d.resolve.apply(d, args);
				});
				return d.promise();
			}].concat(Array.prototype.slice.call(args, 1)));
		}
	}
	catch(e)
	{
		$.jQueryDeferredOld.invokeStacks.push({args: arguments, stack: e, msg: "hook `$.Deferred` failure"});
		return $.jQueryDeferredOld.apply($.jQueryDeferredOld, args);
	}
};

$.Deferred.prototype = Object.assign($.jQueryDeferredOld, $.jQueryDeferredOld.prototype, $.jQueryDeferredOld.__proto__);
*/

/**

let obj = $.Deferred().resolveWith(null, ["成功","解决"])
obj.then(console.log, console.warn, console.info)
let obj2 = $.Deferred().rejectWith(null, ["失败","解决"])
obj2.then(console.log, console.warn, console.info)
console.log(obj instanceof obj2.prototype.constructor)
*/
/*class D extends $.Deferred
{
	constructor(resolver)
	{
		super(resolver)
	}
}
new D()
.then(console.log, console.warn, console.info)

*/
$.Deferred.isIterable = function(obj)
{
	return (obj != null) && (typeof(obj[Symbol.iterator]) === "function");
};

$.Deferred.resolve = function(val)
{
	// $.Deferred.resolve("返回参数1", "返回参数2", "返回参数n");
	// $.Deferred.resolve("function(函数调用结果)", "返回参数2", "返回参数n");
	let d = $.Deferred();
	let args = arguments;
	setTimeout(function()
	{
		/**if(val instanceof Promise) {}
		else if(val instanceof $.Deferred) {}
		else */if(typeof(val) === "function")
		{
			let ret = val.apply(val, Array.prototype.slice.call(args, 1));
			d.resolve.apply(d, [ret].concat(Array.prototype.slice.call(args, 1)));
		}
		else
		{
			d.resolve.apply(d, args);
		}
	});
	return d.promise();
};

$.Deferred.reject = function(val)
{
	// $.Deferred.reject("返回参数1", "返回参数2", "返回参数n");
	let d = $.Deferred();
	let args = arguments;
	setTimeout(function()
	{
		/**if(val instanceof Promise) {}
		else if(val instanceof $.Deferred) {}
		else */if(typeof(val) === "function")
		{
			let ret = val.apply(val, Array.prototype.slice.call(args, 1));
			d.reject.apply(d, [ret].concat(Array.prototype.slice.call(args, 1)));
		}
		else
		{
			d.reject.apply(d, args);
		}
	});
	return d.promise();
};

$.Deferred.all = function(options)
{
	/** https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
	返回值
		如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise。
		如果传入的参数不包含任何 promise，则返回一个异步完成（asynchronously resolved） Promise。注意：Google Chrome 58 在这种情况下返回一个已完成（already resolved）状态的 Promise。
		其它情况下返回一个处理中（pending）的Promise。这个返回的 promise 之后会在所有的 promise 都完成或有一个 promise 失败时异步地变为完成或失败。 见下方关于“Promise.all 的异步或同步”示例。返回值将会按照参数内的 promise 顺序排列，而不是由调用 promise 的完成顺序决定。
	说明
		此方法在集合多个 promise 的返回结果时很有用。
		完成（Fulfillment）：
			如果传入的可迭代对象为空，Promise.all 会同步地返回一个已完成（resolved）状态的promise。
			如果所有传入的 promise 都变为完成状态，或者传入的可迭代对象内没有 promise，Promise.all 返回的 promise 异步地变为完成。
			在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值（也包括非 promise 值）。
		失败/拒绝（Rejection）：
			如果传入的 promise 中有一个失败（rejected），Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成。
	*/
	let d = $.Deferred();
	let slice = Array.prototype.slice;
	let vals = new Array((Array.isArray(options) ? options : (options = [])).length);
	let num = 0;
	slice.call(options).forEach(function(deferred, i, arrs)
	{
		$.when(deferred).done(function()
		{
			num++;
			vals[i] = arguments;
			(num == arrs.length) && d.resolve.apply(d, vals);
		}).fail(function()
		{
			d.reject.apply(d, slice.call(arguments));
		}).progress(function()
		{
			d.notify(slice.call(arguments));
		});
	});
	return d.promise();
};

$.Deferred.race = function(options)
{
	/** https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
	返回值
		一个待定的 Promise 只要给定的迭代中的一个promise解决或拒绝，就采用第一个promise的值作为它的值，从而异步地解析或拒绝（一旦堆栈为空）。
	描述
		race 函数返回一个 Promise，它将与第一个传递的 promise 相同的完成方式被完成。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个完成的方式是两个中的哪个。
		如果传的迭代是空的，则返回的 promise 将永远等待。
		如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 Promise.race 将解析为迭代中找到的第一个值。
	*/
	let d = $.Deferred();
	let slice = Array.prototype.slice;
	slice.call(Array.isArray(options) ? options : (options = [])).forEach(function(deferred, i, arrs)
	{
		$.when(deferred).done(function()
		{
			d.resolve.apply(d, slice.call(arguments));
		}).fail(function()
		{
			d.reject.apply(d, slice.call(arguments));
		}).progress(function()
		{
			d.notify(slice.call(arguments));
		});
	});
	return d.promise();
};

$.Deferred.allSettled = function(options)
{
	/** https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
	返回值
		一旦所指定的 promises 集合中每一个 promise 已经完成，无论是成功的达成或被拒绝，未决议的 Promise将被异步完成。那时，所返回的 promise 的处理器将传入一个数组作为输入，该数组包含原始 promises 集中每个 promise 的结果。
		对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。如果值为 rejected，则存在一个 reason 。value（或 reason ）反映了每个 promise 决议（或拒绝）的值。
	*/
	let d = $.Deferred();
	let slice = Array.prototype.slice;
	let vals = new Array((Array.isArray(options) ? options : (options = [])).length);
	let handle = function(ok, i, status, args, deferred)
	{
		let o = {status: status, state: deferred && deferred.state && deferred.state()};
		o[ok ? "value" : "reason"] = args;
		vals[i] = o;
		(vals.length == options.length) && d.resolve.apply(d, vals);
	};
	slice.call(options).forEach(function(deferred, i, arrs)
	{
		$.when(deferred).done(function()
		{
			handle(true, i, "fulfilled", arguments, deferred);
		}).fail(function()
		{
			handle(false, i, "rejected", arguments, deferred);
		}).progress(function()
		{
			d.notify(slice.call(arguments));
		});
	});
	return d.promise();
};

$.Deferred.any = function(options)
{
	/** https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
	* 任何一个 resolve 即返回结果
	返回值
		如果传入的参数是一个空的可迭代对象，则返回一个 已失败（already rejected） 状态的 Promise。
		如果传入的参数不包含任何 promise，则返回一个 异步完成 （asynchronously resolved）的 Promise。
		其他情况下都会返回一个处理中（pending） 的 Promise。 只要传入的迭代对象中的任何一个 promise 变成成功（resolve）状态，或者其中的所有的 promises 都失败，那么返回的 promise 就会 异步地（当调用栈为空时） 变成成功/失败（resolved/reject）状态。
	说明
		这个方法用于返回第一个成功的 promise 。只要有一个 promise 成功此方法就会终止，它不会等待其他的 promise 全部完成。
	*/
	options = arguments.length ? (Array.isArray(options) ? options : [options]) : [];
	let d = $.Deferred();
	let slice = Array.prototype.slice;
	let vals = new Array(options.length);
	let num = 0;
	slice.call(options).forEach(function(deferred, i, arrs)
	{
		$.when(deferred).then(function()
		{
			d.resolve.apply(d, slice.call(arguments));
		}, function()
		{
			num++;
			vals[i] = arguments;
			(num == arrs.length) && d.reject.call(d, new AggregateError(vals, "All promises were rejected"));
		}, function()
		{
			d.notify(slice.call(arguments));
		});
	});
	return (options.length ? d : $.Deferred(function(D)
	{
		// 空迭代对象的处理
		D.reject.call(D, new AggregateError(options, "All promises were rejected"));
	})).promise();
};