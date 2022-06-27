(function()
{
	const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
	const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
	const concat = Function.bind.call(Function.call, Array.prototype.concat);
	const keys = Reflect.ownKeys;
	
	if(!Object.values)
	{
		Object.values = function values(O)
		{
			return reduce(keys(O), function(v, k)
			{
				return concat(v, typeof(k === "string") && isEnumerable(O, k) ? [O[k]] : []);
			}, []);
		};
	}
	
	if(!Object.entries)
	{
		Object.entries = function entries(O)
		{
			return reduce(keys(O), function(e, k)
			{
				concat(e, typeof(k === "string") && isEnumerable(O, k) ? [[k, O[k]]] : []);
			}, []);
		};
	}
	
	if(!Object.fromEntries)
	{
		Object.fromEntries = function fromEntries(iter)
		{
			const obj = {};
			for(const pair of iter)
			{
				if(Object(pair) !== pair)
				{
					throw new TypeError("iterable for fromEntries should yield objects");
				}
				// Consistency with Map: contract is that entry has "0" and "1" keys, not that it is an array or iterable.
				const {"0": key, "1": val} = pair;
				Object.defineProperty(obj, key, {
					configurable: true,
					enumerable: true,
					writable: true,
					value: val
				});
			}
			return obj;
		};
	}
})();