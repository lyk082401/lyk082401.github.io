(function()
{
	/**
		* https://tc39.es/
		* https://github.com/tc39
	*/
	
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
	
	if (typeof Promise !== 'function') {
	throw new TypeError('A global Promise is required');
}

if (typeof Promise.try !== 'function') {
	Promise.try = {
		try(func) {
			if (typeof this !== 'function') {
				throw new TypeError('Receiver must be a constructor');
			}
			return new this(function (resolve) {
				resolve(func());
			});
		}
	}.try;
}
	
	if (typeof Promise !== 'function') {
	throw new TypeError('A global Promise is required');
}

if (typeof Promise.prototype.finally !== 'function') {
	var speciesConstructor = function (O, defaultConstructor) {
		if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (!C || (typeof C !== 'object' && typeof C !== 'function')) {
			throw new TypeError('O.constructor is not an Object');
		}
		var S = typeof Symbol === 'function' && typeof Symbol.species === 'symbol' ? C[Symbol.species] : undefined;
		if (S == null) {
			return defaultConstructor;
		}
		if (typeof S === 'function' && S.prototype) {
			return S;
		}
		throw new TypeError('no constructor found');
	};

	var shim = {
		finally(onFinally) {
			var promise = this;
			if (typeof promise !== 'object' || promise === null) {
				throw new TypeError('"this" value is not an Object');
			}
			var C = speciesConstructor(promise, Promise); // throws if SpeciesConstructor throws
			if (typeof onFinally !== 'function') {
				return Promise.prototype.then.call(promise, onFinally, onFinally);
			}
			return Promise.prototype.then.call(
				promise,
				x => new C(resolve => resolve(onFinally())).then(() => x),
				e => new C(resolve => resolve(onFinally())).then(() => { throw e; })
			);
		}
	};
	Object.defineProperty(Promise.prototype, 'finally', { configurable: true, writable: true, value: shim.finally });
}
	
})();