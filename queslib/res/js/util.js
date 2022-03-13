// Built by eustia.
(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    } else if (typeof module === 'object' && module.exports)
    {
        module.exports = factory();
    } else { root._ = factory(); }
}(this, function ()
{
    /* eslint-disable */

    var _ = {};

    if (typeof window === 'object' && window._) _ = window._;

    /* ------------------------------ average ------------------------------ */

    var average = _.average = (function (exports) {
        /* Get average value of given numbers.
         *
         * |Name   |Desc                |
         * |-------|--------------------|
         * |numbers|Numbers to calculate|
         * |return |Average value       |
         */

        /* example
         * average(5, 3, 1); // -> 3
         */

        /* typescript
         * export declare function average(...numbers: number[]): number;
         */
        exports = function() {
            var arr = arguments;
            var sum = 0;
            var len = arr.length;

            for (var i = 0; i < len; i++) {
                sum += arr[i];
            }

            return sum / len;
        };

        return exports;
    })({});

    /* ------------------------------ toStr ------------------------------ */

    var toStr = _.toStr = (function (exports) {
        /* Convert value to a string.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |val   |Value to convert|
         * |return|Result string   |
         */

        /* example
         * toStr(null); // -> ''
         * toStr(1); // -> '1'
         * toStr(false); // -> 'false'
         * toStr([1, 2, 3]); // -> '1,2,3'
         */

        /* typescript
         * export declare function toStr(val: any): string;
         */
        exports = function(val) {
            return val == null ? '' : val.toString();
        };

        return exports;
    })({});

    /* ------------------------------ types ------------------------------ */

    var types = _.types = (function (exports) {
        /* Used for typescript definitions only.
         */

        /* typescript
         * export declare namespace types {
         *     interface Collection<T> {}
         *     interface List<T> extends Collection<T> {
         *         [index: number]: T;
         *         length: number;
         *     }
         *     interface ListIterator<T, TResult> {
         *         (value: T, index: number, list: List<T>): TResult;
         *     }
         *     interface Dictionary<T> extends Collection<T> {
         *         [index: string]: T;
         *     }
         *     interface ObjectIterator<T, TResult> {
         *         (element: T, key: string, list: Dictionary<T>): TResult;
         *     }
         *     interface MemoIterator<T, TResult> {
         *         (prev: TResult, curr: T, index: number, list: List<T>): TResult;
         *     }
         *     interface MemoObjectIterator<T, TResult> {
         *         (prev: TResult, curr: T, key: string, list: Dictionary<T>): TResult;
         *     }
         *     type Fn<T> = (...args: any[]) => T;
         *     type AnyFn = Fn<any>;
         *     type PlainObj<T> = { [name: string]: T };
         * }
         * export declare const types: {};
         */
        exports = {};

        return exports;
    })({});

    /* ------------------------------ fnv1a ------------------------------ */

    var fnv1a = _.fnv1a = (function (exports) {
        /* Simple FNV-1a implementation.
         *
         * |Name  |Desc          |
         * |------|--------------|
         * |str   |String to hash|
         * |return|Hast result   |
         */

        /* example
         * fnv1a('test'); // -> 2949673445
         */

        /* typescript
         * export declare function fnv1a(str: string): number;
         */
        // https://github.com/schwarzkopfb/fnv1a
        // http://isthe.com/chongo/tech/comp/fnv
        var BASE = 0x811c9dc5;

        exports = function(str) {
            var ret = BASE;

            for (var i = 0, len = str.length; i < len; i++) {
                ret ^= str.charCodeAt(i);
                ret += (ret << 1) + (ret << 4) + (ret << 7) + (ret << 8) + (ret << 24);
            }

            return ret >>> 0;
        };

        return exports;
    })({});

    /* ------------------------------ strHash ------------------------------ */

    var strHash = _.strHash = (function (exports) {
        /* String hash function using djb2.
         *
         * |Name  |Desc          |
         * |------|--------------|
         * |str   |String to hash|
         * |return|Hash result   |
         */

        /* example
         * strHash('test'); // -> 2090770981
         */

        /* typescript
         * export declare function strHash(str: string): number;
         */
        exports = function(str) {
            var hash = 5381;
            var i = str.length;

            while (i) {
                hash = (hash << 5) + hash + str.charCodeAt(--i);
            }

            return hash >>> 0; // Make sure it's always positive.
        };

        return exports;
    })({});

    /* ------------------------------ lowerCase ------------------------------ */

    var lowerCase = _.lowerCase = (function (exports) {
        /* Convert string to lower case.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to convert |
         * |return|Lower cased string|
         */

        /* example
         * lowerCase('TEST'); // -> 'test'
         */

        /* typescript
         * export declare function lowerCase(str: string): string;
         */

        /* dependencies
         * toStr 
         */

        exports = function(str) {
            return toStr(str).toLocaleLowerCase();
        };

        return exports;
    })({});

    /* ------------------------------ rgbToHsl ------------------------------ */

    var rgbToHsl = _.rgbToHsl = (function (exports) {
        /* Convert rgb to hsl.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |rgb   |Rgb values|
         * |return|Hsl values|
         */

        /* example
         * rgbToHsl([52, 203, 165, 0.8]); // -> [165, 59, 50, 0.8]
         */

        /* typescript
         * export declare function rgbToHsl(rgb: number[]): number[];
         */
        exports = function(rgb) {
            var r = rgb[0] / 255;
            var g = rgb[1] / 255;
            var b = rgb[2] / 255;
            var min = mMin(r, g, b);
            var max = mMax(r, g, b);
            var delta = max - min;
            var h;
            var s;

            if (max === min) {
                h = 0;
            } else if (r === max) {
                h = (g - b) / delta;
            } else if (g === max) {
                h = 2 + (b - r) / delta;
            } else {
                h = 4 + (r - g) / delta;
            }

            h = mMin(h * 60, 360);
            if (h < 0) h += 360;
            var l = (min + max) / 2;

            if (max === min) {
                s = 0;
            } else if (l <= 0.5) {
                s = delta / (max + min);
            } else {
                s = delta / (2 - max - min);
            }

            var ret = [round(h), round(s * 100), round(l * 100)];
            if (rgb[3]) ret[3] = rgb[3];
            return ret;
        };

        var mMin = Math.min;
        var mMax = Math.max;
        var round = Math.round;

        return exports;
    })({});

    /* ------------------------------ hslToRgb ------------------------------ */

    var hslToRgb = _.hslToRgb = (function (exports) {
        /* Convert hsl to rgb.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |hsl   |Hsl values|
         * |return|Rgb values|
         */

        /* example
         * hslToRgb([165, 59, 50, 0.8]); // -> [52, 203, 165, 0.8]
         */

        /* typescript
         * export declare function hslToRgb(hsl: number[]): number[];
         */
        exports = function(hsl) {
            var h = hsl[0] / 360;
            var s = hsl[1] / 100;
            var l = hsl[2] / 100;
            var ret = [];
            var t2;
            var t3;
            var val;
            if (hsl[3]) ret[3] = hsl[3];

            if (s === 0) {
                val = round(l * 255);
                ret[0] = ret[1] = ret[2] = val;
                return ret;
            }

            if (l < 0.5) {
                t2 = l * (1 + s);
            } else {
                t2 = l + s - l * s;
            }

            var t1 = 2 * l - t2;

            for (var i = 0; i < 3; i++) {
                t3 = h + (1 / 3) * -(i - 1);
                if (t3 < 0) t3++;
                if (t3 > 1) t3--;

                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                } else if (2 * t3 < 1) {
                    val = t2;
                } else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                } else {
                    val = t1;
                }

                ret[i] = round(val * 255);
            }

            return ret;
        };

        var round = Math.round;

        return exports;
    })({});

    /* ------------------------------ uniqId ------------------------------ */

    var uniqId = _.uniqId = (function (exports) {
        /* Generate a globally-unique id.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |prefix|Id prefix         |
         * |return|Globally-unique id|
         */

        /* example
         * uniqId('eustia_'); // -> 'eustia_xxx'
         */

        /* typescript
         * export declare function uniqId(prefix?: string): string;
         */
        var idCounter = 0;

        exports = function(prefix) {
            var id = ++idCounter + '';
            return prefix ? prefix + id : id;
        };

        return exports;
    })({});

    /* ------------------------------ has ------------------------------ */

    var has = _.has = (function (exports) {
        /* Checks if key is a direct property.
         *
         * |Name  |Desc                            |
         * |------|--------------------------------|
         * |obj   |Object to query                 |
         * |key   |Path to check                   |
         * |return|True if key is a direct property|
         */

        /* example
         * has({ one: 1 }, 'one'); // -> true
         */

        /* typescript
         * export declare function has(obj: {}, key: string): boolean;
         */
        var hasOwnProp = Object.prototype.hasOwnProperty;

        exports = function(obj, key) {
            return hasOwnProp.call(obj, key);
        };

        return exports;
    })({});

    /* ------------------------------ keys ------------------------------ */

    var keys = _.keys = (function (exports) {
        /* Create an array of the own enumerable property names of object.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |obj   |Object to query        |
         * |return|Array of property names|
         */

        /* example
         * keys({ a: 1 }); // -> ['a']
         */

        /* typescript
         * export declare function keys(obj: any): string[];
         */

        /* dependencies
         * has 
         */

        if (Object.keys && !false) {
            exports = Object.keys;
        } else {
            exports = function(obj) {
                var ret = [];

                for (var key in obj) {
                    if (has(obj, key)) ret.push(key);
                }

                return ret;
            };
        }

        return exports;
    })({});

    /* ------------------------------ slice ------------------------------ */

    var slice = _.slice = (function (exports) {
        /* Create slice of source array or array-like object.
         *
         * |Name            |Desc                      |
         * |----------------|--------------------------|
         * |array           |Array to slice            |
         * |start=0         |Start position            |
         * |end=array.length|End position, not included|
         */

        /* example
         * slice([1, 2, 3, 4], 1, 2); // -> [2]
         */

        /* typescript
         * export declare function slice(
         *     array: any[],
         *     start?: number,
         *     end?: number
         * ): any[];
         */
        exports = function(arr, start, end) {
            var len = arr.length;

            if (start == null) {
                start = 0;
            } else if (start < 0) {
                start = Math.max(len + start, 0);
            } else {
                start = Math.min(start, len);
            }

            if (end == null) {
                end = len;
            } else if (end < 0) {
                end = Math.max(len + end, 0);
            } else {
                end = Math.min(end, len);
            }

            var ret = [];

            while (start < end) {
                ret.push(arr[start++]);
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ freeze ------------------------------ */

    var freeze = _.freeze = (function (exports) {
        /* Shortcut for Object.freeze.
         *
         * Use Object.defineProperties if Object.freeze is not supported.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |obj   |Object to freeze|
         * |return|Object passed in|
         */

        /* example
         * const a = { b: 1 };
         * freeze(a);
         * a.b = 2;
         * console.log(a); // -> {b: 1}
         */

        /* typescript
         * export declare function freeze<T>(obj: T): T;
         */

        /* dependencies
         * keys 
         */

        exports = function(obj) {
            if (Object.freeze) return Object.freeze(obj);
            keys(obj).forEach(function(prop) {
                if (!Object.getOwnPropertyDescriptor(obj, prop).configurable) return;
                Object.defineProperty(obj, prop, {
                    writable: false,
                    configurable: false
                });
            });
            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ swap ------------------------------ */

    var swap = _.swap = (function (exports) {
        /* Swap two items in an array.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to swap|
         * |a     |First index  |
         * |b     |Second index |
         * |return|Array given  |
         */

        /* example
         * const arr = [1, 2];
         * swap(arr, 0, 1); // -> [2, 1]
         */

        /* typescript
         * export declare function swap(arr: any[], a: number, b: number): any[];
         */
        exports = function(arr, a, b) {
            var tmp = arr[a];
            arr[a] = arr[b];
            arr[b] = tmp;
            return arr;
        };

        return exports;
    })({});

    /* ------------------------------ isSorted ------------------------------ */

    var isSorted = _.isSorted = (function (exports) {
        /* Check if an array is sorted.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |arr   |Array to check         |
         * |cmp   |Comparator             |
         * |return|True if array is sorted|
         */

        /* example
         * isSorted([1, 2, 3]); // -> true
         * isSorted([3, 2, 1]); // -> false
         */

        /* typescript
         * export declare function isSorted(arr: any[], cmp?: types.AnyFn): boolean;
         */

        /* dependencies
         * types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : exports.defComparator;

            for (var i = 0, len = arr.length; i < len - 1; i++) {
                if (cmp(arr[i], arr[i + 1]) > 0) return false;
            }

            return true;
        };

        exports.defComparator = function(a, b) {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        };

        return exports;
    })({});

    /* ------------------------------ isUndef ------------------------------ */

    var isUndef = _.isUndef = (function (exports) {
        /* Check if value is undefined.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |val   |Value to check            |
         * |return|True if value is undefined|
         */

        /* example
         * isUndef(void 0); // -> true
         * isUndef(null); // -> false
         */

        /* typescript
         * export declare function isUndef(val: any): boolean;
         */
        exports = function(val) {
            return val === void 0;
        };

        return exports;
    })({});

    /* ------------------------------ clamp ------------------------------ */

    var clamp = _.clamp = (function (exports) {
        /* Clamp number within the inclusive lower and upper bounds.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |n     |Number to clamp|
         * |lower |Lower bound    |
         * |upper |Upper bound    |
         * |return|Clamped number |
         */

        /* example
         * clamp(-10, -5, 5); // -> -5
         * clamp(10, -5, 5); // -> 5
         * clamp(2, -5, 5); // -> 2
         * clamp(10, 5); // -> 5
         * clamp(2, 5); // -> 2
         */

        /* typescript
         * export declare function clamp(n: number, lower: number, upper: number): number;
         * export declare function clamp(n: number, upper: number): number;
         */

        /* dependencies
         * isUndef 
         */

        exports = function(n, lower, upper) {
            if (isUndef(upper)) {
                upper = lower;
                lower = undefined;
            }

            if (!isUndef(lower) && n < lower) return lower;
            if (n > upper) return upper;
            return n;
        };

        return exports;
    })({});

    /* ------------------------------ fill ------------------------------ */

    var fill = _.fill = (function (exports) {
        /* Fill elements of array with value.
         *
         * |Name          |Desc                    |
         * |--------------|------------------------|
         * |list          |Array to fill           |
         * |val           |Value to fill array with|
         * |start=0       |Start position          |
         * |end=arr.length|End position            |
         * |return        |Filled array            |
         */

        /* example
         * fill([1, 2, 3], '*'); // -> ['*', '*', '*']
         * fill([1, 2, 3], '*', 1, 2); // -> [1, '*', 3]
         */

        /* typescript
         * export declare function fill(
         *     list: any[],
         *     val: any,
         *     start?: number,
         *     end?: number
         * ): any[];
         */

        /* dependencies
         * isUndef 
         */

        exports = function(arr, val, start, end) {
            var len = arr.length;
            if (!len) return [];
            if (isUndef(end)) end = len;
            if (isUndef(start)) start = 0;

            while (start < end) {
                arr[start++] = val;
            }

            return arr;
        };

        return exports;
    })({});

    /* ------------------------------ isObj ------------------------------ */

    var isObj = _.isObj = (function (exports) {
        /* Check if value is the language type of Object.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |val   |Value to check            |
         * |return|True if value is an object|
         *
         * [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
         */

        /* example
         * isObj({}); // -> true
         * isObj([]); // -> true
         */

        /* typescript
         * export declare function isObj(val: any): boolean;
         */
        exports = function(val) {
            var type = typeof val;
            return !!val && (type === 'function' || type === 'object');
        };

        return exports;
    })({});

    /* ------------------------------ nextTick ------------------------------ */

    var nextTick = _.nextTick = (function (exports) {
        /* Next tick for both node and browser.
         *
         * |Name|Desc            |
         * |----|----------------|
         * |cb  |Function to call|
         *
         * Use process.nextTick if available.
         *
         * Otherwise setImmediate or setTimeout is used as fallback.
         */

        /* example
         * nextTick(function() {
         *     // Do something...
         * });
         */

        /* typescript
         * export declare function nextTick(cb: types.AnyFn): void;
         */

        /* dependencies
         * types 
         */

        if (typeof process === 'object' && process.nextTick && !false) {
            exports = process.nextTick;
        } else if (typeof setImmediate === 'function') {
            exports = function(cb) {
                setImmediate(ensureCallable(cb));
            };
        } else {
            exports = function(cb) {
                setTimeout(ensureCallable(cb), 0);
            };
        }

        function ensureCallable(fn) {
            if (typeof fn !== 'function')
                throw new TypeError(fn + ' is not a function');
            return fn;
        }

        return exports;
    })({});

    /* ------------------------------ noop ------------------------------ */

    var noop = _.noop = (function (exports) {
        /* A no-operation function.
         */

        /* example
         * noop(); // Does nothing
         */

        /* typescript
         * export declare function noop(): void;
         */
        exports = function() {};

        return exports;
    })({});

    /* ------------------------------ reverse ------------------------------ */

    var reverse = _.reverse = (function (exports) {
        /* Reverse array without mutating it.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |arr   |Array to modify|
         * |return|Reversed array |
         */

        /* example
         * reverse([1, 2, 3]); // -> [3, 2, 1]
         */

        /* typescript
         * export declare function reverse(arr: any[]): any[];
         */
        exports = function(arr) {
            var len = arr.length;
            var ret = Array(len);
            len--;

            for (var i = 0; i <= len; i++) {
                ret[len - i] = arr[i];
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ now ------------------------------ */

    var now = _.now = (function (exports) {
        /* Gets the number of milliseconds that have elapsed since the Unix epoch.
         */

        /* example
         * now(); // -> 1468826678701
         */

        /* typescript
         * export declare function now(): number;
         */
        if (Date.now && !false) {
            exports = Date.now;
        } else {
            exports = function() {
                return new Date().getTime();
            };
        }

        return exports;
    })({});

    /* ------------------------------ isBrowser ------------------------------ */

    var isBrowser = _.isBrowser = (function (exports) {
        /* Check if running in a browser.
         */

        /* example
         * console.log(isBrowser); // -> true if running in a browser
         */

        /* typescript
         * export declare const isBrowser: boolean;
         */
        exports =
            typeof window === 'object' &&
            typeof document === 'object' &&
            document.nodeType === 9;

        return exports;
    })({});

    /* ------------------------------ raf ------------------------------ */

    var raf = _.raf = (function (exports) {
        /* Shortcut for requestAnimationFrame.
         *
         * Use setTimeout if native requestAnimationFrame is not supported.
         */

        /* example
         * const id = raf(function tick() {
         *     // Animation stuff
         *     raf(tick);
         * });
         * raf.cancel(id);
         */

        /* typescript
         * export declare namespace raf {
         *     function cancel(id: number): void;
         * }
         * export declare function raf(cb: types.AnyFn): number;
         */

        /* dependencies
         * now isBrowser types 
         */

        var raf, cancel;
        var lastTime = 0;

        if (isBrowser) {
            raf = window.requestAnimationFrame;
            cancel = window.cancelAnimationFrame;
            var vendors = ['ms', 'moz', 'webkit', 'o'];

            for (var i = 0, len = vendors.length; i < len && !raf; i++) {
                raf = window[vendors[i] + 'RequestAnimationFrame'];
                cancel =
                    window[vendors[i] + 'CancelAnimationFrame'] ||
                    window[vendors[i] + 'CancelRequestAnimationFrame'];
            }
        }

        raf =
            raf ||
            function(cb) {
                var curTime = now();
                var timeToCall = Math.max(0, 16 - (curTime - lastTime));
                var id = setTimeout(function() {
                    cb(curTime + timeToCall);
                }, timeToCall);
                lastTime = curTime + timeToCall;
                return id;
            };

        cancel =
            cancel ||
            function(id) {
                clearTimeout(id);
            };

        raf.cancel = cancel;
        exports = raf;

        return exports;
    })({});

    /* ------------------------------ root ------------------------------ */

    var root = _.root = (function (exports) {
        /* Root object reference, `global` in nodeJs, `window` in browser. */

        /* typescript
         * export declare const root: any;
         */

        /* dependencies
         * isBrowser 
         */

        exports = isBrowser ? window : global;

        return exports;
    })({});

    /* ------------------------------ perfNow ------------------------------ */

    var perfNow = _.perfNow = (function (exports) {
        /* High resolution time up to microsecond precision.
         */

        /* example
         * const start = perfNow();
         *
         * // Do something.
         *
         * console.log(perfNow() - start);
         */

        /* typescript
         * export declare function perfNow(): number;
         */

        /* dependencies
         * now root 
         */

        var performance = root.performance;
        var process = root.process;
        var loadTime;

        if (performance && performance.now) {
            exports = function() {
                return performance.now();
            };
        } else if (process && process.hrtime) {
            var getNanoSeconds = function() {
                var hr = process.hrtime();
                return hr[0] * 1e9 + hr[1];
            };

            loadTime = getNanoSeconds() - process.uptime() * 1e9;

            exports = function() {
                return (getNanoSeconds() - loadTime) / 1e6;
            };
        } else {
            loadTime = now();

            exports = function() {
                return now() - loadTime;
            };
        }

        return exports;
    })({});

    /* ------------------------------ isBool ------------------------------ */

    var isBool = _.isBool = (function (exports) {
        /* Check if value is a boolean primitive.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |val   |Value to check            |
         * |return|True if value is a boolean|
         */

        /* example
         * isBool(true); // -> true
         * isBool(false); // -> true
         * isBool(1); // -> false
         */

        /* typescript
         * export declare function isBool(val: any): boolean;
         */
        exports = function(val) {
            return val === true || val === false;
        };

        return exports;
    })({});

    /* ------------------------------ max ------------------------------ */

    var max = _.max = (function (exports) {
        /* Get maximum value of given numbers.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |...num|Numbers to calculate|
         * |return|Maximum value       |
         */

        /* example
         * max(2.3, 1, 4.5, 2); // 4.5
         */

        /* typescript
         * export declare function max(...num: number[]): number;
         */
        exports = function() {
            var arr = arguments;
            var ret = arr[0];

            for (var i = 1, len = arr.length; i < len; i++) {
                if (arr[i] > ret) ret = arr[i];
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ gcd ------------------------------ */

    var gcd = _.gcd = (function (exports) {
        /* Compute the greatest common divisor using Euclid's algorithm.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |a     |Number to calculate    |
         * |b     |Number to calculate    |
         * |return|Greatest common divisor|
         */

        /* example
         * gcd(121, 44); // -> 11
         */

        /* typescript
         * export declare function gcd(a: number, b: number): number;
         */
        exports = function(a, b) {
            if (b === 0) return a;
            return exports(b, a % b);
        };

        return exports;
    })({});

    /* ------------------------------ restArgs ------------------------------ */

    var restArgs = _.restArgs = (function (exports) {
        /* This accumulates the arguments passed into an array, after a given index.
         *
         * |Name      |Desc                                   |
         * |----------|---------------------------------------|
         * |function  |Function that needs rest parameters    |
         * |startIndex|The start index to accumulates         |
         * |return    |Generated function with rest parameters|
         */

        /* example
         * const paramArr = restArgs(function(rest) {
         *     return rest;
         * });
         * paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
         */

        /* typescript
         * export declare function restArgs(
         *     fn: types.AnyFn,
         *     startIndex?: number
         * ): types.AnyFn;
         */

        /* dependencies
         * types 
         */

        exports = function(fn, startIdx) {
            startIdx = startIdx == null ? fn.length - 1 : +startIdx;
            return function() {
                var len = Math.max(arguments.length - startIdx, 0);
                var rest = new Array(len);
                var i;

                for (i = 0; i < len; i++) {
                    rest[i] = arguments[i + startIdx];
                } // Call runs faster than apply.

                switch (startIdx) {
                    case 0:
                        return fn.call(this, rest);

                    case 1:
                        return fn.call(this, arguments[0], rest);

                    case 2:
                        return fn.call(this, arguments[0], arguments[1], rest);
                }

                var args = new Array(startIdx + 1);

                for (i = 0; i < startIdx; i++) {
                    args[i] = arguments[i];
                }

                args[startIdx] = rest;
                return fn.apply(this, args);
            };
        };

        return exports;
    })({});

    /* ------------------------------ abbrev ------------------------------ */
    _.abbrev = (function (exports) {
        /* Calculate the set of unique abbreviations for a given set of strings.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |names |List of names   |
         * |return|Abbreviation map|
         */

        /* example
         * abbrev('lina', 'luna');
         * // -> {li: 'lina', lin: 'lina', lina: 'lina', lu: 'luna', lun: 'luna', luna: 'luna'}
         */

        /* typescript
         * export declare function abbrev(...names: string[]): types.PlainObj<string>;
         */

        /* dependencies
         * types restArgs isSorted 
         */

        exports = restArgs(function(names) {
            names = names.sort(isSorted.defComparator);
            var ret = {};
            var idleMap = {};

            for (var i = 0, len = names.length; i < len; i++) {
                var str = names[i];
                var nextStr = names[i + 1] || '';
                if (str === nextStr) continue;
                var start = false;
                var abbrev = '';

                for (var j = 0, strLen = str.length; j < strLen; j++) {
                    abbrev += str[j];

                    if (!start && (str[j] !== nextStr[j] || j === strLen - 1)) {
                        start = true;
                    }

                    if (!start) {
                        idleMap[abbrev] = str;
                    } else if (!ret[abbrev] && !idleMap[abbrev]) {
                        ret[abbrev] = str;
                    }
                }
            }

            return ret;
        });

        return exports;
    })({});

    /* ------------------------------ bind ------------------------------ */

    var bind = _.bind = (function (exports) {
        /* Create a function bound to a given object.
         *
         * |Name  |Desc                    |
         * |------|------------------------|
         * |fn    |Function to bind        |
         * |ctx   |This binding of given fn|
         * |args  |Optional arguments      |
         * |return|New bound function      |
         */

        /* example
         * const fn = bind(
         *     function(msg) {
         *         console.log(this.name + ':' + msg);
         *     },
         *     { name: 'eustia' },
         *     'I am a utility library.'
         * );
         * fn(); // -> 'eustia: I am a utility library.'
         */

        /* typescript
         * export declare function bind(
         *     fn: types.AnyFn,
         *     ctx: any,
         *     ...args: any[]
         * ): types.AnyFn;
         */

        /* dependencies
         * restArgs types 
         */

        exports = restArgs(function(fn, ctx, args) {
            return restArgs(function(callArgs) {
                return fn.apply(ctx, args.concat(callArgs));
            });
        });

        return exports;
    })({});

    /* ------------------------------ delay ------------------------------ */

    var delay = _.delay = (function (exports) {
        /* Invoke function after certain milliseconds.
         *
         * |Name   |Desc                                      |
         * |-------|------------------------------------------|
         * |fn     |Function to delay                         |
         * |wait   |Number of milliseconds to delay invocation|
         * |...args|Arguments to invoke fn with               |
         */

        /* example
         * delay(
         *     function(text) {
         *         console.log(text);
         *     },
         *     1000,
         *     'later'
         * );
         * // -> Logs 'later' after one second
         */

        /* typescript
         * export declare function delay(
         *     fn: types.AnyFn,
         *     wait: number,
         *     ...args: any[]
         * ): void;
         */

        /* dependencies
         * restArgs types 
         */

        exports = restArgs(function(fn, wait, args) {
            return setTimeout(function() {
                return fn.apply(null, args);
            }, wait);
        });

        return exports;
    })({});

    /* ------------------------------ after ------------------------------ */
    _.after = (function (exports) {
        /* Create a function that invokes once it's called n or more times.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |n     |Number of calls before invoked|
         * |fn    |Function to restrict          |
         * |return|New restricted function       |
         */

        /* example
         * const fn = after(5, function() {
         *     // -> Only invoke after fn is called 5 times.
         * });
         */

        /* typescript
         * export declare function after<T extends types.AnyFn>(n: number, fn: T): T;
         */

        /* dependencies
         * types 
         */

        exports = function(n, fn) {
            return function() {
                if (--n < 1) return fn.apply(this, arguments);
            };
        };

        return exports;
    })({});

    /* ------------------------------ base64 ------------------------------ */

    var base64 = _.base64 = (function (exports) {
        /* Basic base64 encoding and decoding.
         *
         * ### encode
         *
         * Turn a byte array into a base64 string.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |bytes |Byte array   |
         * |return|Base64 string|
         *
         * ### decode
         *
         * Turn a base64 string into a byte array.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |str   |Base64 string|
         * |return|Byte array   |
         */

        /* example
         * base64.encode([168, 174, 155, 255]); // -> 'qK6b/w=='
         * base64.decode('qK6b/w=='); // -> [168, 174, 155, 255]
         */

        /* typescript
         * export declare const base64: {
         *     encode(bytes: number[]): string;
         *     decode(str: string): number[];
         * };
         */
        exports = {
            encode: function(bytes) {
                var ret = [];
                var len = bytes.length;
                var remain = len % 3;
                len = len - remain;

                for (var i = 0; i < len; i += 3) {
                    ret.push(
                        numToBase64(
                            (bytes[i] << 16) + (bytes[i + 1] << 8) + bytes[i + 2]
                        )
                    );
                }

                len = bytes.length;
                var tmp;

                if (remain === 1) {
                    tmp = bytes[len - 1];
                    ret.push(code[tmp >> 2]);
                    ret.push(code[(tmp << 4) & 0x3f]);
                    ret.push('==');
                } else if (remain === 2) {
                    tmp = (bytes[len - 2] << 8) + bytes[len - 1];
                    ret.push(code[tmp >> 10]);
                    ret.push(code[(tmp >> 4) & 0x3f]);
                    ret.push(code[(tmp << 2) & 0x3f]);
                    ret.push('=');
                }

                return ret.join('');
            },
            decode: function(str) {
                var len = str.length,
                    remain = 0;
                if (str[len - 2] === '=') remain = 2;
                else if (str[len - 1] === '=') remain = 1;
                var ret = new Array((len * 3) / 4 - remain);
                len = remain > 0 ? len - 4 : len;
                var i, j;

                for (i = 0, j = 0; i < len; i += 4) {
                    var num = base64ToNum(str[i], str[i + 1], str[i + 2], str[i + 3]);
                    ret[j++] = (num >> 16) & 0xff;
                    ret[j++] = (num >> 8) & 0xff;
                    ret[j++] = num & 0xff;
                }

                var tmp;

                if (remain === 2) {
                    tmp =
                        (codeMap[str.charCodeAt(i)] << 2) |
                        (codeMap[str.charCodeAt(i + 1)] >> 4);
                    ret[j++] = tmp & 0xff;
                } else if (remain === 1) {
                    tmp =
                        (codeMap[str.charCodeAt(i)] << 10) |
                        (codeMap[str.charCodeAt(i + 1)] << 4) |
                        (codeMap[str.charCodeAt(i + 2)] >> 2);
                    ret[j++] = (tmp >> 8) & 0xff;
                    ret[j++] = tmp & 0xff;
                }

                return ret;
            }
        };
        var codeMap = [];
        var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        for (var i = 0, len = code.length; i < len; i++) {
            codeMap[code.charCodeAt(i)] = i;
        }

        function numToBase64(num) {
            return (
                code[(num >> 18) & 0x3f] +
                code[(num >> 12) & 0x3f] +
                code[(num >> 6) & 0x3f] +
                code[num & 0x3f]
            );
        }

        function base64ToNum(str1, str2, str3, str4) {
            return (
                (codeMap[str1.charCodeAt(0)] << 18) |
                (codeMap[str2.charCodeAt(0)] << 12) |
                (codeMap[str3.charCodeAt(0)] << 6) |
                codeMap[str4.charCodeAt(0)]
            );
        }

        return exports;
    })({});

    /* ------------------------------ before ------------------------------ */

    var before = _.before = (function (exports) {
        /* Create a function that invokes less than n times.
         *
         * |Name  |Desc                                            |
         * |------|------------------------------------------------|
         * |n     |Number of calls at which fn is no longer invoked|
         * |fn    |Function to restrict                            |
         * |return|New restricted function                         |
         *
         * Subsequent calls to the created function return the result of the last fn invocation.
         */

        /* example
         * const fn = before(5, function() {});
         * fn(); // Allow function to be call 4 times at last.
         */

        /* typescript
         * export declare function before<T extends types.AnyFn>(n: number, fn: T): T;
         */

        /* dependencies
         * types 
         */

        exports = function(n, fn) {
            var memo;
            return function() {
                if (--n > 0) memo = fn.apply(this, arguments);
                if (n <= 1) fn = null;
                return memo;
            };
        };

        return exports;
    })({});

    /* ------------------------------ binarySearch ------------------------------ */
    _.binarySearch = (function (exports) {
        /* Binary search implementation.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |array |Sorted array |
         * |val   |Value to seek|
         * |cmp   |Comparator   |
         * |return|Value index  |
         */

        /* example
         * binarySearch([1, 2, 3], 2); // -> 1
         * binarySearch([1, 2], 3); // -> -1
         * binarySearch(
         *     [
         *         {
         *             key: 1
         *         },
         *         {
         *             key: 2
         *         }
         *     ],
         *     { key: 1 },
         *     (a, b) => {
         *         if (a.key === b.key) return 0;
         *         return a.key < b.key ? -1 : 1;
         *     }
         * ); // -> 0
         */

        /* typescript
         * export declare function binarySearch(
         *     array: any[],
         *     val: any,
         *     cmp?: types.AnyFn
         * ): number;
         */

        /* dependencies
         * isSorted types 
         */

        exports = function(arr, val) {
            var cmp =
                arguments.length > 2 && arguments[2] !== undefined
                    ? arguments[2]
                    : isSorted.defComparator;
            var startIdx = 0;
            var endIdx = arr.length - 1;

            while (startIdx <= endIdx) {
                var middleIdx = startIdx + Math.floor((endIdx - startIdx) / 2);
                var middleVal = arr[middleIdx];

                if (cmp(middleVal, val) === 0) {
                    return middleIdx;
                }

                if (cmp(middleVal, val) < 0) {
                    startIdx = middleIdx + 1;
                } else {
                    endIdx = middleIdx - 1;
                }
            }

            return -1;
        };

        return exports;
    })({});

    /* ------------------------------ bubbleSort ------------------------------ */
    _.bubbleSort = (function (exports) {
        /* Bubble sort implementation.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to sort|
         * |cmp   |Comparator   |
         * |return|Sorted array |
         */

        /* example
         * bubbleSort([2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function bubbleSort(arr: any[], cmp?: types.AnyFn): any[];
         */

        /* dependencies
         * swap isSorted types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : isSorted.defComparator;

            for (var i = 0, len = arr.length; i < len; i++) {
                for (var j = i; j > 0; j--) {
                    if (cmp(arr[j], arr[j - 1]) < 0) {
                        swap(arr, j, j - 1);
                    }
                }
            }

            return arr;
        };

        return exports;
    })({});

    /* ------------------------------ bytesToWords ------------------------------ */

    var bytesToWords = _.bytesToWords = (function (exports) {
        /* Convert bytes to 32-bit words.
         *
         * Useful when using CryptoJS.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |bytes |Byte array|
         * |return|Word array|
         */

        /* example
         * bytesToWords([0x12, 0x34, 0x56, 0x78]); // -> [0x12345678]
         */

        /* typescript
         * export declare function bytesToWords(bytes: number[]): number[];
         */
        exports = function(bytes) {
            var words = [];

            for (var i = 0, len = bytes.length; i < len; i++) {
                words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
            }

            return words;
        };

        return exports;
    })({});

    /* ------------------------------ callbackify ------------------------------ */

    var callbackify = _.callbackify = (function (exports) {
        /* Convert a function that returns a Promise to a function following the error-first callback style.
         *
         * |Name  |Desc                                            |
         * |------|------------------------------------------------|
         * |fn    |Function that returns a Promise                 |
         * |return|Function following the error-fist callback style|
         */

        /* example
         * function fn() {
         *     return new Promise(function(resolve, reject) {
         *         // ...
         *     });
         * }
         *
         * const cbFn = callbackify(fn);
         *
         * cbFn(function(err, value) {
         *     // ...
         * });
         */

        /* typescript
         * export declare function callbackify(fn: types.AnyFn): types.AnyFn;
         */

        /* dependencies
         * restArgs types 
         */

        exports = function(fn) {
            return restArgs(function(args) {
                var cb = args.pop();
                fn.apply(this, args).then(
                    function(value) {
                        cb(null, value);
                    },
                    function(err) {
                        if (err === null) err = new Error();
                        cb(err);
                    }
                );
            });
        };

        return exports;
    })({});

    /* ------------------------------ splitCase ------------------------------ */

    var splitCase = _.splitCase = (function (exports) {
        /* Split different string case to an array.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |str   |String to split|
         * |return|Result array   |
         */

        /* example
         * splitCase('foo-bar'); // -> ['foo', 'bar']
         * splitCase('foo bar'); // -> ['foo', 'bar']
         * splitCase('foo_bar'); // -> ['foo', 'bar']
         * splitCase('foo.bar'); // -> ['foo', 'bar']
         * splitCase('fooBar'); // -> ['foo', 'bar']
         * splitCase('foo-Bar'); // -> ['foo', 'bar']
         */

        /* typescript
         * export declare function splitCase(str: string): string[];
         */
        var regUpperCase = /([A-Z])/g;
        var regSeparator = /[_.\- ]+/g;
        var regTrim = /(^-)|(-$)/g;

        exports = function(str) {
            str = str
                .replace(regUpperCase, '-$1')
                .toLowerCase()
                .replace(regSeparator, '-')
                .replace(regTrim, '');
            return str.split('-');
        };

        return exports;
    })({});

    /* ------------------------------ camelCase ------------------------------ */

    var camelCase = _.camelCase = (function (exports) {
        /* Convert string to "camelCase".
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to convert |
         * |return|Camel cased string|
         */

        /* example
         * camelCase('foo-bar'); // -> fooBar
         * camelCase('foo bar'); // -> fooBar
         * camelCase('foo_bar'); // -> fooBar
         * camelCase('foo.bar'); // -> fooBar
         */

        /* typescript
         * export declare function camelCase(str: string): string;
         */

        /* dependencies
         * splitCase 
         */

        exports = function(str) {
            var arr = splitCase(str);
            var ret = arr[0];
            arr.shift();
            arr.forEach(capitalize, arr);
            ret += arr.join('');
            return ret;
        };

        function capitalize(val, idx) {
            this[idx] = val.replace(/\w/, function(match) {
                return match.toUpperCase();
            });
        }

        return exports;
    })({});

    /* ------------------------------ capitalize ------------------------------ */

    var capitalize = _.capitalize = (function (exports) {
        /* Convert the first character to upper case and the remaining to lower case.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |str   |String to capitalize|
         * |return|Capitalized string  |
         */

        /* example
         * capitalize('rED'); // -> Red
         */

        /* typescript
         * export declare function capitalize(str: string): string;
         */
        exports = function(str) {
            return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
        };

        return exports;
    })({});

    /* ------------------------------ char ------------------------------ */
    _.char = (function (exports) {
        /* Return string representing a character whose Unicode code point is the given integer.
         *
         * |Name  |Desc                                  |
         * |------|--------------------------------------|
         * |num   |Integer to convert                    |
         * |return|String representing corresponding char|
         */

        /* example
         * char(65); // -> 'A'
         * char(97); // -> 'a'
         */

        /* typescript
         * export declare function char(num: number): string;
         */
        exports = function(num) {
            return String.fromCodePoint(num);
        };

        return exports;
    })({});

    /* ------------------------------ chunk ------------------------------ */

    var chunk = _.chunk = (function (exports) {
        /* Split array into groups the length of given size.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |arr   |Array to process    |
         * |size=1|Length of each chunk|
         * |return|Chunks of given size|
         */

        /* example
         * chunk([1, 2, 3, 4], 2); // -> [[1, 2], [3, 4]]
         * chunk([1, 2, 3, 4], 3); // -> [[1, 2, 3], [4]]
         * chunk([1, 2, 3, 4]); // -> [[1], [2], [3], [4]]
         */

        /* typescript
         * export declare function chunk(arr: any[], size?: number): Array<any[]>;
         */
        exports = function(arr, size) {
            var ret = [];
            size = size || 1;

            for (var i = 0, len = Math.ceil(arr.length / size); i < len; i++) {
                var start = i * size;
                var end = start + size;
                ret.push(arr.slice(start, end));
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ combine ------------------------------ */
    _.combine = (function (exports) {
        /* Create an array by using one array for keys and another for its values.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |keys  |Keys to be used  |
         * |values|Values to be used|
         * |return|Created object   |
         */

        /* example
         * combine(['a', 'b', 'c'], [1, 2, 3]); // -> {a: 1, b: 2, c: 3}
         */

        /* typescript
         * export declare function combine(keys: string[], values: any[]): any;
         */
        exports = function(keys, values) {
            var ret = {};

            for (var i = 0, len = keys.length; i < len; i++) {
                ret[keys[i]] = values[i];
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ compose ------------------------------ */
    _.compose = (function (exports) {
        /* Compose a list of functions.
         *
         * Each function consumes the return value of the function that follows.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |...fn |Functions to compose|
         * |return|Composed function   |
         */

        /* example
         * const welcome = compose(
         *     function(name) {
         *         return 'hi: ' + name;
         *     },
         *     function(name) {
         *         return name.toUpperCase() + '!';
         *     }
         * );
         *
         * welcome('licia'); // -> 'hi: LICIA!'
         */

        /* typescript
         * export declare function compose(...fn: types.AnyFn[]): types.AnyFn;
         */

        /* dependencies
         * restArgs types 
         */

        exports = restArgs(function(fnList) {
            return function() {
                var i = fnList.length - 1;
                var result = fnList[i].apply(this, arguments);

                while (i--) {
                    result = fnList[i].call(this, result);
                }

                return result;
            };
        });

        return exports;
    })({});

    /* ------------------------------ idxOf ------------------------------ */

    var idxOf = _.idxOf = (function (exports) {
        /* Get the index at which the first occurrence of value.
         *
         * |Name     |Desc                |
         * |---------|--------------------|
         * |arr      |Array to search     |
         * |val      |Value to search for |
         * |fromIdx=0|Index to search from|
         * |return   |Value index         |
         */

        /* example
         * idxOf([1, 2, 1, 2], 2, 2); // -> 3
         */

        /* typescript
         * export declare function idxOf(arr: any[], val: any, fromIdx?: number): number;
         */
        exports = function(arr, val, fromIdx) {
            return Array.prototype.indexOf.call(arr, val, fromIdx);
        };

        return exports;
    })({});

    /* ------------------------------ convertBase ------------------------------ */
    _.convertBase = (function (exports) {
        /* Convert base of a number.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |num   |Number to convert|
         * |from  |Base from        |
         * |to    |Base to          |
         * |return|Converted number |
         */

        /* example
         * convertBase('10', 2, 10); // -> '2'
         * convertBase('ff', 16, 2); // -> '11111111'
         */

        /* typescript
         * export declare function convertBase(
         *     num: number | string,
         *     from: number,
         *     to: number
         * ): string;
         */
        exports = function(num, from, to) {
            return parseInt(num, from).toString(to);
        };

        return exports;
    })({});

    /* ------------------------------ create ------------------------------ */

    var create = _.create = (function (exports) {
        /* Create new object using given object as prototype.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |proto |Prototype of new object|
         * |return|Created object         |
         */

        /* example
         * const obj = create({ a: 1 });
         * console.log(obj.a); // -> 1
         */

        /* typescript
         * export declare function create(proto?: object): any;
         */

        /* dependencies
         * isObj 
         */

        exports = function(proto) {
            if (!isObj(proto)) return {};
            if (objCreate && !false) return objCreate(proto);

            function noop() {}

            noop.prototype = proto;
            return new noop();
        };

        var objCreate = Object.create;

        return exports;
    })({});

    /* ------------------------------ inherits ------------------------------ */

    var inherits = _.inherits = (function (exports) {
        /* Inherit the prototype methods from one constructor into another.
         *
         * |Name      |Desc       |
         * |----------|-----------|
         * |Class     |Child Class|
         * |SuperClass|Super Class|
         */

        /* example
         * function People(name) {
         *     this._name = name;
         * }
         * People.prototype = {
         *     getName: function() {
         *         return this._name;
         *     }
         * };
         * function Student(name) {
         *     this._name = name;
         * }
         * inherits(Student, People);
         * const s = new Student('RedHood');
         * s.getName(); // -> 'RedHood'
         */

        /* typescript
         * export declare function inherits(
         *     Class: types.AnyFn,
         *     SuperClass: types.AnyFn
         * ): void;
         */

        /* dependencies
         * create types 
         */

        exports = function(Class, SuperClass) {
            Class.prototype = create(SuperClass.prototype);
        };

        return exports;
    })({});

    /* ------------------------------ repeat ------------------------------ */

    var repeat = _.repeat = (function (exports) {
        /* Repeat string n-times.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to repeat|
         * |n     |Repeat times    |
         * |return|Repeated string |
         */

        /* example
         * repeat('a', 3); // -> 'aaa'
         * repeat('ab', 2); // -> 'abab'
         * repeat('*', 0); // -> ''
         */

        /* typescript
         * export declare function repeat(str: string, n: number): string;
         */
        exports = function(str, n) {
            var ret = '';
            if (n < 1) return '';

            while (n > 0) {
                if (n & 1) ret += str;
                n >>= 1;
                str += str;
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ lpad ------------------------------ */

    var lpad = _.lpad = (function (exports) {
        /* Pad string on the left side if it's shorter than length.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |str   |String to pad         |
         * |len   |Padding length        |
         * |chars |String used as padding|
         * |return|Result string         |
         */

        /* example
         * lpad('a', 5); // -> '    a'
         * lpad('a', 5, '-'); // -> '----a'
         * lpad('abc', 3, '-'); // -> 'abc'
         * lpad('abc', 5, 'ab'); // -> 'ababc'
         */

        /* typescript
         * export declare function lpad(str: string, len: number, chars?: string): string;
         */

        /* dependencies
         * repeat toStr 
         */

        exports = function(str, len, chars) {
            str = toStr(str);
            var strLen = str.length;
            chars = chars || ' ';
            if (strLen < len) str = (repeat(chars, len - strLen) + str).slice(-len);
            return str;
        };

        return exports;
    })({});

    /* ------------------------------ startWith ------------------------------ */

    var startWith = _.startWith = (function (exports) {
        /* Check if string starts with the given target string.
         *
         * |Name  |Desc                             |
         * |------|---------------------------------|
         * |str   |String to search                 |
         * |prefix|String prefix                    |
         * |return|True if string starts with prefix|
         */

        /* example
         * startWith('ab', 'a'); // -> true
         */

        /* typescript
         * export declare function startWith(str: string, prefix: string): boolean;
         */
        exports = function(str, prefix) {
            return str.indexOf(prefix) === 0;
        };

        return exports;
    })({});

    /* ------------------------------ debounce ------------------------------ */

    var debounce = _.debounce = (function (exports) {
        /* Return a new debounced version of the passed function.
         *
         * |Name  |Desc                           |
         * |------|-------------------------------|
         * |fn    |Function to debounce           |
         * |wait  |Number of milliseconds to delay|
         * |return|New debounced function         |
         */

        /* example
         * const calLayout = debounce(function() {}, 300);
         * // $(window).resize(calLayout);
         */

        /* typescript
         * export declare function debounce<T extends types.AnyFn>(fn: T, wait: number): T;
         */

        /* dependencies
         * types 
         */

        exports = function(fn, wait, immediate) {
            var timeout;
            return function() {
                var ctx = this;
                var args = arguments;

                var throttler = function() {
                    timeout = null;
                    fn.apply(ctx, args);
                };

                if (!immediate) clearTimeout(timeout);
                if (!immediate || !timeout) timeout = setTimeout(throttler, wait);
            };
        };

        return exports;
    })({});

    /* ------------------------------ deburr ------------------------------ */
    _.deburr = (function (exports) {
        /* Convert Latin-1 Supplement and Latin Extended-A letters to basic Latin letters and remove combining diacritical marks.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to deburr|
         * |return|Deburred string |
         */

        /* example
         * deburr('déjà vu'); // -> 'deja vu'
         */

        /* typescript
         * export declare function deburr(str: string): string;
         */
        exports = function(str) {
            return str
                .replace(regLatin, function(key) {
                    return deburredLetters[key];
                })
                .replace(regComboMark, '');
        }; // https://github.com/lodash/lodash/blob/es/deburr.js

        var regComboMark = /[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]/g;
        var regLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g; // https://github.com/lodash/lodash/blob/es/_deburrLetter.js
        // prettier-ignore

        var deburredLetters = {
          // Latin-1 Supplement block.
          '\xc0': 'A',
          '\xc1': 'A',
          '\xc2': 'A',
          '\xc3': 'A',
          '\xc4': 'A',
          '\xc5': 'A',
          '\xe0': 'a',
          '\xe1': 'a',
          '\xe2': 'a',
          '\xe3': 'a',
          '\xe4': 'a',
          '\xe5': 'a',
          '\xc7': 'C',
          '\xe7': 'c',
          '\xd0': 'D',
          '\xf0': 'd',
          '\xc8': 'E',
          '\xc9': 'E',
          '\xca': 'E',
          '\xcb': 'E',
          '\xe8': 'e',
          '\xe9': 'e',
          '\xea': 'e',
          '\xeb': 'e',
          '\xcc': 'I',
          '\xcd': 'I',
          '\xce': 'I',
          '\xcf': 'I',
          '\xec': 'i',
          '\xed': 'i',
          '\xee': 'i',
          '\xef': 'i',
          '\xd1': 'N',
          '\xf1': 'n',
          '\xd2': 'O',
          '\xd3': 'O',
          '\xd4': 'O',
          '\xd5': 'O',
          '\xd6': 'O',
          '\xd8': 'O',
          '\xf2': 'o',
          '\xf3': 'o',
          '\xf4': 'o',
          '\xf5': 'o',
          '\xf6': 'o',
          '\xf8': 'o',
          '\xd9': 'U',
          '\xda': 'U',
          '\xdb': 'U',
          '\xdc': 'U',
          '\xf9': 'u',
          '\xfa': 'u',
          '\xfb': 'u',
          '\xfc': 'u',
          '\xdd': 'Y',
          '\xfd': 'y',
          '\xff': 'y',
          '\xc6': 'Ae',
          '\xe6': 'ae',
          '\xde': 'Th',
          '\xfe': 'th',
          '\xdf': 'ss',
          // Latin Extended-A block.
          '\u0100': 'A',
          '\u0102': 'A',
          '\u0104': 'A',
          '\u0101': 'a',
          '\u0103': 'a',
          '\u0105': 'a',
          '\u0106': 'C',
          '\u0108': 'C',
          '\u010a': 'C',
          '\u010c': 'C',
          '\u0107': 'c',
          '\u0109': 'c',
          '\u010b': 'c',
          '\u010d': 'c',
          '\u010e': 'D',
          '\u0110': 'D',
          '\u010f': 'd',
          '\u0111': 'd',
          '\u0112': 'E',
          '\u0114': 'E',
          '\u0116': 'E',
          '\u0118': 'E',
          '\u011a': 'E',
          '\u0113': 'e',
          '\u0115': 'e',
          '\u0117': 'e',
          '\u0119': 'e',
          '\u011b': 'e',
          '\u011c': 'G',
          '\u011e': 'G',
          '\u0120': 'G',
          '\u0122': 'G',
          '\u011d': 'g',
          '\u011f': 'g',
          '\u0121': 'g',
          '\u0123': 'g',
          '\u0124': 'H',
          '\u0126': 'H',
          '\u0125': 'h',
          '\u0127': 'h',
          '\u0128': 'I',
          '\u012a': 'I',
          '\u012c': 'I',
          '\u012e': 'I',
          '\u0130': 'I',
          '\u0129': 'i',
          '\u012b': 'i',
          '\u012d': 'i',
          '\u012f': 'i',
          '\u0131': 'i',
          '\u0134': 'J',
          '\u0135': 'j',
          '\u0136': 'K',
          '\u0137': 'k',
          '\u0138': 'k',
          '\u0139': 'L',
          '\u013b': 'L',
          '\u013d': 'L',
          '\u013f': 'L',
          '\u0141': 'L',
          '\u013a': 'l',
          '\u013c': 'l',
          '\u013e': 'l',
          '\u0140': 'l',
          '\u0142': 'l',
          '\u0143': 'N',
          '\u0145': 'N',
          '\u0147': 'N',
          '\u014a': 'N',
          '\u0144': 'n',
          '\u0146': 'n',
          '\u0148': 'n',
          '\u014b': 'n',
          '\u014c': 'O',
          '\u014e': 'O',
          '\u0150': 'O',
          '\u014d': 'o',
          '\u014f': 'o',
          '\u0151': 'o',
          '\u0154': 'R',
          '\u0156': 'R',
          '\u0158': 'R',
          '\u0155': 'r',
          '\u0157': 'r',
          '\u0159': 'r',
          '\u015a': 'S',
          '\u015c': 'S',
          '\u015e': 'S',
          '\u0160': 'S',
          '\u015b': 's',
          '\u015d': 's',
          '\u015f': 's',
          '\u0161': 's',
          '\u0162': 'T',
          '\u0164': 'T',
          '\u0166': 'T',
          '\u0163': 't',
          '\u0165': 't',
          '\u0167': 't',
          '\u0168': 'U',
          '\u016a': 'U',
          '\u016c': 'U',
          '\u016e': 'U',
          '\u0170': 'U',
          '\u0172': 'U',
          '\u0169': 'u',
          '\u016b': 'u',
          '\u016d': 'u',
          '\u016f': 'u',
          '\u0171': 'u',
          '\u0173': 'u',
          '\u0174': 'W',
          '\u0175': 'w',
          '\u0176': 'Y',
          '\u0177': 'y',
          '\u0178': 'Y',
          '\u0179': 'Z',
          '\u017b': 'Z',
          '\u017d': 'Z',
          '\u017a': 'z',
          '\u017c': 'z',
          '\u017e': 'z',
          '\u0132': 'IJ',
          '\u0133': 'ij',
          '\u0152': 'Oe',
          '\u0153': 'oe',
          '\u0149': "'n",
          '\u017f': 's'
        };

        return exports;
    })({});

    /* ------------------------------ defined ------------------------------ */
    _.defined = (function (exports) {
        /* Return the first argument that is not undefined.
         *
         * |Name   |Desc                  |
         * |-------|----------------------|
         * |...args|Arguments to check    |
         * |return |First defined argument|
         */

        /* example
         * defined(false, 2, void 0, 100); // -> false
         */

        /* typescript
         * export declare function defined(...args: any[]): any;
         */

        /* dependencies
         * isUndef 
         */

        exports = function() {
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (!isUndef(arguments[i])) return arguments[i];
            }
        };

        return exports;
    })({});

    /* ------------------------------ memStorage ------------------------------ */

    var memStorage = _.memStorage = (function (exports) {
        /* Memory-backed implementation of the Web Storage API.
         *
         * A replacement for environments where localStorage or sessionStorage is not available.
         */

        /* example
         * const localStorage = window.localStorage || memStorage;
         * localStorage.setItem('test', 'licia');
         */

        /* typescript
         * export declare const memStorage: typeof window.localStorage;
         */

        /* dependencies
         * keys 
         */

        exports = {
            getItem: function(key) {
                return (API_KEYS[key] ? cloak[key] : this[key]) || null;
            },
            setItem: function(key, val) {
                API_KEYS[key] ? (cloak[key] = val) : (this[key] = val);
            },
            removeItem: function(key) {
                API_KEYS[key] ? delete cloak[key] : delete this[key];
            },
            key: function(i) {
                var keys = enumerableKeys();
                return i >= 0 && i < keys.length ? keys[i] : null;
            },
            clear: function() {
                var keys = uncloakedKeys();
                /* eslint-disable no-cond-assign */

                for (var i = 0, key; (key = keys[i]); i++) {
                    delete this[key];
                }

                keys = cloakedKeys();
                /* eslint-disable no-cond-assign */

                for (var _i = 0, _key; (_key = keys[_i]); _i++) {
                    delete cloak[_key];
                }
            }
        };
        Object.defineProperty(exports, 'length', {
            enumerable: false,
            configurable: true,
            get: function() {
                return enumerableKeys().length;
            }
        });
        var cloak = {};
        var API_KEYS = {
            getItem: 1,
            setItem: 1,
            removeItem: 1,
            key: 1,
            clear: 1,
            length: 1
        };

        function enumerableKeys() {
            return uncloakedKeys().concat(cloakedKeys());
        }

        function uncloakedKeys() {
            return keys(exports).filter(function(key) {
                return !API_KEYS[key];
            });
        }

        function cloakedKeys() {
            return keys(cloak);
        }

        return exports;
    })({});

    /* ------------------------------ detectMocha ------------------------------ */
    _.detectMocha = (function (exports) {
        /* Detect if mocha is running.
         */

        /* example
         * detectMocha(); // -> True if mocha is running.
         */

        /* typescript
         * export declare function detectMocha(): boolean;
         */

        /* dependencies
         * root 
         */

        exports = function() {
            for (var i = 0, len = methods.length; i < len; i++) {
                var method = methods[i];
                if (typeof root[method] !== 'function') return false;
            }

            return true;
        };

        var methods = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'];

        return exports;
    })({});

    /* ------------------------------ detectOs ------------------------------ */
    _.detectOs = (function (exports) {
        /* Detect operating system using ua.
         *
         * |Name                  |Desc                 |
         * |----------------------|---------------------|
         * |ua=navigator.userAgent|Browser userAgent    |
         * |return                |Operating system name|
         *
         * Supported os: windows, os x, linux, ios, android, windows phone
         */

        /* example
         * if (detectOs() === 'ios') {
         *     // Do something about ios...
         * }
         */

        /* typescript
         * export declare function detectOs(ua?: string): string;
         */

        /* dependencies
         * isBrowser 
         */

        exports = function(ua) {
            ua = ua || (isBrowser ? navigator.userAgent : '');
            ua = ua.toLowerCase();
            if (detect('windows phone')) return 'windows phone';
            if (detect('win')) return 'windows';
            if (detect('android')) return 'android';
            if (detect('ipad') || detect('iphone') || detect('ipod')) return 'ios';
            if (detect('mac')) return 'os x';
            if (detect('linux')) return 'linux';

            function detect(keyword) {
                return ua.indexOf(keyword) > -1;
            }

            return 'unknown';
        };

        return exports;
    })({});

    /* ------------------------------ dotCase ------------------------------ */
    _.dotCase = (function (exports) {
        /* Convert string to "dotCase".
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |str   |String to convert|
         * |return|Dot cased string |
         */

        /* example
         * dotCase('fooBar'); // -> foo.bar
         * dotCase('foo bar'); // -> foo.bar
         */

        /* typescript
         * export declare function dotCase(str: string): string;
         */

        /* dependencies
         * splitCase 
         */

        exports = function(str) {
            return splitCase(str).join('.');
        };

        return exports;
    })({});

    /* ------------------------------ optimizeCb ------------------------------ */

    var optimizeCb = _.optimizeCb = (function (exports) {
        /* Used for function context binding.
         */

        /* typescript
         * export declare function optimizeCb(
         *     fn: types.AnyFn,
         *     ctx: any,
         *     argCount?: number
         * ): types.AnyFn;
         */

        /* dependencies
         * isUndef types 
         */

        exports = function(fn, ctx, argCount) {
            if (isUndef(ctx)) return fn;

            switch (argCount == null ? 3 : argCount) {
                case 1:
                    return function(val) {
                        return fn.call(ctx, val);
                    };

                case 3:
                    return function(val, idx, collection) {
                        return fn.call(ctx, val, idx, collection);
                    };

                case 4:
                    return function(accumulator, val, idx, collection) {
                        return fn.call(ctx, accumulator, val, idx, collection);
                    };
            }

            return function() {
                return fn.apply(ctx, arguments);
            };
        };

        return exports;
    })({});

    /* ------------------------------ upperFirst ------------------------------ */

    var upperFirst = _.upperFirst = (function (exports) {
        /* Convert the first character of string to upper case.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |str   |String to convert|
         * |return|Converted string |
         */

        /* example
         * upperFirst('red'); // -> Red
         */

        /* typescript
         * export declare function upperFirst(str: string): string;
         */
        exports = function(str) {
            if (str.length < 1) return str;
            return str[0].toUpperCase() + str.slice(1);
        };

        return exports;
    })({});

    /* ------------------------------ endWith ------------------------------ */

    var endWith = _.endWith = (function (exports) {
        /* Check if string ends with the given target string.
         *
         * |Name  |Desc                           |
         * |------|-------------------------------|
         * |str   |The string to search           |
         * |suffix|String suffix                  |
         * |return|True if string ends with target|
         */

        /* example
         * endWith('ab', 'b'); // -> true
         */

        /* typescript
         * export declare function endWith(str: string, suffix: string): boolean;
         */
        exports = function(str, suffix) {
            var idx = str.length - suffix.length;
            return idx >= 0 && str.indexOf(suffix, idx) === idx;
        };

        return exports;
    })({});

    /* ------------------------------ escape ------------------------------ */

    var escape = _.escape = (function (exports) {
        /* Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to escape|
         * |return|Escaped string  |
         */

        /* example
         * escape('You & Me'); // -> 'You &amp; Me'
         */

        /* typescript
         * export declare function escape(str: string): string;
         */

        /* dependencies
         * keys 
         */

        exports = function(str) {
            return regTest.test(str) ? str.replace(regReplace, replaceFn) : str;
        };

        var map = (exports.map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        });
        var regSrc = '(?:' + keys(map).join('|') + ')';
        var regTest = new RegExp(regSrc);
        var regReplace = new RegExp(regSrc, 'g');

        var replaceFn = function(match) {
            return map[match];
        };

        return exports;
    })({});

    /* ------------------------------ escapeJsStr ------------------------------ */

    var escapeJsStr = _.escapeJsStr = (function (exports) {
        /* Escape string to be a valid JavaScript string literal between quotes.
         *
         * http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to escape|
         * |return|Escaped string  |
         */

        /* example
         * escapeJsStr('"\n'); // -> '\\"\\\\n'
         */

        /* typescript
         * export declare function escapeJsStr(str: string): string;
         */

        /* dependencies
         * toStr 
         */

        exports = function(str) {
            return toStr(str).replace(regEscapeChars, function(char) {
                switch (char) {
                    case '"':
                    case "'":
                    case '\\':
                        return '\\' + char;

                    case '\n':
                        return '\\n';

                    case '\r':
                        return '\\r';
                    // Line separator

                    case '\u2028':
                        return '\\u2028';
                    // Paragraph separator

                    case '\u2029':
                        return '\\u2029';
                }
            });
        };

        var regEscapeChars = /["'\\\n\r\u2028\u2029]/g;

        return exports;
    })({});

    /* ------------------------------ escapeRegExp ------------------------------ */

    var escapeRegExp = _.escapeRegExp = (function (exports) {
        /* Escape special chars to be used as literals in RegExp constructors.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to escape|
         * |return|Escaped string  |
         */

        /* example
         * escapeRegExp('[licia]'); // -> '\\[licia\\]'
         */

        /* typescript
         * export declare function escapeRegExp(str: string): string;
         */
        exports = function(str) {
            return str.replace(/\W/g, '\\$&');
        };

        return exports;
    })({});

    /* ------------------------------ memoize ------------------------------ */

    var memoize = _.memoize = (function (exports) {
        /* Memoize a given function by caching the computed result.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |fn    |Function to have its output memoized|
         * |hashFn|Function to create cache key        |
         * |return|New memoized function               |
         */

        /* example
         * const fibonacci = memoize(function(n) {
         *     return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
         * });
         */

        /* typescript
         * export declare function memoize(
         *     fn: types.AnyFn,
         *     hashFn?: types.AnyFn
         * ): types.AnyFn;
         */

        /* dependencies
         * has types 
         */

        exports = function(fn, hashFn) {
            var memoize = function(key) {
                var cache = memoize.cache;
                var address = '' + (hashFn ? hashFn.apply(this, arguments) : key);
                if (!has(cache, address)) cache[address] = fn.apply(this, arguments);
                return cache[address];
            };

            memoize.cache = {};
            return memoize;
        };

        return exports;
    })({});

    /* ------------------------------ fibonacci ------------------------------ */
    _.fibonacci = (function (exports) {
        /* Calculate fibonacci number.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |n     |Index of fibonacci sequence|
         * |return|Expected fibonacci number  |
         */

        /* example
         * fibonacci(1); // -> 1
         * fibonacci(3); // -> 2
         */

        /* typescript
         * export declare function fibonacci(n: number): number;
         */

        /* dependencies
         * memoize 
         */

        exports = memoize(function(n) {
            return n < 2 ? n : exports(n - 1) + exports(n - 2);
        });

        return exports;
    })({});

    /* ------------------------------ fileSize ------------------------------ */
    _.fileSize = (function (exports) {
        /* Turn bytes into human readable file size.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |bytes |File bytes        |
         * |return|Readable file size|
         */

        /* example
         * fileSize(5); // -> '5'
         * fileSize(1500); // -> '1.46K'
         * fileSize(1500000); // -> '1.43M'
         * fileSize(1500000000); // -> '1.4G'
         * fileSize(1500000000000); // -> '1.36T'
         */

        /* typescript
         * export declare function fileSize(bytes: number): string;
         */
        exports = function(bytes) {
            if (bytes <= 0) return '0';
            var suffixIdx = Math.floor(Math.log(bytes) / Math.log(1024));
            var val = bytes / Math.pow(2, suffixIdx * 10);
            return +val.toFixed(2) + suffixList[suffixIdx];
        };

        var suffixList = ['', 'K', 'M', 'G', 'T'];

        return exports;
    })({});

    /* ------------------------------ last ------------------------------ */

    var last = _.last = (function (exports) {
        /* Get the last element of array.
         *
         * |Name  |Desc                     |
         * |------|-------------------------|
         * |arr   |The array to query       |
         * |return|The last element of array|
         */

        /* example
         * last([1, 2]); // -> 2
         */

        /* typescript
         * export declare function last(arr: any[]): any;
         */
        exports = function(arr) {
            var len = arr ? arr.length : 0;
            if (len) return arr[len - 1];
        };

        return exports;
    })({});

    /* ------------------------------ stripCmt ------------------------------ */

    var stripCmt = _.stripCmt = (function (exports) {
        /* Strip comments from source code.
         *
         * |Name  |Desc                 |
         * |------|---------------------|
         * |str   |Source code          |
         * |return|Code without comments|
         */

        /* example
         * stripCmt('// comment \n var a = 5; \/* comment2\n * comment3\n *\/'); // -> ' var a = 5; '
         */

        /* typescript
         * export declare function stripCmt(str: string): string;
         */
        exports = function(str) {
            str = ('__' + str + '__').split('');
            var mode = {
                singleQuote: false,
                doubleQuote: false,
                regex: false,
                blockComment: false,
                lineComment: false,
                condComp: false
            };

            for (var i = 0, l = str.length; i < l; i++) {
                if (mode.regex) {
                    if (str[i] === '/' && str[i - 1] !== '\\') mode.regex = false;
                    continue;
                }

                if (mode.singleQuote) {
                    if (str[i] === "'" && str[i - 1] !== '\\') mode.singleQuote = false;
                    continue;
                }

                if (mode.doubleQuote) {
                    if (str[i] === '"' && str[i - 1] !== '\\') mode.doubleQuote = false;
                    continue;
                }

                if (mode.blockComment) {
                    if (str[i] === '*' && str[i + 1] === '/') {
                        str[i + 1] = '';
                        mode.blockComment = false;
                    }

                    str[i] = '';
                    continue;
                }

                if (mode.lineComment) {
                    if (str[i + 1] === '\n') mode.lineComment = false;
                    str[i] = '';
                    continue;
                }

                mode.doubleQuote = str[i] === '"';
                mode.singleQuote = str[i] === "'";

                if (str[i] === '/') {
                    if (str[i + 1] === '*') {
                        str[i] = '';
                        mode.blockComment = true;
                        continue;
                    }

                    if (str[i + 1] === '/') {
                        str[i] = '';
                        mode.lineComment = true;
                        continue;
                    }

                    mode.regex = true;
                }
            }

            return str.join('').slice(2, -2);
        };

        return exports;
    })({});

    /* ------------------------------ precision ------------------------------ */

    var precision = _.precision = (function (exports) {
        /* Find decimal precision of a given number.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |num   |Number to check|
         * |return|Precision      |
         */

        /* example
         * precision(1.234); // -> 3;
         */

        /* typescript
         * export declare function precision(num: number): number;
         */
        exports = function(num) {
            num = num.toExponential().match(regExponential);
            var coefficient = num[1];
            var exponent = parseInt(num[2], 10);
            var places = (coefficient.split('.')[1] || '').length;
            var ret = places - exponent;
            return ret < 0 ? 0 : ret;
        };

        var regExponential = /^(-?\d?\.?\d+)e([+-]\d)+/;

        return exports;
    })({});

    /* ------------------------------ fraction ------------------------------ */
    _.fraction = (function (exports) {
        /* Convert number to fraction.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |num   |Number to convert     |
         * |return|Corresponding fraction|
         */

        /* example
         * fraction(1.2); // -> '6/5'
         */

        /* typescript
         * export declare function fraction(num: number): string;
         */

        /* dependencies
         * gcd precision 
         */

        exports = function(num) {
            if (num === 0) return '0';

            var _precision = precision(num);

            _precision = pow(10, _precision);
            var numerator = num * _precision,
                denominator = _precision;

            var _gcd = abs(gcd(numerator, denominator));

            numerator /= _gcd;
            denominator /= _gcd;
            return numerator + '/' + denominator;
        };

        var abs = Math.abs;
        var pow = Math.pow;

        return exports;
    })({});

    /* ------------------------------ freezeDeep ------------------------------ */
    _.freezeDeep = (function (exports) {
        /* Recursively use Object.freeze.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |obj   |Object to freeze|
         * |return|Object passed in|
         */

        /* example
         * const a = { b: { c: 1 } };
         * freezeDeep(a);
         * a.b.c = 2;
         * console.log(a); // -> {b: {c: 1}}
         */

        /* typescript
         * export declare function freezeDeep<T>(obj: T): T;
         */

        /* dependencies
         * freeze keys isObj 
         */

        exports = function(obj) {
            freeze(obj);
            keys(obj).forEach(function(prop) {
                var val = obj[prop];
                if (isObj(val) && !Object.isFrozen(val)) exports(val);
            });
            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ levenshtein ------------------------------ */

    var levenshtein = _.levenshtein = (function (exports) {
        /* Levenshtein distance implementation.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |a     |First string                        |
         * |b     |Second string                       |
         * |return|Levenshtein distance between a and b|
         */

        /* example
         * levenshtein('cat', 'cake'); // -> 2
         */

        /* typescript
         * export declare function levenshtein(a: string, b: string): number;
         */
        var vector = [];
        var bChars = []; // https://github.com/Yomguithereal/talisman/

        exports = function(a, b) {
            if (a === b) return 0; // Make a is the shorter one

            if (a.length > b.length) {
                var tmp = a;
                a = b;
                b = tmp;
            }

            var aLen = a.length;
            var bLen = b.length;
            if (!aLen) return bLen;
            if (!bLen) return aLen; // Ignore common suffix

            while (aLen > 0 && a.charCodeAt(aLen - 1) === b.charCodeAt(bLen - 1)) {
                aLen--;
                bLen--;
            }

            if (!aLen) return bLen; // Ignore common prefix

            var start = 0;

            while (start < aLen && a.charCodeAt(start) === b.charCodeAt(start)) {
                start++;
            }

            aLen -= start;
            bLen -= start;
            if (!aLen) return bLen;
            var current = 0;
            var left;
            var above;
            var charA;
            var i = 0;

            while (i < bLen) {
                bChars[i] = b.charCodeAt(start + i);
                vector[i] = ++i;
            }
            /* | | |o|a|
             * | |0|1|2|
             * |r|1|1|2|←
             * |o|2|1|2|
             * |a|3|2|1|
             *      ↑
             * a: oa
             * b: roa
             * row: [1, 2, 3]
             */

            for (var _i = 0; _i < aLen; _i++) {
                left = _i;
                current = _i + 1;
                charA = a.charCodeAt(start + _i);

                for (var j = 0; j < bLen; j++) {
                    above = current;
                    current = left;
                    left = vector[j];

                    if (charA !== bChars[j]) {
                        if (left < current) current = left;
                        if (above < current) current = above;
                        current++;
                    }

                    vector[j] = current;
                }
            }

            return current;
        };

        return exports;
    })({});

    /* ------------------------------ identity ------------------------------ */

    var identity = _.identity = (function (exports) {
        /* Return the first argument given.
         *
         * |Name  |Desc       |
         * |------|-----------|
         * |val   |Any value  |
         * |return|Given value|
         */

        /* example
         * identity('a'); // -> 'a'
         */

        /* typescript
         * export declare function identity<T>(val: T): T;
         */
        exports = function(val) {
            return val;
        };

        return exports;
    })({});

    /* ------------------------------ insertionSort ------------------------------ */
    _.insertionSort = (function (exports) {
        /* Insertion sort implementation.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to sort|
         * |cmp   |Comparator   |
         * |return|Sorted array |
         */

        /* example
         * insertionSort([2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function insertionSort(arr: any[], cmp?: types.AnyFn): any[];
         */

        /* dependencies
         * swap isSorted types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : isSorted.defComparator;

            for (var i = 1, len = arr.length; i < len; i++) {
                for (var j = i; j > 0; j--) {
                    if (cmp(arr[j], arr[j - 1]) < 0) {
                        swap(arr, j, j - 1);
                    } else {
                        break;
                    }
                }
            }

            return arr;
        };

        return exports;
    })({});

    /* ------------------------------ intersectRange ------------------------------ */
    _.intersectRange = (function (exports) {
        /* Intersect two ranges.
         *
         * |Name  |Desc                 |
         * |------|---------------------|
         * |a     |Range a              |
         * |b     |Range b              |
         * |return|Intersection if exist|
         */

        /* example
         * intersectRange({ start: 0, end: 12 }, { start: 11, end: 13 });
         * // -> {start: 11, end: 12}
         * intersectRange({ start: 0, end: 5 }, { start: 6, end: 7 });
         * // -> undefined
         */

        /* typescript
         * export declare namespace intersectRange {
         *     interface IRange {
         *         start: number;
         *         end: number;
         *     }
         * }
         * export declare function intersectRange(
         *     a: intersectRange.IRange,
         *     b: intersectRange.IRange
         * ): intersectRange.IRange | void;
         */
        exports = function(a, b) {
            var min = a.start < b.start ? a : b;
            var max = min === a ? b : a;
            if (min.end < max.start) return;
            return {
                start: max.start,
                end: min.end < max.end ? min.end : max.end
            };
        };

        return exports;
    })({});

    /* ------------------------------ invariant ------------------------------ */
    _.invariant = (function (exports) {
        /* Facebook's invariant.
         *
         * [Related docs](https://github.com/zertosh/invariant)
         */

        /* example
         * invariant(true, 'This will not throw');
         * // No errors
         * invariant(false, 'This will throw an error with this message');
         * // Error: Invariant Violation: This will throw an error with this message
         */

        /* typescript
         * export declare function invariant(
         *     condition: boolean,
         *     format?: string,
         *     a?: string,
         *     b?: string,
         *     c?: string,
         *     d?: string,
         *     e?: string,
         *     f?: string
         * ): void;
         */

        /* dependencies
         * root 
         */

        exports = function(condition, format, a, b, c, d, e, f) {
            var process = root.process || {
                env: {
                    NODE_ENV: 'development'
                }
            };

            if (process.env.NODE_ENV !== 'production') {
                if (format === undefined) {
                    throw new Error('invariant requires an error message argument');
                }
            }

            if (!condition) {
                var error;

                if (format === undefined) {
                    error = new Error(
                        'Minified exception occurred; use the non-minified dev environment ' +
                            'for the full error message and additional helpful warnings.'
                    );
                } else {
                    var args = [a, b, c, d, e, f];
                    var argIndex = 0;
                    error = new Error(
                        format.replace(/%s/g, function() {
                            return args[argIndex++];
                        })
                    );
                    error.name = 'Invariant Violation';
                }

                error.framesToPop = 1;
                throw error;
            }
        };

        return exports;
    })({});

    /* ------------------------------ isAbsoluteUrl ------------------------------ */
    _.isAbsoluteUrl = (function (exports) {
        /* Check if an url is absolute.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |url   |Url to check           |
         * |return|True if url is absolute|
         */

        /* example
         * isAbsoluteUrl('http://www.surunzi.com'); // -> true
         * isAbsoluteUrl('//www.surunzi.com'); // -> false
         * isAbsoluteUrl('surunzi.com'); // -> false
         */

        /* typescript
         * export declare function isAbsoluteUrl(url: string): boolean;
         */
        exports = function(url) {
            return regAbsolute.test(url);
        };

        var regAbsolute = /^[a-z][a-z0-9+.-]*:/;

        return exports;
    })({});

    /* ------------------------------ objToStr ------------------------------ */

    var objToStr = _.objToStr = (function (exports) {
        /* Alias of Object.prototype.toString.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |val   |Source value                        |
         * |return|String representation of given value|
         */

        /* example
         * objToStr(5); // -> '[object Number]'
         */

        /* typescript
         * export declare function objToStr(val: any): string;
         */
        var ObjToStr = Object.prototype.toString;

        exports = function(val) {
            return ObjToStr.call(val);
        };

        return exports;
    })({});

    /* ------------------------------ isArgs ------------------------------ */

    var isArgs = _.isArgs = (function (exports) {
        /* Check if value is classified as an arguments object.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |val   |Value to check                      |
         * |return|True if value is an arguments object|
         */

        /* example
         * isArgs(
         *     (function() {
         *         return arguments;
         *     })()
         * ); // -> true
         */

        /* typescript
         * export declare function isArgs(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Arguments]';
        };

        return exports;
    })({});

    /* ------------------------------ isArr ------------------------------ */

    var isArr = _.isArr = (function (exports) {
        /* Check if value is an `Array` object.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |val   |Value to check                    |
         * |return|True if value is an `Array` object|
         */

        /* example
         * isArr([]); // -> true
         * isArr({}); // -> false
         */

        /* typescript
         * export declare function isArr(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        if (Array.isArray && !false) {
            exports = Array.isArray;
        } else {
            exports = function(val) {
                return objToStr(val) === '[object Array]';
            };
        }

        return exports;
    })({});

    /* ------------------------------ castPath ------------------------------ */

    var castPath = _.castPath = (function (exports) {
        /* Cast value into a property path array.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |path  |Value to inspect   |
         * |obj   |Object to query    |
         * |return|Property path array|
         */

        /* example
         * castPath('a.b.c'); // -> ['a', 'b', 'c']
         * castPath(['a']); // -> ['a']
         * castPath('a[0].b'); // -> ['a', '0', 'b']
         * castPath('a.b.c', { 'a.b.c': true }); // -> ['a.b.c']
         */

        /* typescript
         * export declare function castPath(path: string | string[], obj?: any): string[];
         */

        /* dependencies
         * has isArr 
         */

        exports = function(str, obj) {
            if (isArr(str)) return str;
            if (obj && has(obj, str)) return [str];
            var ret = [];
            str.replace(regPropName, function(match, number, quote, str) {
                ret.push(quote ? str.replace(regEscapeChar, '$1') : number || match);
            });
            return ret;
        }; // Lodash _stringToPath

        var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var regEscapeChar = /\\(\\)?/g;

        return exports;
    })({});

    /* ------------------------------ safeDel ------------------------------ */

    var safeDel = _.safeDel = (function (exports) {
        /* Delete object property.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |obj   |Object to query           |
         * |path  |Path of property to delete|
         * |return|Deleted value or undefined|
         */

        /* example
         * const obj = { a: { aa: { aaa: 1 } } };
         * safeDel(obj, 'a.aa.aaa'); // -> 1
         * safeDel(obj, ['a', 'aa']); // -> {}
         * safeDel(obj, 'a.b'); // -> undefined
         */

        /* typescript
         * export declare function safeDel(obj: any, path: string | string[]): any;
         */

        /* dependencies
         * isUndef castPath 
         */

        exports = function(obj, path) {
            path = castPath(path, obj);
            var prop, ret;
            /* eslint-disable no-cond-assign */

            while ((prop = path.shift())) {
                ret = obj[prop];
                if (path.length === 0) delete obj[prop];
                obj = ret;
                if (isUndef(obj)) return;
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ safeGet ------------------------------ */

    var safeGet = _.safeGet = (function (exports) {
        /* Get object property, don't throw undefined error.
         *
         * |Name  |Desc                     |
         * |------|-------------------------|
         * |obj   |Object to query          |
         * |path  |Path of property to get  |
         * |return|Target value or undefined|
         */

        /* example
         * const obj = { a: { aa: { aaa: 1 } } };
         * safeGet(obj, 'a.aa.aaa'); // -> 1
         * safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
         * safeGet(obj, 'a.b'); // -> undefined
         */

        /* typescript
         * export declare function safeGet(obj: any, path: string | string[]): any;
         */

        /* dependencies
         * isUndef castPath 
         */

        exports = function(obj, path) {
            path = castPath(path, obj);
            var prop;
            prop = path.shift();

            while (!isUndef(prop)) {
                obj = obj[prop];
                if (obj == null) return;
                prop = path.shift();
            }

            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ strTpl ------------------------------ */

    var strTpl = _.strTpl = (function (exports) {
        /* Simple string template.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |str   |Template string|
         * |data  |Data to pass in|
         * |return|Result string  |
         */

        /* example
         * strTpl('Hello, {{name.first}}!', { name: { first: 'licia' } }); // -> 'Hello, licia!'
         */

        /* typescript
         * export declare function strTpl(str: string, data: types.PlainObj<any>): string;
         */

        /* dependencies
         * safeGet types toStr 
         */

        var regSep = /{{(.*?)}}/g;

        exports = function(str, data) {
            return str.replace(regSep, function(match, key) {
                return toStr(safeGet(data, key));
            });
        };

        return exports;
    })({});

    /* ------------------------------ flatten ------------------------------ */

    var flatten = _.flatten = (function (exports) {
        /* Recursively flatten an array.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |arr   |Array to flatten   |
         * |return|New flattened array|
         */

        /* example
         * flatten(['a', ['b', ['c']], 'd', ['e']]); // -> ['a', 'b', 'c', 'd', 'e']
         */

        /* typescript
         * export declare function flatten(arr: any[]): any[];
         */

        /* dependencies
         * isArr 
         */

        exports = function(arr) {
            return flat(arr, []);
        };

        function flat(arr, res) {
            var len = arr.length,
                i = -1,
                cur;

            while (len--) {
                cur = arr[++i];
                isArr(cur) ? flat(cur, res) : res.push(cur);
            }

            return res;
        }

        return exports;
    })({});

    /* ------------------------------ isArrBuffer ------------------------------ */

    var isArrBuffer = _.isArrBuffer = (function (exports) {
        /* Check if value is an ArrayBuffer.
         *
         * |Name  |Desc                           |
         * |------|-------------------------------|
         * |val   |Value to check                 |
         * |return|True if value is an ArrayBuffer|
         */

        /* example
         * isArrBuffer(new ArrayBuffer(8)); // -> true
         */

        /* typescript
         * export declare function isArrBuffer(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object ArrayBuffer]';
        };

        return exports;
    })({});

    /* ------------------------------ isDate ------------------------------ */

    var isDate = _.isDate = (function (exports) {
        /* Check if value is classified as a Date object.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |val   |value to check                |
         * |return|True if value is a Date object|
         */

        /* example
         * isDate(new Date()); // -> true
         */

        /* typescript
         * export declare function isDate(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Date]';
        };

        return exports;
    })({});

    /* ------------------------------ isFn ------------------------------ */

    var isFn = _.isFn = (function (exports) {
        /* Check if value is a function.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |val   |Value to check             |
         * |return|True if value is a function|
         *
         * Generator function is also classified as true.
         */

        /* example
         * isFn(function() {}); // -> true
         * isFn(function*() {}); // -> true
         * isFn(async function() {}); // -> true
         */

        /* typescript
         * export declare function isFn(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            var objStr = objToStr(val);
            return (
                objStr === '[object Function]' ||
                objStr === '[object GeneratorFunction]' ||
                objStr === '[object AsyncFunction]'
            );
        };

        return exports;
    })({});

    /* ------------------------------ getProto ------------------------------ */

    var getProto = _.getProto = (function (exports) {
        /* Get prototype of an object.
         *
         * |Name  |Desc                                         |
         * |------|---------------------------------------------|
         * |obj   |Target object                                |
         * |return|Prototype of given object, null if not exists|
         */

        /* example
         * const a = {};
         * getProto(Object.create(a)); // -> a
         */

        /* typescript
         * export declare function getProto(obj: any): any;
         */

        /* dependencies
         * isObj isFn 
         */

        var getPrototypeOf = Object.getPrototypeOf;
        var ObjectCtr = {}.constructor;

        exports = function(obj) {
            if (!isObj(obj)) return;
            if (getPrototypeOf && !false) return getPrototypeOf(obj);
            var proto = obj.__proto__;
            if (proto || proto === null) return proto;
            if (isFn(obj.constructor)) return obj.constructor.prototype;
            if (obj instanceof ObjectCtr) return ObjectCtr.prototype;
        };

        return exports;
    })({});

    /* ------------------------------ golangify ------------------------------ */
    _.golangify = (function (exports) {
        /* Handle errors like golang.
         *
         * |Name  |Desc                                      |
         * |------|------------------------------------------|
         * |fn    |Function that returns a Promise           |
         * |return|Like fn, but resolves with [result, error]|
         *
         * |Name  |Desc                                      |
         * |------|------------------------------------------|
         * |p     |Promise to transform                      |
         * |return|Promise that resolves with [result, error]|
         */

        /* example
         * (async () => {
         *     let fnA = golangify(async () => {
         *         throw Error('err');
         *     });
         *     await fnA(); // -> [undefined, Error]
         *     let fnB = golangify(async num => num * 2);
         *     await fnB(2); // -> [4, null]
         *
         *     await golangify(Promise.reject(Error('err'))); // -> [undefined, Error]
         *     await golangify(Promise.resolve(4)); // -> [4, null]
         * })();
         */

        /* typescript
         * export declare function golangify<T, U = Error>(
         *     fn: (...args: any[]) => Promise<T>
         * ): (...args: any[]) => Promise<[T | undefined, U | null]>;
         * export declare function golangify<T, U = Error>(
         *     p: Promise<T>
         * ): Promise<[T | undefined, U | null]>;
         */

        /* dependencies
         * isFn restArgs 
         */

        exports = function(fn) {
            if (isFn(fn)) {
                return restArgs(function(args) {
                    return fn
                        .apply(this, args)
                        .then(function(v) {
                            return [v, null];
                        })
                        .catch(function(err) {
                            return [void 0, err];
                        });
                });
            } else {
                return fn
                    .then(function(v) {
                        return [v, null];
                    })
                    .catch(function(err) {
                        return [void 0, err];
                    });
            }
        };

        return exports;
    })({});

    /* ------------------------------ isBuffer ------------------------------ */

    var isBuffer = _.isBuffer = (function (exports) {
        /* Check if value is a buffer.
         *
         * |Name  |Desc                     |
         * |------|-------------------------|
         * |val   |The value to check       |
         * |return|True if value is a buffer|
         */

        /* example
         * isBuffer(new Buffer(4)); // -> true
         */

        /* typescript
         * export declare function isBuffer(val: any): boolean;
         */

        /* dependencies
         * isFn 
         */

        exports = function(val) {
            if (val == null) return false;
            if (val._isBuffer) return true;
            return (
                val.constructor &&
                isFn(val.constructor.isBuffer) &&
                val.constructor.isBuffer(val)
            );
        };

        return exports;
    })({});

    /* ------------------------------ isMiniProgram ------------------------------ */

    var isMiniProgram = _.isMiniProgram = (function (exports) {
        /* Check if running in wechat mini program.
         */

        /* example
         * console.log(isMiniProgram); // -> true if running in mini program.
         */

        /* typescript
         * export declare const isMiniProgram: boolean;
         */

        /* dependencies
         * isFn 
         */
        /* eslint-disable no-undef */

        exports = typeof wx !== 'undefined' && isFn(wx.openLocation);

        return exports;
    })({});

    /* ------------------------------ isPlainObj ------------------------------ */

    var isPlainObj = _.isPlainObj = (function (exports) {
        /* Check if value is an object created by Object constructor.
         *
         * |Name  |Desc                           |
         * |------|-------------------------------|
         * |val   |Value to check                 |
         * |return|True if value is a plain object|
         */

        /* example
         * isPlainObj({}); // -> true
         * isPlainObj([]); // -> false
         * isPlainObj(function() {}); // -> false
         */

        /* typescript
         * export declare function isPlainObj(val: any): boolean;
         */

        /* dependencies
         * isObj isArr isFn has 
         */

        exports = function(val) {
            if (!isObj(val)) return false;
            var ctor = val.constructor;
            if (!isFn(ctor)) return false;
            if (!has(ctor.prototype, 'isPrototypeOf')) return false;
            return !isArr(val) && !isFn(val);
        };

        return exports;
    })({});

    /* ------------------------------ isNode ------------------------------ */

    var isNode = _.isNode = (function (exports) {
        /* Check if running in node.
         */

        /* example
         * console.log(isNode); // -> true if running in node
         */

        /* typescript
         * export declare const isNode: boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports =
            typeof process !== 'undefined' && objToStr(process) === '[object process]';

        return exports;
    })({});

    /* ------------------------------ deprecate ------------------------------ */
    _.deprecate = (function (exports) {
        /* Node.js util.deprecate with browser support.
         *
         * |Name  |Desc                     |
         * |------|-------------------------|
         * |fn    |Function to be deprecated|
         * |msg   |Warning message          |
         * |return|Deprecated function      |
         */

        /* example
         * const fn = () => {};
         * const obsoleteFn = deprecate(fn, 'obsoleteFn is deprecated.');
         * obsoleteFn();
         */

        /* typescript
         * export declare function deprecate(fn: types.AnyFn, msg: string): types.AnyFn;
         */

        /* dependencies
         * isNode root memStorage types 
         */

        if (isNode) {
            exports = eval('require')('util').deprecate;
        } else {
            var localStorage = root.localStorage || memStorage;

            exports = function(fn, msg) {
                if (localStorage.getItem('noDeprecation')) {
                    return fn;
                }

                var warned = false;

                function deprecated() {
                    if (!warned) {
                        warned = true;
                        /* eslint-disable no-console */

                        console.warn(msg);
                    }

                    for (
                        var _len = arguments.length, args = new Array(_len), _key = 0;
                        _key < _len;
                        _key++
                    ) {
                        args[_key] = arguments[_key];
                    }

                    return fn.apply(this, args);
                }

                Object.setPrototypeOf(deprecated, fn);

                if (fn.prototype) {
                    deprecated.prototype = fn.prototype;
                }

                return deprecated;
            };
        }

        return exports;
    })({});

    /* ------------------------------ isNum ------------------------------ */

    var isNum = _.isNum = (function (exports) {
        /* Check if value is classified as a Number primitive or object.
         *
         * |Name  |Desc                                 |
         * |------|-------------------------------------|
         * |val   |Value to check                       |
         * |return|True if value is correctly classified|
         */

        /* example
         * isNum(5); // -> true
         * isNum(5.1); // -> true
         * isNum({}); // -> false
         */

        /* typescript
         * export declare function isNum(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Number]';
        };

        return exports;
    })({});

    /* ------------------------------ indent ------------------------------ */
    _.indent = (function (exports) {
        /* Indent each line in a string.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |str   |String to indent    |
         * |char  |Character to prepend|
         * |len   |Indent length       |
         * |return|Indented string     |
         */

        /* example
         * indent('foo\nbar', ' ', 4); // -> '    foo\n    bar'
         */

        /* typescript
         * export declare function indent(
         *     str: string,
         *     char?: string,
         *     len?: number
         * ): string;
         */

        /* dependencies
         * isNum isUndef repeat 
         */

        var regLineBegin = /^(?!\s*$)/gm;

        exports = function(str, char, len) {
            if (isNum(char)) {
                len = char;
                char = ' ';
            }

            if (isUndef(len)) len = 4;
            if (isUndef(char)) char = ' ';
            char = repeat(char, len);
            return str.replace(regLineBegin, char);
        };

        return exports;
    })({});

    /* ------------------------------ isArrLike ------------------------------ */

    var isArrLike = _.isArrLike = (function (exports) {
        /* Check if value is array-like.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |val   |Value to check             |
         * |return|True if value is array like|
         *
         * Function returns false.
         */

        /* example
         * isArrLike('test'); // -> true
         * isArrLike(document.body.children); // -> true;
         * isArrLike([1, 2, 3]); // -> true
         */

        /* typescript
         * export declare function isArrLike(val: any): boolean;
         */

        /* dependencies
         * isNum isFn 
         */

        var MAX_ARR_IDX = Math.pow(2, 53) - 1;

        exports = function(val) {
            if (!val) return false;
            var len = val.length;
            return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
        };

        return exports;
    })({});

    /* ------------------------------ each ------------------------------ */

    var each = _.each = (function (exports) {
        /* Iterate over elements of collection and invokes iterator for each element.
         *
         * |Name    |Desc                          |
         * |--------|------------------------------|
         * |obj     |Collection to iterate over    |
         * |iterator|Function invoked per iteration|
         * |ctx     |Function context              |
         */

        /* example
         * each({ a: 1, b: 2 }, function(val, key) {});
         */

        /* typescript
         * export declare function each<T>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, void>,
         *     ctx?: any
         * ): types.List<T>;
         * export declare function each<T>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, void>,
         *     ctx?: any
         * ): types.Collection<T>;
         */

        /* dependencies
         * isArrLike keys optimizeCb types 
         */

        exports = function(obj, iterator, ctx) {
            iterator = optimizeCb(iterator, ctx);
            var i, len;

            if (isArrLike(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    iterator(obj[i], i, obj);
                }
            } else {
                var _keys = keys(obj);

                for (i = 0, len = _keys.length; i < len; i++) {
                    iterator(obj[_keys[i]], _keys[i], obj);
                }
            }

            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ arrToMap ------------------------------ */

    var arrToMap = _.arrToMap = (function (exports) {
        /* Make an object map using array of strings.
         *
         * |Name    |Desc            |
         * |--------|----------------|
         * |arr     |Array of strings|
         * |val=true|Key value       |
         * |return  |Object map      |
         */

        /* example
         * const needPx = arrToMap([
         *     'column-count',
         *     'columns',
         *     'font-weight',
         *     'line-weight',
         *     'opacity',
         *     'z-index',
         *     'zoom'
         * ]);
         * const key = 'column-count';
         * let val = '5';
         * if (needPx[key]) val += 'px';
         * console.log(val); // -> '5px'
         */

        /* typescript
         * export declare function arrToMap<T>(
         *     arr: string[],
         *     val?: T
         * ): { [key: string]: T };
         */

        /* dependencies
         * each isUndef isFn 
         */

        exports = function(arr, val) {
            if (isUndef(val)) val = true;

            var _isFn = isFn(val);

            var ret = {};
            each(arr, function(key) {
                ret[key] = _isFn ? val(key) : val;
            });
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ parseHtml ------------------------------ */

    var parseHtml = _.parseHtml = (function (exports) {
        /* Simple html parser.
         *
         * |Name   |Desc         |
         * |-------|-------------|
         * |html   |Html to parse|
         * |handler|Handlers     |
         */

        /* example
         * parseHtml('<div>licia</div>', {
         *     start: (tag, attrs, unary) => {},
         *     end: tag => {},
         *     comment: text => {},
         *     text: text => {}
         * });
         */

        /* typescript
         * export declare function parseHtml(
         *     html: string,
         *     handlers: {
         *         start?: (tag: string, attrs: any, unary: boolean) => void;
         *         end?: (tag: string) => void;
         *         comment?: (text: string) => void;
         *         text?: (text: string) => void;
         *     }
         * ): void;
         */

        /* dependencies
         * last arrToMap startWith lowerCase 
         */ // https://johnresig.com/files/htmlparser.js

        exports = function(html, handler) {
            var stack = [];
            var text;
            var lastHtml = html;

            while (html) {
                text = true;

                if (!last(stack) || !SPECIAL[last(stack)]) {
                    if (startWith(html, '<!--')) {
                        var endIdx = html.indexOf('-->');

                        if (endIdx >= 0) {
                            if (handler.comment) {
                                handler.comment(html.substring(4, endIdx));
                            }

                            html = html.substring(endIdx + 3);
                            text = false;
                        }
                    } else if (startWith(html, '<!')) {
                        var match = html.match(regDoctype);

                        if (match) {
                            if (handler.text)
                                handler.text(html.substring(0, match[0].length));
                            html = html.substring(match[0].length);
                            text = false;
                        }
                    } else if (startWith(html, '</')) {
                        var _match = html.match(regEndTag);

                        if (_match) {
                            html = html.substring(_match[0].length);

                            _match[0].replace(regEndTag, parseEndTag);

                            text = false;
                        }
                    } else if (startWith(html, '<')) {
                        var _match2 = html.match(regStartTag);

                        if (_match2) {
                            html = html.substring(_match2[0].length);

                            _match2[0].replace(regStartTag, parseStartTag);

                            text = false;
                        }
                    }

                    if (text) {
                        var _endIdx = html.indexOf('<');

                        var _text = _endIdx < 0 ? html : html.substring(0, _endIdx);

                        html = _endIdx < 0 ? '' : html.substring(_endIdx);
                        if (handler.text) handler.text(_text);
                    }
                } else {
                    var execRes = new RegExp('</'.concat(last(stack), '[^>]*>')).exec(
                        html
                    );

                    if (execRes) {
                        var _text2 = html.substring(0, execRes.index);

                        html = html.substring(execRes.index + execRes[0].length);
                        if (_text2 && handler.text) handler.text(_text2);
                    }

                    parseEndTag('', last(stack));
                }

                if (lastHtml === html) {
                    throw Error('Parse Error: ' + html);
                }

                lastHtml = html;
            }

            parseEndTag();

            function parseStartTag(tag, tagName, rest, unary) {
                tagName = lowerCase(tagName);
                unary = !!unary;
                if (!unary) stack.push(tagName);

                if (handler.start) {
                    var attrs = {};
                    rest.replace(regAttr, function(all, $1, $2, $3, $4) {
                        attrs[$1] = $2 || $3 || $4 || '';
                    });
                    handler.start(tagName, attrs, unary);
                }
            }

            function parseEndTag(tag, tagName) {
                tagName = lowerCase(tagName);
                var pos;

                if (!tagName) {
                    pos = 0;
                } else {
                    for (pos = stack.length - 1; pos >= 0; pos--) {
                        if (stack[pos] === tagName) break;
                    }
                }

                if (pos >= 0) {
                    for (var i = stack.length - 1; i >= pos; i--) {
                        if (handler.end) handler.end(stack[i]);
                    }

                    stack.length = pos;
                }
            }
        };

        var regDoctype = /^<!\s*doctype((?:\s+[\w:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i;
        var regEndTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
        var regStartTag = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Za-z0-9_:@.]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i;
        var regAttr = /([-A-Za-z0-9_:@.]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g; // https://www.w3.org/TR/html/syntax.html#raw-text

        var SPECIAL = arrToMap('script,style'.split(','));

        return exports;
    })({});

    /* ------------------------------ createAssigner ------------------------------ */

    var createAssigner = _.createAssigner = (function (exports) {
        /* Used to create extend, extendOwn and defaults.
         *
         * |Name    |Desc                          |
         * |--------|------------------------------|
         * |keysFn  |Function to get object keys   |
         * |defaults|No override when set to true  |
         * |return  |Result function, extend...    |
         */

        /* typescript
         * export declare function createAssigner(
         *     keysFn: types.AnyFn,
         *     defaults: boolean
         * ): types.AnyFn;
         */

        /* dependencies
         * isUndef each types 
         */

        exports = function(keysFn, defaults) {
            return function(obj) {
                each(arguments, function(src, idx) {
                    if (idx === 0) return;
                    var keys = keysFn(src);
                    each(keys, function(key) {
                        if (!defaults || isUndef(obj[key])) obj[key] = src[key];
                    });
                });
                return obj;
            };
        };

        return exports;
    })({});

    /* ------------------------------ extendOwn ------------------------------ */

    var extendOwn = _.extendOwn = (function (exports) {
        /* Like extend, but only copies own properties over to the destination object.
         *
         * |Name       |Desc              |
         * |-----------|------------------|
         * |destination|Destination object|
         * |...sources |Sources objects   |
         * |return     |Destination object|
         */

        /* example
         * extendOwn({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
         */

        /* typescript
         * export declare function extendOwn(destination: any, ...sources: any[]): any;
         */

        /* dependencies
         * keys createAssigner 
         */

        exports = createAssigner(keys);

        return exports;
    })({});

    /* ------------------------------ easing ------------------------------ */

    var easing = _.easing = (function (exports) {
        /* Easing functions adapted from http://jqueryui.com/ .
         *
         * |Name   |Desc                  |
         * |-------|----------------------|
         * |percent|Number between 0 and 1|
         * |return |Calculated number     |
         */

        /* example
         * easing.linear(0.5); // -> 0.5
         * easing.inElastic(0.5, 500); // -> 0.03125
         */

        /* typescript
         * export declare const easing: {
         *     linear(percent: number): number;
         *     inQuad(percent: number): number;
         *     outQuad(percent: number): number;
         *     inOutQuad(percent: number): number;
         *     outInQuad(percent: number): number;
         *     inCubic(percent: number): number;
         *     outCubic(percent: number): number;
         *     inQuart(percent: number): number;
         *     outQuart(percent: number): number;
         *     inQuint(percent: number): number;
         *     outQuint(percent: number): number;
         *     inExpo(percent: number): number;
         *     outExpo(percent: number): number;
         *     inSine(percent: number): number;
         *     outSine(percent: number): number;
         *     inCirc(percent: number): number;
         *     outCirc(percent: number): number;
         *     inElastic(percent: number, elasticity?: number): number;
         *     outElastic(percent: number, elasticity?: number): number;
         *     inBack(percent: number): number;
         *     outBack(percent: number): number;
         *     inOutBack(percent: number): number;
         *     outInBack(percent: number): number;
         *     inBounce(percent: number): number;
         *     outBounce(percent: number): number;
         * };
         */

        /* dependencies
         * each upperFirst 
         */

        exports.linear = function(t) {
            return t;
        };

        var pow = Math.pow;
        var sqrt = Math.sqrt;
        var sin = Math.sin;
        var min = Math.min;
        var asin = Math.asin;
        var PI = Math.PI;
        var fns = {
            sine: function(t) {
                return 1 + sin((PI / 2) * t - PI / 2);
            },
            circ: function(t) {
                return 1 - sqrt(1 - t * t);
            },
            elastic: function(t, m) {
                m = m || DEFAULT_ELASTICITY;
                if (t === 0 || t === 1) return t;
                var p = 1 - min(m, 998) / 1000;
                var st = t / 1;
                var st1 = st - 1;
                var s = (p / (2 * PI)) * asin(1);
                return -(pow(2, 10 * st1) * sin(((st1 - s) * (2 * PI)) / p));
            },
            back: function(t) {
                return t * t * (3 * t - 2);
            },
            bounce: function(t) {
                var pow2,
                    bounce = 4;
                /* eslint-disable no-empty */

                while (t < ((pow2 = pow(2, --bounce)) - 1) / 11) {}

                return (
                    1 / pow(4, 3 - bounce) - 7.5625 * pow((pow2 * 3 - 2) / 22 - t, 2)
                );
            }
        };
        each(['quad', 'cubic', 'quart', 'quint', 'expo'], function(name, i) {
            fns[name] = function(t) {
                return pow(t, i + 2);
            };
        });
        var DEFAULT_ELASTICITY = 400;
        each(fns, function(fn, name) {
            name = upperFirst(name);
            exports['in' + name] = fn;

            exports['out' + name] = function(t, m) {
                return 1 - fn(1 - t, m);
            };

            exports['inOut' + name] = function(t, m) {
                return t < 0.5 ? fn(t * 2, m) / 2 : 1 - fn(t * -2 + 2, m) / 2;
            };

            exports['outIn' + name] = function(t, m) {
                return t < 0.5
                    ? (1 - fn(1 - 2 * t, m)) / 2
                    : (fn(t * 2 - 1, m) + 1) / 2;
            };
        });

        return exports;
    })({});

    /* ------------------------------ invert ------------------------------ */

    var invert = _.invert = (function (exports) {
        /* Create an object composed of the inverted keys and values of object.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |obj   |Object to invert   |
         * |return|New inverted object|
         *
         * If object contains duplicate values, subsequent values overwrite property assignments of previous values.
         */

        /* example
         * invert({ a: 'b', c: 'd', e: 'f' }); // -> {b: 'a', d: 'c', f: 'e'}
         */

        /* typescript
         * export declare function invert(obj: any): any;
         */

        /* dependencies
         * each 
         */

        exports = function(obj) {
            var ret = {};
            each(obj, function(val, key) {
                ret[val] = key;
            });
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ mime ------------------------------ */

    var mime = _.mime = (function (exports) {
        /* Common mime types.
         *
         * |Name  |Desc     |
         * |------|---------|
         * |name  |Extension|
         * |return|Mime type|
         *
         * |Name  |Desc     |
         * |------|---------|
         * |name  |Mime type|
         * |return|Extension|
         *
         * It contains only the most common file types.
         */

        /* example
         * mime('jpg'); // -> 'image/jpeg'
         * mime('bmp'); // -> 'image/bmp'
         * mime('video/mp4'); // -> 'mp4'
         * mime('test'); // -> undefined
         */

        /* typescript
         * export declare function mime(name: string): string | undefined;
         */

        /* dependencies
         * each 
         */

        var exts = {
            // image
            'image/jpeg': ['jpeg', 'jpg'],
            'image/png': ['png'],
            'image/gif': ['gif'],
            'image/webp': ['webp'],
            'image/tiff': ['tif', 'tiff'],
            'image/bmp': ['bmp'],
            'image/vnd.adobe.photoshop': ['psd'],
            'image/svg+xml': ['svg'],
            // audio
            'audio/mp4': ['m4a', 'mp4a'],
            'audio/midi': ['midi'],
            'audio/mpeg': ['mpga', 'mp2', 'mp2a', 'mp3', 'm2a', 'm3a'],
            'audio/ogg': ['ogg'],
            'audio/wav': ['wav'],
            // video
            'video/mp4': ['mp4', 'mp4v', 'mpg4'],
            'video/x-matroska': ['mkv'],
            'video/webm': ['webm'],
            'video/x-msvideo': ['avi'],
            'video/quicktime': ['qt', 'mov'],
            'video/mpeg': ['mpeg', 'mpg', 'mpe', 'm1v', 'm2v'],
            'video/3gpp': ['3gp', '3gpp'],
            // text
            'text/css': ['css'],
            'text/html': ['html', 'htm', 'shtml'],
            'text/yaml': ['yaml', 'yml'],
            'text/csv': ['csv'],
            'text/markdown': ['markdown', 'md'],
            'text/plain': ['txt', 'text', 'conf', 'log', 'ini'],
            // font
            'font/ttf': ['ttf'],
            'font/woff': ['woff'],
            'font/woff2': ['woff2'],
            // application
            'application/zip': ['zip'],
            'application/x-tar': ['tar'],
            'application/x-rar-compressed': ['rar'],
            'application/gzip': ['gz'],
            'application/x-7z-compressed': ['7z'],
            'application/octet-stream': [
                'bin',
                'so',
                'exe',
                'dll',
                'dmg',
                'iso',
                'msi'
            ],
            'application/epub+zip': ['epub'],
            'application/javascript': ['js'],
            'application/json': ['json'],
            'application/msword': ['doc', 'docx', 'dot', 'dotx'],
            'application/vnd.ms-excel': ['xls', 'xlsx', 'xla', 'xlt'],
            'application/vnd.ms-powerpoint': ['ppt', 'pptx', 'pps', 'pot'],
            'application/pdf': ['pdf'],
            'application/wasm': ['wasm'],
            'application/xml': ['xml'],
            'application/xml-dtd': ['dtd']
        };
        var mimeTypes = {};
        each(exts, function(ext, mimeType) {
            each(ext, function(e) {
                mimeTypes[e] = mimeType;
            });
        });

        exports = function(name) {
            return (isMimeType(name) ? getExt(name) : getType(name)) || undefined;
        };

        function getType(name) {
            return mimeTypes[name];
        }

        function getExt(name) {
            if (exts[name]) {
                return exts[name][0];
            }
        }

        function isMimeType(name) {
            return name.indexOf('/') > -1;
        }

        return exports;
    })({});

    /* ------------------------------ values ------------------------------ */

    var values = _.values = (function (exports) {
        /* Create an array of the own enumerable property values of object.
         *
         * |Name  |Desc                    |
         * |------|------------------------|
         * |obj   |Object to query         |
         * |return|Array of property values|
         */

        /* example
         * values({ one: 1, two: 2 }); // -> [1, 2]
         */

        /* typescript
         * export declare function values(obj: any): any[];
         */

        /* dependencies
         * each 
         */

        exports = function(obj) {
            var ret = [];
            each(obj, function(val) {
                ret.push(val);
            });
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ reduce ------------------------------ */

    var reduce = _.reduce = (function (exports) {
        /* Turn a list of values into a single value.
         *
         * |Name             |Desc                          |
         * |-----------------|------------------------------|
         * |obj              |Collection to iterate over    |
         * |iterator=identity|Function invoked per iteration|
         * |initial          |Initial value                 |
         * |ctx              |Function context              |
         * |return           |Accumulated value             |
         */

        /* example
         * reduce(
         *     [1, 2, 3],
         *     function(sum, n) {
         *         return sum + n;
         *     },
         *     0
         * ); // -> 6
         */

        /* typescript
         * export declare function reduce<T, TResult>(
         *     list: types.List<T>,
         *     iterator: types.MemoIterator<T, TResult>,
         *     memo?: TResult,
         *     context?: any
         * ): TResult;
         * export declare function reduce<T, TResult>(
         *     list: types.Dictionary<T>,
         *     iterator: types.MemoObjectIterator<T, TResult>,
         *     memo?: TResult,
         *     context?: any
         * ): TResult;
         */

        /* dependencies
         * optimizeCb isArrLike isUndef keys types 
         */

        exports = createReduce(1);
        exports.create = createReduce;

        function createReduce(dir) {
            return function(obj, iterator, initial, ctx) {
                iterator = optimizeCb(iterator, ctx);
                var i, len, key;

                if (isArrLike(obj)) {
                    len = obj.length;
                    i = dir > 0 ? 0 : len - 1;

                    if (isUndef(initial)) {
                        initial = obj[i];
                        i += dir;
                    }

                    for (; i < len && i >= 0; i += dir) {
                        initial = iterator(initial, obj[i], i, obj);
                    }
                } else {
                    var _keys = keys(obj);

                    len = _keys.length;
                    i = dir > 0 ? 0 : len - 1;

                    if (isUndef(initial)) {
                        initial = obj[_keys[i]];
                        i += dir;
                    }

                    for (; i < len && i >= 0; i += dir) {
                        key = _keys[i];
                        initial = iterator(initial, obj[key], key, obj);
                    }
                }

                return initial;
            };
        }

        return exports;
    })({});

    /* ------------------------------ isStr ------------------------------ */

    var isStr = _.isStr = (function (exports) {
        /* Check if value is a string primitive.
         *
         * |Name  |Desc                               |
         * |------|-----------------------------------|
         * |val   |Value to check                     |
         * |return|True if value is a string primitive|
         */

        /* example
         * isStr('licia'); // -> true
         */

        /* typescript
         * export declare function isStr(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object String]';
        };

        return exports;
    })({});

    /* ------------------------------ className ------------------------------ */
    _.className = (function (exports) {
        /* Utility for conditionally joining class names.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |names |Class names       |
         * |return|Joined class names|
         */

        /* example
         * className('a', 'b', 'c'); // -> 'a b c'
         * className('a', false, 'b', 0, 1, 'c'); // -> 'a b 1 c'
         * className('a', ['b', 'c']); // -> 'a b c'
         * className('a', { b: false, c: true }); // -> 'a c'
         * className('a', ['b', 'c', { d: true, e: false }]); // -> 'a b c d';
         */

        /* typescript
         * export declare function className(...names: any[]): string;
         */

        /* dependencies
         * each isStr isNum isArr isObj 
         */

        exports = function() {
            var ret = [];
            each(arguments, function(arg) {
                if (!arg) return;
                if (isStr(arg) || isNum(arg)) return ret.push(arg);
                if (isArr(arg)) return ret.push(exports.apply(null, arg));
                if (!isObj(arg)) return;
                each(arg, function(val, key) {
                    if (val) ret.push(key);
                });
            });
            return ret.join(' ');
        };

        return exports;
    })({});

    /* ------------------------------ contain ------------------------------ */

    var contain = _.contain = (function (exports) {
        /* Check if the value is present in the list.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |target|Target object                       |
         * |val   |Value to check                      |
         * |return|True if value is present in the list|
         */

        /* example
         * contain([1, 2, 3], 1); // -> true
         * contain({ a: 1, b: 2 }, 1); // -> true
         * contain('abc', 'a'); // -> true
         */

        /* typescript
         * export declare function contain(arr: any[] | {} | string, val: any): boolean;
         */

        /* dependencies
         * idxOf isStr isArrLike values 
         */

        exports = function(arr, val) {
            if (isStr(arr)) return arr.indexOf(val) > -1;
            if (!isArrLike(arr)) arr = values(arr);
            return idxOf(arr, val) >= 0;
        };

        return exports;
    })({});

    /* ------------------------------ dateFormat ------------------------------ */

    var dateFormat = _.dateFormat = (function (exports) {
        /* Simple but extremely useful date format function.
         *
         * |Name         |Desc                 |
         * |-------------|---------------------|
         * |date=new Date|Date object to format|
         * |mask         |Format mask          |
         * |utc=false    |UTC or not           |
         * |gmt=false    |GMT or not           |
         * |return       |Formatted duration   |
         *
         * |Mask|Desc                                                             |
         * |----|-----------------------------------------------------------------|
         * |d   |Day of the month as digits; no leading zero for single-digit days|
         * |dd  |Day of the month as digits; leading zero for single-digit days   |
         * |ddd |Day of the week as a three-letter abbreviation                   |
         * |dddd|Day of the week as its full name                                 |
         * |m   |Month as digits; no leading zero for single-digit months         |
         * |mm  |Month as digits; leading zero for single-digit months            |
         * |mmm |Month as a three-letter abbreviation                             |
         * |mmmm|Month as its full name                                           |
         * |yy  |Year as last two digits; leading zero for years less than 10     |
         * |yyyy|Year represented by four digits                                  |
         * |h   |Hours; no leading zero for single-digit hours (12-hour clock)    |
         * |hh  |Hours; leading zero for single-digit hours (12-hour clock)       |
         * |H   |Hours; no leading zero for single-digit hours (24-hour clock)    |
         * |HH  |Hours; leading zero for single-digit hours (24-hour clock)       |
         * |M   |Minutes; no leading zero for single-digit minutes                |
         * |MM  |Minutes; leading zero for single-digit minutes                   |
         * |s   |Seconds; no leading zero for single-digit seconds                |
         * |ss  |Seconds; leading zero for single-digit seconds                   |
         * |l L |Milliseconds. l gives 3 digits. L gives 2 digits                 |
         * |t   |Lowercase, single-character time marker string: a or p           |
         * |tt  |Lowercase, two-character time marker string: am or pm            |
         * |T   |Uppercase, single-character time marker string: A or P           |
         * |TT  |Uppercase, two-character time marker string: AM or PM            |
         * |Z   |US timezone abbreviation, e.g. EST or MDT                        |
         * |o   |GMT/UTC timezone offset, e.g. -0500 or +0230                     |
         * |S   |The date's ordinal suffix (st, nd, rd, or th)                    |
         * |UTC:|Must be the first four characters of the mask                    |
         */

        /* example
         * dateFormat('isoDate'); // -> 2016-11-19
         * dateFormat('yyyy-mm-dd HH:MM:ss'); // -> 2016-11-19 19:00:04
         * dateFormat(new Date(), 'yyyy-mm-dd'); // -> 2016-11-19
         */

        /* typescript
         * export declare function dateFormat(
         *     date: Date,
         *     mask: string,
         *     utc?: boolean,
         *     gmt?: boolean
         * ): string;
         * export declare function dateFormat(
         *     mask: string,
         *     utc?: boolean,
         *     gmt?: boolean
         * ): string;
         */

        /* dependencies
         * isStr isDate toStr lpad 
         */

        exports = function(date, mask, utc, gmt) {
            if (arguments.length === 1 && isStr(date) && !regNum.test(date)) {
                mask = date;
                date = undefined;
            }

            date = date || new Date();
            if (!isDate(date)) date = new Date(date);
            mask = toStr(exports.masks[mask] || mask || exports.masks['default']);
            var maskSlice = mask.slice(0, 4);

            if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
                mask = mask.slice(4);
                utc = true;
                if (maskSlice === 'GMT:') gmt = true;
            }

            var prefix = utc ? 'getUTC' : 'get';
            var d = date[prefix + 'Date']();
            var D = date[prefix + 'Day']();
            var m = date[prefix + 'Month']();
            var y = date[prefix + 'FullYear']();
            var H = date[prefix + 'Hours']();
            var M = date[prefix + 'Minutes']();
            var s = date[prefix + 'Seconds']();
            var L = date[prefix + 'Milliseconds']();
            var o = utc ? 0 : date.getTimezoneOffset();
            var flags = {
                d: d,
                dd: padZero(d),
                ddd: exports.i18n.dayNames[D],
                dddd: exports.i18n.dayNames[D + 7],
                m: m + 1,
                mm: padZero(m + 1),
                mmm: exports.i18n.monthNames[m],
                mmmm: exports.i18n.monthNames[m + 12],
                yy: toStr(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: padZero(H % 12 || 12),
                H: H,
                HH: padZero(H),
                M: M,
                MM: padZero(M),
                s: s,
                ss: padZero(s),
                l: padZero(L, 3),
                L: padZero(Math.round(L / 10)),
                t: H < 12 ? 'a' : 'p',
                tt: H < 12 ? 'am' : 'pm',
                T: H < 12 ? 'A' : 'P',
                TT: H < 12 ? 'AM' : 'PM',
                Z: gmt
                    ? 'GMT'
                    : utc
                    ? 'UTC'
                    : (toStr(date).match(regTimezone) || [''])
                          .pop()
                          .replace(regTimezoneClip, ''),
                o:
                    (o > 0 ? '-' : '+') +
                    padZero(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4),
                S: ['th', 'st', 'nd', 'rd'][
                    d % 10 > 3 ? 0 : (((d % 100) - (d % 10) != 10) * d) % 10
                ]
            };
            return mask.replace(regToken, function(match) {
                if (match in flags) return flags[match];
                return match.slice(1, match.length - 1);
            });
        };

        var padZero = function(str) {
            var len =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
            return lpad(toStr(str), len, '0');
        };

        var regToken = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
        var regTimezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
        var regNum = /\d/;
        var regTimezoneClip = /[^-+\dA-Z]/g;
        exports.masks = {
            default: 'ddd mmm dd yyyy HH:MM:ss',
            shortDate: 'm/d/yy',
            mediumDate: 'mmm d, yyyy',
            longDate: 'mmmm d, yyyy',
            fullDate: 'dddd, mmmm d, yyyy',
            shortTime: 'h:MM TT',
            mediumTime: 'h:MM:ss TT',
            longTime: 'h:MM:ss TT Z',
            isoDate: 'yyyy-mm-dd',
            isoTime: 'HH:MM:ss',
            isoDateTime: "yyyy-mm-dd'T'HH:MM:sso",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
            expiresHeaderFormat: 'ddd, dd mmm yyyy HH:MM:ss Z'
        };
        exports.i18n = {
            dayNames: [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat',
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            monthNames: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
        };

        return exports;
    })({});

    /* ------------------------------ defineProp ------------------------------ */

    var defineProp = _.defineProp = (function (exports) {
        /* Shortcut for Object.defineProperty(defineProperties).
         *
         * |Name      |Desc               |
         * |----------|-------------------|
         * |obj       |Object to define   |
         * |prop      |Property path      |
         * |descriptor|Property descriptor|
         * |return    |Object itself      |
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |obj   |Object to define    |
         * |prop  |Property descriptors|
         * |return|Object itself       |
         */

        /* example
         * const obj = { b: { c: 3 }, d: 4, e: 5 };
         * defineProp(obj, 'a', {
         *     get: function() {
         *         return this.e * 2;
         *     }
         * });
         * // obj.a is equal to 10
         * defineProp(obj, 'b.c', {
         *     set: function(val) {
         *         // this is pointed to obj.b
         *         this.e = val;
         *     }.bind(obj)
         * });
         * obj.b.c = 2;
         * // obj.a is equal to 4
         *
         * const obj2 = { a: 1, b: 2, c: 3 };
         * defineProp(obj2, {
         *     a: {
         *         get: function() {
         *             return this.c;
         *         }
         *     },
         *     b: {
         *         set: function(val) {
         *             this.c = val / 2;
         *         }
         *     }
         * });
         * // obj2.a is equal to 3
         * obj2.b = 4;
         * // obj2.a is equal to 2
         */

        /* typescript
         * export declare function defineProp<T>(
         *     obj: T,
         *     prop: string,
         *     descriptor: PropertyDescriptor
         * ): T;
         * export declare function defineProp<T>(
         *     obj: T,
         *     descriptor: PropertyDescriptorMap
         * ): T;
         */

        /* dependencies
         * castPath isStr isObj each 
         */

        exports = function(obj, prop, descriptor) {
            if (isStr(prop)) {
                defineProp(obj, prop, descriptor);
            } else if (isObj(prop)) {
                each(prop, function(descriptor, prop) {
                    defineProp(obj, prop, descriptor);
                });
            }

            return obj;
        };

        function defineProp(obj, prop, descriptor) {
            var path = castPath(prop, obj);
            var lastProp = path.pop();
            /* eslint-disable no-cond-assign */

            while ((prop = path.shift())) {
                if (!obj[prop]) obj[prop] = {};
                obj = obj[prop];
            }

            Object.defineProperty(obj, lastProp, descriptor);
        }

        return exports;
    })({});

    /* ------------------------------ isEmpty ------------------------------ */

    var isEmpty = _.isEmpty = (function (exports) {
        /* Check if value is an empty object or array.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |val   |Value to check        |
         * |return|True if value is empty|
         */

        /* example
         * isEmpty([]); // -> true
         * isEmpty({}); // -> true
         * isEmpty(''); // -> true
         */

        /* typescript
         * export declare function isEmpty(val: any): boolean;
         */

        /* dependencies
         * isArrLike isArr isStr isArgs keys 
         */

        exports = function(val) {
            if (val == null) return true;

            if (isArrLike(val) && (isArr(val) || isStr(val) || isArgs(val))) {
                return val.length === 0;
            }

            return keys(val).length === 0;
        };

        return exports;
    })({});

    /* ------------------------------ toBool ------------------------------ */

    var toBool = _.toBool = (function (exports) {
        /* Convert value to a boolean.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |val   |Value to convert |
         * |return|Converted boolean|
         */

        /* example
         * toBool(true); // -> true
         * toBool(null); // -> false
         * toBool(1); // -> true
         * toBool(0); // -> false
         * toBool('0'); // -> false
         * toBool('1'); // -> true
         * toBool('false'); // -> false
         */

        /* typescript
         * export declare function toBool(val: any): boolean;
         */

        /* dependencies
         * isStr 
         */

        exports = function(val) {
            if (isStr(val)) {
                val = val.toLowerCase();
                return val !== '0' && val !== '' && val !== 'false';
            }

            return !!val;
        };

        return exports;
    })({});

    /* ------------------------------ toNum ------------------------------ */

    var toNum = _.toNum = (function (exports) {
        /* Convert value to a number.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |val   |Value to process|
         * |return|Result number   |
         */

        /* example
         * toNum('5'); // -> 5
         */

        /* typescript
         * export declare function toNum(val: any): number;
         */

        /* dependencies
         * isNum isObj isFn isStr 
         */

        exports = function(val) {
            if (isNum(val)) return val;

            if (isObj(val)) {
                var temp = isFn(val.valueOf) ? val.valueOf() : val;
                val = isObj(temp) ? temp + '' : temp;
            }

            if (!isStr(val)) return val === 0 ? val : +val;
            return +val;
        };

        return exports;
    })({});

    /* ------------------------------ toInt ------------------------------ */

    var toInt = _.toInt = (function (exports) {
        /* Convert value to an integer.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |val   |Value to convert |
         * |return|Converted integer|
         */

        /* example
         * toInt(1.1); // -> 1
         * toInt(undefined); // -> 0
         */

        /* typescript
         * export declare function toInt(val: any): number;
         */

        /* dependencies
         * toNum 
         */

        exports = function(val) {
            if (!val) return val === 0 ? val : 0;
            val = toNum(val);
            return val - (val % 1);
        };

        return exports;
    })({});

    /* ------------------------------ cmpVersion ------------------------------ */

    var cmpVersion = _.cmpVersion = (function (exports) {
        /* Compare version strings.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |v1    |Version to compare|
         * |v2    |Version to compare|
         * |return|Comparison result |
         */

        /* example
         * cmpVersion('1.1.8', '1.0.4'); // -> 1
         * cmpVersion('1.0.2', '1.0.2'); // -> 0
         * cmpVersion('2.0', '2.0.0'); // -> 0
         * cmpVersion('3.0.1', '3.0.0.2'); // -> 1
         * cmpVersion('1.1.1', '1.2.3'); // -> -1
         */

        /* typescript
         * export declare function cmpVersion(v1: string, v2: string): number;
         */

        /* dependencies
         * toInt max 
         */

        exports = function(v1, v2) {
            v1 = v1.split('.');
            v2 = v2.split('.');
            var len = max(v1.length, v2.length);

            for (var i = 0; i < len; i++) {
                var num1 = toInt(v1[i]);
                var num2 = toInt(v2[i]);
                if (num1 > num2) return 1;
                if (num1 < num2) return -1;
            }

            return 0;
        };

        return exports;
    })({});

    /* ------------------------------ detectBrowser ------------------------------ */
    _.detectBrowser = (function (exports) {
        /* Detect browser info using ua.
         *
         * |Name                  |Desc                              |
         * |----------------------|----------------------------------|
         * |ua=navigator.userAgent|Browser userAgent                 |
         * |return                |Object containing name and version|
         *
         * Browsers supported: ie, chrome, edge, firefox, opera, safari, ios(mobile safari), android(android browser)
         */

        /* example
         * const browser = detectBrowser();
         * if (browser.name === 'ie' && browser.version < 9) {
         *     // Do something about old IE...
         * }
         */

        /* typescript
         * export declare function detectBrowser(
         *     ua?: string
         * ): {
         *     name: string;
         *     version: number;
         * };
         */

        /* dependencies
         * isBrowser toInt keys 
         */

        exports = function(ua) {
            ua = ua || (isBrowser ? navigator.userAgent : '');
            ua = ua.toLowerCase();
            var ieVer = getVer(ua, 'msie ');
            if (ieVer)
                return {
                    version: ieVer,
                    name: 'ie'
                };
            if (regIe11.test(ua))
                return {
                    version: 11,
                    name: 'ie'
                };

            for (var i = 0, len = browsers.length; i < len; i++) {
                var name = browsers[i];
                var match = ua.match(regBrowsers[name]);
                if (match == null) continue;
                var version = toInt(match[1].split('.')[0]);
                if (name === 'opera') version = getVer(ua, 'version/') || version;
                return {
                    name: name,
                    version: version
                };
            }

            return {
                name: 'unknown',
                version: -1
            };
        };

        var regBrowsers = {
            edge: /edge\/([0-9._]+)/,
            firefox: /firefox\/([0-9.]+)(?:\s|$)/,
            opera: /opera\/([0-9.]+)(?:\s|$)/,
            android: /android\s([0-9.]+)/,
            ios: /version\/([0-9._]+).*mobile.*safari.*/,
            safari: /version\/([0-9._]+).*safari/,
            chrome: /(?!chrom.*opr)chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/
        };
        var regIe11 = /trident\/7\./;
        var browsers = keys(regBrowsers);

        function getVer(ua, mark) {
            var idx = ua.indexOf(mark);
            if (idx > -1)
                return toInt(ua.substring(idx + mark.length, ua.indexOf('.', idx)));
        }

        return exports;
    })({});

    /* ------------------------------ durationFormat ------------------------------ */
    _.durationFormat = (function (exports) {
        /* Simple duration format function.
         *
         * |Name           |Desc                           |
         * |---------------|-------------------------------|
         * |duration       |Duration to format, millisecond|
         * |mask='hh:mm:ss'|Format mask                    |
         * |return         |Formatted duration             |
         *
         * |Mask|Desc        |
         * |----|------------|
         * |d   |Days        |
         * |h   |Hours       |
         * |m   |Minutes     |
         * |s   |Seconds     |
         * |l   |Milliseconds|
         */

        /* example
         * durationFormat(12345678); // -> '03:25:45'
         * durationFormat(12345678, 'h:m:s:l'); // -> '3:25:45:678'
         */

        /* typescript
         * export declare function durationFormat(duration: number, mask?: string): string;
         */

        /* dependencies
         * toInt lpad toStr 
         */

        var floor = Math.floor;

        exports = function(duration) {
            var mask =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : 'hh:mm:ss';
            duration = toInt(duration);
            var d = floor(duration / 86400000);
            var h = floor(duration / 3600000) % 24;
            var m = floor(duration / 60000) % 60;
            var s = floor(duration / 1000) % 60;
            var l = floor(duration) % 1000;
            var flags = {
                d: d,
                h: h,
                hh: padZero(h),
                m: m,
                mm: padZero(m),
                s: s,
                ss: padZero(s),
                l: l,
                ll: padZero(l, 3)
            };
            return mask.replace(regToken, function(match) {
                if (match in flags) return flags[match];
                return match.slice(1, match.length - 1);
            });
        };

        var padZero = function(str) {
            var len =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
            return lpad(toStr(str), len, '0');
        };

        var regToken = /d{1,2}|h{1,2}|m{1,2}|s{1,2}|l{1,2}|"[^"]*"|'[^']*'/g;

        return exports;
    })({});

    /* ------------------------------ format ------------------------------ */
    _.format = (function (exports) {
        /* Format string in a printf-like format.
         *
         * |Name     |Desc                               |
         * |---------|-----------------------------------|
         * |str      |String to format                   |
         * |...values|Values to replace format specifiers|
         * |return   |Formatted string                   |
         *
         * ### Format Specifiers
         *
         * |Specifier|Desc                |
         * |---------|--------------------|
         * |%s       |String              |
         * |%d, %i   |Integer             |
         * |%f       |Floating point value|
         * |%o       |Object              |
         */

        /* example
         * format('%s_%s', 'foo', 'bar'); // -> 'foo_bar'
         */

        /* typescript
         * export declare function format(str: string, ...values: any[]): string;
         */

        /* dependencies
         * restArgs toInt toNum toStr 
         */

        exports = restArgs(function(str, values) {
            var ret = '';

            for (var i = 0, len = str.length; i < len; i++) {
                var c = str[i];

                if (c !== '%' || values.length === 0) {
                    ret += c;
                    continue;
                }

                i++;
                var val = values.shift();

                switch (str[i]) {
                    case 'i':
                    case 'd':
                        ret += toInt(val);
                        break;

                    case 'f':
                        ret += toNum(val);
                        break;

                    case 's':
                        ret += toStr(val);
                        break;

                    case 'o':
                        ret += tryStringify(val);
                        break;

                    default:
                        i--;
                        values.unshift(val);
                        ret += c;
                }
            }

            return ret;
        });

        function tryStringify(obj) {
            try {
                return JSON.stringify(obj);
            } catch (err) {
                return '[Error Stringify]';
            }
        }

        return exports;
    })({});

    /* ------------------------------ isAsyncFn ------------------------------ */
    _.isAsyncFn = (function (exports) {
        /* Check if value is an async function.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |val   |Value to check                    |
         * |return|True if value is an async function|
         */

        /* example
         * isAsyncFn(function*() {}); // -> false
         * isAsyncFn(function() {}); // -> false
         * isAsyncFn(async function() {}); // -> true
         */

        /* typescript
         * export declare function isAsyncFn(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object AsyncFunction]';
        };

        return exports;
    })({});

    /* ------------------------------ isClose ------------------------------ */
    _.isClose = (function (exports) {
        /* Check if values are close(almost equal) to each other.
         *
         * `abs(a-b) <= max(relTol * max(abs(a), abs(b)), absTol)`
         *
         * |Name       |Desc                    |
         * |-----------|------------------------|
         * |a          |Number to compare       |
         * |b          |Number to compare       |
         * |relTol=1e-9|Relative tolerance      |
         * |absTol=0   |Absolute tolerance      |
         * |return     |True if values are close|
         */

        /* example
         * isClose(1, 1.0000000001); // -> true
         * isClose(1, 2); // -> false
         * isClose(1, 1.2, 0.3); // -> true
         * isClose(1, 1.2, 0.1, 0.3); // -> true
         */

        /* typescript
         * export declare function isClose(
         *     a: number,
         *     b: number,
         *     relTol?: number,
         *     absTol?: number
         * ): boolean;
         */

        /* dependencies
         * isNum 
         */

        exports = function(a, b, relTol, absTol) {
            if (!isNum(relTol)) relTol = 1e-9;
            if (!isNum(absTol)) absTol = 0;
            return abs(a - b) <= max(relTol * max(abs(a), abs(b)), absTol);
        };

        var abs = Math.abs;
        var max = Math.max;

        return exports;
    })({});

    /* ------------------------------ isEmail ------------------------------ */
    _.isEmail = (function (exports) {
        /* Loosely validate an email address.
         *
         * |Name  |Desc                                 |
         * |------|-------------------------------------|
         * |val   |Value to check                       |
         * |return|True if value is an email like string|
         */

        /* example
         * isEmail('surunzi@foxmail.com'); // -> true
         */

        /* typescript
         * export declare function isEmail(val: string): boolean;
         */
        exports = function(val) {
            return regEmail.test(val);
        };

        var regEmail = /.+@.+\..+/;

        return exports;
    })({});

    /* ------------------------------ isEqual ------------------------------ */
    _.isEqual = (function (exports) {
        /* Performs an optimized deep comparison between the two objects, to determine if they should be considered equal.
         *
         * |Name  |Desc                         |
         * |------|-----------------------------|
         * |val   |Value to compare             |
         * |other |Other value to compare       |
         * |return|True if values are equivalent|
         */

        /* example
         * isEqual([1, 2, 3], [1, 2, 3]); // -> true
         */

        /* typescript
         * export declare function isEqual(val: any, other: any): boolean;
         */

        /* dependencies
         * isFn has keys 
         */

        exports = function(a, b) {
            return eq(a, b);
        };

        function deepEq(a, b, aStack, bStack) {
            var className = toString.call(a);
            if (className !== toString.call(b)) return false;

            switch (className) {
                case '[object RegExp]':
                case '[object String]':
                    return '' + a === '' + b;

                case '[object Number]':
                    if (+a !== +a) return +b !== +b;
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;

                case '[object Date]':
                case '[object Boolean]':
                    return +a === +b;
            }

            var areArrays = className === '[object Array]';

            if (!areArrays) {
                if (typeof a != 'object' || typeof b != 'object') return false;
                var aCtor = a.constructor;
                var bCtor = b.constructor;
                if (
                    aCtor !== bCtor &&
                    !(
                        isFn(aCtor) &&
                        aCtor instanceof aCtor &&
                        isFn(bCtor) &&
                        bCtor instanceof bCtor
                    ) &&
                    'constructor' in a &&
                    'constructor' in b
                )
                    return false;
            }

            aStack = aStack || [];
            bStack = bStack || [];
            var length = aStack.length;

            while (length--) {
                if (aStack[length] === a) return bStack[length] === b;
            }

            aStack.push(a);
            bStack.push(b);

            if (areArrays) {
                length = a.length;
                if (length !== b.length) return false;

                while (length--) {
                    if (!eq(a[length], b[length], aStack, bStack)) return false;
                }
            } else {
                var _keys = keys(a);

                var key;
                length = _keys.length;
                if (keys(b).length !== length) return false;

                while (length--) {
                    key = _keys[length];
                    if (!(has(b, key) && eq(a[key], b[key], aStack, bStack)))
                        return false;
                }
            }

            aStack.pop();
            bStack.pop();
            return true;
        }

        function eq(a, b, aStack, bStack) {
            if (a === b) return a !== 0 || 1 / a === 1 / b;
            if (a == null || b == null) return a === b;
            if (a !== a) return b !== b;
            var type = typeof a;
            if (type !== 'function' && type !== 'object' && typeof b != 'object')
                return false;
            return deepEq(a, b, aStack, bStack);
        }

        return exports;
    })({});

    /* ------------------------------ isErr ------------------------------ */
    _.isErr = (function (exports) {
        /* Check if value is an error.
         *
         * |Name  |Desc                     |
         * |------|-------------------------|
         * |val   |Value to check           |
         * |return|True if value is an error|
         */

        /* example
         * isErr(new Error()); // -> true
         */

        /* typescript
         * export declare function isErr(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Error]';
        };

        return exports;
    })({});

    /* ------------------------------ isInt ------------------------------ */

    var isInt = _.isInt = (function (exports) {
        /* Checks if value is classified as a Integer.
         *
         * |Name  |Desc                                 |
         * |------|-------------------------------------|
         * |val   |Value to check                       |
         * |return|True if value is correctly classified|
         */

        /* example
         * isInt(5); // -> true
         * isInt(5.1); // -> false
         * isInt({}); // -> false
         */

        /* typescript
         * export declare function isInt(val: any): boolean;
         */

        /* dependencies
         * isNum 
         */

        exports = function(val) {
            return isNum(val) && val % 1 === 0;
        };

        return exports;
    })({});

    /* ------------------------------ isEven ------------------------------ */
    _.isEven = (function (exports) {
        /* Check if number is even.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |num   |Number to check       |
         * |return|True if number is even|
         */

        /* example
         * isEven(0); // -> true
         * isEven(1); // -> false
         * isEven(2); // -> true
         */

        /* typescript
         * export declare function isEven(num: number): boolean;
         */

        /* dependencies
         * isInt 
         */

        exports = function(num) {
            if (!isInt(num)) return false;
            return num % 2 === 0;
        };

        return exports;
    })({});

    /* ------------------------------ isOdd ------------------------------ */

    var isOdd = _.isOdd = (function (exports) {
        /* Check if number is odd.
         *
         * |Name  |Desc                 |
         * |------|---------------------|
         * |num   |Number to check      |
         * |return|True if number is odd|
         */

        /* example
         * isOdd(0); // -> false
         * isOdd(1); // -> true
         * isOdd(2); // -> false
         */

        /* typescript
         * export declare function isOdd(num: number): boolean;
         */

        /* dependencies
         * isInt 
         */

        exports = function(num) {
            if (!isInt(num)) return false;
            return num % 2 !== 0;
        };

        return exports;
    })({});

    /* ------------------------------ hex ------------------------------ */

    var hex = _.hex = (function (exports) {
        /* Hex encoding and decoding.
         *
         * ### encode
         *
         * Turn a byte array into a hex string.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |bytes |Byte array|
         * |return|hex string|
         *
         * ### decode
         *
         * Turn a hex string into a byte array.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |str   |hex string|
         * |return|Byte array|
         */

        /* example
         * hex.encode([168, 174, 155, 255]); // -> 'a8ae9bff'
         * hex.decode('a8ae9bff'); // -> [168, 174, 155, 255]
         */

        /* typescript
         * export declare const hex: {
         *     encode(bytes: number[]): string;
         *     decode(str: string): number[];
         * };
         */

        /* dependencies
         * isOdd 
         */

        exports = {
            encode: function(bytes) {
                var hex = [];

                for (var i = 0, len = bytes.length; i < len; i++) {
                    var byte = bytes[i];
                    hex.push((byte >>> 4).toString(16));
                    hex.push((byte & 0xf).toString(16));
                }

                return hex.join('');
            },
            decode: function(str) {
                var bytes = [];
                var len = str.length;
                if (isOdd(len)) len--;

                for (var i = 0; i < len; i += 2) {
                    bytes.push(parseInt(str.substr(i, 2), 16));
                }

                return bytes;
            }
        };

        return exports;
    })({});

    /* ------------------------------ isFinite ------------------------------ */

    var isFinite = _.isFinite = (function (exports) {
        /* Check if value is a finite primitive number.
         *
         * |Name  |Desc                            |
         * |------|--------------------------------|
         * |val   |Value to check                  |
         * |return|True if value is a finite number|
         */

        /* example
         * isFinite(3); // -> true
         * isFinite(Infinity); // -> false
         */

        /* typescript
         * export declare function isFinite(val: any): boolean;
         */

        /* dependencies
         * root 
         */

        var nativeIsFinite = root.isFinite;
        var nativeIsNaN = root.isNaN;

        exports = function(val) {
            return nativeIsFinite(val) && !nativeIsNaN(parseFloat(val));
        };

        return exports;
    })({});

    /* ------------------------------ isFullWidth ------------------------------ */

    var isFullWidth = _.isFullWidth = (function (exports) {
        /* Check if character is full width.
         *
         * |Name     |Desc                           |
         * |---------|-------------------------------|
         * |codePoint|Unicode code point             |
         * |return   |True if character is full width|
         */

        /* example
         * isFullWidth('a'.codePointAt(0)); // -> false
         * isFullWidth(','.codePointAt(0)); // -> false
         * isFullWidth('我'.codePointAt(0)); // -> true
         * isFullWidth('，'.codePointAt(0)); // -> true
         */

        /* typescript
         * export declare function isFullWidth(codePoint: number): boolean;
         */

        /* dependencies
         * isInt 
         */ // https://github.com/sindresorhus/is-fullwidth-code-point

        exports = function isFullWidth(c) {
            if (!isInt(c)) {
                return false;
            }
            /* https://unicode.org/Public/UNIDATA/EastAsianWidth.txt
             * Characters with East_Asian_Width property W or F.
             */

            return (
                c >= 0x1100 &&
                (c <= 0x115f ||
                    c === 0x2329 ||
                    c === 0x232a ||
                    (0x2e80 <= c && c <= 0x3247 && c !== 0x303f) ||
                    (0x3250 <= c && c <= 0x4dbf) ||
                    (0x4e00 <= c && c <= 0xa4c6) ||
                    (0xa960 <= c && c <= 0xa97c) ||
                    (0xac00 <= c && c <= 0xd7a3) ||
                    (0xf900 <= c && c <= 0xfaff) ||
                    (0xfe10 <= c && c <= 0xfe19) ||
                    (0xfe30 <= c && c <= 0xfe6b) ||
                    (0xff01 <= c && c <= 0xff60) ||
                    (0xffe0 <= c && c <= 0xffe6) ||
                    (0x1b000 <= c && c <= 0x1b001) ||
                    (0x1f200 <= c && c <= 0x1f251) ||
                    (0x20000 <= c && c <= 0x3fffd))
            );
        };

        return exports;
    })({});

    /* ------------------------------ isGeneratorFn ------------------------------ */

    var isGeneratorFn = _.isGeneratorFn = (function (exports) {
        /* Check if value is a generator function.
         *
         * |Name  |Desc                                 |
         * |------|-------------------------------------|
         * |val   |Value to check                       |
         * |return|True if value is a generator function|
         */

        /* example
         * isGeneratorFn(function*() {}); // -> true
         * isGeneratorFn(function() {}); // -> false
         */

        /* typescript
         * export declare function isGeneratorFn(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object GeneratorFunction]';
        };

        return exports;
    })({});

    /* ------------------------------ isIp ------------------------------ */
    _.isIp = (function (exports) {
        /* Check if value is an IP address.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |str   |String to check               |
         * |return|True if value is an IP address|
         *
         * ### v4
         *
         * Check if value is an IPv4 address.
         *
         * ### v6
         *
         * Check if value is an IPv6 address.
         */

        /* example
         * isIp('192.168.191.1'); // -> true
         * isIp('1:2:3:4:5:6:7:8'); // -> true
         * isIp('test'); // -> false
         * isIp.v4('192.168.191.1'); // -> true
         * isIp.v6('1:2:3:4:5:6:7:8'); // -> true
         */

        /* typescript
         * export declare namespace isIp {
         *     function v4(str: string): boolean;
         *     function v6(str: string): boolean;
         * }
         * export declare function isIp(str: string): boolean;
         */
        exports = function(str) {
            return exports.v4(str) || exports.v6(str);
        }; // https://github.com/sindresorhus/ip-regex

        var v4 =
            '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';
        var regV4 = new RegExp('^'.concat(v4, '$'));
        var v6seg = '[a-fA-F\\d]{1,4}';
        var v6 = [
            '(',
            '(?:'.concat(v6seg, ':){7}(?:').concat(v6seg, '|:)|'),
            '(?:'
                .concat(v6seg, ':){6}(?:')
                .concat(v4, '|:')
                .concat(v6seg, '|:)|'),
            '(?:'
                .concat(v6seg, ':){5}(?::')
                .concat(v4, '|(:')
                .concat(v6seg, '){1,2}|:)|'),
            '(?:'
                .concat(v6seg, ':){4}(?:(:')
                .concat(v6seg, '){0,1}:')
                .concat(v4, '|(:')
                .concat(v6seg, '){1,3}|:)|'),
            '(?:'
                .concat(v6seg, ':){3}(?:(:')
                .concat(v6seg, '){0,2}:')
                .concat(v4, '|(:')
                .concat(v6seg, '){1,4}|:)|'),
            '(?:'
                .concat(v6seg, ':){2}(?:(:')
                .concat(v6seg, '){0,3}:')
                .concat(v4, '|(:')
                .concat(v6seg, '){1,5}|:)|'),
            '(?:'
                .concat(v6seg, ':){1}(?:(:')
                .concat(v6seg, '){0,4}:')
                .concat(v4, '|(:')
                .concat(v6seg, '){1,6}|:)|'),
            '(?::((?::'
                .concat(v6seg, '){0,5}:')
                .concat(v4, '|(?::')
                .concat(v6seg, '){1,7}|:))'),
            ')(%[0-9a-zA-Z]{1,})?'
        ].join('');
        var regV6 = new RegExp('^'.concat(v6, '$'));

        exports.v4 = function(str) {
            return regV4.test(str);
        };

        exports.v6 = function(str) {
            return regV6.test(str);
        };

        return exports;
    })({});

    /* ------------------------------ isJson ------------------------------ */
    _.isJson = (function (exports) {
        /* Check if value is a valid JSON.
         *
         * It uses `JSON.parse()` and a `try... catch` block.
         *
         * |Name  |Desc                         |
         * |------|-----------------------------|
         * |val   |JSON string                  |
         * |return|True if value is a valid JSON|
         */

        /* example
         * isJson('{"a": 5}'); // -> true
         * isJson("{'a': 5}"); // -> false
         */

        /* typescript
         * export declare function isJson(val: string): boolean;
         */
        exports = function(val) {
            try {
                JSON.parse(val);
                return true;
            } catch (e) {
                return false;
            }
        };

        return exports;
    })({});

    /* ------------------------------ isLeapYear ------------------------------ */

    var isLeapYear = _.isLeapYear = (function (exports) {
        /* Check if a year is a leap year.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |year  |Year to check              |
         * |return|True if year is a leap year|
         */

        /* example
         * isLeapYear(2000); // -> true
         * isLeapYear(2002); // -> false
         */

        /* typescript
         * export declare function isLeapYear(year: number): boolean;
         */
        exports = function(year) {
            return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
        };

        return exports;
    })({});

    /* ------------------------------ isMap ------------------------------ */
    _.isMap = (function (exports) {
        /* Check if value is a Map object.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |val   |Value to check        |
         * |return|True if value is a Map|
         */

        /* example
         * isMap(new Map()); // -> true
         * isMap(new WeakMap()); // -> false
         */

        /* typescript
         * export declare function isMap(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Map]';
        };

        return exports;
    })({});

    /* ------------------------------ isMatch ------------------------------ */

    var isMatch = _.isMatch = (function (exports) {
        /* Check if keys and values in src are contained in obj.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |obj   |Object to inspect                 |
         * |src   |Object of property values to match|
         * |return|True if object is match           |
         */

        /* example
         * isMatch({ a: 1, b: 2 }, { a: 1 }); // -> true
         */

        /* typescript
         * export declare function isMatch(obj: any, src: any): boolean;
         */

        /* dependencies
         * keys 
         */

        exports = function(obj, src) {
            var _keys = keys(src);

            var len = _keys.length;
            if (obj == null) return !len;
            obj = Object(obj);

            for (var i = 0; i < len; i++) {
                var key = _keys[i];
                if (src[key] !== obj[key] || !(key in obj)) return false;
            }

            return true;
        };

        return exports;
    })({});

    /* ------------------------------ isMobile ------------------------------ */
    _.isMobile = (function (exports) {
        /* Check whether client is using a mobile browser using ua.
         *
         * |Name                  |Desc                                 |
         * |----------------------|-------------------------------------|
         * |ua=navigator.userAgent|User agent                           |
         * |return                |True if ua belongs to mobile browsers|
         */

        /* example
         * isMobile(navigator.userAgent);
         */

        /* typescript
         * export declare function isMobile(ua?: string): boolean;
         */

        /* dependencies
         * isBrowser memoize 
         */

        var regMobileAll = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
        var regMobileFour = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;
        exports = memoize(function(ua) {
            ua = ua || (isBrowser ? navigator.userAgent : '');
            return regMobileAll.test(ua) || regMobileFour.test(ua.substr(0, 4));
        });

        return exports;
    })({});

    /* ------------------------------ isNaN ------------------------------ */

    var isNaN = _.isNaN = (function (exports) {
        /* Check if value is an NaN.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |val   |Value to check         |
         * |return|True if value is an NaN|
         *
         * Undefined is not an NaN, different from global isNaN function.
         */

        /* example
         * isNaN(0); // -> false
         * isNaN(NaN); // -> true
         */

        /* typescript
         * export declare function isNaN(val: any): boolean;
         */

        /* dependencies
         * isNum 
         */

        exports = function(val) {
            return isNum(val) && val !== +val;
        };

        return exports;
    })({});

    /* ------------------------------ type ------------------------------ */

    var type = _.type = (function (exports) {
        /* Determine the internal JavaScript [[Class]] of an object.
         *
         * |Name          |Desc             |
         * |--------------|-----------------|
         * |val           |Value to get type|
         * |lowerCase=true|LowerCase result |
         * |return        |Type of object   |
         */

        /* example
         * type(5); // -> 'number'
         * type({}); // -> 'object'
         * type(function() {}); // -> 'function'
         * type([]); // -> 'array'
         * type([], false); // -> 'Array'
         * type(async function() {}, false); // -> 'AsyncFunction'
         */

        /* typescript
         * export declare function type(val: any, lowerCase?: boolean): string;
         */

        /* dependencies
         * objToStr isNaN lowerCase isBuffer 
         */

        exports = function(val) {
            var lower =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : true;
            var ret;
            if (val === null) ret = 'Null';
            if (val === undefined) ret = 'Undefined';
            if (isNaN(val)) ret = 'NaN';
            if (isBuffer(val)) ret = 'Buffer';

            if (!ret) {
                ret = objToStr(val).match(regObj);
                if (ret) ret = ret[1];
            }

            if (!ret) return '';
            return lower ? lowerCase(ret) : ret;
        };

        var regObj = /^\[object\s+(.*?)]$/;

        return exports;
    })({});

    /* ------------------------------ convertBin ------------------------------ */
    _.convertBin = (function (exports) {
        /* Convert binary data type.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |bin   |Binary data to convert|
         * |type  |Binary type           |
         * |return|Target binary         |
         *
         * ### Supported binary type
         *
         * base64, ArrayBuffer, Array, Uint8Array, Blob(browser), Buffer(node)
         *
         * You can not convert Blob to other types directly since it's an asynchronous process.
         *
         * ### blobToArrBuffer
         *
         * Convert Blob to ArrayBuffer.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |blob  |Blob to convert    |
         * |return|ArrayBuffer promise|
         */

        /* example
         * convertBin('qK6b/w==', 'Uint8Array'); // -> [168, 174, 155, 255]
         * convertBin.blobToArrBuffer(new Blob([])).then(arrBuffer => {
         *     // Do something...
         * });
         */

        /* typescript
         * export declare namespace convertBin {
         *     function blobToArrBuffer(blob: any): Promise<ArrayBuffer>;
         * }
         * export declare function convertBin(bin: any, type: string): any;
         */

        /* dependencies
         * isStr base64 isArrBuffer isArr isBuffer type lowerCase 
         */

        function exports(bin, t) {
            var result;
            t = lowerCase(t);

            if (isStr(bin)) {
                result = new Uint8Array(base64.decode(bin));
            } else if (isArrBuffer(bin)) {
                bin = bin.slice(0);
                result = new Uint8Array(bin);
            } else if (isArr(bin)) {
                result = new Uint8Array(bin);
            } else if (type(bin) === 'uint8array') {
                result = bin.slice(0);
            } else if (isBuffer(bin)) {
                result = new Uint8Array(bin.length);

                for (var i = 0; i < bin.length; i++) {
                    result[i] = bin[i];
                }
            }

            if (result) {
                switch (t) {
                    case 'base64':
                        result = base64.encode(result);
                        break;

                    case 'arraybuffer':
                        result = result.buffer;
                        break;

                    case 'array':
                        result = [].slice.call(result);
                        break;

                    case 'buffer':
                        result = Buffer.from(result);
                        break;

                    case 'blob':
                        result = new Blob([result.buffer]);
                        break;
                }
            }

            return result;
        }

        exports.blobToArrBuffer = function(blob) {
            return new Promise(function(resolve, reject) {
                var fileReader = new FileReader();

                fileReader.onload = function(e) {
                    resolve(e.target.result);
                };

                fileReader.onerror = function(err) {
                    reject(err);
                };

                fileReader.readAsArrayBuffer(blob);
            });
        };

        return exports;
    })({});

    /* ------------------------------ fileType ------------------------------ */
    _.fileType = (function (exports) {
        function _slicedToArray(arr, i) {
            return (
                _arrayWithHoles(arr) ||
                _iterableToArrayLimit(arr, i) ||
                _unsupportedIterableToArray(arr, i) ||
                _nonIterableRest()
            );
        }

        function _nonIterableRest() {
            throw new TypeError(
                'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
        }

        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === 'Object' && o.constructor) n = o.constructor.name;
            if (n === 'Map' || n === 'Set') return Array.from(o);
            if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return _arrayLikeToArray(o, minLen);
        }

        function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        }

        function _iterableToArrayLimit(arr, i) {
            if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr)))
                return;
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
                for (
                    var _i = arr[Symbol.iterator](), _s;
                    !(_n = (_s = _i.next()).done);
                    _n = true
                ) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i['return'] != null) _i['return']();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }

        function _arrayWithHoles(arr) {
            if (Array.isArray(arr)) return arr;
        }

        /* Detect file type using magic number.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |input |File input                    |
         * |return|Object containing ext and mime|
         *
         * ### Supported file types
         *
         * jpg, png, gif, webp, bmp, gz, zip, rar, pdf, exe
         */

        /* example
         * const fs = require('fs');
         * const file = fs.readFileSync('path/to/file');
         * console.log(fileType(file)); // -> { ext: 'jpg', mime: 'image/jpeg' }
         */

        /* typescript
         * export declare function fileType(
         *     input: Buffer | ArrayBuffer | Uint8Array
         * ):
         *     | {
         *           ext: string;
         *           mime: string;
         *       }
         *     | undefined;
         */

        /* dependencies
         * type mime isFn 
         */

        exports = function(input) {
            if (type(input) !== 'uint8array') {
                input = new Uint8Array(input);
            }

            for (var i = 0, len = types.length; i < len; i++) {
                var _type = types[i];

                var _type2 = _slicedToArray(_type, 3),
                    ext = _type2[0],
                    magic = _type2[1],
                    offset = _type2[2];

                if (isFn(magic)) {
                    if (magic(input)) {
                        return {
                            ext: ext,
                            mime: mime(ext)
                        };
                    }
                } else if (check(input, magic, offset)) {
                    return {
                        ext: ext,
                        mime: mime(ext)
                    };
                }
            }
        };

        var types = [
            ['jpg', [0xff, 0xd8, 0xff]],
            ['png', [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
            ['gif', [0x47, 0x49, 0x46]],
            ['webp', [0x57, 0x45, 0x42, 0x50], 8],
            ['bmp', [0x42, 0x4d]],
            ['gz', [0x1f, 0x8b, 0x8]],
            [
                'zip',
                function(input) {
                    return (
                        check(input, [0x50, 0x4b]) &&
                        (input[2] === 0x3 || input[2] === 0x5 || input[2] === 0x7) &&
                        (input[3] === 0x4 || input[3] === 0x6 || input[3] === 0x8)
                    );
                }
            ],
            [
                'rar',
                function(input) {
                    return (
                        check(input, [0x52, 0x61, 0x72, 0x21, 0x1a, 0x7]) &&
                        (input[6] === 0x0 || input[6] === 0x1)
                    );
                }
            ],
            ['pdf', [0x25, 0x50, 0x44, 0x46]],
            ['exe', [0x4d, 0x5a]]
        ];

        function check(input, magic) {
            var offset =
                arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            for (var i = 0, len = magic.length; i < len; i++) {
                if (input[offset + i] !== magic[i]) {
                    return false;
                }
            }

            return true;
        }

        return exports;
    })({});

    /* ------------------------------ fnArgs ------------------------------ */
    _.fnArgs = (function (exports) {
        /* Validate function arguments.
         *
         * |Name |Desc           |
         * |-----|---------------|
         * |types|Argument types |
         * |args |Argument object|
         *
         * It throws an exception when validation failed.
         */

        /* example
         * function test(a, b, c) {
         *     fnArgs(['number|string', '?Function', '...number'], arguments);
         *     // Do something.
         * }
         * // @ts-ignore
         * test(15);
         * // @ts-ignore
         * test('test', () => {});
         * test('test', () => {}, 5);
         * // @ts-ignore
         * test(); // Throw error
         * // @ts-ignore
         * test('test', 'test'); // Throw error
         * // @ts-ignore
         * test('test', () => {}, 5, 'test'); // Throw error
         */

        /* typescript
         * export declare function fnArgs(types: string[], args: any): void;
         */

        /* dependencies
         * startWith last lowerCase isObj type 
         */

        exports = function(types, args) {
            var argsLen = args.length;
            var typesLen = types.length;
            var minLen = typesLen;
            var maxLen = typesLen;

            for (var i = 0; i < typesLen; i++) {
                var _type = types[i].split('|');

                if (startWith(_type[0], '?')) {
                    _type[0] = _type[0].slice(1);

                    if (minLen === typesLen) {
                        minLen = i;
                    }
                }

                if (i === typesLen - 1 && startWith(_type[0], '...')) {
                    maxLen = Infinity;
                    _type[0] = _type[0].slice(3);

                    if (minLen === typesLen) {
                        minLen = i;
                    }
                }

                types[i] = _type;
            }

            if (argsLen < minLen) {
                throw Error(
                    'Expected at least '
                        .concat(minLen, ' args but got ')
                        .concat(argsLen)
                );
            } else if (argsLen > maxLen) {
                throw Error(
                    'Expected at most '.concat(maxLen, ' args but got ').concat(argsLen)
                );
            }

            for (var _i = 0; _i < argsLen; _i++) {
                var arg = args[_i];

                if (_i >= typesLen) {
                    validateArg(arg, last(types), _i);
                } else {
                    validateArg(arg, types[_i], _i);
                }
            }
        };

        function validateArg(value, types, num) {
            var isValid = false;

            for (var i = 0, len = types.length; i < len; i++) {
                var t = lowerCase(types[i]);

                if (
                    t === 'any' ||
                    (t === 'object' && isObj(value)) ||
                    type(value) === t
                ) {
                    isValid = true;
                    break;
                }
            }

            if (!isValid) {
                throw TypeError(
                    'Argument '.concat(num, ' should be type ').concat(types.join('|'))
                );
            }
        }

        return exports;
    })({});

    /* ------------------------------ isNil ------------------------------ */

    var isNil = _.isNil = (function (exports) {
        /* Check if value is null or undefined, the same as value == null.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |val   |Value to check                    |
         * |return|True if value is null or undefined|
         */

        /* example
         * isNil(null); // -> true
         * isNil(void 0); // -> true
         * isNil(undefined); // -> true
         * isNil(false); // -> false
         * isNil(0); // -> false
         * isNil([]); // -> false
         */

        /* typescript
         * export declare function isNil(val: any): boolean;
         */
        exports = function(val) {
            return val == null;
        };

        return exports;
    })({});

    /* ------------------------------ toSrc ------------------------------ */

    var toSrc = _.toSrc = (function (exports) {
        /* Convert function to its source code.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |fn    |Function to convert|
         * |return|Source code        |
         */

        /* example
         * toSrc(Math.min); // -> 'function min() { [native code] }'
         * toSrc(function() {}); // -> 'function () { }'
         */

        /* typescript
         * export declare function toSrc(fn: types.AnyFn): string;
         */

        /* dependencies
         * isNil types 
         */

        exports = function(fn) {
            if (isNil(fn)) return '';

            try {
                return fnToStr.call(fn);
                /* eslint-disable no-empty */
            } catch (e) {}

            try {
                return fn + '';
                /* eslint-disable no-empty */
            } catch (e) {}

            return '';
        };

        var fnToStr = Function.prototype.toString;

        return exports;
    })({});

    /* ------------------------------ fnParams ------------------------------ */
    _.fnParams = (function (exports) {
        /* Get a function parameter's names.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |fn    |Function to get parameters|
         * |return|Names                     |
         */

        /* example
         * fnParams(function(a, b) {}); // -> ['a', 'b']
         */

        /* typescript
         * export declare function fnParams(fn: types.AnyFn | string): string[];
         */

        /* dependencies
         * toSrc stripCmt startWith isStr types 
         */

        exports = function(fn) {
            var fnStr = stripCmt(isStr(fn) ? fn : toSrc(fn));
            var open;
            var close;

            if (
                !startWith(fnStr, 'async') &&
                !startWith(fnStr, 'function') &&
                !startWith(fnStr, '(')
            ) {
                // Arrow function with no brackets
                open = 0;
                close = fnStr.indexOf('=>');
            } else {
                open = fnStr.indexOf('(') + 1;
                close = fnStr.indexOf(')');
            }

            var ret = fnStr.slice(open, close);
            ret = ret.match(regArgNames);
            return ret === null ? [] : ret;
        };

        var regArgNames = /[^\s,]+/g;

        return exports;
    })({});

    /* ------------------------------ isNative ------------------------------ */
    _.isNative = (function (exports) {
        /* Check if value is a native function.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |val   |Value to check                    |
         * |return|True if value is a native function|
         */

        /* example
         * isNative(function() {}); // -> false
         * isNative(Math.min); // -> true
         */

        /* typescript
         * export declare function isNative(val: any): boolean;
         */

        /* dependencies
         * isObj isFn toSrc 
         */

        exports = function(val) {
            if (!isObj(val)) return false;
            if (isFn(val)) return regIsNative.test(toSrc(val)); // Detect host constructors (Safari > 4; really typed array specific)

            return regIsHostCtor.test(toSrc(val));
        };

        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var regIsNative = new RegExp(
            '^' +
                toSrc(hasOwnProperty)
                    .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
                    .replace(
                        /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                        '$1.*?'
                    ) +
                '$'
        );
        var regIsHostCtor = /^\[object .+?Constructor\]$/;

        return exports;
    })({});

    /* ------------------------------ isNull ------------------------------ */

    var isNull = _.isNull = (function (exports) {
        /* Check if value is an Null.
         *
         * |Name  |Desc                    |
         * |------|------------------------|
         * |val   |Value to check          |
         * |return|True if value is an Null|
         */

        /* example
         * isNull(null); // -> true
         */

        /* typescript
         * export declare function isNull(val: any): boolean;
         */
        exports = function(val) {
            return val === null;
        };

        return exports;
    })({});

    /* ------------------------------ isNumeric ------------------------------ */
    _.isNumeric = (function (exports) {
        /* Check if value is numeric.
         *
         * |Name  |Desc                    |
         * |------|------------------------|
         * |val   |Value to check          |
         * |return|True if value is numeric|
         */

        /* example
         * isNumeric(1); // -> true
         * isNumeric('1'); // -> true
         * isNumeric(Number.MAX_VALUE); // -> true
         * isNumeric(0xff); // -> true
         * isNumeric(''); // -> false
         * isNumeric('1.1.1'); // -> false
         * isNumeric(NaN); // -> false
         */

        /* typescript
         * export declare function isNumeric(val: any): boolean;
         */

        /* dependencies
         * isStr isNaN isFinite isArr 
         */

        exports = function(val) {
            if (isStr(val)) val = val.replace(regComma, '');
            return !isNaN(parseFloat(val)) && isFinite(val) && !isArr(val);
        };

        var regComma = /,/g;

        return exports;
    })({});

    /* ------------------------------ isPrime ------------------------------ */
    _.isPrime = (function (exports) {
        /* Check if the provided integer is a prime number.
         *
         * |Name  |Desc                            |
         * |------|--------------------------------|
         * |num   |Number to check                 |
         * |return|True if number is a prime number|
         */

        /* example
         * isPrime(11); // -> true
         * isPrime(8); // -> false
         */

        /* typescript
         * export declare function isPrime(num: number): boolean;
         */
        exports = function(num) {
            var boundary = Math.floor(Math.sqrt(num));

            for (var i = 2; i <= boundary; i++) {
                if (num % i === 0) {
                    return false;
                }
            }

            return num >= 2;
        };

        return exports;
    })({});

    /* ------------------------------ isPrimitive ------------------------------ */
    _.isPrimitive = (function (exports) {
        /* Check if value is string, number, boolean or null.
         *
         * |Name  |Desc                        |
         * |------|----------------------------|
         * |val   |Value to check              |
         * |return|True if value is a primitive|
         */

        /* example
         * isPrimitive(5); // -> true
         * isPrimitive('abc'); // -> true
         * isPrimitive(false); // -> true
         */

        /* typescript
         * export declare function isPrimitive(val: any): boolean;
         */
        exports = function(val) {
            var type = typeof val;
            return val == null || (type !== 'function' && type !== 'object');
        };

        return exports;
    })({});

    /* ------------------------------ isPromise ------------------------------ */

    var isPromise = _.isPromise = (function (exports) {
        /* Check if value looks like a promise.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |val   |Value to check                    |
         * |return|True if value looks like a promise|
         */

        /* example
         * isPromise(new Promise(function() {})); // -> true
         * isPromise({}); // -> false
         */

        /* typescript
         * export declare function isPromise(val: any): boolean;
         */

        /* dependencies
         * isObj isFn 
         */

        exports = function(val) {
            return isObj(val) && isFn(val.then) && isFn(val.catch);
        };

        return exports;
    })({});

    /* ------------------------------ isRegExp ------------------------------ */

    var isRegExp = _.isRegExp = (function (exports) {
        /* Check if value is a regular expression.
         *
         * |Name  |Desc                                 |
         * |------|-------------------------------------|
         * |val   |Value to check                       |
         * |return|True if value is a regular expression|
         */

        /* example
         * isRegExp(/a/); // -> true
         */

        /* typescript
         * export declare function isRegExp(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object RegExp]';
        };

        return exports;
    })({});

    /* ------------------------------ isRelative ------------------------------ */
    _.isRelative = (function (exports) {
        /* Check if path appears to be relative.
         *
         * |Name  |Desc                               |
         * |------|-----------------------------------|
         * |path  |Path to check                      |
         * |return|True if path appears to be relative|
         */

        /* example
         * isRelative('README.md'); // -> true
         */

        /* typescript
         * export declare function isRelative(path: string): boolean;
         */
        exports = function(path) {
            return !regAbsolute.test(path);
        };

        var regAbsolute = /^([a-z]+:)?[\\/]/i;

        return exports;
    })({});

    /* ------------------------------ isSet ------------------------------ */
    _.isSet = (function (exports) {
        /* Check if value is a Set object.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |val   |Value to check        |
         * |return|True if value is a Set|
         */

        /* example
         * isSet(new Set()); // -> true
         * isSet(new WeakSet()); // -> false
         */

        /* typescript
         * export declare function isSet(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Set]';
        };

        return exports;
    })({});

    /* ------------------------------ isSymbol ------------------------------ */

    var isSymbol = _.isSymbol = (function (exports) {
        /* Check if value is a symbol.
         *
         * |Name  |Desc                     |
         * |------|-------------------------|
         * |val   |Value to check           |
         * |return|True if value is a symbol|
         */

        /* example
         * isSymbol(Symbol('test')); // -> true
         */

        /* typescript
         * export declare function isSymbol(val: any): boolean;
         */
        exports = function(val) {
            return typeof val === 'symbol';
        };

        return exports;
    })({});

    /* ------------------------------ safeSet ------------------------------ */

    var safeSet = _.safeSet = (function (exports) {
        /* Set value at path of object.
         *
         * If a portion of path doesn't exist, it's created.
         *
         * |Name|Desc                   |
         * |----|-----------------------|
         * |obj |Object to modify       |
         * |path|Path of property to set|
         * |val |Value to set           |
         */

        /* example
         * const obj = {};
         * safeSet(obj, 'a.aa.aaa', 1); // obj = {a: {aa: {aaa: 1}}}
         * safeSet(obj, ['a', 'aa'], 2); // obj = {a: {aa: 2}}
         * safeSet(obj, 'a.b', 3); // obj = {a: {aa: 2, b: 3}}
         */

        /* typescript
         * export declare function safeSet(
         *     obj: any,
         *     path: string | string[],
         *     val: any
         * ): void;
         */

        /* dependencies
         * castPath isUndef toStr isSymbol isStr 
         */

        exports = function(obj, path, val) {
            path = castPath(path, obj);
            var lastProp = path.pop();
            var prop;
            prop = path.shift();

            while (!isUndef(prop)) {
                // #25
                if (!isStr(prop) && !isSymbol(prop)) {
                    prop = toStr(prop);
                }

                if (
                    prop === '__proto__' ||
                    prop === 'constructor' ||
                    prop === 'prototype'
                ) {
                    return;
                }

                if (!obj[prop]) obj[prop] = {};
                obj = obj[prop];
                prop = path.shift();
            }

            obj[lastProp] = val;
        };

        return exports;
    })({});

    /* ------------------------------ isTypedArr ------------------------------ */
    _.isTypedArr = (function (exports) {
        /* Check if value is a typed array.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |val   |Value to check                |
         * |return|True if value is a typed array|
         */

        /* example
         * isTypedArr([]); // -> false
         * isTypedArr(new Uint8Array(8)); // -> true
         */

        /* typescript
         * export declare function isTypedArr(val: any): boolean;
         */

        /* dependencies
         * objToStr each 
         */

        exports = function(val) {
            return !!map[objToStr(val)];
        };

        var map = {};
        each(
            [
                'Int8Array',
                'Int16Array',
                'Int32Array',
                'Uint8Array',
                'Uint8ClampedArray',
                'Uint16Array',
                'Uint32Array',
                'Float32Array',
                'Float64Array'
            ],
            function(val) {
                map['[object ' + val + ']'] = true;
            }
        );

        return exports;
    })({});

    /* ------------------------------ isUrl ------------------------------ */
    _.isUrl = (function (exports) {
        /* Loosely validate an url.
         *
         * |Name  |Desc                               |
         * |------|-----------------------------------|
         * |val   |Value to check                     |
         * |return|True if value is an url like string|
         */

        /* example
         * isUrl('http://www.example.com?foo=bar&param=test'); // -> true
         */

        /* typescript
         * export declare function isUrl(val: string): boolean;
         */
        exports = function(val) {
            return regUrl.test(val);
        };

        var regUrl = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

        return exports;
    })({});

    /* ------------------------------ isWeakMap ------------------------------ */
    _.isWeakMap = (function (exports) {
        /* Check if value is a WeakMap object.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |val   |Value to check            |
         * |return|True if value is a WeakMap|
         */

        /* example
         * isWeakMap(new Map()); // -> false
         * isWeakMap(new WeakMap()); // -> true
         */

        /* typescript
         * export declare function isWeakMap(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object WeakMap]';
        };

        return exports;
    })({});

    /* ------------------------------ isWeakSet ------------------------------ */
    _.isWeakSet = (function (exports) {
        /* Check if value is a WeakSet object.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |val   |Value to check            |
         * |return|True if value is a WeakSet|
         */

        /* example
         * isWeakSet(new Set()); // -> false
         * isWeakSet(new WeakSet()); // -> true
         */

        /* typescript
         * export declare function isWeakSet(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object WeakSet]';
        };

        return exports;
    })({});

    /* ------------------------------ jsonClone ------------------------------ */
    _.jsonClone = (function (exports) {
        /* Use JSON parse and stringify to clone object.
         *
         * |Name  |Desc          |
         * |------|--------------|
         * |val   |Value to clone|
         * |return|Cloned value  |
         */

        /* example
         * jsonClone({ name: 'licia' }); // -> { name: 'licia' }
         */

        /* typescript
         * export declare function jsonClone<T>(val: T): T;
         */
        exports = function(val) {
            return JSON.parse(JSON.stringify(val));
        };

        return exports;
    })({});

    /* ------------------------------ kebabCase ------------------------------ */
    _.kebabCase = (function (exports) {
        /* Convert string to "kebabCase".
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to convert |
         * |return|Kebab cased string|
         */

        /* example
         * kebabCase('fooBar'); // -> foo-bar
         * kebabCase('foo bar'); // -> foo-bar
         * kebabCase('foo_bar'); // -> foo-bar
         * kebabCase('foo.bar'); // -> foo-bar
         */

        /* typescript
         * export declare function kebabCase(str: string): string;
         */

        /* dependencies
         * splitCase 
         */

        exports = function(str) {
            return splitCase(str).join('-');
        };

        return exports;
    })({});

    /* ------------------------------ keyCode ------------------------------ */
    _.keyCode = (function (exports) {
        /* Key codes and key names conversion.
         *
         * Get key code's name.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |code  |Key code              |
         * |return|Corresponding key name|
         *
         * Get key name's code.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |name  |Key name              |
         * |return|Corresponding key code|
         */

        /* example
         * keyCode(13); // -> 'enter'
         * keyCode('enter'); // -> 13
         */

        /* typescript
         * export declare function keyCode(name: string): number;
         * export declare function keyCode(code: number): string;
         */

        /* dependencies
         * isStr invert 
         */

        exports = function(val) {
            if (isStr(val)) return codeMap[val];
            return nameMap[val];
        };

        var codeMap = {
            backspace: 8,
            tab: 9,
            enter: 13,
            shift: 16,
            ctrl: 17,
            alt: 18,
            'pause/break': 19,
            'caps lock': 20,
            esc: 27,
            space: 32,
            'page up': 33,
            'page down': 34,
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            insert: 45,
            delete: 46,
            windows: 91,
            'right windows': 92,
            'windows menu': 93,
            'numpad *': 106,
            'numpad +': 107,
            'numpad -': 109,
            'numpad .': 110,
            'numpad /': 111,
            'num lock': 144,
            'scroll lock': 145,
            ';': 186,
            '=': 187,
            ',': 188,
            '-': 189,
            '.': 190,
            '/': 191,
            '`': 192,
            '[': 219,
            '\\': 220,
            ']': 221,
            "'": 222
        }; // Lower case chars

        for (var i = 97; i < 123; i++) {
            codeMap[String.fromCharCode(i)] = i - 32;
        } // Numbers

        for (var _i = 48; _i < 58; _i++) {
            codeMap[_i - 48] = _i;
        } // Function keys

        for (var _i2 = 1; _i2 < 13; _i2++) {
            codeMap['f' + _i2] = _i2 + 111;
        } // Numpad keys

        for (var _i3 = 0; _i3 < 10; _i3++) {
            codeMap['numpad ' + _i3] = _i3 + 96;
        }

        var nameMap = invert(codeMap);

        return exports;
    })({});

    /* ------------------------------ size ------------------------------ */

    var size = _.size = (function (exports) {
        /* Get size of object or length of array like object.
         *
         * |Name  |Desc                 |
         * |------|---------------------|
         * |obj   |Collection to inspect|
         * |return|Collection size      |
         */

        /* example
         * size({ a: 1, b: 2 }); // -> 2
         * size([1, 2, 3]); // -> 3
         */

        /* typescript
         * export declare function size(obj: any): number;
         */

        /* dependencies
         * isArrLike keys 
         */

        exports = function(obj) {
            return isArrLike(obj) ? obj.length : keys(obj).length;
        };

        return exports;
    })({});

    /* ------------------------------ longest ------------------------------ */

    var longest = _.longest = (function (exports) {
        /* Get the longest item in an array.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |arr   |Array to inspect|
         * |return|Longest item    |
         */

        /* example
         * longest(['a', 'abcde', 'abc']); // -> 'abcde'
         */

        /* typescript
         * export declare function longest(arr: string[]): string;
         */

        /* dependencies
         * size 
         */

        exports = function(arr) {
            if (arr.length < 1) return;
            var ret = arr[0],
                retSize = size(arr[0]);

            for (var i = 1, len = arr.length; i < len; i++) {
                var elSize = size(arr[i]);

                if (elSize > retSize) {
                    ret = arr[i];
                    retSize = elSize;
                }
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ ltrim ------------------------------ */

    var ltrim = _.ltrim = (function (exports) {
        /* Remove chars or white-spaces from beginning of string.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to trim    |
         * |chars |Characters to trim|
         * |return|Trimmed string    |
         */

        /* example
         * ltrim(' abc  '); // -> 'abc  '
         * ltrim('_abc_', '_'); // -> 'abc_'
         * ltrim('_abc_', ['a', '_']); // -> 'bc_'
         */

        /* typescript
         * export declare function ltrim(str: string, chars?: string | string[]): string;
         */
        var regSpace = /^\s+/;

        exports = function(str, chars) {
            if (chars == null) {
                if (str.trimLeft) {
                    return str.trimLeft();
                }

                return str.replace(regSpace, '');
            }

            var start = 0;
            var len = str.length;
            var charLen = chars.length;
            var found = true;
            var i;
            var c;

            while (found && start < len) {
                found = false;
                i = -1;
                c = str.charAt(start);

                while (++i < charLen) {
                    if (c === chars[i]) {
                        found = true;
                        start++;
                        break;
                    }
                }
            }

            return start >= len ? '' : str.substr(start, len);
        };

        return exports;
    })({});

    /* ------------------------------ matcher ------------------------------ */

    var matcher = _.matcher = (function (exports) {
        /* Return a predicate function that checks if attrs are contained in an object.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |attrs |Object of property values to match|
         * |return|New predicate function            |
         */

        /* example
         * const filter = require('licia/filter');
         *
         * const objects = [
         *     { a: 1, b: 2, c: 3 },
         *     { a: 4, b: 5, c: 6 }
         * ];
         * filter(objects, matcher({ a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6}]
         */

        /* typescript
         * export declare function matcher(attrs: any): types.AnyFn;
         */

        /* dependencies
         * extendOwn isMatch types 
         */

        exports = function(attrs) {
            attrs = extendOwn({}, attrs);
            return function(obj) {
                return isMatch(obj, attrs);
            };
        };

        return exports;
    })({});

    /* ------------------------------ wordsToBytes ------------------------------ */

    var wordsToBytes = _.wordsToBytes = (function (exports) {
        /* Convert 32-bit words to bytes.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |words |Word array|
         * |return|Byte array|
         */

        /* example
         * wordsToBytes([0x12345678]); // -> [0x12, 0x34, 0x56, 0x78]
         */

        /* typescript
         * export declare function wordsToBytes(words: number[]): number[];
         */
        exports = function(words) {
            var bytes = [];

            for (var b = 0, len = words.length * 32; b < len; b += 8) {
                bytes.push((words[b >>> 5] >>> (24 - (b % 32))) & 0xff);
            }

            return bytes;
        };

        return exports;
    })({});

    /* ------------------------------ mergeArr ------------------------------ */
    _.mergeArr = (function (exports) {
        /* Merge the contents of arrays together into the first array.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |first |Array to merge                      |
         * |arrays|Arrays to merge into the first array|
         * |return|First array                         |
         */

        /* example
         * const a = [1, 2];
         * mergeArr(a, [3, 4], [5, 6]);
         * console.log(a); // -> [1, 2, 3, 4, 5, 6]
         */

        /* typescript
         * export declare function mergeArr<T, U>(
         *     first: ArrayLike<T>,
         *     ...arrays: ArrayLike<U>[]
         * ): ArrayLike<T | U>;
         */

        /* dependencies
         * restArgs 
         */

        exports = restArgs(function(first, arrays) {
            var end = first.length;

            for (var i = 0, len = arrays.length; i < len; i++) {
                var arr = arrays[i];

                for (var j = 0, _len = arr.length; j < _len; j++) {
                    first[end++] = arr[j];
                }
            }

            first.length = end;
            return first;
        });

        return exports;
    })({});

    /* ------------------------------ mergeSort ------------------------------ */
    _.mergeSort = (function (exports) {
        /* Merge sort implementation.
         *
         * Note: It's not an "in-place" sort.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to sort|
         * |cmp   |Comparator   |
         * |return|Sorted array |
         */

        /* example
         * mergeSort([2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function mergeSort(arr: any[], cmp?: types.AnyFn): any[];
         */

        /* dependencies
         * isSorted types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : isSorted.defComparator;
            if (arr.length <= 1) return arr;
            var middle = floor(arr.length / 2);
            var left = arr.slice(0, middle);
            var right = arr.slice(middle);
            return merge(exports(left, cmp), exports(right, cmp), cmp);
        };

        function merge(left, right, cmp) {
            var ret = [];
            var i = 0;
            var j = 0;

            while (i < left.length && j < right.length) {
                cmp(left[i], right[j]) < 0 ? ret.push(left[i++]) : ret.push(right[j++]);
            }

            while (i < left.length) {
                ret.push(left[i++]);
            }

            while (j < right.length) {
                ret.push(right[j++]);
            }

            return ret;
        }

        var floor = Math.floor;

        return exports;
    })({});

    /* ------------------------------ methods ------------------------------ */
    _.methods = (function (exports) {
        /* Return a sorted list of the names of every method in an object.
         *
         * |Name  |Desc                    |
         * |------|------------------------|
         * |obj   |Object to check         |
         * |return|Function names in object|
         */

        /* example
         * methods(console); // -> ['Console', 'assert', 'dir', ...]
         */

        /* typescript
         * export declare function methods(obj: any): string[];
         */

        /* dependencies
         * isFn 
         */

        exports = function(obj) {
            var ret = [];

            for (var key in obj) {
                if (isFn(obj[key])) ret.push(key);
            }

            return ret.sort();
        };

        return exports;
    })({});

    /* ------------------------------ min ------------------------------ */

    var min = _.min = (function (exports) {
        /* Get minimum value of given numbers.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |...num|Numbers to calculate|
         * |return|Minimum value       |
         */

        /* example
         * min(2.3, 1, 4.5, 2); // 1
         */

        /* typescript
         * export declare function min(...num: number[]): number;
         */
        exports = function() {
            var arr = arguments;
            var ret = arr[0];

            for (var i = 1, len = arr.length; i < len; i++) {
                if (arr[i] < ret) ret = arr[i];
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ toDate ------------------------------ */

    var toDate = _.toDate = (function (exports) {
        /* Convert value to a Date.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |val   |Value to convert|
         * |return|Converted Date  |
         */

        /* example
         * toDate('20180501');
         * toDate('2018-05-01');
         * toDate(1525107450849);
         */

        /* typescript
         * export declare function toDate(val: any): Date;
         */

        /* dependencies
         * isDate isStr 
         */

        exports = function(val) {
            if (!val) return new Date();
            if (isDate(val)) return val;

            if (isStr(val)) {
                var match = val.match(regDate);
                if (match) return new Date(match[1], match[2] - 1, match[3]);
            }

            return new Date(val);
        };

        var regDate = /^(\d{4})-?(\d{2})-?(\d{1,2})$/;

        return exports;
    })({});

    /* ------------------------------ ms ------------------------------ */

    var ms = _.ms = (function (exports) {
        /* Convert time string formats to milliseconds.
         *
         * Turn time string into milliseconds.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |str   |String format|
         * |return|Milliseconds |
         *
         * Turn milliseconds into time string.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |num   |Milliseconds |
         * |return|String format|
         */

        /* example
         * ms('1s'); // -> 1000
         * ms('1m'); // -> 60000
         * ms('1.5h'); // -> 5400000
         * ms('1d'); // -> 86400000
         * ms('1y'); // -> 31557600000
         * ms('1000'); // -> 1000
         * ms(1500); // -> '1.5s'
         * ms(60000); // -> '1m'
         */

        /* typescript
         * export declare function ms(str: string): number;
         * export declare function ms(num: number): string;
         */

        /* dependencies
         * toNum isStr 
         */

        exports = function(str) {
            if (isStr(str)) {
                var match = str.match(regStrTime);
                if (!match) return 0;
                return toNum(match[1]) * factor[match[2] || 'ms'];
            } else {
                var num = str;
                var suffix = 'ms';

                for (var i = 0, len = suffixList.length; i < len; i++) {
                    if (num >= factor[suffixList[i]]) {
                        suffix = suffixList[i];
                        break;
                    }
                }

                return +(num / factor[suffix]).toFixed(2) + suffix;
            }
        };

        var factor = {
            ms: 1,
            s: 1000
        };
        factor.m = factor.s * 60;
        factor.h = factor.m * 60;
        factor.d = factor.h * 24;
        factor.y = factor.d * 365.25;
        var suffixList = ['y', 'd', 'h', 'm', 's'];
        var regStrTime = /^((?:\d+)?\.?\d+) *(s|m|h|d|y)?$/;

        return exports;
    })({});

    /* ------------------------------ upperCase ------------------------------ */

    var upperCase = _.upperCase = (function (exports) {
        /* Convert string to upper case.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |str   |String to convert|
         * |return|Uppercased string|
         */

        /* example
         * upperCase('test'); // -> 'TEST'
         */

        /* typescript
         * export declare function upperCase(str: string): string;
         */

        /* dependencies
         * toStr 
         */

        exports = function(str) {
            return toStr(str).toLocaleUpperCase();
        };

        return exports;
    })({});

    /* ------------------------------ morse ------------------------------ */
    _.morse = (function (exports) {
        /* Morse code encoding and decoding.
         *
         * ### encode
         *
         * Turn text into Morse code.
         *
         * |Name  |Desc          |
         * |------|--------------|
         * |txt   |Text to encode|
         * |return|Morse code    |
         *
         * ### decode
         *
         * Decode Morse code into text.
         *
         * |Name  |Desc          |
         * |------|--------------|
         * |morse |Morse code    |
         * |return|Decoded string|
         */

        /* example
         * const str = morse.encode('Hello, world.');
         * // -> '.... . .-.. .-.. --- --..-- ....... .-- --- .-. .-.. -.. .-.-.-'
         * morse.decode(str); // -> 'Hello, world.'
         */

        /* typescript
         * export declare const morse: {
         *     encode(txt: string): string;
         *     decode(morse: string): string;
         * };
         */

        /* dependencies
         * upperCase invert 
         */

        exports = {
            encode: function(txt) {
                var len = txt.length;
                var ret = Array(len);

                for (var i = 0; i < len; i++) {
                    var c = upperCase(txt[i]);
                    ret[i] = map[c] || '?';
                }

                return ret.join(' ');
            },
            decode: function(morse) {
                var ret = morse.split(' ');

                for (var i = 0, len = ret.length; i < len; i++) {
                    ret[i] = decodeMap[ret[i]] || ' ';
                }

                return ret.join('');
            }
        }; // copied from http://freenet.msp.mn.us/people/calguire/morse.html

        var map = {
            A: '.-',
            B: '-...',
            C: '-.-.',
            D: '-..',
            E: '.',
            F: '..-.',
            G: '--.',
            H: '....',
            I: '..',
            J: '.---',
            K: '-.-',
            L: '.-..',
            M: '--',
            N: '-.',
            O: '---',
            P: '.--.',
            Q: '--.-',
            R: '.-.',
            S: '...',
            T: '-',
            U: '..-',
            V: '...-',
            W: '.--',
            X: '-..-',
            Y: '-.--',
            Z: '--..',
            Á: '.--.-',
            Ä: '.-.-',
            É: '..-..',
            Ñ: '--.--',
            Ö: '---.',
            Ü: '..--',
            '1': '.----',
            '2': '..---',
            '3': '...--',
            '4': '....-',
            '5': '.....',
            '6': '-....',
            '7': '--...',
            '8': '---..',
            '9': '----.',
            '0': '-----',
            ',': '--..--',
            '.': '.-.-.-',
            '?': '..--..',
            ';': '-.-.-',
            ':': '---...',
            '/': '-..-.',
            '-': '-....-',
            "'": '.----.',
            '()': '-.--.-',
            _: '..--.-',
            '@': '.--.-.',
            ' ': '.......'
        };
        var decodeMap = invert(map);

        return exports;
    })({});

    /* ------------------------------ naturalSort ------------------------------ */
    _.naturalSort = (function (exports) {
        /* Sort values in natural order.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |arr   |Array of values|
         * |return|Sorted array   |
         */

        /* example
         * naturalSort(['img12', 'img11', '$img', '_img', '1', '2', '12']);
         * // -> ['1', '2', '12', '$img', 'img11', 'img12', '_img']
         * naturalSort([2, '1', 13]); // -> ['1', 2, 13]
         */

        /* typescript
         * export declare function naturalSort<T extends any[]>(arr: T): T;
         */

        /* dependencies
         * startWith root toStr 
         */

        exports = function(arr) {
            return arr.sort(naturalOrderComparator);
        }; // https://github.com/ChromeDevTools/devtools-frontend

        function naturalOrderComparator(a, b) {
            a = toStr(a);
            b = toStr(b);

            if (startWith(a, '_') && !startWith(b, '_')) {
                return 1;
            }

            if (startWith(b, '_') && !startWith(a, '_')) {
                return -1;
            }

            var chunk = /^\d+|^\D+/;
            var chunka, chunkb, anum, bnum;
            /* eslint-disable no-constant-condition */

            while (true) {
                if (a) {
                    if (!b) {
                        return 1;
                    }
                } else {
                    if (b) {
                        return -1;
                    }

                    return 0;
                }

                chunka = a.match(chunk)[0];
                chunkb = b.match(chunk)[0];
                anum = !root.isNaN(chunka);
                bnum = !root.isNaN(chunkb);

                if (anum && !bnum) {
                    return -1;
                }

                if (bnum && !anum) {
                    return 1;
                }

                if (anum && bnum) {
                    var diff = chunka - chunkb;

                    if (diff) {
                        return diff;
                    }

                    if (chunka.length !== chunkb.length) {
                        if (!+chunka && !+chunkb) {
                            return chunka.length - chunkb.length;
                        }

                        return chunkb.length - chunka.length;
                    }
                } else if (chunka !== chunkb) {
                    return chunka < chunkb ? -1 : 1;
                }

                a = a.substring(chunka.length);
                b = b.substring(chunkb.length);
            }
        }

        return exports;
    })({});

    /* ------------------------------ negate ------------------------------ */

    var negate = _.negate = (function (exports) {
        /* Create a function that negates the result of the predicate function.
         *
         * |Name     |Desc               |
         * |---------|-------------------|
         * |predicate|Predicate to negate|
         * |return   |New function       |
         */

        /* example
         * function even(n) {
         *     return n % 2 === 0;
         * }
         * // filter([1, 2, 3, 4, 5, 6], negate(even)); -> [1, 3, 5]
         */

        /* typescript
         * export declare function negate<T extends types.AnyFn>(predicate: T): T;
         */

        /* dependencies
         * types 
         */

        exports = function(predicate) {
            return function() {
                return !predicate.apply(this, arguments);
            };
        };

        return exports;
    })({});

    /* ------------------------------ normalizePath ------------------------------ */
    _.normalizePath = (function (exports) {
        /* Normalize file path slashes.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |path  |Path to normalize|
         * |return|Normalized path  |
         */

        /* example
         * normalizePath('\\foo\\bar\\'); // -> '/foo/bar/'
         * normalizePath('./foo//bar'); // -> './foo/bar'
         */

        /* typescript
         * export declare function normalizePath(path: string): string;
         */
        exports = function(path) {
            return path.replace(regSlashes, '/');
        };

        var regSlashes = /[\\/]+/g;

        return exports;
    })({});

    /* ------------------------------ pick ------------------------------ */

    var pick = _.pick = (function (exports) {
        /* Return a filtered copy of an object.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |object|Source object  |
         * |filter|Object filter  |
         * |return|Filtered object|
         */

        /* example
         * pick({ a: 1, b: 2 }, 'a'); // -> {a: 1}
         * pick({ a: 1, b: 2, c: 3 }, ['b', 'c']); // -> {b: 2, c: 3}
         * pick({ a: 1, b: 2, c: 3, d: 4 }, function(val, key) {
         *     return val % 2;
         * }); // -> {a: 1, c: 3}
         */

        /* typescript
         * export declare function pick(
         *     object: any,
         *     filter: string | string[] | Function
         * ): any;
         */

        /* dependencies
         * isStr isArr contain each 
         */

        exports = function(obj, filter, omit) {
            if (isStr(filter)) filter = [filter];

            if (isArr(filter)) {
                var keys = filter;

                filter = function(val, key) {
                    return contain(keys, key);
                };
            }

            var ret = {};

            var iteratee = function(val, key) {
                if (filter(val, key)) ret[key] = val;
            };

            if (omit) {
                iteratee = function(val, key) {
                    if (!filter(val, key)) ret[key] = val;
                };
            }

            each(obj, iteratee);
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ omit ------------------------------ */
    _.omit = (function (exports) {
        /* Opposite of pick.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |obj   |Source object  |
         * |filter|Object filter  |
         * |return|Filtered object|
         */

        /* example
         * omit({ a: 1, b: 2 }, 'a'); // -> {b: 2}
         * omit({ a: 1, b: 2, c: 3 }, ['b', 'c']); // -> {a: 1}
         * omit({ a: 1, b: 2, c: 3, d: 4 }, function(val, key) {
         *     return val % 2;
         * }); // -> {b: 2, d: 4}
         */

        /* typescript
         * export declare function omit(
         *     obj: any,
         *     filter: string | string[] | Function
         * ): any;
         */

        /* dependencies
         * pick 
         */

        exports = function(obj, filter) {
            return pick(obj, filter, true);
        };

        return exports;
    })({});

    /* ------------------------------ ordinal ------------------------------ */
    _.ordinal = (function (exports) {
        /* Add ordinal indicator to number.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |num   |Number to add indicator|
         * |return|Result ordinal number  |
         */

        /* example
         * ordinal(1); // -> '1st'
         * ordinal(2); // -> '2nd'
         */

        /* typescript
         * export declare function ordinal(num: number): string;
         */
        // https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
        exports = function(num) {
            var j = num % 10;
            var k = num % 100;
            var indicator = 'th';

            if (j == 1 && k != 11) {
                indicator = 'st';
            }

            if (j == 2 && k != 12) {
                indicator = 'nd';
            }

            if (j == 3 && k != 13) {
                indicator = 'rd';
            }

            return num + indicator;
        };

        return exports;
    })({});

    /* ------------------------------ pad ------------------------------ */
    _.pad = (function (exports) {
        /* Pad string on the left and right sides if it's shorter than length.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |str   |String to pad         |
         * |len   |Padding length        |
         * |chars |String used as padding|
         * |return|Result string         |
         */

        /* example
         * pad('a', 5); // -> '  a  '
         * pad('a', 5, '-'); // -> '--a--'
         * pad('abc', 3, '-'); // -> 'abc'
         * pad('abc', 5, 'ab'); // -> 'babca'
         * pad('ab', 5, 'ab'); // -> 'ababa'
         */

        /* typescript
         * export declare function pad(str: string, len: number, chars?: string): string;
         */

        /* dependencies
         * repeat toStr 
         */

        exports = function(str, len, chars) {
            str = toStr(str);
            var strLen = str.length;
            chars = chars || ' ';

            if (strLen < len) {
                var padStr = repeat(chars, Math.ceil((len - strLen) / 2));
                str = padStr + str + padStr;
                str = str.substr(Math.ceil((str.length - len) / 2), len);
            }

            return str;
        };

        return exports;
    })({});

    /* ------------------------------ pairs ------------------------------ */
    _.pairs = (function (exports) {
        /* Convert an object into a list of [key, value] pairs.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |obj   |Object to convert         |
         * |return|List of [key, value] pairs|
         */

        /* example
         * pairs({ a: 1, b: 2 }); // -> [['a', 1], ['b', 2]]
         */

        /* typescript
         * export declare function pairs(obj: any): Array<any[]>;
         */

        /* dependencies
         * keys 
         */

        exports = function(obj) {
            var _keys = keys(obj);

            var len = _keys.length;
            var ret = Array(len);

            for (var i = 0; i < len; i++) {
                ret[i] = [_keys[i], obj[_keys[i]]];
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ parallel ------------------------------ */
    _.parallel = (function (exports) {
        /* Run an array of functions in parallel.
         *
         * |Name |Desc                   |
         * |-----|-----------------------|
         * |tasks|Array of functions     |
         * |cb   |Callback once completed|
         */

        /* example
         * parallel(
         *     [
         *         function(cb) {
         *             setTimeout(function() {
         *                 cb(null, 'one');
         *             }, 200);
         *         },
         *         function(cb) {
         *             setTimeout(function() {
         *                 cb(null, 'two');
         *             }, 100);
         *         }
         *     ],
         *     function(err, results) {
         *         // results -> ['one', 'two']
         *     }
         * );
         */

        /* typescript
         * export declare function parallel(tasks: types.AnyFn[], cb?: types.AnyFn): void;
         */

        /* dependencies
         * noop each nextTick types 
         */

        exports = function(tasks, cb) {
            cb = cb || noop;
            var results = [];
            var pending = tasks.length;
            if (!pending) return done(null);
            each(tasks, function(task, i) {
                task(function(err, result) {
                    taskCb(i, err, result);
                });
            });

            function taskCb(i, err, result) {
                results[i] = result;
                if (--pending === 0 || err) done(err);
            }

            function done(err) {
                nextTick(function() {
                    cb(err, results);
                    cb = noop;
                });
            }
        };

        return exports;
    })({});

    /* ------------------------------ pascalCase ------------------------------ */
    _.pascalCase = (function (exports) {
        /* Convert string to "pascalCase".
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |str   |String to convert  |
         * |return|Pascal cased string|
         */

        /* example
         * pascalCase('fooBar'); // -> FooBar
         * pascalCase('foo bar'); // -> FooBar
         * pascalCase('foo_bar'); // -> FooBar
         * pascalCase('foo.bar'); // -> FooBar
         */

        /* typescript
         * export declare function pascalCase(str: string): string;
         */

        /* dependencies
         * camelCase upperFirst 
         */

        exports = function(str) {
            return upperFirst(camelCase(str));
        };

        return exports;
    })({});

    /* ------------------------------ property ------------------------------ */

    var property = _.property = (function (exports) {
        /* Return a function that will itself return the key property of any passed-in object.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |path  |Path of the property to get|
         * |return|New accessor function      |
         */

        /* example
         * const obj = { a: { b: 1 } };
         * property('a')(obj); // -> {b: 1}
         * property(['a', 'b'])(obj); // -> 1
         */

        /* typescript
         * export declare function property(path: string | string[]): types.AnyFn;
         */

        /* dependencies
         * isArr safeGet types 
         */

        exports = function(path) {
            if (!isArr(path)) return shallowProperty(path);
            return function(obj) {
                return safeGet(obj, path);
            };
        };

        function shallowProperty(key) {
            return function(obj) {
                return obj == null ? void 0 : obj[key];
            };
        }

        return exports;
    })({});

    /* ------------------------------ safeCb ------------------------------ */

    var safeCb = _.safeCb = (function (exports) {
        /* Create callback based on input value.
         */

        /* typescript
         * export declare function safeCb(
         *     val?: any,
         *     ctx?: any,
         *     argCount?: number
         * ): types.AnyFn;
         */

        /* dependencies
         * isFn isObj isArr optimizeCb matcher identity types property 
         */

        exports = function(val, ctx, argCount) {
            if (val == null) return identity;
            if (isFn(val)) return optimizeCb(val, ctx, argCount);
            if (isObj(val) && !isArr(val)) return matcher(val);
            return property(val);
        };

        return exports;
    })({});

    /* ------------------------------ every ------------------------------ */
    _.every = (function (exports) {
        /* Check if predicate return truthy for all elements.
         *
         * |Name    |Desc                                         |
         * |--------|---------------------------------------------|
         * |object  |Collection to iterate over                   |
         * |iterator|Function invoked per iteration               |
         * |context |Predicate context                            |
         * |return  |True if all elements pass the predicate check|
         */

        /* example
         * every([2, 4], function(val) {
         *     return val % 2 === 0;
         * }); // -> true
         */

        /* typescript
         * export declare function every<T>(
         *     object: types.List<T>,
         *     iterator?: types.ListIterator<T, boolean>,
         *     context?: any
         * ): boolean;
         * export declare function every<T>(
         *     object: types.Dictionary<T>,
         *     iterator?: types.ObjectIterator<T, boolean>,
         *     context?: any
         * ): boolean;
         */

        /* dependencies
         * safeCb isArrLike keys types 
         */

        exports = function(obj, predicate, ctx) {
            predicate = safeCb(predicate, ctx);

            var _keys = !isArrLike(obj) && keys(obj);

            var len = (_keys || obj).length;

            for (var i = 0; i < len; i++) {
                var curKey = _keys ? _keys[i] : i;
                if (!predicate(obj[curKey], curKey, obj)) return false;
            }

            return true;
        };

        return exports;
    })({});

    /* ------------------------------ filter ------------------------------ */

    var filter = _.filter = (function (exports) {
        /* Iterates over elements of collection, returning an array of all the values that pass a truth test.
         *
         * |Name     |Desc                                   |
         * |---------|---------------------------------------|
         * |obj      |Collection to iterate over             |
         * |predicate|Function invoked per iteration         |
         * |ctx      |Predicate context                      |
         * |return   |Array of all values that pass predicate|
         */

        /* example
         * filter([1, 2, 3, 4, 5], function(val) {
         *     return val % 2 === 0;
         * }); // -> [2, 4]
         */

        /* typescript
         * export declare function filter<T>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, boolean>,
         *     context?: any
         * ): T[];
         * export declare function filter<T>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, boolean>,
         *     context?: any
         * ): T[];
         */

        /* dependencies
         * safeCb each types 
         */

        exports = function(obj, predicate, ctx) {
            var ret = [];
            predicate = safeCb(predicate, ctx);
            each(obj, function(val, idx, list) {
                if (predicate(val, idx, list)) ret.push(val);
            });
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ compact ------------------------------ */
    _.compact = (function (exports) {
        /* Return a copy of the array with all falsy values removed.
         *
         * The values false, null, 0, "", undefined, and NaN are falsey.
         *
         * |Name  |Desc                        |
         * |------|----------------------------|
         * |arr   |Array to compact            |
         * |return|New array of filtered values|
         */

        /* example
         * compact([0, 1, false, 2, '', 3]); // -> [1, 2, 3]
         */

        /* typescript
         * export declare function compact(arr: any[]): any[];
         */

        /* dependencies
         * filter 
         */

        exports = function(arr) {
            return filter(arr, function(val) {
                return !!val;
            });
        };

        return exports;
    })({});

    /* ------------------------------ difference ------------------------------ */

    var difference = _.difference = (function (exports) {
        /* Create an array of unique array values not included in the other given array.
         *
         * |Name   |Desc                        |
         * |-------|----------------------------|
         * |arr    |Array to inspect            |
         * |...args|Values to exclude           |
         * |return |New array of filtered values|
         */

        /* example
         * difference([3, 2, 1], [4, 2]); // -> [3, 1]
         */

        /* typescript
         * export declare function difference(arr: any[], ...args: any[]): any[];
         */

        /* dependencies
         * restArgs flatten filter contain 
         */

        exports = restArgs(function(arr, args) {
            args = flatten(args);
            return filter(arr, function(val) {
                return !contain(args, val);
            });
        });

        return exports;
    })({});

    /* ------------------------------ unique ------------------------------ */

    var unique = _.unique = (function (exports) {
        /* Create duplicate-free version of an array.
         *
         * |Name  |Desc                         |
         * |------|-----------------------------|
         * |arr   |Array to inspect             |
         * |cmp   |Function for comparing values|
         * |return|New duplicate free array     |
         */

        /* example
         * unique([1, 2, 3, 1]); // -> [1, 2, 3]
         */

        /* typescript
         * export declare function unique(
         *     arr: any[],
         *     cmp?: (a: any, b: any) => boolean | number
         * ): any[];
         */

        /* dependencies
         * filter 
         */

        exports = function(arr, cmp) {
            cmp = cmp || isEqual;
            return filter(arr, function(item, idx, arr) {
                var len = arr.length;

                while (++idx < len) {
                    if (cmp(item, arr[idx])) return false;
                }

                return true;
            });
        };

        function isEqual(a, b) {
            return a === b;
        }

        return exports;
    })({});

    /* ------------------------------ allKeys ------------------------------ */

    var allKeys = _.allKeys = (function (exports) {
        /* Retrieve all the names of object's own and inherited properties.
         *
         * |Name   |Desc                       |
         * |-------|---------------------------|
         * |obj    |Object to query            |
         * |options|Options                    |
         * |return |Array of all property names|
         *
         * Available options:
         *
         * |Name              |Desc                     |
         * |------------------|-------------------------|
         * |prototype=true    |Include prototype keys   |
         * |unenumerable=false|Include unenumerable keys|
         * |symbol=false      |Include symbol keys      |
         *
         * Members of Object's prototype won't be retrieved.
         */

        /* example
         * const obj = Object.create({ zero: 0 });
         * obj.one = 1;
         * allKeys(obj); // -> ['zero', 'one']
         */

        /* typescript
         * export declare namespace allKeys {
         *     interface IOptions {
         *         prototype?: boolean;
         *         unenumerable?: boolean;
         *     }
         * }
         * export declare function allKeys(
         *     obj: any,
         *     options: { symbol: true } & allKeys.IOptions
         * ): Array<string | Symbol>;
         * export declare function allKeys(
         *     obj: any,
         *     options?: ({ symbol: false } & allKeys.IOptions) | allKeys.IOptions
         * ): string[];
         */

        /* dependencies
         * keys getProto unique 
         */

        var getOwnPropertyNames = Object.getOwnPropertyNames;
        var getOwnPropertySymbols = Object.getOwnPropertySymbols;

        exports = function(obj) {
            var _ref =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : {},
                _ref$prototype = _ref.prototype,
                prototype = _ref$prototype === void 0 ? true : _ref$prototype,
                _ref$unenumerable = _ref.unenumerable,
                unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
                _ref$symbol = _ref.symbol,
                symbol = _ref$symbol === void 0 ? false : _ref$symbol;

            var ret = [];

            if ((unenumerable || symbol) && getOwnPropertyNames) {
                var getKeys = keys;
                if (unenumerable && getOwnPropertyNames) getKeys = getOwnPropertyNames;

                do {
                    ret = ret.concat(getKeys(obj));

                    if (symbol && getOwnPropertySymbols) {
                        ret = ret.concat(getOwnPropertySymbols(obj));
                    }
                } while (
                    prototype &&
                    (obj = getProto(obj)) &&
                    obj !== Object.prototype
                );

                ret = unique(ret);
            } else {
                if (prototype) {
                    for (var key in obj) {
                        ret.push(key);
                    }
                } else {
                    ret = keys(obj);
                }
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ defaults ------------------------------ */

    var defaults = _.defaults = (function (exports) {
        /* Fill in undefined properties in object with the first value present in the following list of defaults objects.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |obj   |Destination object|
         * |...src|Sources objects   |
         * |return|Destination object|
         */

        /* example
         * defaults({ name: 'RedHood' }, { name: 'Unknown', age: 24 }); // -> {name: 'RedHood', age: 24}
         */

        /* typescript
         * export declare function defaults(obj: any, ...src: any[]): any;
         */

        /* dependencies
         * createAssigner allKeys 
         */

        exports = createAssigner(allKeys, true);

        return exports;
    })({});

    /* ------------------------------ highlight ------------------------------ */
    _.highlight = (function (exports) {
        /* Highlight code.
         *
         * |Name   |Desc                        |
         * |-------|----------------------------|
         * |str    |Code string                 |
         * |lang=js|Language, js, html or css   |
         * |style  |Keyword highlight style     |
         * |return |Highlighted html code string|
         *
         * Available styles:
         *
         * comment, string, number, keyword, operator
         */

        /* example
         * highlight('const a = 5;', 'js', {
         *     keyword: 'color:#569cd6;'
         * }); // -> '<span class="keyword" style="color:#569cd6;">const</span> a <span class="operator" style="color:#994500;">=</span> <span class="number" style="color:#0086b3;">5</span>;'
         */

        /* typescript
         * export declare function highlight(
         *     str: string,
         *     lang?: string,
         *     style?: {
         *         comment?: string;
         *         string?: string;
         *         number?: string;
         *         keyword?: string;
         *         operator?: string;
         *     }
         * ): string;
         */

        /* dependencies
         * each defaults 
         */ // https://github.com/trentrichardson/jQuery-Litelighter

        exports = function(str) {
            var lang =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : 'js';
            var style =
                arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            defaults(style, defStyle);
            str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            lang = language[lang];
            var subLangSi = 0;
            var subLangs = [];
            each(lang, function(val) {
                if (!val.language) return;
                str = str.replace(val.re, function($1, $2) {
                    if (!$2) {
                        return $1;
                    }

                    subLangs[subLangSi++] = exports($2, val.language, style);
                    return $1.replace($2, '___subtmpl' + (subLangSi - 1) + '___');
                });
            });
            each(lang, function(val, key) {
                if (language[val.language]) return;
                str = str.replace(val.re, '___' + key + '___$1___end' + key + '___');
            });
            var levels = [];
            str = str.replace(/___(?!subtmpl)\w+?___/g, function($0) {
                var end = $0.substr(3, 3) === 'end',
                    tag = (!end ? $0.substr(3) : $0.substr(6)).replace(/_/g, ''),
                    lastTag = levels.length > 0 ? levels[levels.length - 1] : null;

                if (
                    !end &&
                    (lastTag == null ||
                        tag == lastTag ||
                        (lastTag != null &&
                            lang[lastTag] &&
                            lang[lastTag].embed != undefined &&
                            lang[lastTag].embed.indexOf(tag) > -1))
                ) {
                    levels.push(tag);
                    return $0;
                } else if (end && tag == lastTag) {
                    levels.pop();
                    return $0;
                }

                return '';
            });
            each(lang, function(val, key) {
                var s = style[val.style]
                    ? ' style="'.concat(style[val.style], '"')
                    : '';
                str = str
                    .replace(new RegExp('___end' + key + '___', 'g'), '</span>')
                    .replace(
                        new RegExp('___' + key + '___', 'g'),
                        '<span class="'.concat(val.style, '"').concat(s, '>')
                    );
            });
            each(lang, function(val) {
                if (!val.language) return;
                str = str.replace(/___subtmpl\d+___/g, function($tmpl) {
                    var i = parseInt($tmpl.replace(/___subtmpl(\d+)___/, '$1'), 10);
                    return subLangs[i];
                });
            });
            return str;
        };

        var defStyle = {
            comment: 'color:#63a35c;',
            string: 'color:#183691;',
            number: 'color:#0086b3;',
            keyword: 'color:#a71d5d;',
            operator: 'color:#994500;'
        };
        var language = {};
        language.js = {
            comment: {
                re: /(\/\/.*|\/\*([\s\S]*?)\*\/)/g,
                style: 'comment'
            },
            string: {
                re: /(('.*?')|(".*?"))/g,
                style: 'string'
            },
            numbers: {
                re: /(-?(\d+|\d+\.\d+|\.\d+))/g,
                style: 'number'
            },
            keywords: {
                re: /(?:\b)(function|for|foreach|while|if|else|elseif|switch|break|as|return|this|class|self|default|var|const|let|false|true|null|undefined)(?:\b)/gi,
                style: 'keyword'
            },
            operator: {
                re: /(\+|-|\/|\*|%|=|&lt;|&gt;|\||\?|\.)/g,
                style: 'operator'
            }
        };
        language.html = {
            comment: {
                re: /(&lt;!--([\s\S]*?)--&gt;)/g,
                style: 'comment'
            },
            tag: {
                re: /(&lt;\/?\w(.|\n)*?\/?&gt;)/g,
                style: 'keyword',
                embed: ['string']
            },
            string: language.js.string,
            css: {
                re: /(?:&lt;style.*?&gt;)([\s\S]*)?(?:&lt;\/style&gt;)/gi,
                language: 'css'
            },
            script: {
                re: /(?:&lt;script.*?&gt;)([\s\S]*?)(?:&lt;\/script&gt;)/gi,
                language: 'js'
            }
        };
        language.css = {
            comment: language.js.comment,
            string: language.js.string,
            numbers: {
                re: /((-?(\d+|\d+\.\d+|\.\d+)(%|px|em|pt|in)?)|#[0-9a-fA-F]{3}[0-9a-fA-F]{3})/g,
                style: 'number'
            },
            keywords: {
                re: /(@\w+|:?:\w+|[a-z-]+:)/g,
                style: 'keyword'
            }
        };

        return exports;
    })({});

    /* ------------------------------ parseArgs ------------------------------ */
    _.parseArgs = (function (exports) {
        /* Parse command line argument options, the same as minimist.
         *
         * |Name   |Desc           |
         * |-------|---------------|
         * |args   |Argument array |
         * |options|Parse options  |
         * |return |Parsed result  |
         *
         * ### options
         *
         * |Name      |Desc             |
         * |----------|-----------------|
         * |names     |option names     |
         * |shorthands|option shorthands|
         */

        /* example
         * parseArgs(['eustia', '--output', 'util.js', '-w'], {
         *     names: {
         *         output: 'string',
         *         watch: 'boolean'
         *     },
         *     shorthands: {
         *         output: 'o',
         *         watch: 'w'
         *     }
         * });
         * // -> {remain: ['eustia'], output: 'util.js', watch: true}
         */

        /* typescript
         * export declare function parseArgs(
         *     args: string[],
         *     options: {
         *         names: any;
         *         shorthands: any;
         *     }
         * ): any;
         */

        /* dependencies
         * defaults toNum invert toBool 
         */

        exports = function(args, opts) {
            opts = opts || {};
            defaults(opts, defOpts);
            var names = opts.names;
            var shorthands = invert(opts.shorthands);
            var remain = [];
            var ret = {
                remain: remain
            };
            var name;
            var type;

            for (var i = 0, len = args.length; i < len; i++) {
                var arg = args[i];
                var nextArg = args[i + 1];
                var match = arg.match(regDoubleDash);

                if (match) {
                    name = match[1];
                    type = names[name];

                    if (!type) {
                        remain.push(arg);
                    } else if (nextArg && !regDashStart.test(nextArg)) {
                        setArg(name, nextArg);
                        i++;
                    } else if (type === 'boolean') {
                        setArg(name, true);
                        i++;
                    }

                    continue;
                }

                match = arg.match(regSingleDash);

                if (match) {
                    var letters = match[1];

                    for (var j = 0; j < letters.length; j++) {
                        var letter = letters[j];
                        name = shorthands[letter];
                        if (!name) continue;
                        type = names[name];
                        if (type === 'boolean') setArg(shorthands[letter], true);
                    }

                    continue;
                }

                remain.push(arg);
            }

            function setArg(name, val) {
                var type = names[name];

                switch (type) {
                    case 'number':
                        val = toNum(val);
                        break;

                    case 'boolean':
                        val = toBool(val);
                        break;

                    default:
                        break;
                }

                ret[name] = val;
            }

            return ret;
        };

        var defOpts = {
            names: {},
            shorthands: {}
        };
        var regDoubleDash = /^--(.+)/;
        var regSingleDash = /^-([^-]+)/;
        var regDashStart = /^-/;

        return exports;
    })({});

    /* ------------------------------ extend ------------------------------ */

    var extend = _.extend = (function (exports) {
        /* Copy all of the properties in the source objects over to the destination object.
         *
         * |Name       |Desc              |
         * |-----------|------------------|
         * |destination|Destination object|
         * |...sources |Sources objects   |
         * |return     |Destination object|
         */

        /* example
         * extend({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
         */

        /* typescript
         * export declare function extend(destination: any, ...sources: any[]): any;
         */

        /* dependencies
         * createAssigner allKeys 
         */

        exports = createAssigner(allKeys);

        return exports;
    })({});

    /* ------------------------------ clone ------------------------------ */

    var clone = _.clone = (function (exports) {
        /* Create a shallow-copied clone of the provided plain object.
         *
         * Any nested objects or arrays will be copied by reference, not duplicated.
         *
         * |Name  |Desc          |
         * |------|--------------|
         * |val   |Value to clone|
         * |return|Cloned value  |
         */

        /* example
         * clone({ name: 'eustia' }); // -> {name: 'eustia'}
         */

        /* typescript
         * export declare function clone<T>(val: T): T;
         */

        /* dependencies
         * isObj isArr extend 
         */

        exports = function(obj) {
            if (!isObj(obj)) return obj;
            return isArr(obj) ? obj.slice() : extend({}, obj);
        };

        return exports;
    })({});

    /* ------------------------------ findIdx ------------------------------ */

    var findIdx = _.findIdx = (function (exports) {
        /* Return the first index where the predicate truth test passes.
         *
         * |Name     |Desc                          |
         * |---------|------------------------------|
         * |arr      |Array to search               |
         * |predicate|Function invoked per iteration|
         * |return   |Index of matched element      |
         */

        /* example
         * findIdx(
         *     [
         *         {
         *             name: 'john',
         *             age: 24
         *         },
         *         {
         *             name: 'jane',
         *             age: 23
         *         }
         *     ],
         *     function(val) {
         *         return val.age === 23;
         *     }
         * ); // -> 1
         */

        /* typescript
         * export declare function findIdx(arr: any[], predicate: types.AnyFn): number;
         */

        /* dependencies
         * safeCb types 
         */

        exports = function(arr, predicate, ctx, dir) {
            dir = dir || 1;
            predicate = safeCb(predicate, ctx);
            var len = arr.length;
            var i = dir > 0 ? 0 : len - 1;

            while (i >= 0 && i < len) {
                if (predicate(arr[i], i, arr)) return i;
                i += dir;
            }

            return -1;
        };

        return exports;
    })({});

    /* ------------------------------ findLastIdx ------------------------------ */
    _.findLastIdx = (function (exports) {
        /* Return the last index where the predicate truth test passes.
         *
         * |Name     |Desc                          |
         * |---------|------------------------------|
         * |arr      |Array to search               |
         * |predicate|Function invoked per iteration|
         * |return   |Last index of matched element |
         */

        /* example
         * findLastIdx(
         *     [
         *         {
         *             name: 'john',
         *             age: 24
         *         },
         *         {
         *             name: 'jane',
         *             age: 23
         *         },
         *         {
         *             name: 'kitty',
         *             age: 24
         *         }
         *     ],
         *     function(val) {
         *         return val.age === 24;
         *     }
         * ); // -> 2
         */

        /* typescript
         * export declare function findLastIdx(arr: any[], predicate: types.AnyFn): number;
         */

        /* dependencies
         * findIdx types 
         */

        exports = function(arr, predicate, ctx) {
            return findIdx(arr, predicate, ctx, -1);
        };

        return exports;
    })({});

    /* ------------------------------ findKey ------------------------------ */

    var findKey = _.findKey = (function (exports) {
        /* Return the first key where the predicate truth test passes.
         *
         * |Name     |Desc                          |
         * |---------|------------------------------|
         * |obj      |Object to search              |
         * |predicate|Function invoked per iteration|
         * |ctx      |Predicate context             |
         * |return   |Key of matched element        |
         */

        /* example
         * findKey({ a: 1, b: 2 }, function(val) {
         *     return val === 1;
         * }); // -> a
         */

        /* typescript
         * export declare function findKey(
         *     obj: any,
         *     predicate: types.AnyFn,
         *     ctx?: any
         * ): string | void;
         */

        /* dependencies
         * safeCb keys types 
         */

        exports = function(obj, predicate, ctx) {
            predicate = safeCb(predicate, ctx);

            var _keys = keys(obj);

            var key;

            for (var i = 0, len = _keys.length; i < len; i++) {
                key = _keys[i];
                if (predicate(obj[key], key, obj)) return key;
            }
        };

        return exports;
    })({});

    /* ------------------------------ find ------------------------------ */
    _.find = (function (exports) {
        /* Find the first value that passes a truth test in a collection.
         *
         * |Name    |Desc                             |
         * |--------|---------------------------------|
         * |object  |Collection to iterate over       |
         * |iterator|Function invoked per iteration   |
         * |context |Predicate context                |
         * |return  |First value that passes predicate|
         */

        /* example
         * find(
         *     [
         *         {
         *             name: 'john',
         *             age: 24
         *         },
         *         {
         *             name: 'jane',
         *             age: 23
         *         }
         *     ],
         *     function(val) {
         *         return val.age === 23;
         *     }
         * ); // -> {name: 'jane', age: 23}
         */

        /* typescript
         * export declare function find<T>(
         *     object: types.List<T>,
         *     iterator: types.ListIterator<T, boolean>,
         *     context?: any
         * ): T | undefined;
         * export declare function find<T>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, boolean>,
         *     context?: any
         * ): T | undefined;
         */

        /* dependencies
         * findKey findIdx isArrLike isUndef types 
         */

        exports = function(obj, predicate, ctx) {
            var keyFinder = isArrLike(obj) ? findIdx : findKey;
            var key = keyFinder(obj, predicate, ctx);
            if (!isUndef(key) && key !== -1) return obj[key];
        };

        return exports;
    })({});

    /* ------------------------------ map ------------------------------ */

    var map = _.map = (function (exports) {
        /* Create an array of values by running each element in collection through iteratee.
         *
         * |Name    |Desc                          |
         * |--------|------------------------------|
         * |object  |Collection to iterate over    |
         * |iterator|Function invoked per iteration|
         * |context |Function context              |
         * |return  |New mapped array              |
         */

        /* example
         * map([4, 8], function(n) {
         *     return n * n;
         * }); // -> [16, 64]
         */

        /* typescript
         * export declare function map<T, TResult>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, TResult>,
         *     context?: any
         * ): TResult[];
         * export declare function map<T, TResult>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, TResult>,
         *     context?: any
         * ): TResult[];
         */

        /* dependencies
         * safeCb keys isArrLike types 
         */

        exports = function(obj, iterator, ctx) {
            iterator = safeCb(iterator, ctx);

            var _keys = !isArrLike(obj) && keys(obj);

            var len = (_keys || obj).length;
            var results = Array(len);

            for (var i = 0; i < len; i++) {
                var curKey = _keys ? _keys[i] : i;
                results[i] = iterator(obj[curKey], curKey, obj);
            }

            return results;
        };

        return exports;
    })({});

    /* ------------------------------ atob ------------------------------ */
    _.atob = (function (exports) {
        /* Use Buffer to emulate atob when running in node.
         */

        /* example
         * atob('SGVsbG8gV29ybGQ='); // -> 'Hello World'
         */

        /* typescript
         * export declare function atob(str: string): string;
         */

        /* dependencies
         * root isNode base64 map 
         */

        if (isNode) {
            exports = function(str) {
                return new Buffer(str, 'base64').toString('binary');
            };
        } else {
            if (root.atob && !false) {
                exports = root.atob;
            } else {
                exports = function(str) {
                    return map(base64.decode(str), function(c) {
                        return String.fromCharCode(c);
                    }).join('');
                };
            }
        }

        return exports;
    })({});

    /* ------------------------------ btoa ------------------------------ */
    _.btoa = (function (exports) {
        /* Use Buffer to emulate btoa when running in node.
         */

        /* example
         * btoa('Hello World'); // -> 'SGVsbG8gV29ybGQ='
         */

        /* typescript
         * export declare function btoa(str: string): string;
         */

        /* dependencies
         * root isNode base64 map 
         */

        if (isNode) {
            exports = function(str) {
                return new Buffer(str, 'binary').toString('base64');
            };
        } else {
            if (root.btoa && !false) {
                exports = root.btoa;
            } else {
                exports = function(str) {
                    return base64.encode(
                        map(str, function(c) {
                            return c.charCodeAt(0);
                        })
                    );
                };
            }
        }

        return exports;
    })({});

    /* ------------------------------ centerAlign ------------------------------ */
    _.centerAlign = (function (exports) {
        /* Center align text in a string.
         *
         * |Name  |Desc                    |
         * |------|------------------------|
         * |str   |String to align         |
         * |width |Total width of each line|
         * |return|Center aligned string   |
         */

        /* example
         * centerAlign('test', 8); // -> '  test'
         * centerAlign('test\nlines', 8); // -> '  test\n lines'
         * centerAlign(['test', 'lines'], 8); // -> '  test\n lines'
         */

        /* typescript
         * export declare function centerAlign(
         *     str: string | string[],
         *     width?: number
         * ): string;
         */

        /* dependencies
         * longest isArr isUndef map lpad 
         */

        exports = function(str, width) {
            var ret = str;

            if (!isArr(ret)) {
                ret = ret.split(regLineBreak);
            }

            if (isUndef(width)) width = longest(str);
            ret = map(ret, function(str) {
                var len = str.length;
                return lpad(str, floor((width - len) / 2) + len);
            });
            return ret.join('\n');
        };

        var regLineBreak = /\n/g;
        var floor = Math.floor;

        return exports;
    })({});

    /* ------------------------------ normalizeHeader ------------------------------ */
    _.normalizeHeader = (function (exports) {
        /* Normalize http header name.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |header|Header to normalize|
         * |return|Normalized header  |
         */

        /* example
         * normalizeHeader('content-type'); // -> 'Content-Type'
         * normalizeHeader('etag'); // -> 'ETag'
         */

        /* typescript
         * export declare function normalizeHeader(header: string): string;
         */

        /* dependencies
         * map capitalize 
         */

        exports = function(header) {
            var ret = specialHeaders[header.toLowerCase()];

            if (!ret) {
                ret = map(header.split('-'), capitalize).join('-');
            }

            return ret;
        };

        var specialHeaders = {
            'content-md5': 'Content-MD5',
            dnt: 'DNT',
            etag: 'ETag',
            'last-event-id': 'Last-Event-ID',
            tcn: 'TCN',
            te: 'TE',
            'www-authenticate': 'WWW-Authenticate',
            'x-dnsprefetch-control': 'X-DNSPrefetch-Control'
        };

        return exports;
    })({});

    /* ------------------------------ pluck ------------------------------ */

    var pluck = _.pluck = (function (exports) {
        /* Extract a list of property values.
         *
         * |Name  |Desc                           |
         * |------|-------------------------------|
         * |obj   |Collection to iterate over     |
         * |key   |Property path                  |
         * |return|New array of specified property|
         */

        /* example
         * const stooges = [
         *     { name: 'moe', age: 40 },
         *     { name: 'larry', age: 50 },
         *     { name: 'curly', age: 60 }
         * ];
         * pluck(stooges, 'name'); // -> ['moe', 'larry', 'curly']
         */

        /* typescript
         * export declare function pluck(object: any, key: string | string[]): any[];
         */

        /* dependencies
         * map property 
         */

        exports = function(obj, key) {
            return map(obj, property(key));
        };

        return exports;
    })({});

    /* ------------------------------ fuzzySearch ------------------------------ */
    _.fuzzySearch = (function (exports) {
        /* Simple fuzzy search.
         *
         * |Name     |Desc            |
         * |---------|----------------|
         * |needle   |String to search|
         * |haystacks|Search list     |
         * |options  |Search options  |
         *
         * Available options:
         *
         * |Name               |Desc                                        |
         * |-------------------|--------------------------------------------|
         * |caseSensitive=false|Whether comparisons should be case sensitive|
         * |key                |Object key path if item is object           |
         */

        /* example
         * fuzzySearch('lic', ['licia', 'll', 'lic']); // -> ['lic', 'licia']
         * fuzzySearch(
         *     'alpha-test',
         *     [
         *         {
         *             name: 'alpha-test-1'
         *         },
         *         {
         *             name: 'beta-test'
         *         }
         *     ],
         *     {
         *         key: 'name'
         *     }
         * ); // -> [{ name: 'alpha-test-1' }]
         */

        /* typescript
         * export declare function fuzzySearch(
         *     needle: string,
         *     haystack: any[],
         *     options?: {
         *         caseSensitive?: boolean;
         *         key?: string | string[];
         *     }
         * ): any[];
         */

        /* dependencies
         * filter map isStr safeGet levenshtein pluck 
         */

        exports = function(needle, haystacks) {
            var options =
                arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (!options.caseSensitive) {
                needle = needle.toLowerCase();
            }

            haystacks = map(haystacks, function(haystack) {
                var string = toStr(haystack, options);

                if (!options.caseSensitive) {
                    string = string.toLowerCase();
                }

                return {
                    value: haystack,
                    levenshtein: levenshtein(needle, string),
                    string: string
                };
            });
            haystacks = filter(haystacks, function(haystack) {
                return hasAllLetters(needle, haystack.string, options);
            });
            haystacks.sort(function(a, b) {
                return a.levenshtein - b.levenshtein;
            });
            return pluck(haystacks, 'value');
        };

        function toStr(haystack, options) {
            if (isStr(haystack)) return haystack;
            return safeGet(haystack, options.key) || '';
        }

        function hasAllLetters(needle, haystack) {
            var hLen = haystack.length;
            var nLen = needle.length;
            if (nLen > hLen) return false;
            if (nLen === hLen) return needle === haystack;

            for (var i = 0, j = 0; i < nLen; i++) {
                var c = needle.charCodeAt(i);
                var has = false;

                while (j < hLen) {
                    if (haystack.charCodeAt(j++) === c) {
                        has = true;
                        break;
                    }
                }

                if (!has) return false;
            }

            return true;
        }

        return exports;
    })({});

    /* ------------------------------ toArr ------------------------------ */

    var toArr = _.toArr = (function (exports) {
        /* Convert value to an array.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |val   |Value to convert|
         * |return|Converted array |
         */

        /* example
         * toArr({ a: 1, b: 2 }); // -> [{a: 1, b: 2}]
         * toArr('abc'); // -> ['abc']
         * toArr(1); // -> [1]
         * toArr(null); // -> []
         */

        /* typescript
         * export declare function toArr(val: any): any[];
         */

        /* dependencies
         * isArrLike map isArr isStr 
         */

        exports = function(val) {
            if (!val) return [];
            if (isArr(val)) return val;
            if (isArrLike(val) && !isStr(val)) return map(val);
            return [val];
        };

        return exports;
    })({});

    /* ------------------------------ Class ------------------------------ */

    var Class = _.Class = (function (exports) {
        /* Create JavaScript class.
         *
         * |Name   |Desc                             |
         * |-------|---------------------------------|
         * |methods|Public methods                   |
         * [statics|Static methods                   |
         * |return |Function used to create instances|
         */

        /* example
         * const People = Class({
         *     initialize: function People(name, age) {
         *         this.name = name;
         *         this.age = age;
         *     },
         *     introduce: function() {
         *         return 'I am ' + this.name + ', ' + this.age + ' years old.';
         *     }
         * });
         *
         * const Student = People.extend(
         *     {
         *         initialize: function Student(name, age, school) {
         *             this.callSuper(People, 'initialize', arguments);
         *
         *             this.school = school;
         *         },
         *         introduce: function() {
         *             return (
         *                 this.callSuper(People, 'introduce') +
         *                 '\n I study at ' +
         *                 this.school +
         *                 '.'
         *             );
         *         }
         *     },
         *     {
         *         is: function(obj) {
         *             return obj instanceof Student;
         *         }
         *     }
         * );
         *
         * const a = new Student('allen', 17, 'Hogwarts');
         * a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
         * Student.is(a); // -> true
         */

        /* typescript
         * export declare namespace Class {
         *     class Base {
         *         toString(): string;
         *     }
         *     class IConstructor extends Base {
         *         constructor(...args: any[]);
         *         static extend(methods: any, statics: any): IConstructor;
         *         static inherits(Class: types.AnyFn): void;
         *         static methods(methods: any): IConstructor;
         *         static statics(statics: any): IConstructor;
         *         [method: string]: any;
         *     }
         * }
         * export declare function Class(methods: any, statics?: any): Class.IConstructor;
         */

        /* dependencies
         * extend toArr inherits safeGet isMiniProgram types 
         */

        exports = function(methods, statics) {
            return Base.extend(methods, statics);
        };

        function makeClass(parent, methods, statics) {
            statics = statics || {};
            var className =
                methods.className || safeGet(methods, 'initialize.name') || '';
            delete methods.className;

            var ctor = function() {
                var args = toArr(arguments);
                return this.initialize
                    ? this.initialize.apply(this, args) || this
                    : this;
            };

            if (!isMiniProgram) {
                // unsafe-eval CSP violation
                try {
                    ctor = new Function(
                        'toArr',
                        'return function ' +
                            className +
                            '()' +
                            '{' +
                            'var args = toArr(arguments);' +
                            'return this.initialize ? this.initialize.apply(this, args) || this : this;' +
                            '};'
                    )(toArr);
                } catch (e) {
                    /* eslint-disable no-empty */
                }
            }

            inherits(ctor, parent);
            ctor.prototype.constructor = ctor;

            ctor.extend = function(methods, statics) {
                return makeClass(ctor, methods, statics);
            };

            ctor.inherits = function(Class) {
                inherits(ctor, Class);
            };

            ctor.methods = function(methods) {
                extend(ctor.prototype, methods);
                return ctor;
            };

            ctor.statics = function(statics) {
                extend(ctor, statics);
                return ctor;
            };

            ctor.methods(methods).statics(statics);
            return ctor;
        }

        var Base = (exports.Base = makeClass(Object, {
            className: 'Base',
            callSuper: function(parent, name, args) {
                var superMethod = parent.prototype[name];
                return superMethod.apply(this, args);
            },
            toString: function() {
                return this.constructor.name;
            }
        }));

        return exports;
    })({});

    /* ------------------------------ Caseless ------------------------------ */
    _.Caseless = (function (exports) {
        /* Modify object props without caring about letter case.
         *
         * ### constructor
         *
         * |Name|Desc         |
         * |----|-------------|
         * |obj |Target object|
         *
         * ### getKey
         *
         * Get key with preserved casing.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |key   |Caseless key|
         * |return|Object key  |
         *
         * ### set
         *
         * Set value.
         *
         * |Name|Desc        |
         * |----|------------|
         * |key |Caseless key|
         * |val |Value to set|
         *
         * ### get
         *
         * Get value.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |key   |Caseless key      |
         * |return|Value of given key|
         *
         * ### remove
         *
         * Remove value.
         *
         * |Name|Desc        |
         * |----|------------|
         * |key |Caseless key|
         *
         * ### has
         *
         * Determine whether target object has given key.
         *
         * |Name  |Desc                 |
         * |------|---------------------|
         * |key   |Caseless key         |
         * |return|True if has given key|
         */

        /* example
         * const headers = { 'Content-Type': 'text/javascript' };
         * const c = new Caseless(headers);
         * c.set('content-type', 'text/css');
         * console.log(headers); // -> { 'Content-Type': 'text/css' }
         * c.getKey('content-type'); // -> 'Content-Type'
         * c.remove('content-type');
         * c.has('content-type'); // -> false
         */

        /* typescript
         * export declare class Caseless {
         *     constructor(obj: any);
         *     getKey(key: string): string | void;
         *     set(key: string, val: any): void;
         *     get(key: string): any;
         *     remove(key: string): void;
         *     has(key: string): boolean;
         * }
         */

        /* dependencies
         * Class lowerCase keys 
         */

        exports = Class({
            initialize: function(obj) {
                this._target = obj;
            },
            set: function(key, val) {
                var name = this.getKey(key);
                if (name) key = name;
                this._target[key] = val;
            },
            get: function(key) {
                key = this.getKey(key);

                if (key) {
                    return this._target[key];
                }
            },
            getKey: function(key) {
                var name = lowerCase(key);

                var _keys = keys(this._target);

                for (var i = 0, len = _keys.length; i < len; i++) {
                    var _key = _keys[i];
                    if (lowerCase(_key) === name) return _key;
                }
            },
            remove: function(key) {
                delete this._target[this.getKey(key)];
            },
            has: function(key) {
                return !!this.getKey(key);
            }
        });

        return exports;
    })({});

    /* ------------------------------ Color ------------------------------ */

    var Color = _.Color = (function (exports) {
        /* Color converter.
         *
         * ### constructor
         *
         * |Name |Desc            |
         * |-----|----------------|
         * |color|Color to convert|
         *
         * ### toRgb
         *
         * Get color rgb string format.
         *
         * ### toHex
         *
         * Get color hex string format.
         *
         * ### toHsl
         *
         * Get color hsl string format.
         *
         * ### parse
         *
         * [static] Parse color string into object containing value and model.
         *
         * |Name  |Desc                             |
         * |------|---------------------------------|
         * |color |Color string                     |
         * |return|Object containing value and model|
         */

        /* example
         * Color.parse('rgb(170, 287, 204, 0.5)'); // -> {val: [170, 187, 204, 0.5], model: 'rgb'}
         * const color = new Color('#abc');
         * color.toRgb(); // -> 'rgb(170, 187, 204)'
         * color.toHsl(); // -> 'hsl(210, 25%, 73%)'
         */

        /* typescript
         * export declare namespace Color {
         *     interface IColor {
         *         val: number[];
         *         model: string;
         *     }
         * }
         * export declare class Color {
         *     constructor(color: string | Color.IColor);
         *     toRgb(): string;
         *     toHex(): string;
         *     toHsl(): string;
         *     static parse(colorStr: string): Color.IColor;
         * }
         */

        /* dependencies
         * Class isStr clamp rgbToHsl hslToRgb hex 
         */

        exports = Class(
            {
                initialize: function Color(color) {
                    if (isStr(color)) color = exports.parse(color);
                    this.model = color.model;
                    this.val = color.val;
                },
                toRgb: function() {
                    var val = this.val;
                    if (this.model === 'hsl') val = hslToRgb(val);
                    var prefix = 'rgba';

                    if (val[3] === 1) {
                        prefix = 'rgb';
                        val = val.slice(0, 3);
                    }

                    return prefix + '(' + val.join(', ') + ')';
                },
                toHex: function() {
                    var val = this.val;
                    if (this.model === 'hsl') val = hslToRgb(val);
                    var ret = hex.encode(val.slice(0, 3));

                    if (ret[0] === ret[1] && ret[2] === ret[3] && ret[4] === ret[5]) {
                        ret = ret[0] + ret[2] + ret[5];
                    }

                    return '#' + ret;
                },
                toHsl: function() {
                    var val = this.val;
                    if (this.model === 'rgb') val = rgbToHsl(val);
                    var prefix = 'hsla';

                    if (val[3] === 1) {
                        prefix = 'hsl';
                        val = val.slice(0, 3);
                    }

                    val[1] = val[1] + '%';
                    val[2] = val[2] + '%';
                    return prefix + '(' + val.join(', ') + ')';
                }
            },
            {
                parse: function(colorStr) {
                    var i, match;
                    var val = [0, 0, 0, 1],
                        model = 'rgb';
                    /* eslint-disable no-cond-assign */

                    if ((match = colorStr.match(regHexAbbr))) {
                        match = match[1];

                        for (i = 0; i < 3; i++) {
                            val[i] = parseInt(match[i] + match[i], 16);
                        }
                    } else if ((match = colorStr.match(regHex))) {
                        match = match[1];

                        for (i = 0; i < 3; i++) {
                            var i2 = i * 2;
                            val[i] = parseInt(match.slice(i2, i2 + 2), 16);
                        }
                    } else if ((match = colorStr.match(regRgba))) {
                        for (i = 0; i < 3; i++) {
                            val[i] = parseInt(match[i + 1], 0);
                        }

                        if (match[4]) val[3] = parseFloat(match[4]);
                    } else if ((match = colorStr.match(regRgbaPer))) {
                        for (i = 0; i < 3; i++) {
                            val[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
                        }

                        if (match[4]) val[3] = parseFloat(match[4]);
                    } else if ((match = colorStr.match(regHsla))) {
                        model = 'hsl';
                        val = [
                            ((parseFloat(match[1]) % 360) + 360) % 360,
                            clamp(parseFloat(match[2]), 0, 100),
                            clamp(parseFloat(match[3]), 0, 100),
                            clamp(parseFloat(match[4]), 0, 1)
                        ];
                    }

                    return {
                        val: val,
                        model: model
                    };
                }
            }
        );
        var regHexAbbr = /^#([a-fA-F0-9]{3})$/;
        var regHex = /^#([a-fA-F0-9]{6})$/;
        var regRgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
        var regRgbaPer = /^rgba?\(\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
        var regHsla = /^hsla?\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;

        return exports;
    })({});

    /* ------------------------------ Delegator ------------------------------ */
    _.Delegator = (function (exports) {
        /* Object delegation.
         *
         * ### constructor
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |host  |Host object      |
         * |target|Delegation target|
         *
         * ### method
         *
         * Allow method to be accessed on the host object.
         *
         * |Name       |Desc              |
         * |-----------|------------------|
         * |name       |Host method name  |
         * |target=name|Target method name|
         *
         * ### getter
         *
         * Create a getter.
         *
         * ### setter
         *
         * Create a setter.
         *
         * ### access
         *
         * Create a accessor, same as calling both setter and getter.
         */

        /* example
         * const host = {
         *     target: {
         *         a() {
         *             return 'a';
         *         },
         *         b: 'b',
         *         c: 'c',
         *         d: 'd',
         *         e() {
         *             return 'e';
         *         }
         *     }
         * };
         * const delegator = new Delegator(host, 'target');
         * delegator
         *     .method('a')
         *     .getter('b')
         *     .setter('c')
         *     .access('d');
         * // @ts-ignore
         * host.a(); // -> 'a'
         * // @ts-ignore
         * host.b; // -> 'b'
         * // @ts-ignore
         * host.c = 5;
         * // @ts-ignore
         * host.target.c; // -> 5
         * // @ts-ignore
         * host.d; // -> 'd'
         * // @ts-ignore
         * host.d = 5;
         * // @ts-ignore
         * host.d; // -> 5
         */

        /* typescript
         * export declare class Delegator {
         *     constructor(host: object, target: object | string);
         *     method(name: string, target?: string): Delegator;
         *     getter(name: string, target?: string): Delegator;
         *     setter(name: string, target?: string): Delegator;
         *     access(name: string, target?: string): Delegator;
         * }
         */

        /* dependencies
         * Class safeGet defineProp isStr 
         */

        exports = Class({
            initialize: function Delegator(host, target) {
                this._host = host;

                if (isStr(target)) {
                    target = safeGet(host, target);
                }

                this._target = target;
            },
            method: function(name, targetName) {
                var target = this._target;
                var fn = target[targetName || name];

                this._host[name] = function() {
                    return fn.apply(target, arguments);
                };

                return this;
            },
            getter: function(name, targetName) {
                var target = this._target;
                targetName = targetName || name;
                defineProp(this._host, name, {
                    get: function() {
                        return target[targetName];
                    },
                    configurable: true
                });
                return this;
            },
            setter: function(name, targetName) {
                var target = this._target;
                targetName = targetName || name;
                defineProp(this._host, name, {
                    set: function(val) {
                        return (target[targetName] = val);
                    },
                    configurable: true
                });
                return this;
            },
            access: function(name, targetName) {
                return this.getter(name, targetName).setter(name, targetName);
            }
        });

        return exports;
    })({});

    /* ------------------------------ Dispatcher ------------------------------ */
    _.Dispatcher = (function (exports) {
        /* Flux dispatcher.
         *
         * [Related docs](https://facebook.github.io/flux/docs/dispatcher.html)
         */

        /* example
         * const dispatcher = new Dispatcher();
         *
         * dispatcher.register(function(payload) {
         *     switch (
         *         payload.actionType
         *         // Do something
         *     ) {
         *     }
         * });
         *
         * dispatcher.dispatch({
         *     actionType: 'action'
         * });
         */

        /* typescript
         * export declare class Dispatcher {
         *     dispatch(payload: any);
         *     register(cb: types.AnyFn): void;
         *     waitFor(ids: string[]): void;
         *     unregister(id: string): void;
         *     isDispatching(): boolean;
         * }
         */

        /* dependencies
         * Class uniqId types 
         */

        exports = Class({
            initialize: function Dispatcher() {
                this._callbacks = {};
                this._isDispatching = false;
                this._isHandled = {};
                this._isPending = {};
            },
            dispatch: function(payload) {
                this._startDispatching(payload);

                for (var id in this._callbacks) {
                    if (this._isPending[id]) continue;

                    this._invokeCb(id);
                }

                this._stopDispatching();
            },
            register: function(cb) {
                var id = uniqId('ID_');
                this._callbacks[id] = cb;
                return id;
            },
            waitFor: function(ids) {
                for (var i = 0, len = ids.length; i < len; i++) {
                    var id = ids[i];
                    if (this._isPending[id]) continue;

                    this._invokeCb(id);
                }
            },
            unregister: function(id) {
                delete this._callbacks[id];
            },
            isDispatching: function() {
                return this._isDispatching;
            },
            _startDispatching: function(payload) {
                for (var id in this._callbacks) {
                    this._isPending[id] = false;
                    this._isHandled[id] = false;
                }

                this._pendingPayload = payload;
                this._isDispatching = true;
            },
            _stopDispatching: function() {
                delete this._pendingPayload;
                this._isDispatching = false;
            },
            _invokeCb: function(id) {
                this._isPending[id] = true;

                this._callbacks[id](this._pendingPayload);

                this._isHandled[id] = true;
            }
        });

        return exports;
    })({});

    /* ------------------------------ Enum ------------------------------ */

    var Enum = _.Enum = (function (exports) {
        /* Enum type implementation.
         *
         * ### constructor
         *
         * |Name|Desc            |
         * |----|----------------|
         * |arr |Array of strings|
         *
         * |Name|Desc                  |
         * |----|----------------------|
         * |obj |Pairs of key and value|
         */

        /* example
         * const importance = new Enum([
         *     'NONE',
         *     'TRIVIAL',
         *     'REGULAR',
         *     'IMPORTANT',
         *     'CRITICAL'
         * ]);
         * const val = 1;
         * if (val === importance.CRITICAL) {
         *     // Do something.
         * }
         */

        /* typescript
         * export declare class Enum {
         *     size: number;
         *     constructor(map: string[] | { [member: string]: any });
         *     [key: string]: any;
         * }
         */

        /* dependencies
         * Class freeze isArr each keys 
         */

        exports = Class({
            initialize: function Enum(map) {
                if (isArr(map)) {
                    this.size = map.length;
                    each(
                        map,
                        function(member, val) {
                            this[member] = val;
                        },
                        this
                    );
                } else {
                    this.size = keys(map).length;
                    each(
                        map,
                        function(val, member) {
                            this[member] = val;
                        },
                        this
                    );
                }

                freeze(this);
            }
        });

        return exports;
    })({});

    /* ------------------------------ Heap ------------------------------ */

    var Heap = _.Heap = (function (exports) {
        /* Heap implementation.
         *
         * ### size
         *
         * Heap size.
         *
         * ### constructor
         *
         * |Name|Desc      |
         * |----|----------|
         * |cmp |Comparator|
         *
         * ### clear
         *
         * Clear the heap.
         *
         * ### add
         *
         * Add an item to the heap.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |item  |Item to add |
         * |return|Current size|
         *
         * ### poll
         *
         * Retrieve and remove the root item of the heap.
         *
         * ### peek
         *
         * Same as poll, but does not remove the item.
         */

        /* example
         * const heap = new Heap(function(a, b) {
         *     return b - a;
         * });
         * heap.add(2);
         * heap.add(1);
         * heap.add(4);
         * heap.add(5);
         * heap.poll(); // -> 5
         * console.log(heap.size); // -> 4
         */

        /* typescript
         * export declare class Heap {
         *     size: number;
         *     constructor(cmp?: types.AnyFn);
         *     clear(): void;
         *     add(item: any): number;
         *     poll(): any;
         *     peek(): any;
         * }
         */

        /* dependencies
         * Class swap isSorted types 
         */

        exports = Class({
            initialize: function Heap() {
                var cmp =
                    arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : isSorted.defComparator;
                this._cmp = cmp;
                this.clear();
            },
            clear: function() {
                this._data = [];
                this.size = 0;
            },
            add: function(item) {
                this._data.push(item);

                this.size++;

                this._heapifyUp(this.size - 1);

                return this.size;
            },
            poll: function() {
                var data = this._data;

                if (this.size > 0) {
                    var item = data[0];
                    data[0] = data[this.size - 1];
                    this.size--;

                    this._heapifyDown(0);

                    return item;
                }
            },
            peek: function() {
                if (this.size > 0) {
                    return this._data[0];
                }
            },
            _heapifyUp: function(idx) {
                var data = this._data;
                var parent = parentIdx(idx);

                while (idx > 0 && this._cmp(data[parent], data[idx]) > 0) {
                    swap(data, parent, idx);
                    idx = parent;
                    parent = parentIdx(idx);
                }
            },
            _heapifyDown: function(idx) {
                var size = this.size;
                var cmp = this._cmp;
                var data = this._data;

                while (leftChildIdx(idx) < size) {
                    var smallerIdx = leftChildIdx(idx);
                    var rightChild = rightChildIdx(idx);

                    if (
                        rightChild < size &&
                        cmp(data[rightChildIdx], data[smallerIdx]) < 0
                    ) {
                        smallerIdx = rightChild;
                    }

                    if (cmp(data[idx], data[smallerIdx]) < 0) {
                        break;
                    } else {
                        swap(data, idx, smallerIdx);
                    }

                    idx = smallerIdx;
                }
            }
        });

        function parentIdx(idx) {
            return Math.floor((idx - 1) / 2);
        }

        function leftChildIdx(idx) {
            return 2 * idx + 1;
        }

        function rightChildIdx(idx) {
            return 2 * idx + 2;
        }

        return exports;
    })({});

    /* ------------------------------ heapSort ------------------------------ */
    _.heapSort = (function (exports) {
        /* Heap sort implementation.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to sort|
         * |cmp   |Comparator   |
         * |return|Sorted array |
         */

        /* example
         * heapSort([2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function heapSort(arr: any[], cmp?: types.AnyFn): any[];
         */

        /* dependencies
         * Heap isSorted types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : isSorted.defComparator;
            var heap = new Heap(cmp);
            var len = arr.length;

            for (var i = 0; i < len; i++) {
                heap.add(arr[i]);
            }

            for (var _i = 0; _i < len; _i++) {
                arr[_i] = heap.poll();
            }

            return arr;
        };

        return exports;
    })({});

    /* ------------------------------ I18n ------------------------------ */
    _.I18n = (function (exports) {
        /* Simple internationalization library.
         *
         * ### constructor
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |locale|Locale code  |
         * |langs |Language data|
         *
         * ### set
         *
         * Add language or append extra keys to existing language.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |locale|Locale code  |
         * |lang  |Language data|
         *
         * ### locale
         *
         * Set default locale.
         *
         * |Name  |Desc       |
         * |------|-----------|
         * |locale|Locale code|
         *
         * ### t
         *
         * Get translation text.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |path  |Path of translation to get|
         * |data  |Data to pass in           |
         * |return|Translation text          |
         */

        /* example
         * const i18n = new I18n('en', {
         *     en: {
         *         welcome: 'Hello, {{name}}!',
         *         curTime(data) {
         *             return 'Current time is ' + data.time;
         *         }
         *     },
         *     cn: {
         *         welcome: '你好，{{name}}！'
         *     }
         * });
         * i18n.set('cn', {
         *     curTime(data) {
         *         return '当前时间是 ' + data.time;
         *     }
         * });
         * i18n.t('welcome', { name: 'licia' }); // -> 'Hello, licia!'
         * i18n.locale('cn');
         * i18n.t('curTime', { time: '5:47 pm' }); // -> '当前时间是 5:47 pm'
         */

        /* typescript
         * export declare class I18n {
         *     constructor(locale: string, langs: types.PlainObj<any>);
         *     set(locale: string, lang: types.PlainObj<any>): void;
         *     t(path: string | string[], data?: types.PlainObj<any>): string;
         *     locale(locale: string): void;
         * }
         */

        /* dependencies
         * Class safeGet types extend strTpl isStr isFn 
         */

        exports = Class({
            initialize: function I18n(locale, langs) {
                this._locale = locale;
                this._langs = langs;
            },
            set: function(locale, lang) {
                if (this._langs[locale]) {
                    extend(this._langs[locale], lang);
                } else {
                    this._langs[locale] = lang;
                }
            },
            t: function(path, data) {
                var val = '';
                var lang = this._langs[this._locale];
                if (!lang) return '';
                val = safeGet(lang, path);

                if (data) {
                    if (isStr(val)) {
                        val = strTpl(val, data);
                    } else if (isFn(val)) {
                        val = val(data);
                    }
                }

                return val || '';
            },
            locale: function(locale) {
                this._locale = locale;
            }
        });

        return exports;
    })({});

    /* ------------------------------ LinkedList ------------------------------ */

    var LinkedList = _.LinkedList = (function (exports) {
        /* Doubly-linked list implementation.
         *
         * ### size
         *
         * List size.
         *
         * ### head.
         *
         * First node.
         *
         * ### tail
         *
         * Last node.
         *
         * ### push
         *
         * Add an value to the end of the list.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |val   |Value to push|
         * |return|Current size |
         *
         * ### pop
         *
         * Get the last value of the list.
         *
         * ### unshift
         *
         * Add an value to the head of the list.
         *
         * ### shift
         *
         * Get the first value of the list.
         *
         * ### rmNode
         *
         * Remove node.
         *
         * ### find
         *
         * Find node.
         *
         * |Name  |Desc                             |
         * |------|---------------------------------|
         * |fn    |Function invoked per iteration   |
         * |return|First value that passes predicate|
         *
         * ### forEach
         *
         * Iterate over the list.
         *
         * ### toArr
         *
         * Convert the list to a JavaScript array.
         */

        /* example
         * const linkedList = new LinkedList();
         * linkedList.push(5);
         * linkedList.pop(); // -> 5
         */

        /* typescript
         * export declare namespace LinkedList {
         *     class Node {
         *         value: any;
         *         prev: Node | null;
         *         next: Node | null;
         *     }
         * }
         * export declare class LinkedList {
         *     size: number;
         *     head: LinkedList.Node;
         *     tail: LinkedList.Node;
         *     push(val: any): number;
         *     pop(): any;
         *     unshift(val: any): number;
         *     shift(): any;
         *     find(fn: types.AnyFn): LinkedList.Node | void;
         *     delNode(node: LinkedList.Node): void;
         *     forEach(iterator: types.AnyFn, ctx?: any);
         *     toArr(): any[];
         * }
         */

        /* dependencies
         * Class types 
         */

        exports = Class({
            initialize: function LinkedList() {
                this.tail = null;
                this.head = null;
                this.size = 0;
            },
            push: function(val) {
                var node = new Node(val, this.tail, null, this);
                this.tail = node;
                this.head = this.head || node;
                this.size++;
                return this.size;
            },
            pop: function() {
                if (!this.tail) return;
                var node = this.tail;
                this.tail = node.prev;

                if (this.tail) {
                    this.tail.next = null;
                } else {
                    this.head = null;
                }

                this.size--;
                return node.value;
            },
            unshift: function(val) {
                var node = new Node(val, null, this.head, this);
                this.head = node;
                this.tail = this.tail || node;
                this.size++;
                return this.size;
            },
            shift: function() {
                if (!this.head) return;
                var node = this.head;
                this.head = node.next;

                if (this.head) {
                    this.head.prev = null;
                } else {
                    this.tail = null;
                }

                this.size--;
                return node.value;
            },
            rmNode: function(node) {
                if (node.list !== this) {
                    throw Error('Node does not belong to this list');
                }

                var next = node.next,
                    prev = node.prev;

                if (next) {
                    next.prev = prev;
                }

                if (prev) {
                    prev.next = next;
                }

                if (node === this.head) {
                    this.head = next;
                }

                if (node === this.tail) {
                    this.tail = prev;
                }

                node.list = null;
                node.prev = null;
                node.next = null;
                this.size--;
            },
            find: function(fn) {
                for (var i = 0, current = this.head; current !== null; i++) {
                    if (fn(current.value)) {
                        return current;
                    }

                    current = current.next;
                }
            },
            forEach: function(iterator, ctx) {
                ctx = arguments.length > 1 ? ctx : this;

                for (var i = 0, current = this.head; current !== null; i++) {
                    iterator.call(ctx, current.value, i, this);
                    current = current.next;
                }
            },
            toArr: function() {
                var arr = new Array(this.size);

                for (var i = 0, current = this.head; current !== null; i++) {
                    arr[i] = current.value;
                    current = current.next;
                }

                return arr;
            }
        });
        var Node = (exports.Node = Class({
            initialize: function Node(val, prev, next, list) {
                this.value = val;
                this.list = list;

                if (prev) {
                    prev.next = this;
                    this.prev = prev;
                } else {
                    this.prev = null;
                }

                if (next) {
                    next.prev = this;
                    this.next = next;
                } else {
                    this.next = null;
                }
            }
        }));

        return exports;
    })({});

    /* ------------------------------ HashTable ------------------------------ */
    _.HashTable = (function (exports) {
        /* Hash table implementation.
         *
         * ### constructor
         *
         * |Name   |Desc       |
         * |-------|-----------|
         * |size=32|Bucket size|
         *
         * ### set
         *
         * Set value.
         *
         * |Name|Desc        |
         * |----|------------|
         * |key |Value key   |
         * |val |Value to set|
         *
         * ### get
         *
         * Get value.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |key   |Value key         |
         * |return|Value of given key|
         *
         * ### has
         *
         * Check if has value.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |key   |Value key           |
         * |return|True if value exists|
         *
         * ### delete
         *
         * Delete value.
         */

        /* example
         * const hashTable = new HashTable(128);
         * hashTable.set('name', 'redhoodsu');
         * hashTable.get('name'); // -> 'redhoodsu'
         * hashTable.has('name'); // -> true
         * hashTable.delete('name');
         * hashTable.has('name'); // -> false
         */

        /* typescript
         * export declare class HashTable {
         *     constructor(size?: number);
         *     set(key: string, val: any): void;
         *     get(key: string): any;
         *     has(key: string): boolean;
         *     delete(key: string): void;
         * }
         */

        /* dependencies
         * Class LinkedList map strHash has 
         */

        exports = Class({
            initialize: function HashTable() {
                var size =
                    arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : 32;
                this._buckets = map(Array(size), function() {
                    return new LinkedList();
                });
                this._keys = {};
            },
            set: function(key, val) {
                var keyHash = this._hash(key);

                this._keys[key] = keyHash;
                var linkedList = this._buckets[keyHash];
                var node = linkedList.find(function(val) {
                    return val.key === key;
                });

                if (!node) {
                    linkedList.push({
                        key: key,
                        value: val
                    });
                } else {
                    node.value.value = val;
                }
            },
            get: function(key) {
                var linkedList = this._buckets[this._hash(key)];

                var node = linkedList.find(function(val) {
                    return val.key === key;
                });

                if (node) {
                    return node.value.value;
                }
            },
            has: function(key) {
                return has(this._keys, key);
            },
            delete: function(key) {
                var keyHash = this._hash(key);

                delete this._keys[key];
                var linkedList = this._buckets[keyHash];
                var node = linkedList.find(function(val) {
                    return val.key === key;
                });

                if (node) {
                    linkedList.rmNode(node);
                }
            },
            _hash: function(key) {
                return strHash(key) % this._buckets.length;
            }
        });

        return exports;
    })({});

    /* ------------------------------ HeapSnapshot ------------------------------ */
    _.HeapSnapshot = (function (exports) {
        /* V8 heap snapshot manipulator.
         *
         * ### constructor
         *
         * |Name   |Desc            |
         * |-------|----------------|
         * |profile|Profile to parse|
         *
         * ### nodes
         *
         * Parsed nodes.
         *
         * ### edges
         *
         * Parsed edges.
         */

        /* example
         * const fs = require('fs');
         * const data = fs.readFileSync('path/to/heapsnapshot', 'utf8');
         * const heapSnapshot = new HeapSnapshot(data);
         * let totalSize = 0;
         * heapSnapshot.nodes.forEach(node => (totalSize += node.selfSize));
         * console.log(totalSize);
         */

        /* typescript
         * export declare class HeapSnapshot {
         *     nodes: LinkedList;
         *     edges: LinkedList;
         *     constructor(profile: any);
         * }
         */

        /* dependencies
         * Class toBool camelCase LinkedList isStr each map 
         */

        exports = Class({
            initialize: function HeapSnapshot(profile) {
                if (isStr(profile)) {
                    profile = JSON.parse(profile);
                }

                this.nodes = new LinkedList();
                this.edges = new LinkedList();
                var snapshot = profile.snapshot;
                var meta = snapshot.meta;
                this.nodeFields = map(meta.node_fields, camelCase);
                this.nodeTypes = meta.node_types[this.nodeFields.indexOf('type')];
                this.edgeFields = map(meta.edge_fields, camelCase);
                this.edgeTypes = meta.edge_types[this.edgeFields.indexOf('type')];

                this._init(profile);
            },
            _init: function(profile) {
                var _this = this;

                var nodes = profile.nodes,
                    edges = profile.edges,
                    strings = profile.strings;
                var nodeFields = this.nodeFields,
                    edgeFields = this.edgeFields;
                var curEdgeIdx = 0;
                var nodeFieldCount = nodeFields.length;
                var edgeFieldCount = edgeFields.length;
                var nodeMap = {};

                for (var i = 0, len = nodes.length; i < len; i += nodeFieldCount) {
                    var node = new Node(this);
                    node.init(nodes.slice(i, i + nodeFieldCount), strings);
                    this.nodes.push(node);
                    nodeMap[i] = node;
                }

                this.nodes.forEach(function(node) {
                    var edgeCount = node.edgeCount;
                    delete node.edgeCount;
                    var maxEdgeIdx = curEdgeIdx + edgeCount * edgeFieldCount;

                    for (var _i = curEdgeIdx; _i < maxEdgeIdx; _i += edgeFieldCount) {
                        var edge = new Edge(_this, node);
                        edge.init(
                            edges.slice(_i, _i + edgeFieldCount),
                            strings,
                            nodeMap
                        );

                        _this.edges.push(edge);
                    }

                    curEdgeIdx = maxEdgeIdx;
                });
            }
        });
        var Node = Class({
            initialize: function Node(heapSnapshot) {
                this._heapSnapshot = heapSnapshot;
            },
            init: function(fields, strings) {
                var _this2 = this;

                var heapSnapshot = this._heapSnapshot;
                var nodeFields = heapSnapshot.nodeFields,
                    nodeTypes = heapSnapshot.nodeTypes;
                each(nodeFields, function(field, idx) {
                    var val = fields[idx];

                    switch (field) {
                        case 'name':
                            val = strings[val];
                            break;

                        case 'detachedness':
                            val = toBool(val);
                            break;

                        case 'type':
                            val = nodeTypes[val];
                            break;
                    }

                    _this2[field] = val;
                });
            }
        });
        var Edge = Class({
            initialize: function Edge(heapSnapshot, fromNode) {
                this._heapSnapshot = heapSnapshot;
                this.fromNode = fromNode;
            },
            init: function(fields, strings, nodeMap) {
                var _this3 = this;

                var heapSnapshot = this._heapSnapshot;
                var edgeFields = heapSnapshot.edgeFields,
                    edgeTypes = heapSnapshot.edgeTypes;
                each(edgeFields, function(field, idx) {
                    var val = fields[idx];

                    switch (field) {
                        case 'nameOrIndex':
                            val = strings[val];
                            break;

                        case 'type':
                            val = edgeTypes[val];
                            break;

                        case 'toNode':
                            val = nodeMap[val];
                            break;
                    }

                    _this3[field] = val;
                });
            }
        });

        return exports;
    })({});

    /* ------------------------------ PseudoMap ------------------------------ */

    var PseudoMap = _.PseudoMap = (function (exports) {
        /* Like es6 Map, without iterators.
         *
         * It supports only string keys, and uses Map if exists.
         */

        /* example
         * const map = new PseudoMap();
         * map.set('1', 1);
         * map.get('1'); // -> 1
         */

        /* typescript
         * export declare const PseudoMap: typeof Map;
         */

        /* dependencies
         * Class root defineProp keys each isArr isUndef 
         */

        if (root.Map && !false) {
            exports = root.Map;
        } else {
            exports = Class({
                initialize: function PseudoMap(data) {
                    this.clear();
                    var self = this;
                    defineProp(this, 'size', {
                        get: function() {
                            return keys(self._data).length;
                        },
                        set: function() {},
                        enumerable: true,
                        configurable: true
                    });

                    if (data instanceof exports) {
                        data.forEach(function(val, key) {
                            this.set(key, val);
                        }, this);
                    } else if (isArr(data)) {
                        each(
                            data,
                            function(val) {
                                this.set(val[0], val[1]);
                            },
                            this
                        );
                    }
                },
                forEach: function(fn, ctx) {
                    each(
                        this._data,
                        function(val, key) {
                            fn.call(this, val, key);
                        },
                        ctx
                    );
                },
                has: function(key) {
                    return !isUndef(this._data[key]);
                },
                get: function(key) {
                    return this._data[key];
                },
                set: function(key, val) {
                    this._data[key] = val;
                },
                delete: function(key) {
                    delete this._data[key];
                },
                clear: function() {
                    this._data = {};
                }
            });
        }

        return exports;
    })({});

    /* ------------------------------ Lru ------------------------------ */
    _.Lru = (function (exports) {
        /* Simple LRU cache.
         *
         * ### constructor
         *
         * |Name|Desc              |
         * |----|------------------|
         * |max |Max items in cache|
         *
         * ### has
         *
         * Check if has cache.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |key   |Cache key           |
         * |return|True if value exists|
         *
         * ### remove
         *
         * Remove cache.
         *
         * |Name  |Desc     |
         * |------|---------|
         * |key   |Cache key|
         *
         * ### get
         *
         * Get cache value.
         *
         * |Name  |Desc       |
         * |------|-----------|
         * |key   |Cache key  |
         * |return|Cache value|
         *
         * ### set
         *
         * Set cache.
         *
         * |Name  |Desc       |
         * |------|-----------|
         * |key   |Cache key  |
         * |val   |Cache value|
         *
         * ### clear
         *
         * Clear cache.
         */

        /* example
         * const cache = new Lru(50);
         * cache.set('test', 'licia');
         * cache.get('test'); // -> 'licia'
         */

        /* typescript
         * export declare class Lru {
         *     constructor(max: number);
         *     has(key: string): boolean;
         *     remove(key: string): void;
         *     get(key: string): any;
         *     set(key: string, val: any): void;
         *     clear(): void;
         * }
         */

        /* dependencies
         * LinkedList PseudoMap Class 
         */

        exports = Class({
            initialize: function Lru(max) {
                this._max = max;
                this._list = new LinkedList();
                this._map = new PseudoMap();
            },
            has: function(key) {
                return this._map.has(key);
            },
            remove: function(key) {
                var map = this._map;

                if (this.has(key)) {
                    var node = map.get(key);

                    this._list.rmNode(node);

                    map.delete(key);
                }
            },
            get: function(key) {
                var list = this._list;
                var map = this._map;
                var ret;

                if (this.has(key)) {
                    var node = map.get(key);
                    ret = node.value.val;
                    list.rmNode(node);
                    list.unshift(node.value);
                    map.set(key, list.head);
                }

                return ret;
            },
            set: function(key, val) {
                var list = this._list;
                var map = this._map;

                if (this.has(key)) {
                    var node = map.get(key);
                    list.rmNode(node);
                    list.unshift({
                        key: key,
                        val: val
                    });
                    map.set(key, list.head);
                } else {
                    list.unshift({
                        key: key,
                        val: val
                    });
                    map.set(key, list.head);

                    if (list.size > this._max) {
                        var item = list.pop();
                        map.delete(item.key);
                    }
                }
            },
            clear: function() {
                this._map = new PseudoMap();
                this._list = new LinkedList();
            }
        });

        return exports;
    })({});

    /* ------------------------------ Queue ------------------------------ */

    var Queue = _.Queue = (function (exports) {
        /* Queue data structure.
         *
         * ### size
         *
         * Queue size.
         *
         * ### clear
         *
         * Clear the queue.
         *
         * ### enqueue
         *
         * Add an item to the queue.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |item  |Item to enqueue|
         * |return|Current size   |
         *
         * ### dequeue
         *
         * Remove the first item of the queue.
         *
         * ### peek
         *
         * Get the first item without removing it.
         *
         * ### forEach
         *
         * Iterate over the queue.
         *
         * |Name    |Desc                      |
         * |--------|--------------------------|
         * |iterator|Function invoked iteration|
         * |ctx     |Function context          |
         *
         * ### toArr
         *
         * Convert queue to a JavaScript array.
         */

        /* example
         * const queue = new Queue();
         *
         * console.log(queue.size); // -> 0
         * queue.enqueue(2);
         * queue.enqueue(3);
         * queue.dequeue(); // -> 2
         * console.log(queue.size); // -> 1
         * queue.peek(); // -> 3
         * console.log(queue.size); // -> 1
         */

        /* typescript
         * export declare class Queue {
         *     size: number;
         *     clear(): void;
         *     enqueue(item: any): number;
         *     dequeue(): any;
         *     peek(): any;
         *     forEach(iterator: types.AnyFn, context?: any): void;
         *     toArr(): any[];
         * }
         */

        /* dependencies
         * Class types 
         */

        exports = Class({
            initialize: function Queue() {
                this.clear();
            },
            clear: function() {
                this._items = [];
                this.size = 0;
            },
            enqueue: function(item) {
                this._items.push(item);

                return ++this.size;
            },
            dequeue: function() {
                if (!this.size) return;
                this.size--;
                return this._items.shift();
            },
            peek: function() {
                if (!this.size) return;
                return this._items[0];
            },
            forEach: function(iterator, ctx) {
                ctx = arguments.length > 1 ? ctx : this;
                var items = this._items;

                for (var i = 0, size = this.size; i < size; i++) {
                    iterator.call(ctx, items[i], i, this);
                }
            },
            toArr: function() {
                return this._items.slice(0);
            }
        });

        return exports;
    })({});

    /* ------------------------------ QuickLru ------------------------------ */
    _.QuickLru = (function (exports) {
        /* LRU implementation without linked list.
         *
         * Inspired by the [hashlru algorithm](https://github.com/dominictarr/hashlru#algorithm).
         *
         * The api is the same as Lru module.
         */

        /* example
         * const cache = new QuickLru(50);
         * cache.set('test', 'licia');
         * cache.get('test'); // -> 'licia'
         */

        /* typescript
         * export declare class QuickLru {
         *     constructor(max: number);
         *     has(key: string): boolean;
         *     remove(key: string): void;
         *     get(key: string): any;
         *     set(key: string, val: any): void;
         *     clear(): void;
         * }
         */

        /* dependencies
         * isUndef Class 
         */

        exports = Class({
            initialize: function QuickLru(max) {
                this._max = max;
                this._cache = {};
                this._oldCache = {};
                this._size = 0;
            },
            has: function(key) {
                return !isUndef(this._cache[key]) || !isUndef(this._oldCache[key]);
            },
            remove: function(key) {
                if (!isUndef(this._cache[key])) this._cache[key] = undefined;
                if (!isUndef(this._oldCache[key])) this._oldCache[key] = undefined;
            },
            get: function(key) {
                if (!isUndef(this._cache[key])) {
                    return this._cache[key];
                }

                var val = this._oldCache[key];

                if (!isUndef(val)) {
                    this._update(key, val);

                    return val;
                }
            },
            set: function(key, val) {
                if (!isUndef(this._cache[key])) {
                    this._cache[key] = val;
                } else {
                    this._update(key, val);
                }
            },
            clear: function() {
                this._cache = {};
                this._oldCache = {};
            },
            _update: function(key, val) {
                this._cache[key] = val;
                this._size++;

                if (this._size > this._max) {
                    this._size = 0;
                    this._oldCache = this._cache;
                    this._cache = {};
                }
            }
        });

        return exports;
    })({});

    /* ------------------------------ Semaphore ------------------------------ */
    _.Semaphore = (function (exports) {
        /* Limit simultaneous access to a resource.
         *
         * ### constructor
         *
         * |Name     |Desc           |
         * |---------|---------------|
         * |counter=1|Initial counter|
         *
         * ### wait
         *
         * Wait to execute until counter is bigger than 0.
         *
         * |Name|Desc               |
         * |----|-------------------|
         * |fn  |Function to execute|
         *
         * ### signal
         *
         * Wake up one waiter if any.
         */

        /* example
         * const sem = new Semaphore(10);
         * require('http')
         *     .createServer((req, res) => {
         *         sem.wait(function() {
         *             res.end('.');
         *             setTimeout(() => sem.signal(), 500);
         *         });
         *     })
         *     .listen(3000);
         */

        /* typescript
         * export declare class Semaphore {
         *     constructor(counter?: number);
         *     wait(fn: () => void): void;
         *     signal(): void;
         * }
         */

        /* dependencies
         * Class Queue 
         */

        exports = Class({
            initialize: function Semaphore() {
                var counter =
                    arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : 1;
                this._counter = counter;
                this._tasks = new Queue();
            },
            wait: function(fn) {
                if (this._counter > 0) {
                    this._counter--;
                    return fn();
                }

                this._tasks.enqueue(fn);
            },
            signal: function() {
                var task = this._tasks.dequeue();

                if (task) {
                    return task();
                }

                this._counter++;
            }
        });

        return exports;
    })({});

    /* ------------------------------ Stack ------------------------------ */

    var Stack = _.Stack = (function (exports) {
        /* Stack data structure.
         *
         * ### size
         *
         * Stack size.
         *
         * ### clear
         *
         * Clear the stack.
         *
         * ### push
         *
         * Add an item to the stack.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |item  |Item to add |
         * |return|Current size|
         *
         * ### pop
         *
         * Get the last item of the stack.
         *
         * ### peek
         *
         * Get the last item without removing it.
         *
         * ### forEach
         *
         * Iterate over the stack.
         *
         * |Name    |Desc                      |
         * |--------|--------------------------|
         * |iterator|Function invoked iteration|
         * |ctx     |Function context          |
         *
         * ### toArr
         *
         * Convert the stack to a JavaScript array.
         */

        /* example
         * const stack = new Stack();
         *
         * stack.push(2); // -> 1
         * stack.push(3); // -> 2
         * stack.pop(); // -> 3
         */

        /* typescript
         * export declare class Stack {
         *     size: number;
         *     clear(): void;
         *     push(item: any): number;
         *     pop(): any;
         *     peek(): any;
         *     forEach(iterator: types.AnyFn, context?: any): void;
         *     toArr(): any[];
         * }
         */

        /* dependencies
         * Class reverse types 
         */

        exports = Class({
            initialize: function Stack() {
                this.clear();
            },
            clear: function() {
                this._items = [];
                this.size = 0;
            },
            push: function(item) {
                this._items.push(item);

                return ++this.size;
            },
            pop: function() {
                if (!this.size) return;
                this.size--;
                return this._items.pop();
            },
            peek: function() {
                return this._items[this.size - 1];
            },
            forEach: function(iterator, ctx) {
                ctx = arguments.length > 1 ? ctx : this;
                var items = this._items;

                for (var i = this.size - 1, j = 0; i >= 0; i--, j++) {
                    iterator.call(ctx, items[i], j, this);
                }
            },
            toArr: function() {
                return reverse(this._items);
            }
        });

        return exports;
    })({});

    /* ------------------------------ Trie ------------------------------ */
    _.Trie = (function (exports) {
        /* Trie data structure.
         *
         * ### add
         *
         * Add a word to trie.
         *
         * |Name|Desc       |
         * |----|-----------|
         * |word|Word to add|
         *
         * ### remove
         *
         * Remove a word from trie.
         *
         * ### has
         *
         * Check if word exists.
         *
         * ### words
         *
         * Get all words with given Prefix.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |prefix|Word prefix            |
         * |return|Words with given Prefix|
         *
         * ### clear
         *
         * Clear all words from trie.
         */

        /* example
         * const trie = new Trie();
         * trie.add('carpet');
         * trie.add('car');
         * trie.add('cat');
         * trie.add('cart');
         * trie.has('cat'); // -> true
         * trie.remove('carpet');
         * trie.has('carpet'); // -> false
         * trie.words('car'); // -> ['car', 'cart']
         * trie.clear();
         */

        /* typescript
         * export declare class Trie {
         *     add(word: string): void;
         *     remove(word: string): void;
         *     has(word: string): boolean;
         *     words(prefix: string): string[];
         *     clear(): void;
         * }
         */

        /* dependencies
         * Class each 
         */ // https://chromium.googlesource.com/devtools/devtools-frontend/+/refs/heads/master/front_end/common/Trie.js

        exports = Class({
            initialize: function Trie() {
                this.clear();
            },
            add: function(word) {
                var edges = this._edges;
                var node = this._root;
                this._wordsInSubtree[node]++;

                for (var i = 0, len = word.length; i < len; i++) {
                    var edge = word[i];
                    var next = edges[node][edge];

                    if (!next) {
                        if (this._freeNodes.length) {
                            next = this._freeNodes.pop();
                        } else {
                            next = this._idx++;

                            this._isWord.push(false);

                            this._wordsInSubtree.push(0);

                            edges.push({});
                        }

                        edges[node][edge] = next;
                    }

                    this._wordsInSubtree[next]++;
                    node = next;
                }

                this._isWord[node] = true;
            },
            remove: function(word) {
                if (!this.has(word)) {
                    return;
                }

                var node = this._root;
                this._wordsInSubtree[node]--;

                for (var i = 0, len = word.length; i < len; i++) {
                    var edge = word[i];
                    var next = this._edges[node][edge];

                    if (!--this._wordsInSubtree[next]) {
                        delete this._edges[node][edge];

                        this._freeNodes.push(next);
                    }

                    node = next;
                }

                this._isWord[node] = false;
            },
            has: function(word) {
                var node = this._root;

                for (var i = 0, len = word.length; i < len; i++) {
                    node = this._edges[node][word[i]];

                    if (!node) {
                        return false;
                    }
                }

                return this._isWord[node];
            },
            words: function(prefix) {
                var node = this._root;

                for (var i = 0, len = prefix.length; i < len; i++) {
                    node = this._edges[node][prefix[i]];

                    if (!node) {
                        return [];
                    }
                }

                var result = [];

                this._dfs(node, prefix, result);

                return result;
            },
            clear: function() {
                this._idx = 1;
                this._root = 0;
                this._edges = [{}];
                this._isWord = [false];
                this._wordsInSubtree = [0];
                this._freeNodes = [];
            },
            _dfs: function(node, prefix, result) {
                var _this = this;

                if (this._isWord[node]) {
                    result.push(prefix);
                }

                var edges = this._edges[node];
                each(edges, function(node, edge) {
                    return _this._dfs(node, prefix + edge, result);
                });
            }
        });

        return exports;
    })({});

    /* ------------------------------ Validator ------------------------------ */
    _.Validator = (function (exports) {
        /* Object values validation.
         *
         * ### constructor
         *
         * |Name   |Desc                    |
         * |-------|------------------------|
         * |options|Validation configuration|
         *
         * ### validate
         *
         * Validate object.
         *
         * |Name  |Desc                            |
         * |------|--------------------------------|
         * |obj   |Object to validate              |
         * |return|Validation result, true means ok|
         *
         * ### addPlugin
         *
         * [static] Add plugin.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |name  |Plugin name       |
         * |plugin|Validation handler|
         *
         * ### Default Plugins
         *
         * Required, number, boolean, string and regexp.
         */

        /* example
         * Validator.addPlugin('custom', function(val, key, config) {
         *     if (typeof val === 'string' && val.length === 5) return true;
         *
         *     return key + ' should be a string with length 5';
         * });
         * const validator = new Validator({
         *     test: {
         *         required: true,
         *         custom: true
         *     }
         * });
         * validator.validate({}); // -> 'test is required'
         * validator.validate({ test: 1 }); // -> 'test should be a string with length 5';
         * validator.validate({ test: 'licia' }); // -> true
         */

        /* typescript
         * export declare class Validator {
         *     constructor(options: types.PlainObj<any>);
         *     validate(object: any): string | boolean;
         *     static plugins: any;
         *     static addPlugin(name: string, plugin: types.AnyFn): void;
         * }
         */

        /* dependencies
         * Class keys safeGet isFn isUndef isNum isStr isBool types 
         */

        exports = Class(
            {
                className: 'Validator',
                initialize: function(options) {
                    this._options = options;
                    this._optKeys = keys(options);
                },
                validate: function(obj) {
                    obj = obj || {};
                    var options = this._options;
                    var objKeys = this._optKeys;

                    for (var i = 0, len = objKeys.length; i < len; i++) {
                        var key = objKeys[i];

                        var result = this._validateVal(
                            safeGet(obj, key),
                            options[key],
                            key
                        );

                        if (result !== true) return result;
                    }

                    return true;
                },
                _validateVal: function(val, rules, objKey) {
                    var plugins = exports.plugins;
                    if (isFn(rules)) return rules(val);
                    var ruleKeys = keys(rules);

                    for (var i = 0, len = ruleKeys.length; i < len; i++) {
                        var key = ruleKeys[i];
                        var config = rules[key];
                        var result = true;
                        if (isFn(config)) result = config(val, objKey);
                        var plugin = plugins[key];
                        if (plugin) result = plugin(val, objKey, config);
                        if (result !== true) return result;
                    }

                    return true;
                }
            },
            {
                plugins: {
                    required: function(val, key, config) {
                        if (config && isUndef(val)) return key + ' is required';
                        return true;
                    },
                    number: function(val, key, config) {
                        if (config && !isUndef(val) && !isNum(val))
                            return key + ' should be a number';
                        return true;
                    },
                    boolean: function(val, key, config) {
                        if (config && !isUndef(val) && !isBool(val))
                            return key + ' should be a boolean';
                        return true;
                    },
                    string: function(val, key, config) {
                        if (config && !isUndef(val) && !isStr(val))
                            return key + ' should be a string';
                        return true;
                    },
                    regexp: function(val, key, config) {
                        if (isStr(val) && !config.test(val))
                            return (
                                key + ' should match given regexp ' + config.toString()
                            );
                        return true;
                    }
                },
                addPlugin: function(name, plugin) {
                    exports.plugins[name] = plugin;
                }
            }
        );

        return exports;
    })({});

    /* ------------------------------ Wrr ------------------------------ */
    _.Wrr = (function (exports) {
        /* Weighted Round Robin implementation.
         *
         * ### size
         *
         * Pool size.
         *
         * ### set
         *
         * Set a value to the pool. Weight is updated if value already exists.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |val   |Value to set       |
         * |weight|Weight of the value|
         *
         * ### get
         *
         * Get weight of given value.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |val   |Value to get       |
         * |return|Weight of the value|
         *
         * ### remove
         *
         * Remove given value.
         *
         * |Name|Desc           |
         * |----|---------------|
         * |val |Value to remove|
         *
         * ### next
         *
         * Get next value from pool.
         *
         * ### clear
         *
         * Clear all values.
         */

        /* example
         * const pool = new Wrr();
         * pool.set('A', 4);
         * pool.set('B', 8);
         * pool.set('C', 2);
         * pool.next();
         * pool.remove('A');
         * console.log(pool.size); // -> 2
         */

        /* typescript
         * export declare class Wrr {
         *     size: number;
         *     set(val: any, weight: number): void;
         *     get(val: any): number | void;
         *     remove(val: any): void;
         *     clear(): void;
         *     next(): any;
         * }
         */

        /* dependencies
         * Class max map reduce gcd filter 
         */

        exports = Class({
            initialize: function Wrr() {
                this._peers = [];
            },
            set: function(val, weight) {
                var peers = this._peers;
                var size = this.size;

                for (var i = 0; i < size; i++) {
                    var peer = peers[i];

                    if (peer.val === val) {
                        peer.weight = weight;

                        this._reset();

                        return;
                    }
                }

                peers.push({
                    val: val,
                    weight: weight
                });

                this._reset();
            },
            get: function(val) {
                var peers = this._peers;
                var size = this.size;

                for (var i = 0; i < size; i++) {
                    var peer = peers[i];

                    if (peer.val === val) {
                        return peer.weight;
                    }
                }
            },
            remove: function(val) {
                this._peers = filter(this._peers, function(peer) {
                    return peer.val !== val;
                });

                this._reset();
            },
            next: function() {
                var peers = this._peers;
                var size = this.size;
                if (size === 0) return; // http://kb.linuxvirtualserver.org/wiki/Weighted_Round-Robin_Scheduling

                while (
                    true
                    /* eslint-disable-line */
                ) {
                    this._i = (this._i + 1) % size;

                    if (this._i === 0) {
                        this._cw = this._cw - this._gcdS;

                        if (this._cw <= 0) {
                            this._cw = this._maxS;
                        }
                    }

                    if (this._cw === 0) return;

                    if (peers[this._i].weight >= this._cw) {
                        return peers[this._i].val;
                    }
                }
            },
            clear: function() {
                this._peers = [];

                this._reset();
            },
            _reset: function() {
                var peers = this._peers;
                this.size = peers.length;
                var weights = map(peers, function(peer) {
                    return peer.weight;
                });
                this._i = -1;
                this._cw = 0;
                this._maxS = max.apply(null, weights);
                this._gcdS = reduce(
                    weights,
                    function(prev, weight) {
                        return gcd(prev, weight);
                    },
                    0
                );
            }
        });

        return exports;
    })({});

    /* ------------------------------ isCyclic ------------------------------ */
    _.isCyclic = (function (exports) {
        /* Detect cyclic object reference.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |val   |Value to detect        |
         * |return|True if value is cyclic|
         */

        /* example
         * isCyclic({}); // -> false
         * const obj = { a: 1 };
         * // @ts-ignore
         * obj.b = obj;
         * isCyclic(obj); // -> true
         */

        /* typescript
         * export declare function isCyclic(val: any): boolean;
         */

        /* dependencies
         * Class keys isObj 
         */

        exports = function(val, parents) {
            // Slower than is-circular because of different ways to check if value is an object.
            if (!isObj(val)) {
                return false;
            }

            if (parents && parents.contains(val)) {
                return true;
            }

            parents = new Node(val, parents);

            var _keys = keys(val);

            for (var i = 0, len = _keys.length; i < len; i++) {
                if (exports(val[_keys[i]], parents)) {
                    return true;
                }
            }

            return false;
        };
        /* https://github.com/tjmehta/is-circular
         * Use singly linked list to avoid creating arrays.
         */

        var Node = Class({
            initialize: function Node(val, next) {
                this.val = val;
                this.next = next;
            },
            contains: function(val) {
                var cursor = this;

                while (cursor) {
                    if (cursor.val === val) {
                        return true;
                    }

                    cursor = cursor.next;
                }

                return false;
            }
        });

        return exports;
    })({});

    /* ------------------------------ moment ------------------------------ */
    _.moment = (function (exports) {
        /* Tiny moment.js like implementation.
         *
         * It only supports a subset of moment.js api.
         *
         * ### Available methods
         *
         * format, isValid, isLeapYear, isSame, isBefore, isAfter, year,
         * month, date, hour, minute, second, millisecond, unix, clone,
         * toDate, toArray, toJSON, toISOString, toObject, toString, set,
         * startOf, endOf, add, subtract, diff
         *
         * ### Not supported
         *
         * locale and units like quarter and week.
         *
         * Note: Format uses dateFormat module, so the mask is not quite the same as moment.js.
         */

        /* example
         * moment('20180501').format('yyyy-mm-dd'); // -> '2018-05-01'
         */

        /* typescript
         * export declare namespace moment {
         *     class M {
         *         constructor(value: string | Date);
         *         format(mask: string): string;
         *         isValid(): boolean;
         *         isLeapYear(): boolean;
         *         isSame(that: M): boolean;
         *         valueOf(): number;
         *         isBefore(that: M): boolean;
         *         isAfter(that: M): boolean;
         *         year(): number;
         *         year(number): M;
         *         month(): number;
         *         month(number): M;
         *         date(): number;
         *         date(number): M;
         *         hour(): number;
         *         hour(number): M;
         *         minute(): number;
         *         minute(number): M;
         *         second(): number;
         *         second(number): M;
         *         millisecond(): number;
         *         millisecond(number): M;
         *         unix(): number;
         *         clone(): M;
         *         toDate(): Date;
         *         toArray(): number[];
         *         toJSON(): string;
         *         toISOString(): string;
         *         toObject(): any;
         *         toString(): string;
         *         set(unit: string, num: number): M;
         *         startOf(unit: string): M;
         *         endOf(unit: string): M;
         *         daysInMonth(): number;
         *         add(num: number, unit: string): M;
         *         subtract(num: number, unit: string): M;
         *         diff(input: M | string | Date, unit: string, asFloat: boolean): number;
         *     }
         * }
         * export declare function moment(value: string | Date): moment.M;
         */

        /* dependencies
         * Class toDate dateFormat isLeapYear extend toStr isNil ms 
         */

        exports = function(val) {
            return new Moment(val);
        };

        var Moment = Class({
            initialize: function Moment(val) {
                this._d = toDate(val);

                this._init();
            },
            _init: function() {
                var d = this._d;
                extend(this, {
                    _year: d.getFullYear(),
                    _month: d.getMonth(),
                    _date: d.getDate(),
                    _hour: d.getHours(),
                    _minute: d.getMinutes(),
                    _second: d.getSeconds(),
                    _millisecond: d.getMilliseconds()
                });
                return this;
            },
            format: function(mask) {
                return dateFormat(this._d, mask);
            },
            isValid: function() {
                return !(this._d.toString() === 'Invalid Date');
            },
            isLeapYear: function() {
                return isLeapYear(this._year);
            },
            isSame: function(that) {
                return this.valueOf() === that.valueOf();
            },
            valueOf: function() {
                return this._d.getTime();
            },
            isBefore: function(that) {
                return this.valueOf() < that.valueOf();
            },
            isAfter: function(that) {
                return this.valueOf() > that.valueOf();
            },
            year: makeGetSet('year'),
            month: makeGetSet('month'),
            date: makeGetSet('date'),
            hour: makeGetSet('hour'),
            minute: makeGetSet('minute'),
            second: makeGetSet('second'),
            millisecond: makeGetSet('millisecond'),
            unix: function() {
                return floor(this.valueOf() / 1000);
            },
            clone: function() {
                return new Moment(this);
            },
            toDate: function() {
                return new Date(this._d);
            },
            toArray: function() {
                return [
                    this._year,
                    this._month,
                    this._date,
                    this._hour,
                    this._minute,
                    this._second,
                    this._millisecond
                ];
            },
            toJSON: function() {
                return this.toISOString();
            },
            toISOString: function() {
                return this.toDate().toISOString();
            },
            toObject: function() {
                return {
                    years: this._year,
                    months: this._month,
                    date: this._date,
                    hours: this._hour,
                    minutes: this._minute,
                    seconds: this._second,
                    milliseconds: this._millisecond
                };
            },
            toString: function() {
                return this._d.toUTCString();
            },
            set: function(unit, num) {
                var d = this._d;
                unit = normalizeUnit(unit);

                switch (unit) {
                    case 'year':
                        d.setFullYear(num);
                        break;

                    case 'month':
                        d.setMonth(num);
                        break;

                    case 'date':
                        d.setDate(num);
                        break;

                    case 'hour':
                        d.setHours(num);
                        break;

                    case 'minute':
                        d.setMinutes(num);
                        break;

                    case 'second':
                        d.setSeconds(num);
                        break;

                    case 'millisecond':
                        d.setMilliseconds(num);
                        break;
                }

                return this._init();
            },
            startOf: function(unit) {
                unit = normalizeUnit(unit);
                /* eslint-disable no-fallthrough */

                switch (unit) {
                    case 'year':
                        this.month(0);

                    case 'month':
                        this.date(1);

                    case 'day':
                    case 'date':
                        this.hour(0);

                    case 'hour':
                        this.minute(0);

                    case 'minute':
                        this.second(0);

                    case 'second':
                        this.millisecond(0);
                }

                return this;
            },
            endOf: function(unit) {
                return this.startOf(unit)
                    .add(1, unit)
                    .subtract(1, 'ms');
            },
            daysInMonth: function() {
                return this.clone()
                    .endOf('month')
                    .date();
            },
            add: createAdder(1),
            subtract: createAdder(-1),
            diff: function(input, unit, asFloat) {
                var that = input instanceof Moment ? input : new Moment(input);
                var ret;
                unit = normalizeUnit(unit);
                var diff = this - that;

                switch (unit) {
                    case 'year':
                        ret = monthDiff(this, that) / 12;
                        break;

                    case 'month':
                        ret = monthDiff(this, that);
                        break;

                    case 'second':
                        ret = diff / 1e3;
                        break;
                    // 1000

                    case 'minute':
                        ret = diff / 6e4;
                        break;
                    // 1000 * 60

                    case 'hour':
                        ret = diff / 36e5;
                        break;
                    // 1000 * 60 * 60

                    case 'day':
                        ret = diff / 864e5;
                        break;
                    // 1000 * 60 * 60 * 24

                    default:
                        ret = diff;
                }

                return asFloat ? ret : absFloor(ret);
            }
        });
        var floor = Math.floor;
        var ceil = Math.ceil;

        function absFloor(num) {
            return num < 0 ? ceil(num) || 0 : floor(num);
        }

        var unitShorthandMap = {
            y: 'year',
            M: 'month',
            D: 'date',
            d: 'day',
            h: 'hour',
            m: 'minute',
            s: 'second',
            ms: 'millisecond'
        };
        var regEndS = /s$/; // Turn 'y' or 'years' into 'year'

        function normalizeUnit(unit) {
            unit = toStr(unit);
            if (unitShorthandMap[unit]) return unitShorthandMap[unit];
            return unit.toLowerCase().replace(regEndS, '');
        }

        function makeGetSet(unit) {
            return function(num) {
                return isNil(num) ? this['_' + unit] : this.set(unit, num);
            };
        }

        function createAdder(dir) {
            return function(num, unit) {
                unit = normalizeUnit(unit);
                if (unit === 'month') return this.month(this._month + dir * num);
                if (unit === 'year') return this.year(this._year + dir * num);
                var duration = createDuration(num, unit);
                this._d = new Date(this.valueOf() + dir * duration);
                return this._init();
            };
        }

        var msMap = {
            day: 'd',
            hour: 'h',
            minute: 'm',
            second: 's',
            millisecond: ''
        };

        function createDuration(num, unit) {
            return ms(num + msMap[unit]);
        } // From moment.js

        function monthDiff(a, b) {
            var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
            var anchor = a.clone().add(wholeMonthDiff, 'months');
            var anchor2;
            var adjust;

            if (b - anchor < 0) {
                anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
                adjust = (b - anchor) / (anchor - anchor2);
            } else {
                anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
                adjust = (b - anchor) / (anchor2 - anchor);
            }

            return -(wholeMonthDiff + adjust) || 0;
        }

        return exports;
    })({});

    /* ------------------------------ JsonTransformer ------------------------------ */
    _.JsonTransformer = (function (exports) {
        /* Json to json transformer.
         *
         * ### constructor
         *
         * |Name   |Desc                     |
         * |-------|-------------------------|
         * |data={}|Json object to manipulate|
         *
         * ### set
         *
         * Set object value.
         *
         * |Name|Desc        |
         * |----|------------|
         * |key |Object key  |
         * |val |Value to set|
         *
         * If key is not given, the whole source object is replaced by val.
         *
         * ### get
         *
         * Get object value.
         *
         * |Name  |Desc                           |
         * |------|-------------------------------|
         * |key   |Object key                     |
         * |return|Specified value or whole object|
         *
         * ### remove
         *
         * Remove object value.
         *
         * |Name|Desc                 |
         * |----|---------------------|
         * |key |Object keys to remove|
         *
         * ### map
         *
         * Shortcut for array map.
         *
         * |Name|Desc                          |
         * |----|------------------------------|
         * |from|From object path              |
         * |to  |Target object path            |
         * |fn  |Function invoked per iteration|
         *
         * ### filter
         *
         * Shortcut for array filter.
         *
         * ### compute
         *
         * Compute value from several object values.
         *
         * |Name|Desc                            |
         * |----|--------------------------------|
         * |from|Source values                   |
         * |to  |Target object path              |
         * |fn  |Function to compute target value|
         */

        /* example
         * const data = new JsonTransformer({
         *     books: [
         *         {
         *             title: 'Book 1',
         *             price: 5
         *         },
         *         {
         *             title: 'Book 2',
         *             price: 10
         *         }
         *     ],
         *     author: {
         *         lastname: 'Su',
         *         firstname: 'RedHood'
         *     }
         * });
         * data.filter('books', function(book) {
         *     return book.price > 5;
         * });
         * data.compute('author', function(author) {
         *     return author.firstname + author.lastname;
         * });
         * data.set('count', data.get('books').length);
         * data.get(); // -> {books: [{title: 'Book 2', price: 10}], author: 'RedHoodSu', count: 1}
         */

        /* typescript
         * export declare class JsonTransformer {
         *     constructor(data: any);
         *     set(key: string, val: any): JsonTransformer;
         *     get(key?: string): any;
         *     map(from: string, to: string, fn: types.AnyFn): JsonTransformer;
         *     map(from: string, fn: types.AnyFn): JsonTransformer;
         *     filter(from: string, to: string, fn: types.AnyFn): JsonTransformer;
         *     filter(from: string, fn: types.AnyFn): JsonTransformer;
         *     remove(keys: string | string[]): JsonTransformer;
         *     compute(
         *         from: string | string[],
         *         to: string,
         *         fn: types.AnyFn
         *     ): JsonTransformer;
         *     compute(from: string, fn: types.AnyFn): JsonTransformer;
         *     toString(): string;
         * }
         */

        /* dependencies
         * Class safeSet safeGet map filter isFn safeDel toArr each types 
         */

        exports = Class({
            className: 'JsonTransformer',
            initialize: function(data) {
                this._data = data || {};
            },
            set: function(key, val) {
                if (arguments.length === 1) {
                    this._data = key;
                    return this;
                }

                safeSet(this._data, key, val);
                return this;
            },
            get: function(key) {
                if (key == null) return this._data;
                return safeGet(this._data, key);
            },
            map: function(from, to, fn) {
                if (isFn(from)) return this.set(map(this._data, from, this));

                if (isFn(to)) {
                    fn = to;
                    to = from;
                }

                return this.set(to, map(this.get(from), fn, this));
            },
            filter: function(from, to, fn) {
                if (isFn(from)) return this.set(filter(this._data, from, this));

                if (isFn(to)) {
                    fn = to;
                    to = from;
                }

                return this.set(to, filter(this.get(from), fn, this));
            },
            remove: function(keys) {
                keys = toArr(keys);
                var data = this._data;
                each(keys, function(key) {
                    safeDel(data, key);
                });
                return this;
            },
            compute: function(from, to, fn) {
                if (isFn(from)) return this.set(from.call(this, this._data));
                if (isFn(to)) return this.set(from, to.call(this, this.get(from)));
                from = map(
                    toArr(from),
                    function(key) {
                        return safeGet(this._data, key);
                    },
                    this
                );
                return this.set(to, fn.apply(this, from));
            },
            toString: function() {
                return JSON.stringify(this._data);
            }
        });

        return exports;
    })({});

    /* ------------------------------ SingleEmitter ------------------------------ */
    _.SingleEmitter = (function (exports) {
        /* Event emitter with single event type.
         *
         * ### addListener
         *
         * Add listener.
         *
         * ### rmListener
         *
         * Remove listener.
         *
         * |Name    |Desc          |
         * |--------|--------------|
         * |listener|Event listener|
         *
         * ### rmAllListeners
         *
         * Remove all listeners.
         *
         * ### emit
         *
         * Call listeners.
         *
         * |Name   |Desc                        |
         * |-------|----------------------------|
         * |...args|Arguments passed to listener|
         *
         * ### mixin
         *
         * [static] Mixin object class methods.
         *
         * |Name|Desc           |
         * |----|---------------|
         * |obj |Object to mixin|
         */

        /* example
         * const event = new SingleEmitter();
         * event.addListener(function(name) {
         *     console.log(name);
         * });
         * event.emit('licia'); // Logs out 'licia'.
         */

        /* typescript
         * export declare class SingleEmitter {
         *     addListener(listener: types.AnyFn): void;
         *     rmListener(listener: types.AnyFn): void;
         *     emit(...args: any[]): void;
         *     rmAllListeners(): void;
         *     static mixin(obj: any): void;
         * }
         */

        /* dependencies
         * Class clone each toArr types 
         */

        exports = Class(
            {
                initialize: function SingleEmitter() {
                    this._listeners = [];
                },
                addListener: function(listener) {
                    this._listeners.push(listener);
                },
                rmListener: function(listener) {
                    var idx = this._listeners.indexOf(listener);

                    if (idx > -1) {
                        this._listeners.splice(idx, 1);
                    }
                },
                rmAllListeners: function() {
                    this._listeners = [];
                },
                emit: function() {
                    var _this = this;

                    var args = toArr(arguments);
                    var listeners = clone(this._listeners);
                    each(
                        listeners,
                        function(listener) {
                            return listener.apply(_this, args);
                        },
                        this
                    );
                }
            },
            {
                mixin: function(obj) {
                    each(
                        ['addListener', 'rmListener', 'emit', 'rmAllListeners'],
                        function(val) {
                            obj[val] = exports.prototype[val];
                        }
                    );
                    obj._listeners = obj._listeners || [];
                }
            }
        );

        return exports;
    })({});

    /* ------------------------------ concat ------------------------------ */

    var concat = _.concat = (function (exports) {
        /* Concat multiple arrays into a single array.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |...arr|Arrays to concat  |
         * |return|Concatenated array|
         */

        /* example
         * concat([1, 2], [3], [4, 5]); // -> [1, 2, 3, 4, 5]
         */

        /* typescript
         * export declare function concat(...args: Array<any[]>): any[];
         */

        /* dependencies
         * toArr 
         */

        exports = function() {
            var args = toArr(arguments);
            var ret = [];

            for (var i = 0, len = args.length; i < len; i++) {
                ret = ret.concat(toArr(args[i]));
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ curry ------------------------------ */
    _.curry = (function (exports) {
        /* Function currying.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |fn    |Function to curry   |
         * |return|New curried function|
         */

        /* example
         * const add = curry(function(a, b) {
         *     return a + b;
         * });
         * const add1 = add(1);
         * add1(2); // -> 3
         */

        /* typescript
         * export declare function curry(fn: types.AnyFn): types.AnyFn;
         */

        /* dependencies
         * toArr types 
         */

        exports = function(fn) {
            var len = fn.length;
            return function curriedFn() {
                var args = toArr(arguments);

                if (args.length < len) {
                    return function() {
                        return curriedFn.apply(null, args.concat(toArr(arguments)));
                    };
                }

                return fn.apply(null, args);
            };
        };

        return exports;
    })({});

    /* ------------------------------ define ------------------------------ */

    var define = _.define = (function (exports) {
        /* Define a module, should be used along with use.
         *
         * |Name    |Desc        |
         * |--------|------------|
         * |name    |Module name |
         * |requires|Dependencies|
         * |method  |Module body |
         *
         * The module won't be executed until it's used by use function.
         */

        /* example
         * define('A', function() {
         *     return 'A';
         * });
         * define('B', ['A'], function(A) {
         *     return 'B' + A;
         * });
         */

        /* typescript
         * export declare function define(
         *     name: string,
         *     requires: string[],
         *     method: types.AnyFn
         * ): void;
         * export declare function define(name: string, method: types.AnyFn): void;
         */

        /* dependencies
         * toArr types 
         */

        exports = function(name, requires, method) {
            if (arguments.length === 2) {
                method = requires;
                requires = [];
            }

            define(name, requires, method);
        };

        var modules = (exports._modules = {});

        function define(name, requires, method) {
            modules[name] = {
                requires: toArr(requires),
                body: method
            };
        }

        return exports;
    })({});

    /* ------------------------------ intersect ------------------------------ */
    _.intersect = (function (exports) {
        /* Compute the list of values that are the intersection of all the arrays.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |...arr|Arrays to inspect             |
         * |return|New array of inspecting values|
         */

        /* example
         * intersect([1, 2, 3, 4], [2, 1, 10], [2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function intersect(...arr: Array<any[]>): any[];
         */

        /* dependencies
         * contain toArr 
         */

        exports = function(arr) {
            var ret = [];
            var args = toArr(arguments);
            var argsLen = args.length;

            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                if (contain(ret, item)) continue;
                var j = 1;

                for (; j < argsLen; j++) {
                    if (!contain(args[j], item)) break;
                }

                if (j === argsLen) ret.push(item);
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ partial ------------------------------ */

    var partial = _.partial = (function (exports) {
        /* Partially apply a function by filling in given arguments.
         *
         * |Name       |Desc                                    |
         * |-----------|----------------------------------------|
         * |fn         |Function to partially apply arguments to|
         * |...partials|Arguments to be partially applied       |
         * |return     |New partially applied function          |
         */

        /* example
         * const sub5 = partial(function(a, b) {
         *     return b - a;
         * }, 5);
         * sub5(20); // -> 15
         */

        /* typescript
         * export declare function partial(
         *     fn: types.AnyFn,
         *     ...partials: any[]
         * ): types.AnyFn;
         */

        /* dependencies
         * restArgs toArr types 
         */

        exports = restArgs(function(fn, partials) {
            return function() {
                var args = [];
                args = args.concat(partials);
                args = args.concat(toArr(arguments));
                return fn.apply(this, args);
            };
        });

        return exports;
    })({});

    /* ------------------------------ once ------------------------------ */

    var once = _.once = (function (exports) {
        /* Create a function that invokes once.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |fn    |Function to restrict   |
         * |return|New restricted function|
         */

        /* example
         * function init() {}
         * const initOnce = once(init);
         * initOnce();
         * initOnce(); // -> init is invoked once
         */

        /* typescript
         * export declare function once(fn: types.AnyFn): types.AnyFn;
         */

        /* dependencies
         * partial before types 
         */

        exports = partial(before, 2);

        return exports;
    })({});

    /* ------------------------------ Emitter ------------------------------ */

    var Emitter = _.Emitter = (function (exports) {
        /* Event emitter class which provides observer pattern.
         *
         * ### on
         *
         * Bind event.
         *
         * ### off
         *
         * Unbind event.
         *
         * ### once
         *
         * Bind event that trigger once.
         *
         * |Name    |Desc          |
         * |--------|--------------|
         * |event   |Event name    |
         * |listener|Event listener|
         *
         * ### emit
         *
         * Emit event.
         *
         * |Name   |Desc                        |
         * |-------|----------------------------|
         * |event  |Event name                  |
         * |...args|Arguments passed to listener|
         *
         * ### removeAllListeners
         *
         * Remove all listeners.
         *
         * |Name |Desc      |
         * |-----|----------|
         * |event|Event name|
         *
         * ### mixin
         *
         * [static] Mixin object class methods.
         *
         * |Name|Desc           |
         * |----|---------------|
         * |obj |Object to mixin|
         */

        /* example
         * const event = new Emitter();
         * event.on('test', function(name) {
         *     console.log(name);
         * });
         * event.emit('test', 'licia'); // Logs out 'licia'.
         * Emitter.mixin({});
         */

        /* typescript
         * export declare class Emitter {
         *     on(event: string, listener: types.AnyFn): Emitter;
         *     off(event: string, listener: types.AnyFn): Emitter;
         *     once(event: string, listener: types.AnyFn): Emitter;
         *     emit(event: string, ...args: any[]): Emitter;
         *     removeAllListeners(event?: string): Emitter;
         *     static mixin(obj: any): any;
         * }
         */

        /* dependencies
         * Class has each slice once types clone 
         */

        exports = Class(
            {
                initialize: function Emitter() {
                    this._events = this._events || {};
                },
                on: function(event, listener) {
                    this._events[event] = this._events[event] || [];

                    this._events[event].push(listener);

                    return this;
                },
                off: function(event, listener) {
                    var events = this._events;
                    if (!has(events, event)) return;
                    var idx = events[event].indexOf(listener);

                    if (idx > -1) {
                        events[event].splice(idx, 1);
                    }

                    return this;
                },
                once: function(event, listener) {
                    this.on(event, once(listener));
                    return this;
                },
                emit: function(event) {
                    var _this = this;

                    if (!has(this._events, event)) return;
                    var args = slice(arguments, 1);
                    var events = clone(this._events[event]);
                    each(
                        events,
                        function(val) {
                            return val.apply(_this, args);
                        },
                        this
                    );
                    return this;
                },
                removeAllListeners: function(event) {
                    if (!event) {
                        this._events = {};
                    } else {
                        delete this._events[event];
                    }

                    return this;
                }
            },
            {
                mixin: function(obj) {
                    each(['on', 'off', 'once', 'emit', 'removeAllListeners'], function(
                        val
                    ) {
                        obj[val] = exports.prototype[val];
                    });
                    obj._events = obj._events || {};
                }
            }
        );

        return exports;
    })({});

    /* ------------------------------ Logger ------------------------------ */
    _.Logger = (function (exports) {
        /* Simple logger with level filter.
         *
         * ### constructor
         *
         * |Name       |Desc        |
         * |-----------|------------|
         * |name       |Logger name |
         * |level=DEBUG|Logger level|
         *
         * ### setLevel
         *
         * Set level.
         *
         * |Name |Desc        |
         * |-----|------------|
         * |level|Logger level|
         *
         * ### getLevel
         *
         * Get current level.
         *
         * ### trace, debug, info, warn, error
         *
         * Logging methods.
         *
         * ### Log Levels
         *
         * TRACE, DEBUG, INFO, WARN, ERROR and SILENT.
         */

        /* example
         * const logger = new Logger('licia', Logger.level.ERROR);
         * logger.trace('test');
         *
         * // Format output.
         * logger.formatter = function(type, argList) {
         *     argList.push(new Date().getTime());
         *
         *     return argList;
         * };
         *
         * logger.on('all', function(type, argList) {
         *     // It's not affected by log level.
         * });
         *
         * logger.on('debug', function(argList) {
         *     // Affected by log level.
         * });
         */

        /* typescript
         * export declare class Logger extends Emitter {
         *     name: string;
         *     formatter(type: string, argList: any[]): any[];
         *     constructor(name: string, level?: string | number);
         *     setLevel(level: string | number): Logger;
         *     getLevel(): number;
         *     trace(...args: any[]): Logger;
         *     debug(...args: any[]): Logger;
         *     info(...args: any[]): Logger;
         *     warn(...args: any[]): Logger;
         *     error(...args: any[]): Logger;
         *     static level: Enum;
         * }
         */

        /* dependencies
         * Emitter Enum toArr isUndef clone isStr isNum 
         */

        exports = Emitter.extend(
            {
                initialize: function Logger(name, level) {
                    this.name = name;
                    this.setLevel(isUndef(level) ? exports.level.DEBUG : level);
                    this.callSuper(Emitter, 'initialize', arguments);
                },
                setLevel: function(level) {
                    if (isStr(level)) {
                        level = exports.level[level.toUpperCase()];
                        if (level) this._level = level;
                        return this;
                    }

                    if (isNum(level)) this._level = level;
                    return this;
                },
                getLevel: function() {
                    return this._level;
                },
                formatter: function(type, argList) {
                    return argList;
                },
                trace: function() {
                    return this._log('trace', arguments);
                },
                debug: function() {
                    return this._log('debug', arguments);
                },
                info: function() {
                    return this._log('info', arguments);
                },
                warn: function() {
                    return this._log('warn', arguments);
                },
                error: function() {
                    return this._log('error', arguments);
                },
                _log: function(type, argList) {
                    argList = toArr(argList);
                    if (argList.length === 0) return this;
                    this.emit('all', type, clone(argList));
                    if (exports.level[type.toUpperCase()] < this._level) return this;
                    this.emit(type, clone(argList));
                    /* eslint-disable no-console */

                    var consoleMethod = type === 'debug' ? console.log : console[type];
                    consoleMethod.apply(console, this.formatter(type, argList));
                    return this;
                }
            },
            {
                level: new Enum({
                    TRACE: 0,
                    DEBUG: 1,
                    INFO: 2,
                    WARN: 3,
                    ERROR: 4,
                    SILENT: 5
                })
            }
        );

        return exports;
    })({});

    /* ------------------------------ Store ------------------------------ */
    _.Store = (function (exports) {
        /* Memory storage.
         *
         * Extend from Emitter.
         *
         * ### constructor
         *
         * |Name|Desc        |
         * |----|------------|
         * |data|Initial data|
         *
         * ### set
         *
         * Set value.
         *
         * |Name|Desc        |
         * |----|------------|
         * |key |Value key   |
         * |val |Value to set|
         *
         * Set values.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |values|Key value pairs|
         *
         * This emit a change event whenever is called.
         *
         * ### get
         *
         * Get value.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |key   |Value key         |
         * |return|Value of given key|
         *
         * Get values.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |keys  |Array of keys  |
         * |return|Key value pairs|
         *
         * ### remove
         *
         * Remove value.
         *
         * |Name|Desc         |
         * |----|-------------|
         * |key |Key to remove|
         *
         * ### clear
         *
         * Clear all data.
         *
         * ### each
         *
         * Iterate over values.
         *
         * |Name|Desc                          |
         * |----|------------------------------|
         * |fn  |Function invoked per iteration|
         */

        /* example
         * const store = new Store('test');
         * store.set('user', { name: 'licia' });
         * store.get('user').name; // -> 'licia'
         * store.clear();
         * store.each(function(val, key) {
         *     // Do something.
         * });
         * store.on('change', function(key, newVal, oldVal) {
         *     // It triggers whenever set is called.
         * });
         */

        /* typescript
         * export declare class Store extends Emitter {
         *     constructor(data?: {});
         *     set(key: string, val: any): void;
         *     set(values: {}): void;
         *     get(key: string): any;
         *     get(keys: string[]): {};
         *     remove(key: string): void;
         *     remove(keys: string[]): void;
         *     clear(): void;
         *     each(fn: (...args: any[]) => void): void;
         * }
         */

        /* dependencies
         * Emitter isStr isObj each toArr 
         */

        exports = Emitter.extend({
            initialize: function Store(data) {
                this.callSuper(Emitter, 'initialize', arguments);
                this._data = data || {};
                this.save(this._data);
            },
            set: function(key, val) {
                var data;

                if (isStr(key)) {
                    data = {};
                    data[key] = val;
                } else if (isObj(key)) {
                    data = key;
                }

                var self = this;
                each(data, function(val, key) {
                    var oldVal = self._data[key];
                    self._data[key] = val;
                    self.emit('change', key, val, oldVal);
                });
                this.save(this._data);
            },
            get: function(key) {
                var data = this._data;
                if (isStr(key)) return data[key];
                var ret = {};
                each(key, function(val) {
                    ret[val] = data[val];
                });
                return ret;
            },
            remove: function(key) {
                key = toArr(key);
                var data = this._data;
                each(key, function(val) {
                    delete data[val];
                });
                this.save(data);
            },
            clear: function() {
                this._data = {};
                this.save(this._data);
            },
            each: function(fn) {
                each(this._data, fn);
            },
            // This methods exists to be overwritten.
            save: function(data) {
                this._data = data;
            }
        });

        return exports;
    })({});

    /* ------------------------------ wrap ------------------------------ */

    var wrap = _.wrap = (function (exports) {
        /* Wrap the function inside a wrapper function, passing it as the first argument.
         *
         * |Name   |Desc            |
         * |-------|----------------|
         * |fn     |Function to wrap|
         * |wrapper|Wrapper function|
         * |return |New function    |
         */

        /* example
         * const p = wrap(escape, function(fn, text) {
         *     return '<p>' + fn(text) + '</p>';
         * });
         * p('You & Me'); // -> '<p>You &amp; Me</p>'
         */

        /* typescript
         * export declare function wrap(
         *     fn: types.AnyFn,
         *     wrapper: types.AnyFn
         * ): types.AnyFn;
         */

        /* dependencies
         * partial types 
         */

        exports = function(fn, wrapper) {
            return partial(wrapper, fn);
        };

        return exports;
    })({});

    /* ------------------------------ PriorityQueue ------------------------------ */
    _.PriorityQueue = (function (exports) {
        /* Priority queue implementation.
         *
         * ### size
         *
         * Queue size.
         *
         * ### constructor
         *
         * |Name |Desc      |
         * |-----|----------|
         * |cmp  |Comparator|
         *
         * ### clear
         *
         * Clear the queue.
         *
         * ### enqueue
         *
         * Add an item to the queue.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |item  |Item to add |
         * |return|Current size|
         *
         * ### dequeue
         *
         * Retrieve and remove the highest priority item of the queue.
         *
         * ### peek
         *
         * Same as dequeue, but does not remove the item.
         */

        /* example
         * const queue = new PriorityQueue(function(a, b) {
         *     if (a.priority > b.priority) return 1;
         *     if (a.priority === b.priority) return -1;
         *     return 0;
         * });
         * queue.enqueue({
         *     priority: 1000,
         *     value: 'apple'
         * });
         * queue.enqueue({
         *     priority: 500,
         *     value: 'orange'
         * });
         * queue.dequeue(); // -> { priority: 1000, value: 'apple' }
         */

        /* typescript
         * export declare class PriorityQueue {
         *     size: number;
         *     constructor(cmp?: types.AnyFn);
         *     clear(): void;
         *     enqueue(item: any): number;
         *     dequeue(): any;
         *     peek(): any;
         * }
         */

        /* dependencies
         * Class Heap isSorted wrap types 
         */

        exports = Class({
            initialize: function PriorityQueue() {
                var cmp =
                    arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : isSorted.defComparator;
                this._heap = new Heap(
                    wrap(cmp, function(fn, a, b) {
                        return fn(a, b) * -1;
                    })
                );
                this.size = 0;
            },
            clear: function() {
                this._heap.clear();

                this.size = 0;
            },
            enqueue: function(item) {
                this._heap.add(item);

                this.size++;
                return this.size;
            },
            dequeue: function() {
                var item = this._heap.poll();

                if (item) {
                    this.size--;
                    return item;
                }
            },
            peek: function() {
                return this._heap.peek();
            }
        });

        return exports;
    })({});

    /* ------------------------------ ucs2 ------------------------------ */

    var ucs2 = _.ucs2 = (function (exports) {
        /* UCS-2 encoding and decoding.
         *
         * ### encode
         *
         * Create a string using an array of code point values.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |arr   |Array of code points|
         * |return|Encoded string      |
         *
         * ### decode
         *
         * Create an array of code point values using a string.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |str   |Input string        |
         * |return|Array of code points|
         */

        /* example
         * ucs2.encode([0x61, 0x62, 0x63]); // -> 'abc'
         * ucs2.decode('abc'); // -> [0x61, 0x62, 0x63]
         * '𝌆'.length; // -> 2
         * ucs2.decode('𝌆').length; // -> 1
         */

        /* typescript
         * export declare const ucs2: {
         *     encode(arr: number[]): string;
         *     decode(str: string): number[];
         * };
         */

        /* dependencies
         * chunk map 
         */ // https://mathiasbynens.be/notes/javascript-encoding

        exports = {
            encode: function(arr) {
                // https://stackoverflow.com/questions/22747068/is-there-a-max-number-of-arguments-javascript-functions-can-accept
                if (arr.length < 32768) {
                    return String.fromCodePoint.apply(String, arr);
                }

                return map(chunk(arr, 32767), function(nums) {
                    return String.fromCodePoint.apply(String, nums);
                }).join('');
            },
            decode: function(str) {
                var ret = [];
                var i = 0;
                var len = str.length;

                while (i < len) {
                    var c = str.charCodeAt(i++); // A high surrogate

                    if (c >= 0xd800 && c <= 0xdbff && i < len) {
                        var tail = str.charCodeAt(i++); // nextC >= 0xDC00 && nextC <= 0xDFFF

                        if ((tail & 0xfc00) === 0xdc00) {
                            // C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
                            ret.push(((c & 0x3ff) << 10) + (tail & 0x3ff) + 0x10000);
                        } else {
                            ret.push(c);
                            i--;
                        }
                    } else {
                        ret.push(c);
                    }
                }

                return ret;
            }
        };

        return exports;
    })({});

    /* ------------------------------ utf8 ------------------------------ */

    var utf8 = _.utf8 = (function (exports) {
        /* UTF-8 encoding and decoding.
         *
         * ### encode
         *
         * Turn any UTF-8 decoded string into UTF-8 encoded string.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to encode|
         * |return|Encoded string  |
         *
         * ### decode
         *
         * Turn any UTF-8 encoded string into UTF-8 decoded string.
         *
         * |Name      |Desc                  |
         * |----------|----------------------|
         * |str       |String to decode      |
         * |safe=false|Suppress error if true|
         * |return    |Decoded string        |
         */

        /* example
         * utf8.encode('\uD800\uDC00'); // ->  '\xF0\x90\x80\x80'
         * utf8.decode('\xF0\x90\x80\x80'); // -> '\uD800\uDC00'
         */

        /* typescript
         * export declare const utf8: {
         *     encode(str: string): string;
         *     decode(str: string, safe?: boolean): string;
         * };
         */

        /* dependencies
         * ucs2 
         */ // https://encoding.spec.whatwg.org/#utf-8

        exports = {
            encode: function(str) {
                var codePoints = ucs2.decode(str);
                var byteArr = '';

                for (var i = 0, len = codePoints.length; i < len; i++) {
                    byteArr += encodeCodePoint(codePoints[i]);
                }

                return byteArr;
            },
            decode: function(str, safe) {
                byteArr = ucs2.decode(str);
                byteIdx = 0;
                byteCount = byteArr.length;
                codePoint = 0;
                bytesSeen = 0;
                bytesNeeded = 0;
                lowerBoundary = 0x80;
                upperBoundary = 0xbf;
                var codePoints = [];
                var tmp;

                while ((tmp = decodeCodePoint(safe)) !== false) {
                    codePoints.push(tmp);
                }

                return ucs2.encode(codePoints);
            }
        };
        var fromCharCode = String.fromCharCode;

        function encodeCodePoint(codePoint) {
            // U+0000 to U+0080, ASCII code point
            if ((codePoint & 0xffffff80) === 0) {
                return fromCharCode(codePoint);
            }

            var ret = '',
                count,
                offset; // U+0080 to U+07FF, inclusive

            if ((codePoint & 0xfffff800) === 0) {
                count = 1;
                offset = 0xc0;
            } else if ((codePoint & 0xffff0000) === 0) {
                // U+0800 to U+FFFF, inclusive
                count = 2;
                offset = 0xe0;
            } else if ((codePoint & 0xffe00000) == 0) {
                // U+10000 to U+10FFFF, inclusive
                count = 3;
                offset = 0xf0;
            }

            ret += fromCharCode((codePoint >> (6 * count)) + offset);

            while (count > 0) {
                var tmp = codePoint >> (6 * (count - 1));
                ret += fromCharCode(0x80 | (tmp & 0x3f));
                count--;
            }

            return ret;
        }

        var byteArr,
            byteIdx,
            byteCount,
            codePoint,
            bytesSeen,
            bytesNeeded,
            lowerBoundary,
            upperBoundary;

        function decodeCodePoint(safe) {
            /* eslint-disable no-constant-condition */
            while (true) {
                if (byteIdx >= byteCount && bytesNeeded) {
                    if (safe) return goBack();
                    throw new Error('Invalid byte index');
                }

                if (byteIdx === byteCount) return false;
                var byte = byteArr[byteIdx];
                byteIdx++;

                if (!bytesNeeded) {
                    // 0x00 to 0x7F
                    if ((byte & 0x80) === 0) {
                        return byte;
                    } // 0xC2 to 0xDF

                    if ((byte & 0xe0) === 0xc0) {
                        bytesNeeded = 1;
                        codePoint = byte & 0x1f;
                    } else if ((byte & 0xf0) === 0xe0) {
                        // 0xE0 to 0xEF
                        if (byte === 0xe0) lowerBoundary = 0xa0;
                        if (byte === 0xed) upperBoundary = 0x9f;
                        bytesNeeded = 2;
                        codePoint = byte & 0xf;
                    } else if ((byte & 0xf8) === 0xf0) {
                        // 0xF0 to 0xF4
                        if (byte === 0xf0) lowerBoundary = 0x90;
                        if (byte === 0xf4) upperBoundary = 0x8f;
                        bytesNeeded = 3;
                        codePoint = byte & 0x7;
                    } else {
                        if (safe) return goBack();
                        throw new Error('Invalid UTF-8 detected');
                    }

                    continue;
                }

                if (byte < lowerBoundary || byte > upperBoundary) {
                    if (safe) {
                        byteIdx--;
                        return goBack();
                    }

                    throw new Error('Invalid continuation byte');
                }

                lowerBoundary = 0x80;
                upperBoundary = 0xbf;
                codePoint = (codePoint << 6) | (byte & 0x3f);
                bytesSeen++;
                if (bytesSeen !== bytesNeeded) continue;
                var tmp = codePoint;
                codePoint = 0;
                bytesNeeded = 0;
                bytesSeen = 0;
                return tmp;
            }
        }

        function goBack() {
            var start = byteIdx - bytesSeen - 1;
            byteIdx = start + 1;
            codePoint = 0;
            bytesNeeded = 0;
            bytesSeen = 0;
            lowerBoundary = 0x80;
            upperBoundary = 0xbf;
            return byteArr[start];
        }

        return exports;
    })({});

    /* ------------------------------ bytesToStr ------------------------------ */

    var bytesToStr = _.bytesToStr = (function (exports) {
        /* Convert bytes to string.
         *
         * |Name         |Desc              |
         * |-------------|------------------|
         * |bytes        |Bytes array       |
         * |encoding=utf8|Encoding of string|
         * |return       |Result string     |
         */

        /* example
         * bytesToStr([108, 105, 99, 105, 97]); // -> 'licia'
         */

        /* typescript
         * export declare function bytesToStr(bytes: number[], encoding?: string): string;
         */

        /* dependencies
         * utf8 hex base64 
         */

        exports = function(bytes) {
            var encoding =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : 'utf8';
            if (encoding === 'hex') return hex.encode(bytes);
            if (encoding === 'base64') return base64.encode(bytes);
            var str = [];

            for (var i = 0, len = bytes.length; i < len; i++) {
                str.push(String.fromCharCode(bytes[i]));
            }

            str = str.join('');

            if (encoding === 'utf8') {
                str = utf8.decode(str);
            }

            return str;
        };

        return exports;
    })({});

    /* ------------------------------ decodeUriComponent ------------------------------ */
    _.decodeUriComponent = (function (exports) {
        /* Better decodeURIComponent that does not throw if input is invalid.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to decode|
         * |return|Decoded string  |
         */

        /* example
         * decodeUriComponent('%%25%'); // -> '%%%'
         * decodeUriComponent('%E0%A4%A'); // -> '\xE0\xA4%A'
         */

        /* typescript
         * export declare function decodeUriComponent(str: string): string;
         */

        /* dependencies
         * each ucs2 map utf8 
         */

        exports = function(str) {
            try {
                return decodeURIComponent(str);
            } catch (e) {
                var matches = str.match(regMatcher);

                if (!matches) {
                    return str;
                }

                each(matches, function(match) {
                    str = str.replace(match, decode(match));
                });
                return str;
            }
        };

        function decode(str) {
            str = str.split('%').slice(1);
            var bytes = map(str, hexToInt);
            str = ucs2.encode(bytes);
            str = utf8.decode(str, true);
            return str;
        }

        function hexToInt(numStr) {
            return +('0x' + numStr);
        }

        var regMatcher = /(%[a-f0-9]{2})+/gi;

        return exports;
    })({});

    /* ------------------------------ strToBytes ------------------------------ */

    var strToBytes = _.strToBytes = (function (exports) {
        /* Convert string into bytes.
         *
         * |Name         |Desc              |
         * |-------------|------------------|
         * |str          |String to convert |
         * |encoding=utf8|Encoding of string|
         * |return       |Bytes array       |
         *
         * Supported encoding: utf8, hex, base64
         */

        /* example
         * strToBytes('licia'); // -> [108, 105, 99, 105, 97]
         * strToBytes('qK6b/w==', 'base64'); // -> [168, 174, 155, 255]
         */

        /* typescript
         * export declare function strToBytes(str: string, encoding?: string): number[];
         */

        /* dependencies
         * utf8 hex base64 
         */

        exports = function(str) {
            var encoding =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : 'utf8';
            if (encoding === 'hex') return hex.decode(str);
            if (encoding === 'base64') return base64.decode(str);
            var bytes = [];

            if (encoding === 'utf8') {
                str = utf8.encode(str);
            }

            for (var i = 0, len = str.length; i < len; i++) {
                bytes.push(str.charCodeAt(i) & 0xff);
            }

            return bytes;
        };

        return exports;
    })({});

    /* ------------------------------ crc1 ------------------------------ */
    _.crc1 = (function (exports) {
        /* CRC1 implementation.
         *
         * |Name    |Desc                |
         * |--------|--------------------|
         * |input   |Data to calculate   |
         * |previous|Previous CRC1 result|
         * |return  |CRC1 result         |
         */

        /* example
         * crc1('1234567890').toString(16); // -> 'd'
         */

        /* typescript
         * export declare function crc1(
         *     input: string | number[],
         *     previous?: number
         * ): number;
         */

        /* dependencies
         * isStr strToBytes 
         */ // https://github.com/alexgorbatchev/node-crc

        exports = function(input, previous) {
            return exports.signed(input, previous) >>> 0;
        };

        exports.signed = function(input, previous) {
            if (isStr(input)) input = strToBytes(input);
            var crc = ~~previous;
            var accum = 0;

            for (var i = 0, len = input.length; i < len; i++) {
                var byte = input[i];
                accum += byte;
            }

            crc += accum % 256;
            return crc % 256;
        };

        return exports;
    })({});

    /* ------------------------------ crc16 ------------------------------ */
    _.crc16 = (function (exports) {
        /* CRC16 implementation.
         *
         * |Name    |Desc                 |
         * |--------|---------------------|
         * |input   |Data to calculate    |
         * |previous|Previous CRC16 result|
         * |return  |CRC16 result         |
         */

        /* example
         * crc16('1234567890').toString(16); // -> 'c57a'
         */

        /* typescript
         * export declare function crc16(
         *     input: string | number[],
         *     previous?: number
         * ): number;
         */

        /* dependencies
         * isStr strToBytes 
         */ // prettier-ignore

        var TABLE = [
            0x0000,
            0xc0c1,
            0xc181,
            0x0140,
            0xc301,
            0x03c0,
            0x0280,
            0xc241,
            0xc601,
            0x06c0,
            0x0780,
            0xc741,
            0x0500,
            0xc5c1,
            0xc481,
            0x0440,
            0xcc01,
            0x0cc0,
            0x0d80,
            0xcd41,
            0x0f00,
            0xcfc1,
            0xce81,
            0x0e40,
            0x0a00,
            0xcac1,
            0xcb81,
            0x0b40,
            0xc901,
            0x09c0,
            0x0880,
            0xc841,
            0xd801,
            0x18c0,
            0x1980,
            0xd941,
            0x1b00,
            0xdbc1,
            0xda81,
            0x1a40,
            0x1e00,
            0xdec1,
            0xdf81,
            0x1f40,
            0xdd01,
            0x1dc0,
            0x1c80,
            0xdc41,
            0x1400,
            0xd4c1,
            0xd581,
            0x1540,
            0xd701,
            0x17c0,
            0x1680,
            0xd641,
            0xd201,
            0x12c0,
            0x1380,
            0xd341,
            0x1100,
            0xd1c1,
            0xd081,
            0x1040,
            0xf001,
            0x30c0,
            0x3180,
            0xf141,
            0x3300,
            0xf3c1,
            0xf281,
            0x3240,
            0x3600,
            0xf6c1,
            0xf781,
            0x3740,
            0xf501,
            0x35c0,
            0x3480,
            0xf441,
            0x3c00,
            0xfcc1,
            0xfd81,
            0x3d40,
            0xff01,
            0x3fc0,
            0x3e80,
            0xfe41,
            0xfa01,
            0x3ac0,
            0x3b80,
            0xfb41,
            0x3900,
            0xf9c1,
            0xf881,
            0x3840,
            0x2800,
            0xe8c1,
            0xe981,
            0x2940,
            0xeb01,
            0x2bc0,
            0x2a80,
            0xea41,
            0xee01,
            0x2ec0,
            0x2f80,
            0xef41,
            0x2d00,
            0xedc1,
            0xec81,
            0x2c40,
            0xe401,
            0x24c0,
            0x2580,
            0xe541,
            0x2700,
            0xe7c1,
            0xe681,
            0x2640,
            0x2200,
            0xe2c1,
            0xe381,
            0x2340,
            0xe101,
            0x21c0,
            0x2080,
            0xe041,
            0xa001,
            0x60c0,
            0x6180,
            0xa141,
            0x6300,
            0xa3c1,
            0xa281,
            0x6240,
            0x6600,
            0xa6c1,
            0xa781,
            0x6740,
            0xa501,
            0x65c0,
            0x6480,
            0xa441,
            0x6c00,
            0xacc1,
            0xad81,
            0x6d40,
            0xaf01,
            0x6fc0,
            0x6e80,
            0xae41,
            0xaa01,
            0x6ac0,
            0x6b80,
            0xab41,
            0x6900,
            0xa9c1,
            0xa881,
            0x6840,
            0x7800,
            0xb8c1,
            0xb981,
            0x7940,
            0xbb01,
            0x7bc0,
            0x7a80,
            0xba41,
            0xbe01,
            0x7ec0,
            0x7f80,
            0xbf41,
            0x7d00,
            0xbdc1,
            0xbc81,
            0x7c40,
            0xb401,
            0x74c0,
            0x7580,
            0xb541,
            0x7700,
            0xb7c1,
            0xb681,
            0x7640,
            0x7200,
            0xb2c1,
            0xb381,
            0x7340,
            0xb101,
            0x71c0,
            0x7080,
            0xb041,
            0x5000,
            0x90c1,
            0x9181,
            0x5140,
            0x9301,
            0x53c0,
            0x5280,
            0x9241,
            0x9601,
            0x56c0,
            0x5780,
            0x9741,
            0x5500,
            0x95c1,
            0x9481,
            0x5440,
            0x9c01,
            0x5cc0,
            0x5d80,
            0x9d41,
            0x5f00,
            0x9fc1,
            0x9e81,
            0x5e40,
            0x5a00,
            0x9ac1,
            0x9b81,
            0x5b40,
            0x9901,
            0x59c0,
            0x5880,
            0x9841,
            0x8801,
            0x48c0,
            0x4980,
            0x8941,
            0x4b00,
            0x8bc1,
            0x8a81,
            0x4a40,
            0x4e00,
            0x8ec1,
            0x8f81,
            0x4f40,
            0x8d01,
            0x4dc0,
            0x4c80,
            0x8c41,
            0x4400,
            0x84c1,
            0x8581,
            0x4540,
            0x8701,
            0x47c0,
            0x4680,
            0x8641,
            0x8201,
            0x42c0,
            0x4380,
            0x8341,
            0x4100,
            0x81c1,
            0x8081,
            0x4040
        ];
        if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

        exports = function(input, previous) {
            return exports.signed(input, previous) >>> 0;
        };

        exports.signed = function(input, previous) {
            if (isStr(input)) input = strToBytes(input);
            var crc = ~~previous;

            for (var i = 0, len = input.length; i < len; i++) {
                var byte = input[i];
                crc = (TABLE[(crc ^ byte) & 0xff] ^ (crc >> 8)) & 0xffff;
            }

            return crc;
        };

        return exports;
    })({});

    /* ------------------------------ crc32 ------------------------------ */
    _.crc32 = (function (exports) {
        /* CRC32 implementation.
         *
         * |Name    |Desc                 |
         * |--------|---------------------|
         * |input   |Data to calculate    |
         * |previous|Previous CRC32 result|
         * |return  |CRC16 result         |
         */

        /* example
         * crc32('1234567890').toString(16); // -> '261daee5'
         */

        /* typescript
         * export declare function crc32(
         *     input: string | number[],
         *     previous?: number
         * ): number;
         */

        /* dependencies
         * isStr strToBytes 
         */

        var TABLE = [];

        for (var n = 0; n < 256; n++) {
            var c = n;

            for (var k = 0; k < 8; k++) {
                if (c & 1) {
                    c = 0xedb88320 ^ (c >>> 1);
                } else {
                    c = c >>> 1;
                }
            }

            TABLE[n] = c >>> 0;
        }

        if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

        exports = function(input, previous) {
            return exports.signed(input, previous) >>> 0;
        };

        exports.signed = function(input, previous) {
            if (isStr(input)) input = strToBytes(input);
            var crc = previous === 0 ? 0 : ~~previous ^ -1;

            for (var i = 0, len = input.length; i < len; i++) {
                var byte = input[i];
                crc = TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
            }

            return crc ^ -1;
        };

        return exports;
    })({});

    /* ------------------------------ crc8 ------------------------------ */
    _.crc8 = (function (exports) {
        /* CRC8 implementation.
         *
         * |Name    |Desc                |
         * |--------|--------------------|
         * |input   |Data to calculate   |
         * |previous|Previous CRC8 result|
         * |return  |CRC8 result         |
         */

        /* example
         * crc8('1234567890').toString(16); // -> '52'
         */

        /* typescript
         * export declare function crc8(
         *     input: string | number[],
         *     previous?: number
         * ): number;
         */

        /* dependencies
         * isStr strToBytes 
         */ // prettier-ignore

        var TABLE = [
            0x00,
            0x07,
            0x0e,
            0x09,
            0x1c,
            0x1b,
            0x12,
            0x15,
            0x38,
            0x3f,
            0x36,
            0x31,
            0x24,
            0x23,
            0x2a,
            0x2d,
            0x70,
            0x77,
            0x7e,
            0x79,
            0x6c,
            0x6b,
            0x62,
            0x65,
            0x48,
            0x4f,
            0x46,
            0x41,
            0x54,
            0x53,
            0x5a,
            0x5d,
            0xe0,
            0xe7,
            0xee,
            0xe9,
            0xfc,
            0xfb,
            0xf2,
            0xf5,
            0xd8,
            0xdf,
            0xd6,
            0xd1,
            0xc4,
            0xc3,
            0xca,
            0xcd,
            0x90,
            0x97,
            0x9e,
            0x99,
            0x8c,
            0x8b,
            0x82,
            0x85,
            0xa8,
            0xaf,
            0xa6,
            0xa1,
            0xb4,
            0xb3,
            0xba,
            0xbd,
            0xc7,
            0xc0,
            0xc9,
            0xce,
            0xdb,
            0xdc,
            0xd5,
            0xd2,
            0xff,
            0xf8,
            0xf1,
            0xf6,
            0xe3,
            0xe4,
            0xed,
            0xea,
            0xb7,
            0xb0,
            0xb9,
            0xbe,
            0xab,
            0xac,
            0xa5,
            0xa2,
            0x8f,
            0x88,
            0x81,
            0x86,
            0x93,
            0x94,
            0x9d,
            0x9a,
            0x27,
            0x20,
            0x29,
            0x2e,
            0x3b,
            0x3c,
            0x35,
            0x32,
            0x1f,
            0x18,
            0x11,
            0x16,
            0x03,
            0x04,
            0x0d,
            0x0a,
            0x57,
            0x50,
            0x59,
            0x5e,
            0x4b,
            0x4c,
            0x45,
            0x42,
            0x6f,
            0x68,
            0x61,
            0x66,
            0x73,
            0x74,
            0x7d,
            0x7a,
            0x89,
            0x8e,
            0x87,
            0x80,
            0x95,
            0x92,
            0x9b,
            0x9c,
            0xb1,
            0xb6,
            0xbf,
            0xb8,
            0xad,
            0xaa,
            0xa3,
            0xa4,
            0xf9,
            0xfe,
            0xf7,
            0xf0,
            0xe5,
            0xe2,
            0xeb,
            0xec,
            0xc1,
            0xc6,
            0xcf,
            0xc8,
            0xdd,
            0xda,
            0xd3,
            0xd4,
            0x69,
            0x6e,
            0x67,
            0x60,
            0x75,
            0x72,
            0x7b,
            0x7c,
            0x51,
            0x56,
            0x5f,
            0x58,
            0x4d,
            0x4a,
            0x43,
            0x44,
            0x19,
            0x1e,
            0x17,
            0x10,
            0x05,
            0x02,
            0x0b,
            0x0c,
            0x21,
            0x26,
            0x2f,
            0x28,
            0x3d,
            0x3a,
            0x33,
            0x34,
            0x4e,
            0x49,
            0x40,
            0x47,
            0x52,
            0x55,
            0x5c,
            0x5b,
            0x76,
            0x71,
            0x78,
            0x7f,
            0x6a,
            0x6d,
            0x64,
            0x63,
            0x3e,
            0x39,
            0x30,
            0x37,
            0x22,
            0x25,
            0x2c,
            0x2b,
            0x06,
            0x01,
            0x08,
            0x0f,
            0x1a,
            0x1d,
            0x14,
            0x13,
            0xae,
            0xa9,
            0xa0,
            0xa7,
            0xb2,
            0xb5,
            0xbc,
            0xbb,
            0x96,
            0x91,
            0x98,
            0x9f,
            0x8a,
            0x8d,
            0x84,
            0x83,
            0xde,
            0xd9,
            0xd0,
            0xd7,
            0xc2,
            0xc5,
            0xcc,
            0xcb,
            0xe6,
            0xe1,
            0xe8,
            0xef,
            0xfa,
            0xfd,
            0xf4,
            0xf3
        ];
        if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

        exports = function(input, previous) {
            return exports.signed(input, previous) >>> 0;
        };

        exports.signed = function(input, previous) {
            if (isStr(input)) input = strToBytes(input);
            var crc = ~~previous;

            for (var i = 0, len = input.length; i < len; i++) {
                var byte = input[i];
                crc = TABLE[(crc ^ byte) & 0xff] & 0xff;
            }

            return crc;
        };

        return exports;
    })({});

    /* ------------------------------ md5 ------------------------------ */
    _.md5 = (function (exports) {
        /* MD5 implementation.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |msg   |Message to encrypt|
         * |return|MD5 hash          |
         */

        /* example
         * md5('licia'); // -> 'e59f337d85e9a467f1783fab282a41d0'
         */

        /* typescript
         * export declare function md5(msg: string | number[]): string;
         */

        /* dependencies
         * isStr strToBytes hex bytesToWords wordsToBytes 
         */ // https://github.com/pvorb/node-md5

        exports = function(msg) {
            if (isStr(msg)) msg = strToBytes(msg);
            var m = bytesToWords(msg);
            var l = msg.length * 8;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878; // Swap endian

            for (var i = 0; i < m.length; i++) {
                m[i] =
                    (((m[i] << 8) | (m[i] >>> 24)) & 0x00ff00ff) |
                    (((m[i] << 24) | (m[i] >>> 8)) & 0xff00ff00);
            } // Padding

            m[l >>> 5] |= 0x80 << l % 32;
            m[(((l + 64) >>> 9) << 4) + 14] = l;

            for (var _i = 0; _i < m.length; _i += 16) {
                var aa = a;
                var bb = b;
                var cc = c;
                var dd = d;
                a = FF(a, b, c, d, m[_i + 0], 7, -680876936);
                d = FF(d, a, b, c, m[_i + 1], 12, -389564586);
                c = FF(c, d, a, b, m[_i + 2], 17, 606105819);
                b = FF(b, c, d, a, m[_i + 3], 22, -1044525330);
                a = FF(a, b, c, d, m[_i + 4], 7, -176418897);
                d = FF(d, a, b, c, m[_i + 5], 12, 1200080426);
                c = FF(c, d, a, b, m[_i + 6], 17, -1473231341);
                b = FF(b, c, d, a, m[_i + 7], 22, -45705983);
                a = FF(a, b, c, d, m[_i + 8], 7, 1770035416);
                d = FF(d, a, b, c, m[_i + 9], 12, -1958414417);
                c = FF(c, d, a, b, m[_i + 10], 17, -42063);
                b = FF(b, c, d, a, m[_i + 11], 22, -1990404162);
                a = FF(a, b, c, d, m[_i + 12], 7, 1804603682);
                d = FF(d, a, b, c, m[_i + 13], 12, -40341101);
                c = FF(c, d, a, b, m[_i + 14], 17, -1502002290);
                b = FF(b, c, d, a, m[_i + 15], 22, 1236535329);
                a = GG(a, b, c, d, m[_i + 1], 5, -165796510);
                d = GG(d, a, b, c, m[_i + 6], 9, -1069501632);
                c = GG(c, d, a, b, m[_i + 11], 14, 643717713);
                b = GG(b, c, d, a, m[_i + 0], 20, -373897302);
                a = GG(a, b, c, d, m[_i + 5], 5, -701558691);
                d = GG(d, a, b, c, m[_i + 10], 9, 38016083);
                c = GG(c, d, a, b, m[_i + 15], 14, -660478335);
                b = GG(b, c, d, a, m[_i + 4], 20, -405537848);
                a = GG(a, b, c, d, m[_i + 9], 5, 568446438);
                d = GG(d, a, b, c, m[_i + 14], 9, -1019803690);
                c = GG(c, d, a, b, m[_i + 3], 14, -187363961);
                b = GG(b, c, d, a, m[_i + 8], 20, 1163531501);
                a = GG(a, b, c, d, m[_i + 13], 5, -1444681467);
                d = GG(d, a, b, c, m[_i + 2], 9, -51403784);
                c = GG(c, d, a, b, m[_i + 7], 14, 1735328473);
                b = GG(b, c, d, a, m[_i + 12], 20, -1926607734);
                a = HH(a, b, c, d, m[_i + 5], 4, -378558);
                d = HH(d, a, b, c, m[_i + 8], 11, -2022574463);
                c = HH(c, d, a, b, m[_i + 11], 16, 1839030562);
                b = HH(b, c, d, a, m[_i + 14], 23, -35309556);
                a = HH(a, b, c, d, m[_i + 1], 4, -1530992060);
                d = HH(d, a, b, c, m[_i + 4], 11, 1272893353);
                c = HH(c, d, a, b, m[_i + 7], 16, -155497632);
                b = HH(b, c, d, a, m[_i + 10], 23, -1094730640);
                a = HH(a, b, c, d, m[_i + 13], 4, 681279174);
                d = HH(d, a, b, c, m[_i + 0], 11, -358537222);
                c = HH(c, d, a, b, m[_i + 3], 16, -722521979);
                b = HH(b, c, d, a, m[_i + 6], 23, 76029189);
                a = HH(a, b, c, d, m[_i + 9], 4, -640364487);
                d = HH(d, a, b, c, m[_i + 12], 11, -421815835);
                c = HH(c, d, a, b, m[_i + 15], 16, 530742520);
                b = HH(b, c, d, a, m[_i + 2], 23, -995338651);
                a = II(a, b, c, d, m[_i + 0], 6, -198630844);
                d = II(d, a, b, c, m[_i + 7], 10, 1126891415);
                c = II(c, d, a, b, m[_i + 14], 15, -1416354905);
                b = II(b, c, d, a, m[_i + 5], 21, -57434055);
                a = II(a, b, c, d, m[_i + 12], 6, 1700485571);
                d = II(d, a, b, c, m[_i + 3], 10, -1894986606);
                c = II(c, d, a, b, m[_i + 10], 15, -1051523);
                b = II(b, c, d, a, m[_i + 1], 21, -2054922799);
                a = II(a, b, c, d, m[_i + 8], 6, 1873313359);
                d = II(d, a, b, c, m[_i + 15], 10, -30611744);
                c = II(c, d, a, b, m[_i + 6], 15, -1560198380);
                b = II(b, c, d, a, m[_i + 13], 21, 1309151649);
                a = II(a, b, c, d, m[_i + 4], 6, -145523070);
                d = II(d, a, b, c, m[_i + 11], 10, -1120210379);
                c = II(c, d, a, b, m[_i + 2], 15, 718787259);
                b = II(b, c, d, a, m[_i + 9], 21, -343485551);
                a = (a + aa) >>> 0;
                b = (b + bb) >>> 0;
                c = (c + cc) >>> 0;
                d = (d + dd) >>> 0;
            }

            return hex.encode(wordsToBytes(endian([a, b, c, d])));
        };

        function FF(a, b, c, d, x, s, t) {
            var n = a + ((b & c) | (~b & d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function GG(a, b, c, d, x, s, t) {
            var n = a + ((b & d) | (c & ~d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function HH(a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function II(a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function endian(n) {
            if (n.constructor == Number) {
                return (rotl(n, 8) & 0x00ff00ff) | (rotl(n, 24) & 0xff00ff00);
            }

            for (var i = 0; i < n.length; i++) {
                n[i] = endian(n[i]);
            }

            return n;
        }

        function rotl(n, b) {
            return (n << b) | (n >>> (32 - b));
        }

        return exports;
    })({});

    /* ------------------------------ mapObj ------------------------------ */

    var mapObj = _.mapObj = (function (exports) {
        /* Map for objects.
         *
         * |Name    |Desc                          |
         * |--------|------------------------------|
         * |object  |Object to iterate over        |
         * |iterator|Function invoked per iteration|
         * |context |Function context              |
         * |return  |New mapped object             |
         */

        /* example
         * mapObj({ a: 1, b: 2 }, function(val, key) {
         *     return val + 1;
         * }); // -> {a: 2, b: 3}
         */

        /* typescript
         * export declare function mapObj<T, TResult>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, TResult>,
         *     context?: any
         * ): types.Dictionary<TResult>;
         */

        /* dependencies
         * safeCb keys types 
         */

        exports = function(obj, iterator, ctx) {
            iterator = safeCb(iterator, ctx);

            var _keys = keys(obj);

            var len = _keys.length;
            var ret = {};

            for (var i = 0; i < len; i++) {
                var curKey = _keys[i];
                ret[curKey] = iterator(obj[curKey], curKey, obj);
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ cloneDeep ------------------------------ */

    var cloneDeep = _.cloneDeep = (function (exports) {
        /* Recursively clone value.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |val   |Value to clone   |
         * |return|Deep cloned Value|
         */

        /* example
         * const obj = [{ a: 1 }, { a: 2 }];
         * const obj2 = cloneDeep(obj);
         * console.log(obj[0] === obj2[1]); // -> false
         */

        /* typescript
         * export declare function cloneDeep<T>(val: T): T;
         */

        /* dependencies
         * isObj isFn isArr mapObj 
         */

        exports = function(obj) {
            if (isArr(obj)) {
                return obj.map(function(val) {
                    return exports(val);
                });
            }

            if (isObj(obj) && !isFn(obj)) {
                return mapObj(obj, function(val) {
                    return exports(val);
                });
            }

            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ extendDeep ------------------------------ */
    _.extendDeep = (function (exports) {
        /* Recursive object extending.
         *
         * |Name       |Desc              |
         * |-----------|------------------|
         * |destination|Destination object|
         * |...sources |Sources objects   |
         * |return     |Destination object|
         */

        /* example
         * extendDeep(
         *     {
         *         name: 'RedHood',
         *         family: {
         *             mother: 'Jane',
         *             father: 'Jack'
         *         }
         *     },
         *     {
         *         family: {
         *             brother: 'Bruce'
         *         }
         *     }
         * );
         * // -> {name: 'RedHood', family: {mother: 'Jane', father: 'Jack', brother: 'Bruce'}}
         */

        /* typescript
         * export declare function extendDeep(destination: any, ...sources: any[]): any;
         */

        /* dependencies
         * isPlainObj each cloneDeep 
         */

        exports = function(obj) {
            var i = 0;
            var ret = obj;
            var len = arguments.length;

            while (++i < len) {
                obj = arguments[i];

                if (isPlainObj(ret) && isPlainObj(obj)) {
                    each(obj, function(val, key) {
                        if (
                            key === '__proto__' ||
                            key === 'constructor' ||
                            key === 'prototype'
                        ) {
                            return;
                        }

                        ret[key] = exports(ret[key], obj[key]);
                    });
                } else {
                    ret = cloneDeep(obj);
                }
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ html ------------------------------ */
    _.html = (function (exports) {
        /* Html parser and serializer.
         *
         * ### parse
         *
         * Parse html string into js object.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |html  |Html string     |
         * |return|Parsed js object|
         *
         * ### stringify
         *
         * Stringify object into an html string.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |tree  |Object to stringify|
         * |return|Html string        |
         */

        /* example
         * const tree = html.parse('<div id="name">licia</div>');
         * // -> [{tag: 'div', attrs: {id: 'name'}, content: ['licia']}]
         * html.stringify(tree);
         */

        /* typescript
         * export declare const html: {
         *     parse(html: string): any[];
         *     stringify(tree: any[]): string;
         * };
         */

        /* dependencies
         * parseHtml Stack isArr each isStr mapObj 
         */

        function parse(html) {
            var ret = [];
            var stack = new Stack();
            parseHtml(html, {
                start: function(tag, attrs) {
                    attrs = mapObj(attrs, function(val) {
                        return unescapeQuote(val);
                    });
                    stack.push({
                        tag: tag,
                        attrs: attrs
                    });
                },
                end: function() {
                    var node = stack.pop();

                    if (!stack.size) {
                        ret.push(node);
                        return;
                    }

                    var lastNode = stack.peek();

                    if (!isArr(lastNode.content)) {
                        lastNode.content = [];
                    }

                    lastNode.content.push(node);
                },
                comment: function(text) {
                    var comment = '<!--'.concat(text, '-->');
                    var lastNode = stack.peek();

                    if (!lastNode) {
                        ret.push(comment);
                        return;
                    }

                    if (!lastNode.content) lastNode.content = [];
                    lastNode.content.push(comment);
                },
                text: function(text) {
                    var lastNode = stack.peek();

                    if (!lastNode) {
                        ret.push(text);
                        return;
                    }

                    if (!lastNode.content) lastNode.content = [];
                    lastNode.content.push(text);
                }
            });
            return ret;
        }

        function stringify(tree) {
            var ret = '';

            if (isArr(tree)) {
                each(tree, function(node) {
                    return (ret += stringify(node));
                });
            } else if (isStr(tree)) {
                ret = tree;
            } else {
                ret += '<'.concat(tree.tag);
                each(tree.attrs, function(val, key) {
                    return (ret += ' '.concat(key, '="').concat(escapeQuote(val), '"'));
                });
                ret += '>';
                if (tree.content) ret += stringify(tree.content);
                ret += '</'.concat(tree.tag, '>');
            }

            return ret;
        }

        var unescapeQuote = function(str) {
            return str.replace(/&quot;/g, '"');
        };

        var escapeQuote = function(str) {
            return str.replace(/"/g, '&quot;');
        };

        exports = {
            parse: parse,
            stringify: stringify
        };

        return exports;
    })({});

    /* ------------------------------ remove ------------------------------ */

    var remove = _.remove = (function (exports) {
        /* Remove all elements from array that predicate returns truthy for and return an array of the removed elements.
         *
         * Unlike filter, this method mutates array.
         *
         * |Name    |Desc                                |
         * |--------|------------------------------------|
         * |list    |Collection to iterate over          |
         * |iterator|Function invoked per iteration      |
         * |context |Predicate context                   |
         * |return  |Array of all values that are removed|
         */

        /* example
         * const arr = [1, 2, 3, 4, 5];
         * const evens = remove(arr, function(val) {
         *     return val % 2 === 0;
         * });
         * console.log(arr); // -> [1, 3, 5]
         * console.log(evens); // -> [2, 4]
         */

        /* typescript
         * export declare function remove<T, TResult>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, boolean>,
         *     context?: any
         * ): TResult[];
         */

        /* dependencies
         * safeCb types 
         */

        exports = function(arr, iterator, ctx) {
            var ret = [];
            iterator = safeCb(iterator, ctx);
            var i = -1;
            var len = arr.length;

            while (++i < len) {
                var val = arr[i];

                if (iterator(val, i, arr)) {
                    ret.push(val);
                    arr.splice(i, 1);
                }
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ ReduceStore ------------------------------ */
    _.ReduceStore = (function (exports) {
        /* Simplified redux like state container.
         *
         * ### constructor
         *
         * |Name        |Desc                       |
         * |------------|---------------------------|
         * |reducer     |Function returns next state|
         * |initialState|Initial state              |
         *
         * ### subscribe
         *
         * Add a change listener.
         *
         * |Name    |Desc                                |
         * |--------|------------------------------------|
         * |listener|Callback to invoke on every dispatch|
         * |return  |Function to unsubscribe             |
         *
         * ### dispatch
         *
         * Dispatch an action.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |action|Object representing changes|
         * |return|Same action object         |
         *
         * ### getState
         *
         * Get the current state.
         */

        /* example
         * const store = new ReduceStore(function(state, action) {
         *     switch (action.type) {
         *         case 'INCREMENT':
         *             return state + 1;
         *         case 'DECREMENT':
         *             return state - 1;
         *         default:
         *             return state;
         *     }
         * }, 0);
         *
         * store.subscribe(function() {
         *     console.log(store.getState());
         * });
         *
         * store.dispatch({ type: 'INCREMENT' }); // 1
         * store.dispatch({ type: 'INCREMENT' }); // 2
         * store.dispatch({ type: 'DECREMENT' }); // 1
         */

        /* typescript
         * export declare class ReduceStore {
         *     constructor(reducer: types.AnyFn, initialState: any);
         *     subscribe(listener: types.AnyFn): types.AnyFn;
         *     dispatch(action: any): any;
         *     getState(): any;
         * }
         */

        /* dependencies
         * Class clone remove types 
         */

        exports = Class({
            initialize: function ReduceStore(reducer, initialState) {
                this._reducer = reducer;
                this._state = initialState;
                this._curListeners = [];
                this._nextListeners = this._curListeners;
            },
            subscribe: function(listener) {
                var isSubscribed = true;

                this._ensureCanMutateNextListeners();

                this._nextListeners.push(listener);

                var self = this;
                return function() {
                    if (!isSubscribed) return;
                    isSubscribed = false;

                    self._ensureCanMutateNextListeners();

                    remove(self._nextListeners, function(val) {
                        return val === listener;
                    });
                };
            },
            dispatch: function(action) {
                this._state = this._reducer(this._state, action);
                var listeners = (this._curListeners = this._nextListeners);

                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i]();
                }

                return action;
            },
            getState: function() {
                return this._state;
            },
            _ensureCanMutateNextListeners: function() {
                if (this._nextListeners === this._curListeners) {
                    this._nextListeners = clone(this._curListeners);
                }
            }
        });

        return exports;
    })({});

    /* ------------------------------ some ------------------------------ */

    var some = _.some = (function (exports) {
        /* Check if predicate return truthy for any element.
         *
         * |Name     |Desc                                          |
         * |---------|----------------------------------------------|
         * |obj      |Collection to iterate over                    |
         * |predicate|Function to invoked per iteration             |
         * |ctx      |Predicate context                             |
         * |return   |True if any element passes the predicate check|
         */

        /* example
         * some([2, 5], function(val) {
         *     return val % 2 === 0;
         * }); // -> true
         */

        /* typescript
         * export declare function some<T>(
         *     list: types.List<T>,
         *     iterator?: types.ListIterator<T, boolean>,
         *     context?: any
         * ): boolean;
         * export declare function some<T>(
         *     object: types.Dictionary<T>,
         *     iterator?: types.ObjectIterator<T, boolean>,
         *     context?: any
         * ): boolean;
         */

        /* dependencies
         * safeCb isArrLike keys types 
         */

        exports = function(obj, predicate, ctx) {
            predicate = safeCb(predicate, ctx);

            var _keys = !isArrLike(obj) && keys(obj);

            var len = (_keys || obj).length;

            for (var i = 0; i < len; i++) {
                var key = _keys ? _keys[i] : i;
                if (predicate(obj[key], key, obj)) return true;
            }

            return false;
        };

        return exports;
    })({});

    /* ------------------------------ BloomFilter ------------------------------ */
    _.BloomFilter = (function (exports) {
        /* Bloom filter implementation.
         *
         * ### constructor
         *
         * |Name     |Desc                    |
         * |---------|------------------------|
         * |size=1024|Number of buckets       |
         * |k=3      |Number of Hash functions|
         *
         * ### add
         *
         * Add an element to the filter.
         *
         * |Name|Desc        |
         * |----|------------|
         * |val |Value to add|
         *
         * ### test
         *
         * Test if an element is in the filter.
         *
         * |Name  |Desc                                     |
         * |------|-----------------------------------------|
         * |val   |Value to test                            |
         * |return|True if probably, false if definitely not|
         */

        /* example
         * const bloom = new BloomFilter(256, 3);
         * bloom.add('Bruce Wayne');
         * bloom.add('Clark Kent');
         * bloom.test('Clark Kent'); // -> true
         * bloom.test('Bruce Wayne'); // -> true
         * bloom.test('Tony Stark'); // -> false
         */

        /* typescript
         * export declare class BloomFilter {
         *     constructor(size?: number, k?: number);
         *     add(val: string): void;
         *     test(val: string): boolean;
         * }
         */
        // https://github.com/jasondavies/bloomfilter.js

        /* dependencies
         * Class fill fnv1a strHash each some 
         */

        exports = Class({
            initialize: function() {
                var size =
                    arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : 1024;
                var k =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : 3;
                this._buckets = fill(new Array(size), 0);
                this._k = k;
                this._size = size;
            },
            add: function(val) {
                var _this = this;

                each(this._locations(val), function(location) {
                    return (_this._buckets[location] = 1);
                });
            },
            test: function(val) {
                var _this2 = this;

                return !some(this._locations(val), function(location) {
                    return _this2._buckets[location] === 0;
                });
            },
            _locations: function(val) {
                var ret = [];
                var size = this._size;
                var a = fnv1a(val);
                var b = strHash(val); // http://willwhim.wpengine.com/2011/09/03/producing-n-hash-functions-by-hashing-only-once/

                for (var i = 0; i < this._k; i++) {
                    ret[i] = (a + b * i) % size;
                }

                console.log(ret);
                return ret;
            }
        });

        return exports;
    })({});

    /* ------------------------------ Readiness ------------------------------ */
    _.Readiness = (function (exports) {
        /* Readiness manager.
         *
         * ### signal
         *
         * Signal task is ready.
         *
         * |Name |Desc       |
         * |-----|-----------|
         * |tasks|Ready tasks|
         *
         * ### ready
         *
         * Register ready callback.
         *
         * |Name  |Desc                                    |
         * |------|----------------------------------------|
         * |tasks |Tasks to listen                         |
         * |fn    |Callback to trigger if tasks are ready  |
         * |return|Promise that will be resolved when ready|
         *
         * ### isReady
         *
         * Check if tasks are ready.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |tasks |Tasks to check             |
         * |return|True if all tasks are ready|
         */

        /* example
         * const readiness = new Readiness();
         * readiness.ready('serverCreated', function() {
         *     // Do something.
         * });
         * readiness.signal('serverCreated');
         * readiness.isReady('serverCreated'); // -> true
         */

        /* typescript
         * export declare class Readiness {
         *     signal(tasks: string | string[]): void;
         *     isReady(tasks: string | string[]): boolean;
         *     ready(tasks: string | string[], fn?: types.AnyFn): Promise<void>;
         * }
         */

        /* dependencies
         * Class types toArr each map noop some 
         */

        exports = Class({
            initialize: function Readiness() {
                this._promises = {};
                this._resolves = {};
                this._states = {};
            },
            signal: function(tasks) {
                var states = this._states;
                each(this._getPromises(toArr(tasks)), function(val) {
                    if (!val.state) {
                        states[val.task] = true;
                        val.resolve();
                    }
                });
            },
            isReady: function(tasks) {
                return !some(this._getPromises(toArr(tasks)), function(val) {
                    return !val.state;
                });
            },
            ready: function(tasks) {
                var fn =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : noop;
                return Promise.all(
                    map(this._getPromises(toArr(tasks)), function(val) {
                        return val.promise;
                    })
                ).then(fn);
            },
            _getPromises: function(tasks) {
                var promises = this._promises;
                var resolves = this._resolves;
                var states = this._states;
                return map(tasks, function(task) {
                    if (!promises[task]) {
                        promises[task] = new Promise(function(resolve) {
                            resolves[task] = resolve;
                            states[task] = false;
                        });
                    }

                    return {
                        task: task,
                        promise: promises[task],
                        resolve: resolves[task],
                        state: states[task]
                    };
                });
            }
        });

        return exports;
    })({});

    /* ------------------------------ State ------------------------------ */

    var State = _.State = (function (exports) {
        /* Simple state machine.
         *
         * Extend from Emitter.
         *
         * ### constructor
         *
         * |Name   |Desc                  |
         * |-------|----------------------|
         * |initial|Initial state         |
         * |events |Events to change state|
         *
         * ### is
         *
         * Check current state.
         *
         * |Name  |Desc                                    |
         * |------|----------------------------------------|
         * |state |State to check                          |
         * |return|True if current state equals given value|
         */

        /* example
         * const state = new State('empty', {
         *     load: { from: 'empty', to: 'pause' },
         *     play: { from: 'pause', to: 'play' },
         *     pause: { from: ['play', 'empty'], to: 'pause' },
         *     unload: { from: ['play', 'pause'], to: 'empty' }
         * });
         *
         * state.is('empty'); // -> true
         * state.load();
         * state.is('pause'); // -> true
         * state.on('play', function(src) {
         *     console.log(src); // -> 'eustia'
         * });
         * state.on('error', function(err, event) {
         *     // Error handler
         * });
         * state.play('eustia');
         */

        /* typescript
         * export declare class State extends Emitter {
         *     constructor(initial: string, events: any);
         *     is(state: string): boolean;
         *     [event: string]: any;
         * }
         */

        /* dependencies
         * Emitter each some toArr 
         */

        exports = Emitter.extend({
            className: 'State',
            initialize: function(initial, events) {
                this.callSuper(Emitter, 'initialize');
                this.current = initial;
                var self = this;
                each(events, function(event, key) {
                    self[key] = buildEvent(key, event);
                });
            },
            is: function(state) {
                return this.current === state;
            }
        });

        function buildEvent(name, event) {
            var from = toArr(event.from);
            var to = event.to;
            return function() {
                var args = toArr(arguments);
                args.unshift(name);
                var hasEvent = some(
                    from,
                    function(val) {
                        return this.current === val;
                    },
                    this
                );

                if (hasEvent) {
                    this.current = to;
                    this.emit.apply(this, args);
                } else {
                    this.emit(
                        'error',
                        new Error(this.current + ' => ' + to + ' error'),
                        name
                    );
                }
            };
        }

        return exports;
    })({});

    /* ------------------------------ Promise ------------------------------ */

    var Promise = _.Promise = (function (exports) {
        /* Lightweight Promise implementation.
         *
         * [Promises spec](https://github.com/promises-aplus/promises-spec)
         */

        /* example
         * function get(url) {
         *     return new Promise(function(resolve, reject) {
         *         const req = new XMLHttpRequest();
         *         req.open('GET', url);
         *         req.onload = function() {
         *             req.status == 200
         *                 ? resolve(req.response)
         *                 : reject(Error(req.statusText));
         *         };
         *         req.onerror = function() {
         *             reject(Error('Network Error'));
         *         };
         *         req.send();
         *     });
         * }
         *
         * get('test.json').then(function(result) {
         *     // Do something...
         * });
         */

        /* typescript
         */

        /* dependencies
         * Class isObj isFn State bind nextTick noop toArr 
         */

        var Promise = (exports = Class(
            {
                initialize: function Promise(fn) {
                    if (!isObj(this))
                        throw new TypeError('Promises must be constructed via new');
                    if (!isFn(fn)) throw new TypeError(fn + ' is not a function');
                    var self = this;
                    this._state = new State('pending', {
                        fulfill: {
                            from: 'pending',
                            to: 'fulfilled'
                        },
                        reject: {
                            from: 'pending',
                            to: 'rejected'
                        },
                        adopt: {
                            from: 'pending',
                            to: 'adopted'
                        }
                    })
                        .on('fulfill', assignVal)
                        .on('reject', assignVal)
                        .on('adopt', assignVal);

                    function assignVal(val) {
                        self._value = val;
                    }

                    this._handled = false;
                    this._value = undefined;
                    this._deferreds = [];
                    doResolve(fn, this);
                },
                catch: function(onRejected) {
                    return this.then(null, onRejected);
                },
                then: function(onFulfilled, onRejected) {
                    var promise = new Promise(noop);
                    handle(this, new Handler(onFulfilled, onRejected, promise));
                    return promise;
                }
            },
            {
                all: function(arr) {
                    var args = toArr(arr);
                    return new Promise(function(resolve, reject) {
                        if (args.length === 0) return resolve([]);
                        var remaining = args.length;

                        function res(i, val) {
                            try {
                                if (val && (isObj(val) || isFn(val))) {
                                    var then = val.then;

                                    if (isFn(then)) {
                                        then.call(
                                            val,
                                            function(val) {
                                                res(i, val);
                                            },
                                            reject
                                        );
                                        return;
                                    }
                                }

                                args[i] = val;
                                if (--remaining === 0) resolve(args);
                            } catch (e) {
                                reject(e);
                            }
                        }

                        for (var i = 0; i < args.length; i++) {
                            res(i, args[i]);
                        }
                    });
                },
                resolve: function(val) {
                    if (val && isObj(val) && val.constructor === Promise) return val;
                    return new Promise(function(resolve) {
                        resolve(val);
                    });
                },
                reject: function(val) {
                    return new Promise(function(resolve, reject) {
                        reject(val);
                    });
                },
                race: function(values) {
                    return new Promise(function(resolve, reject) {
                        for (var i = 0, len = values.length; i < len; i++) {
                            values[i].then(resolve, reject);
                        }
                    });
                }
            }
        ));
        var Handler = Class({
            initialize: function Handler(onFulfilled, onRejected, promise) {
                this.onFulfilled = isFn(onFulfilled) ? onFulfilled : null;
                this.onRejected = isFn(onRejected) ? onRejected : null;
                this.promise = promise;
            }
        });

        function reject(self, err) {
            self._state.reject(err);

            finale(self);
        }

        function resolve(self, val) {
            try {
                if (val === self)
                    throw new TypeError('A promise cannot be resolved with itself');

                if (val && (isObj(val) || isFn(val))) {
                    var then = val.then;

                    if (val instanceof Promise) {
                        self._state.adopt(val);

                        return finale(self);
                    }

                    if (isFn(then)) return doResolve(bind(then, val), self);
                }

                self._state.fulfill(val);

                finale(self);
            } catch (e) {
                reject(self, e);
            }
        }

        function finale(self) {
            for (var i = 0, len = self._deferreds.length; i < len; i++) {
                handle(self, self._deferreds[i]);
            }

            self._deferreds = null;
        }

        function handle(self, deferred) {
            while (self._state.is('adopted')) {
                self = self._value;
            }

            if (self._state.is('pending')) return self._deferreds.push(deferred);
            self._handled = true;
            nextTick(function() {
                var isFulfilled = self._state.is('fulfilled');

                var cb = isFulfilled ? deferred.onFulfilled : deferred.onRejected;
                if (cb === null)
                    return (isFulfilled ? resolve : reject)(
                        deferred.promise,
                        self._value
                    );
                var ret;

                try {
                    ret = cb(self._value);
                } catch (e) {
                    return reject(deferred.promise, e);
                }

                resolve(deferred.promise, ret);
            });
        }

        function doResolve(fn, self) {
            var done = false;

            try {
                fn(
                    function(val) {
                        if (done) return;
                        done = true;
                        resolve(self, val);
                    },
                    function(reason) {
                        if (done) return;
                        done = true;
                        reject(self, reason);
                    }
                );
            } catch (e) {
                if (done) return;
                done = true;
                reject(self, e);
            }
        }

        return exports;
    })({});

    /* ------------------------------ Tween ------------------------------ */
    _.Tween = (function (exports) {
        /* Tween engine for JavaScript animations.
         *
         * Extend from Emitter.
         *
         * ### constructor
         *
         * |Name|Desc           |
         * |----|---------------|
         * |obj |Values to tween|
         *
         * ### to
         *
         * |Name       |Desc            |
         * |-----------|----------------|
         * |destination|Final properties|
         * |duration   |Tween duration  |
         * |ease       |Easing function |
         *
         * ### play
         *
         * Begin playing forward.
         *
         * ### pause
         *
         * Pause the animation.
         *
         * ### paused
         *
         * Get animation paused state.
         *
         * ### progress
         *
         * Update or get animation progress.
         *
         * |Name    |Desc                  |
         * |--------|----------------------|
         * |progress|Number between 0 and 1|
         */

        /* example
         * const pos = { x: 0, y: 0 };
         *
         * const tween = new Tween(pos);
         * tween
         *     .on('update', function(target) {
         *         console.log(target.x, target.y);
         *     })
         *     .on('end', function(target) {
         *         console.log(target.x, target.y); // -> 100, 100
         *     });
         * tween.to({ x: 100, y: 100 }, 1000, 'inElastic').play();
         */

        /* typescript
         * export declare class Tween extends Emitter {
         *     constructor(target: any);
         *     to(props: any, duration?: number, ease?: string | Function): Tween;
         *     progress(): number;
         *     progress(progress: number): Tween;
         *     play(): Tween;
         *     pause(): Tween;
         *     paused(): boolean;
         * }
         */

        /* dependencies
         * Emitter State easing now each raf isFn 
         */

        exports = Emitter.extend({
            className: 'Tween',
            initialize: function(target) {
                this.callSuper(Emitter, 'initialize', arguments);
                this._target = target;
                this._dest = {};
                this._duration = 0;
                this._progress = 0;
                this._origin = {};
                this._diff = {};
                this._ease = easing['linear'];
                this._state = new State('pause', {
                    play: {
                        from: 'pause',
                        to: 'play'
                    },
                    pause: {
                        from: 'play',
                        to: 'pause'
                    }
                });
            },
            to: function(props, duration, ease) {
                var origin = {};
                var target = this._target;
                var diff = {};
                ease = ease || this._ease;
                this._dest = props;
                this._duration = duration || this._duration;
                this._ease = isFn(ease) ? ease : easing[ease];
                each(props, function(val, key) {
                    origin[key] = target[key];
                    diff[key] = val - origin[key];
                });
                this._origin = origin;
                this._diff = diff;
                return this;
            },
            progress: function(progress) {
                var ease = this._ease;
                var target = this._target;
                var origin = this._origin;
                var diff = this._diff;
                var dest = this._dest;
                var self = this;

                if (progress != null) {
                    progress = progress < 1 ? progress : 1;
                    this._progress = progress;
                    each(dest, function(val, key) {
                        target[key] = origin[key] + diff[key] * ease(progress);
                    });
                    self.emit('update', target);
                    return this;
                }

                return this._progress;
            },
            play: function() {
                var state = this._state;
                if (state.is('play')) return;
                state.play();
                var startTime = now();
                var progress = this._progress;
                var duration = this._duration * (1 - progress);
                var target = this._target;
                var self = this;

                function render() {
                    if (state.is('pause')) return;
                    var time = now();
                    self.progress(progress + (time - startTime) / duration);

                    if (self._progress === 1) {
                        state.pause();
                        self.emit('end', target);
                        return;
                    }

                    raf(render);
                }

                raf(render);
                return this;
            },
            pause: function() {
                var state = this._state;
                if (state.is('pause')) return;
                state.pause();
                return this;
            },
            paused: function() {
                return this._state.is('pause');
            }
        });

        return exports;
    })({});

    /* ------------------------------ promisify ------------------------------ */

    var promisify = _.promisify = (function (exports) {
        /* Convert callback based functions into Promises.
         *
         * |Name           |Desc                                  |
         * |---------------|--------------------------------------|
         * |fn             |Callback based function               |
         * |multiArgs=false|If callback has multiple success value|
         * |return         |Result function                       |
         *
         * If multiArgs is set to true, the resulting promise will always fulfill with an array of the callback's success values.
         */

        /* example
         * const fs = require('fs');
         *
         * const readFile = promisify(fs.readFile);
         * readFile('test.js', 'utf-8').then(function(data) {
         *     // Do something with file content.
         * });
         */

        /* typescript
         * export declare function promisify(
         *     fn: types.AnyFn,
         *     multiArgs?: boolean
         * ): types.AnyFn;
         */

        /* dependencies
         * restArgs root types 
         */

        exports = function(fn, multiArgs) {
            return restArgs(function(args) {
                return new root.Promise(function(resolve, reject) {
                    args.push(
                        restArgs(function callback(err, values) {
                            if (err) return reject(err);
                            if (!multiArgs) return resolve(values[0]);
                            resolve(values);
                        })
                    );
                    fn.apply(this, args);
                });
            });
        };

        return exports;
    })({});

    /* ------------------------------ quickSort ------------------------------ */
    _.quickSort = (function (exports) {
        /* Quick sort implementation.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to sort|
         * |cmp   |Comparator   |
         * |return|Sorted array |
         */

        /* example
         * quickSort([2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function quickSort(arr: any[], cmp?: types.AnyFn): any[];
         */

        /* dependencies
         * swap isSorted types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : isSorted.defComparator;
            return quickSort(arr, 0, arr.length - 1, cmp);
        };

        function quickSort(arr, left, right, cmp) {
            if (arr.length <= 1) return arr;
            var idx = partition(arr, left, right, cmp);
            if (left < idx - 1) quickSort(arr, left, idx - 1, cmp);
            if (idx < right) quickSort(arr, idx, right, cmp);
            return arr;
        }

        function partition(arr, left, right, cmp) {
            var pivot = arr[floor((right + left) / 2)];

            while (left <= right) {
                while (cmp(arr[left], pivot) < 0) {
                    left++;
                }

                while (cmp(arr[right], pivot) > 0) {
                    right--;
                }

                if (left <= right) {
                    swap(arr, left, right);
                    left++;
                    right--;
                }
            }

            return left;
        }

        var floor = Math.floor;

        return exports;
    })({});

    /* ------------------------------ random ------------------------------ */

    var random = _.random = (function (exports) {
        /* Produces a random number between min and max(inclusive).
         *
         * |Name          |Desc                  |
         * |--------------|----------------------|
         * |min           |Minimum possible value|
         * |max           |Maximum possible value|
         * |floating=false|Float or not          |
         * |return        |Random number         |
         */

        /* example
         * random(1, 5); // -> an integer between 0 and 5
         * random(5); // -> an integer between 0 and 5
         * random(1.2, 5.2, true); /// -> a floating-point number between 1.2 and 5.2
         */

        /* typescript
         * export declare function random(
         *     min: number,
         *     max?: number,
         *     floating?: boolean
         * ): number;
         */
        exports = function(min, max, floating) {
            if (max == null) {
                max = min;
                min = 0;
            }

            var rand = Math.random();

            if (floating || min % 1 || max % 1) {
                return Math.min(
                    min +
                        rand *
                            (max - min + parseFloat('1e-' + ((rand + '').length - 1))),
                    max
                );
            }

            return min + Math.floor(rand * (max - min + 1));
        };

        return exports;
    })({});

    /* ------------------------------ randomBytes ------------------------------ */

    var randomBytes = _.randomBytes = (function (exports) {
        /* Random bytes generator.
         *
         * Use crypto module in node or crypto object in browser if possible.
         *
         * |Name  |Desc                        |
         * |------|----------------------------|
         * |size  |Number of bytes to generate |
         * |return|Random bytes of given length|
         */

        /* example
         * randomBytes(5); // -> [55, 49, 153, 30, 122]
         */

        /* typescript
         * export declare function randomBytes(size: number): Uint8Array;
         */

        /* dependencies
         * random isBrowser isNode 
         */

        exports = function(size) {
            var ret = new Uint8Array(size);

            for (var i = 0; i < size; i++) {
                ret[i] = random(0, 255);
            }

            return ret;
        };

        var crypto;

        if (isBrowser) {
            crypto = window.crypto || window.msCrypto;

            if (crypto) {
                exports = function(size) {
                    var ret = new Uint8Array(size);
                    crypto.getRandomValues(ret);
                    return ret;
                };
            }
        } else if (isNode) {
            crypto = eval('require')('crypto');

            exports = function(size) {
                return crypto.randomBytes(size);
            };
        }

        return exports;
    })({});

    /* ------------------------------ seedRandom ------------------------------ */

    var seedRandom = _.seedRandom = (function (exports) {
        /* Seeded random number generator.
         *
         * |Name         |Desc                                          |
         * |-------------|----------------------------------------------|
         * |seed         |Random seed                                   |
         * |min=0        |Min possible value                            |
         * |max=1        |Maximum possible value                        |
         * |floating=true|Float or not                                  |
         * |return       |Function that generates random number sequence|
         */

        /* example
         * const random = seedRandom(19920719, 0, 100, false);
         * random(); // -> 7
         * random(); // -> 68
         */

        /* typescript
         * export declare function seedRandom(
         *     seed: number,
         *     min?: number,
         *     max?: number,
         *     floating?: boolean
         * ): () => number;
         */
        // https://softwareengineering.stackexchange.com/questions/260969/original-source-of-seed-9301-49297-233280-random-algorithm
        exports = function(seed) {
            var min =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var max =
                arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var floating =
                arguments.length > 3 && arguments[3] !== undefined
                    ? arguments[3]
                    : true;
            return function() {
                seed = (seed * 9301 + 49297) % 233280;
                var rnd = seed / 233280.0;
                rnd = min + rnd * (max - min);
                return floating ? rnd : Math.floor(rnd);
            };
        };

        return exports;
    })({});

    /* ------------------------------ randomColor ------------------------------ */
    _.randomColor = (function (exports) {
        /* Random color generator.
         *
         * |Name   |Desc          |
         * |-------|--------------|
         * |options|Random options|
         * |return |Random color  |
         *
         * Available options:
         *
         * |Name      |Desc                             |
         * |----------|---------------------------------|
         * |count=1   |Color number                     |
         * |hue       |Hue, number between 0 and 360    |
         * |lightness |Lightness, number between 0 and 1|
         * |format=hex|Color format, hex, hsl or rgb    |
         * |seed      |Random color seed                |
         */

        /* example
         * randomColor({
         *     count: 2
         * }); // -> ['#fed7f4', '#526498']
         */

        /* typescript
         * export declare function randomColor(): string;
         * export declare function randomColor(options: {
         *     count?: number;
         *     hue?: number;
         *     lightness?: number;
         *     format?: string;
         *     seed?: number;
         * }): string | string[];
         */

        /* dependencies
         * defaults random Color seedRandom isFn 
         */

        exports = function() {
            var options =
                arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            defaults(options, defOpts);
            var count = options.count;
            var randomH = options.randomH,
                randomL = options.randomL,
                randomS = options.randomS;

            if (!isFn(randomH)) {
                var seed = options.seed || random(0, 100000);
                randomH = seedRandom(seed, 0, 360, false);
                randomL = seedRandom(seed + 1, 0, 1);
                randomS = seedRandom(seed + 2, 0, 1);
            }

            if (count > 1) {
                var colors = [];

                for (var i = 0; i < count; i++) {
                    colors.push(
                        exports(
                            defaults(
                                {
                                    count: 1,
                                    randomH: randomH,
                                    randomL: randomL,
                                    randomS: randomS
                                },
                                options
                            )
                        )
                    );
                }

                return colors;
            }

            var hue = options.hue || randomH();
            var lightness = options.lightness || randomL().toFixed(2);
            var saturation = options.saturation || randomS().toFixed(2);
            var color = new Color({
                val: [hue, Math.round(saturation * 100), Math.round(lightness * 100)],
                model: 'hsl'
            });

            switch (options.format) {
                case 'hsl':
                    return color.toHsl();

                case 'rgb':
                    return color.toRgb();

                default:
                    return color.toHex();
            }
        };

        var defOpts = {
            count: 1,
            format: 'hex'
        };

        return exports;
    })({});

    /* ------------------------------ randomId ------------------------------ */
    _.randomId = (function (exports) {
        /* A tiny id generator, similar to nanoid.
         *
         * |Name   |Desc                                                |
         * |-------|----------------------------------------------------|
         * |size=21|Id size                                             |
         * |symbols|Symbols used to generate ids, a-zA-Z0-9_- by default|
         */

        /* example
         * randomId(); // -> 'oKpy4HwU8E6IvU5I03gyQ'
         * randomId(5); // -> 'sM6E9'
         * randomId(5, 'abc'); // -> 'cbbcb'
         */

        /* typescript
         * export declare function randomId(size?: number, symbols?: string): string;
         */

        /* dependencies
         * randomBytes 
         */

        var defSymbols =
            'ModuleSymbhasOwnPr-0123456789ABCDEFGHIJKLNQRTUVWXYZ_cfgijkpqtvxz';

        exports = function() {
            var size =
                arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;
            var symbols =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : defSymbols;
            var id = '';
            var len = symbols.length;
            var bytes = randomBytes(21);

            while (0 < size--) {
                id += symbols[bytes[size] % len];
            }

            return id;
        };

        return exports;
    })({});

    /* ------------------------------ randomItem ------------------------------ */
    _.randomItem = (function (exports) {
        /* Get a random item from an array.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |arr   |Array to get        |
         * |return|Randomly picked item|
         */

        /* example
         * randomItem([1, 2, 3]); // -> 2
         */

        /* typescript
         * export declare function randomItem(arr: any[]): any;
         */

        /* dependencies
         * random 
         */

        exports = function(arr) {
            return arr[random(0, arr.length - 1)];
        };

        return exports;
    })({});

    /* ------------------------------ range ------------------------------ */
    _.range = (function (exports) {
        /* Create flexibly-numbered lists of integers.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |start |Start of the range                |
         * |end   |End of the range                  |
         * |step=1|Value to increment or decrement by|
         * |return|List of integers                  |
         */

        /* example
         * range(5); // -> [0, 1, 2, 3, 4]
         * range(0, 5, 2); // -> [0, 2, 4]
         */

        /* typescript
         * export declare function range(
         *     start: number,
         *     end?: number,
         *     step?: number
         * ): number[];
         */
        exports = function(start, end, step) {
            if (end == null) {
                end = start || 0;
                start = 0;
            }

            if (!step) step = end < start ? -1 : 1;
            var len = Math.max(Math.ceil((end - start) / step), 0);
            var ret = Array(len);

            for (var i = 0; i < len; i++, start += step) {
                ret[i] = start;
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ rc4 ------------------------------ */
    _.rc4 = (function (exports) {
        /* RC4 symmetric encryption implementation.
         *
         * ### encrypt
         *
         * RC4 encryption, result as base64 string.
         *
         * ### decrypt
         *
         * RC4 decryption, pass base64 string as input.
         *
         * |Name  |Desc                            |
         * |------|--------------------------------|
         * |key   |Secret key                      |
         * |str   |String to be encrypted/decrypted|
         * |return|Encrypted/decrypted string      |
         */

        /* example
         * rc4.encrypt('licia', 'Hello world'); // -> 'j9y2VpSfR3AdNN8='
         * rc4.decrypt('licia', 'j9y2VpSfR3AdNN8='); // -> 'Hello world'
         */

        /* typescript
         * export declare const rc4: {
         *     encrypt(key: string, str: string): string;
         *     decrypt(key: string, str: string): string;
         * };
         */

        /* dependencies
         * base64 bytesToStr strToBytes 
         */

        exports = {
            encrypt: function(key, str) {
                return rc4(key, str, false);
            },
            decrypt: function(key, str) {
                return rc4(key, str, true);
            }
        };

        function rc4(key, str, decrypt) {
            key = strToBytes(key);

            if (!decrypt) {
                str = strToBytes(str);
            } else {
                str = base64.decode(str);
            }

            var result = [];
            var s = [];
            var j = 0;
            var i = 0;
            var x;

            for (i = 0; i < 256; i++) {
                s[i] = i;
            }

            for (i = 0; i < 256; i++) {
                j = (j + s[i] + key[i % key.length]) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x;
            }

            i = 0;
            j = 0;

            for (var y = 0, len = str.length; y < len; y++) {
                i = (i + 1) % 256;
                j = (j + s[i]) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x;
                result.push(str[y] ^ s[(s[i] + s[j]) % 256]);
            }

            return !decrypt ? base64.encode(result) : bytesToStr(result);
        }

        return exports;
    })({});

    /* ------------------------------ reduceRight ------------------------------ */
    _.reduceRight = (function (exports) {
        /* Right-associative version of reduce.
         */

        /* example
         * reduceRight(
         *     [[1], [2], [3]],
         *     function(a, b) {
         *         return a.concat(b);
         *     },
         *     []
         * ); // -> [3, 2, 1]
         */

        /* typescript
         * export declare function reduceRight<T, TResult>(
         *     list: types.Collection<T>,
         *     iterator: types.MemoIterator<T, TResult>,
         *     memo?: TResult,
         *     context?: any
         * ): TResult;
         */

        /* dependencies
         * reduce types 
         */

        exports = reduce.create(-1);

        return exports;
    })({});

    /* ------------------------------ reject ------------------------------ */
    _.reject = (function (exports) {
        /* Opposite of filter.
         *
         * |Name     |Desc                                          |
         * |---------|----------------------------------------------|
         * |obj      |Collection to iterate over                    |
         * |predicate|Function invoked per iteration                |
         * |ctx      |Predicate context                             |
         * |return   |Array of all values that didn't pass predicate|
         */

        /* example
         * reject([1, 2, 3, 4, 5], function(val) {
         *     return val % 2 === 0;
         * }); // -> [1, 3, 5]
         */

        /* typescript
         * export declare function reject<T>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, boolean>,
         *     context?: any
         * ): T[];
         * export declare function reject<T>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, boolean>,
         *     context?: any
         * ): T[];
         */

        /* dependencies
         * safeCb negate filter types 
         */

        exports = function(obj, predicate, ctx) {
            predicate = safeCb(negate(predicate), ctx);
            return filter(obj, predicate);
        };

        return exports;
    })({});

    /* ------------------------------ replaceAll ------------------------------ */
    _.replaceAll = (function (exports) {
        /* Replace all instance in a string.
         *
         * |Name     |Desc                               |
         * |---------|-----------------------------------|
         * |str      |Source string                      |
         * |substr   |String to be replaced              |
         * |newSubstr|String to replace substr           |
         * |return   |New string with all substr replaced|
         */

        /* example
         * replaceAll('hello world goodbye world', 'world', 'licia'); // -> 'hello licia goodbye licia'
         */

        /* typescript
         * export declare function replaceAll(
         *     str: string,
         *     substr: string,
         *     newSubstr: string
         * ): string;
         */

        /* dependencies
         * escapeRegExp 
         */

        exports = function(str, substr, newSubstr) {
            return str.replace(new RegExp(escapeRegExp(substr), 'g'), newSubstr);
        };

        return exports;
    })({});

    /* ------------------------------ rpad ------------------------------ */
    _.rpad = (function (exports) {
        /* Pad string on the right side if it's shorter than length.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |str   |String to pad         |
         * |len   |Padding length        |
         * |chars |String used as padding|
         * |return|Result string         |
         */

        /* example
         * rpad('a', 5); // -> 'a    '
         * rpad('a', 5, '-'); // -> 'a----'
         * rpad('abc', 3, '-'); // -> 'abc'
         * rpad('abc', 5, 'ab'); // -> 'abcab'
         */

        /* typescript
         * export declare function rpad(str: string, len: number, chars?: string): string;
         */

        /* dependencies
         * repeat toStr 
         */

        exports = function(str, len, chars) {
            str = toStr(str);
            var strLen = str.length;
            chars = chars || ' ';
            if (strLen < len) str = (str + repeat(chars, len - strLen)).slice(0, len);
            return str;
        };

        return exports;
    })({});

    /* ------------------------------ rtrim ------------------------------ */

    var rtrim = _.rtrim = (function (exports) {
        /* Remove chars or white-spaces from end of string.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to trim    |
         * |chars |Characters to trim|
         * |return|Trimmed string    |
         */

        /* example
         * rtrim(' abc  '); // -> ' abc'
         * rtrim('_abc_', '_'); // -> '_abc'
         * rtrim('_abc_', ['c', '_']); // -> '_ab'
         */

        /* typescript
         * export declare function rtrim(str: string, chars?: string | string[]): string;
         */
        exports = function(str, chars) {
            if (chars == null) {
                if (str.trimRight) {
                    return str.trimRight();
                }

                chars = ' \r\n\t\f\v';
            }

            var end = str.length - 1;
            var charLen = chars.length;
            var found = true;
            var i;
            var c;

            while (found && end >= 0) {
                found = false;
                i = -1;
                c = str.charAt(end);

                while (++i < charLen) {
                    if (c === chars[i]) {
                        found = true;
                        end--;
                        break;
                    }
                }
            }

            return end >= 0 ? str.substring(0, end + 1) : '';
        };

        return exports;
    })({});

    /* ------------------------------ trim ------------------------------ */

    var trim = _.trim = (function (exports) {
        /* Remove chars or white-spaces from beginning end of string.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to trim    |
         * |chars |Characters to trim|
         * |return|Trimmed string    |
         */

        /* example
         * trim(' abc  '); // -> 'abc'
         * trim('_abc_', '_'); // -> 'abc'
         * trim('_abc_', ['a', 'c', '_']); // -> 'b'
         */

        /* typescript
         * export declare function trim(str: string, chars?: string | string[]): string;
         */

        /* dependencies
         * ltrim rtrim 
         */

        exports = function(str, chars) {
            if (chars == null && str.trim) {
                return str.trim();
            }

            return ltrim(rtrim(str, chars), chars);
        };

        return exports;
    })({});

    /* ------------------------------ css ------------------------------ */
    _.css = (function (exports) {
        /* Css parser and serializer.
         *
         * Comments will be stripped.
         *
         * ### parse
         *
         * Parse css into js object.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |css   |Css string      |
         * |return|Parsed js object|
         *
         * ### stringify
         *
         * Stringify object into css.
         *
         * |Name      |Desc               |
         * |----------|-------------------|
         * |stylesheet|Object to stringify|
         * |options   |Stringify options  |
         * |return    |Css string         |
         *
         * Options:
         *
         * |Name       |Desc                 |
         * |-----------|---------------------|
         * |indent='  '|String used to indent|
         */

        /* example
         * const stylesheet = css.parse('.name { background: #000; color: red; }');
         * // {type: 'stylesheet', rules: [{type: 'rule', selector: '.name', declarations: [...]}]}
         * css.stringify(stylesheet);
         */

        /* typescript
         * export declare const css: {
         *     parse(css: string): object;
         *     stringify(stylesheet: object, options?: { indent?: string }): string;
         * };
         */

        /* dependencies
         * Class trim repeat defaults camelCase 
         */ // https://github.com/reworkcss/css

        exports = {
            parse: function(css) {
                return new Parser(css).parse();
            },
            stringify: function(stylesheet, options) {
                return new Compiler(stylesheet, options).compile();
            }
        };
        var regComments = /(\/\*[\s\S]*?\*\/)/gi;
        var regOpen = /^{\s*/;
        var regClose = /^}/;
        var regWhitespace = /^\s*/;
        var regProperty = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
        var regValue = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
        var regSelector = /^([^{]+)/;
        var regSemicolon = /^[;\s]*/;
        var regColon = /^:\s*/;
        var regMedia = /^@media *([^{]+)/;
        var regKeyframes = /^@([-\w]+)?keyframes\s*/;
        var regFontFace = /^@font-face\s*/;
        var regSupports = /^@supports *([^{]+)/;
        var regIdentifier = /^([-\w]+)\s*/;
        var regKeyframeSelector = /^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/;
        var regComma = /^,\s*/;
        var Parser = Class({
            initialize: function Parser(css) {
                this.input = stripCmt(css);
                this.open = this._createMatcher(regOpen);
                this.close = this._createMatcher(regClose);
                this.whitespace = this._createMatcher(regWhitespace);
                this.atImport = this._createAtRule('import');
                this.atCharset = this._createAtRule('charset');
                this.atNamespace = this._createAtRule('namespace');
            },
            parse: function() {
                return this.stylesheet();
            },
            stylesheet: function() {
                return {
                    type: 'stylesheet',
                    rules: this.rules()
                };
            },
            rules: function() {
                var rule;
                var rules = [];
                this.whitespace();

                while (
                    this.input.length &&
                    this.input[0] !== '}' &&
                    (rule = this.atRule() || this.rule())
                ) {
                    rules.push(rule);
                    this.whitespace();
                }

                return rules;
            },
            atRule: function() {
                if (this.input[0] !== '@') return;
                return (
                    this.atKeyframes() ||
                    this.atMedia() ||
                    this.atSupports() ||
                    this.atImport() ||
                    this.atCharset() ||
                    this.atNamespace() ||
                    this.atFontFace()
                );
            },
            atKeyframes: function() {
                var matched = this.match(regKeyframes);
                if (!matched) return;
                var vendor = matched[1] || '';
                matched = this.match(regIdentifier);
                if (!matched) throw Error('@keyframes missing name');
                var name = matched[1];
                if (!this.open()) throw Error("@keyframes missing '{'");
                var keyframes = [];
                var keyframe;

                while ((keyframe = this.keyframe())) {
                    keyframes.push(keyframe);
                }

                if (!this.close()) throw Error("@keyframes missing '}'");
                return {
                    type: 'keyframes',
                    name: name,
                    vendor: vendor,
                    keyframes: keyframes
                };
            },
            keyframe: function() {
                var selector = [];
                var matched;

                while ((matched = this.match(regKeyframeSelector))) {
                    selector.push(matched[1]);
                    this.match(regComma);
                }

                if (!selector.length) return;
                this.whitespace();
                return {
                    type: 'keyframe',
                    selector: selector.join(', '),
                    declarations: this.declarations()
                };
            },
            atSupports: function() {
                var matched = this.match(regSupports);
                if (!matched) return;
                var supports = trim(matched[1]);
                if (!this.open()) throw Error("@supports missing '{'");
                var rules = this.rules();
                if (!this.close()) throw Error("@supports missing '}'");
                return {
                    type: 'supports',
                    supports: supports,
                    rules: rules
                };
            },
            atFontFace: function() {
                var matched = this.match(regFontFace);
                if (!matched) return;
                if (!this.open()) throw Error("@font-face missing '{'");
                var declaration;
                var declarations = [];

                while ((declaration = this.declaration())) {
                    declarations.push(declaration);
                }

                if (!this.close()) throw Error("@font-face missing '}'");
                return {
                    type: 'font-face',
                    declarations: declarations
                };
            },
            atMedia: function() {
                var matched = this.match(regMedia);
                if (!matched) return;
                var media = trim(matched[1]);
                if (!this.open()) throw Error("@media missing '{'");
                this.whitespace();
                var rules = this.rules();
                if (!this.close()) throw Error("@media missing '}'");
                return {
                    type: 'media',
                    media: media,
                    rules: rules
                };
            },
            rule: function() {
                var selector = this.selector();
                if (!selector) throw Error('missing selector');
                return {
                    type: 'rule',
                    selector: selector,
                    declarations: this.declarations()
                };
            },
            declarations: function() {
                var declarations = [];
                if (!this.open()) throw Error("missing '{'");
                this.whitespace();
                var declaration;

                while ((declaration = this.declaration())) {
                    declarations.push(declaration);
                }

                if (!this.close()) throw Error("missing '}'");
                this.whitespace();
                return declarations;
            },
            declaration: function() {
                var property = this.match(regProperty);
                if (!property) return;
                property = trim(property[0]);
                if (!this.match(regColon)) throw Error("property missing ':'");
                var value = this.match(regValue);
                this.match(regSemicolon);
                this.whitespace();
                return {
                    type: 'declaration',
                    property: property,
                    value: value ? trim(value[0]) : ''
                };
            },
            selector: function() {
                var matched = this.match(regSelector);
                if (!matched) return;
                return trim(matched[0]);
            },
            match: function(reg) {
                var matched = reg.exec(this.input);
                if (!matched) return;
                this.input = this.input.slice(matched[0].length);
                return matched;
            },
            _createMatcher: function(reg) {
                var _this = this;

                return function() {
                    return _this.match(reg);
                };
            },
            _createAtRule: function(name) {
                var reg = new RegExp('^@' + name + '\\s*([^;]+);');
                return function() {
                    var matched = this.match(reg);
                    if (!matched) return;
                    var ret = {
                        type: name
                    };
                    ret[name] = trim(matched[1]);
                    return ret;
                };
            }
        });
        var Compiler = Class({
            initialize: function Compiler(input) {
                var options =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : {};
                defaults(options, {
                    indent: '  '
                });
                this.input = input;
                this.indentLevel = 0;
                this.indentation = options.indent;
            },
            compile: function() {
                return this.stylesheet(this.input);
            },
            stylesheet: function(node) {
                return this.mapVisit(node.rules, '\n\n');
            },
            media: function(node) {
                return (
                    '@media ' +
                    node.media +
                    ' {\n' +
                    this.indent(1) +
                    this.mapVisit(node.rules, '\n\n') +
                    this.indent(-1) +
                    '\n}'
                );
            },
            keyframes: function(node) {
                return (
                    '@'.concat(node.vendor, 'keyframes ') +
                    node.name +
                    ' {\n' +
                    this.indent(1) +
                    this.mapVisit(node.keyframes, '\n') +
                    this.indent(-1) +
                    '\n}'
                );
            },
            supports: function(node) {
                return (
                    '@supports ' +
                    node.supports +
                    ' {\n' +
                    this.indent(1) +
                    this.mapVisit(node.rules, '\n\n') +
                    this.indent(-1) +
                    '\n}'
                );
            },
            keyframe: function(node) {
                return this.rule(node);
            },
            mapVisit: function(nodes, delimiter) {
                var str = '';

                for (var i = 0, len = nodes.length; i < len; i++) {
                    var node = nodes[i];
                    str += this[camelCase(node.type)](node);
                    if (delimiter && i < len - 1) str += delimiter;
                }

                return str;
            },
            fontFace: function(node) {
                return (
                    '@font-face {\n' +
                    this.indent(1) +
                    this.mapVisit(node.declarations, '\n') +
                    this.indent(-1) +
                    '\n}'
                );
            },
            rule: function(node) {
                return (
                    this.indent() +
                    node.selector +
                    ' {\n' +
                    this.indent(1) +
                    this.mapVisit(node.declarations, '\n') +
                    this.indent(-1) +
                    '\n' +
                    this.indent() +
                    '}'
                );
            },
            declaration: function(node) {
                return this.indent() + node.property + ': ' + node.value + ';';
            },
            import: function(node) {
                return '@import '.concat(node.import, ';');
            },
            charset: function(node) {
                return '@charset '.concat(node.charset, ';');
            },
            namespace: function(node) {
                return '@namespace '.concat(node.namespace, ';');
            },
            indent: function(level) {
                if (level) {
                    this.indentLevel += level;
                    return '';
                }

                return repeat(this.indentation, this.indentLevel);
            }
        });

        var stripCmt = function(str) {
            return str.replace(regComments, '');
        };

        return exports;
    })({});

    /* ------------------------------ extractBlockCmts ------------------------------ */
    _.extractBlockCmts = (function (exports) {
        /* Extract block comments from source code.
         *
         * |Name  |Desc             |
         * |------|-----------------|
         * |str   |String to extract|
         * |return|Block comments   |
         */

        /* example
         * extractBlockCmts('\/*licia*\/'); // -> ['licia']
         */

        /* typescript
         * export declare function extractBlockCmts(str: string): string[];
         */

        /* dependencies
         * map trim 
         */

        var regBlockCmt = /(\/\*[\s\S]*?\*\/)/gm;

        exports = function(str) {
            var ret = str.match(regBlockCmt);
            if (!ret) return [];
            ret = map(ret, function(comment) {
                return trim(
                    map(comment.split('\n'), function(line) {
                        return trim(line).replace(/^\/\*+|\*+\/$|^\*+/g, '');
                    }).join('\n')
                );
            });
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ extractUrls ------------------------------ */

    var extractUrls = _.extractUrls = (function (exports) {
        /* Extract urls from plain text.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |str   |Text to extract|
         * |return|Url list       |
         */

        /* example
         * const str =
         *     '[Official site: http://eustia.liriliri.io](http://eustia.liriliri.io)';
         * extractUrls(str); // -> ['http://eustia.liriliri.io']
         */

        /* typescript
         * export declare function extractUrls(str: string): string[];
         */

        /* dependencies
         * unique trim map toArr 
         */

        exports = function(str) {
            var urlList = toArr(str.match(regUrl));
            return unique(
                map(urlList, function(url) {
                    return trim(url);
                })
            );
        };

        var regUrl = /((https?)|(ftp)):\/\/[\w.]+[^ \f\n\r\t\v"\\<>[\]\u2100-\uFFFF(),]*/gi;

        return exports;
    })({});

    /* ------------------------------ linkify ------------------------------ */
    _.linkify = (function (exports) {
        /* Hyperlink urls in a string.
         *
         * |Name     |Desc                     |
         * |---------|-------------------------|
         * |str      |String to hyperlink      |
         * |hyperlink|Function to hyperlink url|
         * |return   |Result string            |
         */

        /* example
         * const str = 'Official site: http://eustia.liriliri.io';
         * linkify(str); // -> 'Official site: <a href="http://eustia.liriliri.io">http://eustia.liriliri.io</a>'
         * linkify(str, function(url) {
         *     return '<a href="' + url + '" target="_blank">' + url + '</a>';
         * });
         */

        /* typescript
         * export declare function linkify(str: string, hyperlink?: types.AnyFn): string;
         */

        /* dependencies
         * extractUrls each escapeRegExp types 
         */

        exports = function(str, hyperlink) {
            hyperlink = hyperlink || defHyperlink;
            var urlList = extractUrls(str);
            each(urlList, function(url) {
                str = str.replace(new RegExp(escapeRegExp(url), 'g'), hyperlink);
            });
            return str;
        };

        function defHyperlink(url) {
            return '<a href="' + url + '">' + url + '</a>';
        }

        return exports;
    })({});

    /* ------------------------------ ini ------------------------------ */
    _.ini = (function (exports) {
        /* Ini parser and serializer.
         *
         * ### parse
         *
         * Parse ini string into js object.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |ini   |Ini string      |
         * |return|Parsed js object|
         *
         * ### stringify
         *
         * Stringify object into an ini formatted string.
         *
         * |Name   |Desc                |
         * |-------|--------------------|
         * |obj    |Object to stringify |
         * |options|Stringify options   |
         * |return |Ini formatted string|
         *
         * Options:
         *
         * |Name            |Desc               |
         * |----------------|-------------------|
         * |section         |Top section        |
         * |whitespace=false|Whitespace around =|
         */

        /* example
         * const config = ini.parse(`
         * ; This is a comment
         * library = licia
         *
         * [user.info]
         * name = surunzi
         * alias[] = redhoodsu
         * alias[] = red
         * `); // -> {library: 'licia', user: {info: {name: 'surunzi', alias: ['redhoodsu', 'red']}}}
         *
         * ini.stringify(config);
         */

        /* typescript
         * export declare const ini: {
         *     parse(ini: string): any;
         *     stringify(
         *         obj: any,
         *         options?: {
         *             section?: string;
         *             whitespace: boolean;
         *         }
         *     ): string;
         * };
         */

        /* dependencies
         * each trim safeSet safeGet endWith isArr isObj 
         */ // https://github.com/npm/ini

        var regSection = /^\[([^\]]*)\]$/i;
        var regKeyVal = /^([^=]+)(=(.*))?$/i;
        var regComment = /^\s*[;#]/;

        function parse(ini) {
            var ret = {};
            var section = ret;
            each(ini.split('\n'), function(line) {
                line = trim(line);
                if (!line || line.match(regComment)) return;
                var match = line.match(regSection);

                if (match && match[1]) {
                    var _key = match[1];
                    section = safeGet(ret, _key) || {};
                    return safeSet(ret, _key, section);
                }

                match = line.match(regKeyVal);
                if (!match) return;
                var key = trim(match[1]);
                var val = match[2] ? trim(match[3]) : true;
                if (val === 'true') val = true;
                if (val === 'false') val = false;
                if (val === 'null') val = null;

                if (endWith(key, '[]')) {
                    key = key.substring(0, key.length - 2);
                    if (!section[key]) section[key] = [];
                }

                isArr(section[key]) ? section[key].push(val) : (section[key] = val);
            });
            return ret;
        }

        function stringify(obj) {
            var options =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var ret = '';
            var section = options.section;
            var whitespace = options.whitespace;
            var separator = whitespace ? ' = ' : '=';
            var children = [];
            each(obj, function(val, key) {
                if (isArr(val)) {
                    each(val, function(item) {
                        ret += ''
                            .concat(key, '[]')
                            .concat(separator)
                            .concat(item, '\n');
                    });
                } else if (isObj(val)) {
                    children.push({
                        key: key,
                        val: val
                    });
                } else {
                    ret += ''
                        .concat(key)
                        .concat(separator)
                        .concat(val, '\n');
                }
            });

            if (section && ret) {
                ret = '['.concat(section, ']\n') + ret;
            }

            section = section ? section + '.' : '';
            each(children, function(child) {
                child = stringify(child.val, {
                    section: section + child.key,
                    whitespace: options.whitespace
                });

                if (child) {
                    if (ret) {
                        ret += '\n';
                    }

                    ret += child;
                }
            });
            return ret;
        }

        exports = {
            parse: parse,
            stringify: stringify
        };

        return exports;
    })({});

    /* ------------------------------ isDataUrl ------------------------------ */
    _.isDataUrl = (function (exports) {
        /* Check if a string is a valid data url.
         *
         * |Name  |Desc                        |
         * |------|----------------------------|
         * |str   |String to check             |
         * |return|True if string is a data url|
         */

        /* example
         * isDataUrl('http://eustia.liriliri.io'); // -> false
         * isDataUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D'); // -> true
         */

        /* typescript
         * export declare function isDataUrl(str: string): boolean;
         */

        /* dependencies
         * trim 
         */

        exports = function(str) {
            return regDataUrl.test(trim(str));
        }; // https://tools.ietf.org/html/rfc2397

        var regDataUrl = /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*?)$/i;

        return exports;
    })({});

    /* ------------------------------ normalizePhone ------------------------------ */
    _.normalizePhone = (function (exports) {
        /* Normalize phone numbers into E.164 format.
         *
         * |Name   |Desc              |
         * |-------|------------------|
         * |phone  |Phone to normalize|
         * |options|Normalize options |
         * |return |Normalized phone  |
         *
         * Available options:
         *
         * |Name             |Desc                                 |
         * |-----------------|-------------------------------------|
         * |countryCode      |Country code                         |
         * |trunkPrefix=false|True if local format has trunk prefix|
         */

        /* example
         * normalizePhone('13512345678', {
         *     countryCode: 86
         * }); // -> '+8613512345678'
         * normalizePhone('(415) 555-2671', {
         *     countryCode: 1
         * }); // -> '+14155552671'
         * normalizePhone('020 7183 8750', {
         *     countryCode: 44,
         *     trunkPrefix: true
         * }); // -> '+442071838750'
         */

        /* typescript
         * export declare function normalizePhone(
         *     phone: string,
         *     options: {
         *         countryCode: number;
         *         trunkPrefix?: boolean;
         *     }
         * ): string;
         */

        /* dependencies
         * trim 
         */

        exports = function(phone, options) {
            phone = trim(phone);
            var countryCode = options.countryCode,
                _options$trunkPrefix = options.trunkPrefix,
                trunkPrefix =
                    _options$trunkPrefix === void 0 ? false : _options$trunkPrefix;
            var plusSign = regPlusSign.test(phone);
            phone = phone.replace(regNotDigit, '');

            if (plusSign) {
                phone = phone.replace(new RegExp('^'.concat(countryCode)), '');
            }

            if (trunkPrefix) {
                phone = phone.replace(regTrunkPrefix, '');
            }

            return '+'.concat(countryCode + phone);
        };

        var regPlusSign = /^\+/;
        var regNotDigit = /\D/g;
        var regTrunkPrefix = /^\d/;

        return exports;
    })({});

    /* ------------------------------ query ------------------------------ */

    var query = _.query = (function (exports) {
        /* Parse and stringify url query strings.
         *
         * ### parse
         *
         * Parse a query string into an object.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |str   |Query string|
         * |return|Query object|
         *
         * ### stringify
         *
         * Stringify an object into a query string.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |obj   |Query object|
         * |return|Query string|
         */

        /* example
         * query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
         * query.stringify({ foo: 'bar', eruda: 'true' }); // -> 'foo=bar&eruda=true'
         * query.parse('name=eruda&name=eustia'); // -> {name: ['eruda', 'eustia']}
         */

        /* typescript
         * export declare const query: {
         *     parse(str: string): any;
         *     stringify(object: any): string;
         * };
         */

        /* dependencies
         * trim each isUndef isArr map isEmpty filter isObj 
         */

        exports = {
            parse: function(str) {
                var ret = {};
                str = trim(str).replace(regIllegalChars, '');
                each(str.split('&'), function(param) {
                    var parts = param.split('=');
                    var key = parts.shift(),
                        val = parts.length > 0 ? parts.join('=') : null;
                    key = decodeURIComponent(key);
                    val = decodeURIComponent(val);

                    if (isUndef(ret[key])) {
                        ret[key] = val;
                    } else if (isArr(ret[key])) {
                        ret[key].push(val);
                    } else {
                        ret[key] = [ret[key], val];
                    }
                });
                return ret;
            },
            stringify: function(obj, arrKey) {
                return filter(
                    map(obj, function(val, key) {
                        if (isObj(val) && isEmpty(val)) return '';
                        if (isArr(val)) return exports.stringify(val, key);
                        return (
                            (arrKey
                                ? encodeURIComponent(arrKey)
                                : encodeURIComponent(key)) +
                            '=' +
                            encodeURIComponent(val)
                        );
                    }),
                    function(str) {
                        return str.length > 0;
                    }
                ).join('&');
            }
        };
        var regIllegalChars = /^(\?|#|&)/g;

        return exports;
    })({});

    /* ------------------------------ Url ------------------------------ */

    var Url = _.Url = (function (exports) {
        /* Simple url manipulator.
         *
         * ### constructor
         *
         * |Name        |Desc      |
         * |------------|----------|
         * |url=location|Url string|
         *
         * ### setQuery
         *
         * Set query value.
         *
         * |Name  |Desc       |
         * |------|-----------|
         * |name  |Query name |
         * |val   |Query value|
         * |return|this       |
         *
         * |Name  |Desc        |
         * |------|------------|
         * |query |query object|
         * |return|this        |
         *
         * ### rmQuery
         *
         * Remove query value.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |name  |Query name|
         * |return|this      |
         *
         * ### parse
         *
         * [static] Parse url into an object.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |url   |Url string|
         * |return|Url object|
         *
         * ### stringify
         *
         * [static] Stringify url object into a string.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |url   |Url object|
         * |return|Url string|
         *
         * An url object contains the following properties:
         *
         * |Name    |Desc                                                                                  |
         * |--------|--------------------------------------------------------------------------------------|
         * |protocol|The protocol scheme of the URL (e.g. http:)                                           |
         * |slashes |A boolean which indicates whether the protocol is followed by two forward slashes (//)|
         * |auth    |Authentication information portion (e.g. username:password)                           |
         * |hostname|Host name without port number                                                         |
         * |port    |Optional port number                                                                  |
         * |pathname|URL path                                                                              |
         * |query   |Parsed object containing query string                                                 |
         * |hash    |The "fragment" portion of the URL including the pound-sign (#)                        |
         */

        /* example
         * const url = new Url('http://example.com:8080?eruda=true');
         * console.log(url.port); // -> '8080'
         * url.query.foo = 'bar';
         * url.rmQuery('eruda');
         * url.toString(); // -> 'http://example.com:8080/?foo=bar'
         */

        /* typescript
         * export declare namespace Url {
         *     interface IUrl {
         *         protocol: string;
         *         auth: string;
         *         hostname: string;
         *         hash: string;
         *         query: any;
         *         port: string;
         *         pathname: string;
         *         slashes: boolean;
         *     }
         * }
         * export declare class Url {
         *     protocol: string;
         *     auth: string;
         *     hostname: string;
         *     hash: string;
         *     query: any;
         *     port: string;
         *     pathname: string;
         *     slashes: boolean;
         *     constructor(url?: string);
         *     setQuery(name: string, val: string | number): Url;
         *     setQuery(query: types.PlainObj<string | number>): Url;
         *     rmQuery(name: string | string[]): Url;
         *     toString(): string;
         *     static parse(url: string): Url.IUrl;
         *     static stringify(object: Url.IUrl): string;
         * }
         */

        /* dependencies
         * Class extend trim query isEmpty each isArr toArr isBrowser isObj types toStr 
         */

        exports = Class(
            {
                className: 'Url',
                initialize: function(url) {
                    if (!url && isBrowser) url = window.location.href;
                    extend(this, exports.parse(url || ''));
                },
                setQuery: function(name, val) {
                    var query = this.query;

                    if (isObj(name)) {
                        each(name, function(val, key) {
                            query[key] = toStr(val);
                        });
                    } else {
                        query[name] = toStr(val);
                    }

                    return this;
                },
                rmQuery: function(name) {
                    var query = this.query;
                    if (!isArr(name)) name = toArr(name);
                    each(name, function(key) {
                        delete query[key];
                    });
                    return this;
                },
                toString: function() {
                    return exports.stringify(this);
                }
            },
            {
                parse: function(url) {
                    var ret = {
                        protocol: '',
                        auth: '',
                        hostname: '',
                        hash: '',
                        query: {},
                        port: '',
                        pathname: '',
                        slashes: false
                    };
                    var rest = trim(url);
                    var slashes = false;
                    var proto = rest.match(regProto);

                    if (proto) {
                        proto = proto[0];
                        ret.protocol = proto.toLowerCase();
                        rest = rest.substr(proto.length);
                    }

                    if (proto) {
                        slashes = rest.substr(0, 2) === '//';

                        if (slashes) {
                            rest = rest.slice(2);
                            ret.slashes = true;
                        }
                    }

                    if (slashes) {
                        var host = rest;
                        var hostEnd = -1;

                        for (var i = 0, len = hostEndingChars.length; i < len; i++) {
                            var pos = rest.indexOf(hostEndingChars[i]);
                            if (pos !== -1 && (hostEnd === -1 || pos < hostEnd))
                                hostEnd = pos;
                        }

                        if (hostEnd > -1) {
                            host = rest.slice(0, hostEnd);
                            rest = rest.slice(hostEnd);
                        }

                        var atSign = host.lastIndexOf('@');

                        if (atSign !== -1) {
                            ret.auth = decodeURIComponent(host.slice(0, atSign));
                            host = host.slice(atSign + 1);
                        }

                        ret.hostname = host;
                        var port = host.match(regPort);

                        if (port) {
                            port = port[0];
                            if (port !== ':') ret.port = port.substr(1);
                            ret.hostname = host.substr(0, host.length - port.length);
                        }
                    }

                    var hash = rest.indexOf('#');

                    if (hash !== -1) {
                        ret.hash = rest.substr(hash);
                        rest = rest.slice(0, hash);
                    }

                    var queryMark = rest.indexOf('?');

                    if (queryMark !== -1) {
                        ret.query = query.parse(rest.substr(queryMark + 1));
                        rest = rest.slice(0, queryMark);
                    }

                    ret.pathname = rest || '/';
                    return ret;
                },
                stringify: function(obj) {
                    var ret =
                        obj.protocol +
                        (obj.slashes ? '//' : '') +
                        (obj.auth ? encodeURIComponent(obj.auth) + '@' : '') +
                        obj.hostname +
                        (obj.port ? ':' + obj.port : '') +
                        obj.pathname;
                    if (!isEmpty(obj.query)) ret += '?' + query.stringify(obj.query);
                    if (obj.hash) ret += obj.hash;
                    return ret;
                }
            }
        );
        var regProto = /^([a-z0-9.+-]+:)/i;
        var regPort = /:[0-9]*$/;
        var hostEndingChars = ['/', '?', '#'];

        return exports;
    })({});

    /* ------------------------------ getUrlParam ------------------------------ */
    _.getUrlParam = (function (exports) {
        /* Get url param.
         *
         * |Name        |Desc            |
         * |------------|----------------|
         * |name        |Param name      |
         * |url=location|Url to get param|
         * |return      |Param value     |
         */

        /* example
         * getUrlParam('test', 'http://example.com/?test=true'); // -> 'true'
         */

        /* typescript
         * export declare function getUrlParam(
         *     name: string,
         *     url?: string
         * ): string | undefined;
         */

        /* dependencies
         * Url 
         */

        exports = function(name, url) {
            return new Url(url).query[name];
        };

        return exports;
    })({});

    /* ------------------------------ selector ------------------------------ */

    var selector = _.selector = (function (exports) {
        /* Css selector parser and serializer.
         *
         * ### parse
         *
         * Parse css selector into js object.
         *
         * |Name    |Desc            |
         * |--------|----------------|
         * |selector|Css selector    |
         * |return  |Parsed js object|
         *
         * ### stringify
         *
         * Stringify object into an css selector.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |groups|Object to stringify|
         * |return|Css selector       |
         */

        /* example
         * const groups = selector.parse('#test, input.user[name="licia"]');
         * // -> [[{type: 'id', value: 'test'}],[{type: 'tag', value: 'input'}...]]
         * selector.stringify(groups);
         */

        /* typescript
         * export declare namespace selector {
         *     interface IToken {
         *         type: string;
         *         value: string;
         *     }
         * }
         * export declare const selector: {
         *     parse(selector: string): Array<selector.IToken[]>;
         *     stringify(selector: Array<selector.IToken[]>): string;
         * };
         */

        /* dependencies
         * trim each identity map 
         */ // https://github.com/jquery/sizzle

        var whitespace = '[\\x20\\t\\r\\n\\f]';
        var identifier = '(?:\\\\[\\da-fA-F]{1,6}'.concat(
            whitespace,
            '?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+'
        );
        var attributes = '\\['
            .concat(whitespace, '*(')
            .concat(identifier, ')(?:')
            .concat(whitespace, '*([*^$|!~]?=)')
            .concat(
                whitespace,
                '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|('
            )
            .concat(identifier, '))|)')
            .concat(whitespace, '*\\]');
        var pseudos = '::?('
            .concat(
                identifier,
                ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|'
            )
            .concat(attributes, ')*)|.*)\\)|)');
        var regComma = new RegExp('^'.concat(whitespace, '*,').concat(whitespace, '*'));
        var regCombinators = new RegExp(
            '^'
                .concat(whitespace, '*([>+~]|')
                .concat(whitespace, ')')
                .concat(whitespace, '*')
        );
        var matchExpr = {
            id: {
                reg: new RegExp('^#('.concat(identifier, ')')),
                value: function(raw) {
                    return raw.slice(1);
                },
                toStr: function(value) {
                    return '#'.concat(value);
                }
            },
            class: {
                reg: new RegExp('^\\.('.concat(identifier, ')')),
                value: function(raw) {
                    return raw.slice(1);
                },
                toStr: function(value) {
                    return '.'.concat(value);
                }
            },
            tag: {
                reg: new RegExp('^('.concat(identifier, '|[*])')),
                value: identity
            },
            attribute: {
                reg: new RegExp('^'.concat(attributes)),
                value: function(raw) {
                    return raw.slice(1, raw.length - 1);
                },
                toStr: function(value) {
                    return '['.concat(value, ']');
                }
            },
            pseudo: {
                reg: new RegExp('^'.concat(pseudos)),
                value: identity
            }
        };
        each(matchExpr, function(item) {
            if (!item.value) item.value = identity;
            if (!item.toStr) item.toStr = identity;
        });

        function parse(selector) {
            selector = trim(selector);
            var groups = [];
            var tokens;
            var match;
            var matched;

            while (selector) {
                if (!matched || (match = regComma.exec(selector))) {
                    if (match) {
                        selector = selector.slice(match[0].length);
                    }

                    tokens = [];
                    groups.push(tokens);
                }

                matched = false;

                if ((match = regCombinators.exec(selector))) {
                    matched = match.shift();
                    selector = selector.slice(matched.length);
                    matched = trim(matched);
                    if (!matched) matched = ' ';
                    tokens.push({
                        value: matched,
                        type: 'combinator'
                    });
                }

                each(matchExpr, function(_ref, type) {
                    var reg = _ref.reg,
                        value = _ref.value;

                    if ((match = reg.exec(selector))) {
                        matched = match.shift();
                        selector = selector.slice(matched.length);
                        matched = trim(matched);
                        tokens.push({
                            value: value(matched),
                            type: type
                        });
                    }
                });

                if (!matched) {
                    break;
                }
            }

            return groups;
        }

        function stringify(groups) {
            return map(groups, function(group) {
                group = map(group, function(_ref2) {
                    var type = _ref2.type,
                        value = _ref2.value;

                    if (type === 'combinator') {
                        return value === ' ' ? value : ' '.concat(value, ' ');
                    }

                    return matchExpr[type].toStr(value);
                });
                return group.join('');
            }).join(', ');
        }

        exports = {
            parse: parse,
            stringify: stringify
        };

        return exports;
    })({});

    /* ------------------------------ cssPriority ------------------------------ */
    _.cssPriority = (function (exports) {
        /* Calculate and compare priority of css selector/rule.
         *
         * |Name    |Type           |
         * |--------|---------------|
         * |selector|CSS selector   |
         * |options |Rule extra info|
         * |return  |Priority array |
         *
         * Priority array contains five number values.
         *
         * 1. Important mark
         * 2. Inline style
         * 3. ID selector
         * 4. Class selectors
         * 5. Type selectors
         * 6. Rule position
         *
         * ### compare
         *
         * Compare priorities.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |p1    |Priority to compare|
         * |p2    |Priority to compare|
         * |return|Comparison result  |
         */

        /* example
         * cssPriority('a.button > i.icon:before', {
         *     important: true,
         *     inlineStyle: false,
         *     position: 100
         * }); // -> [1, 0, 0, 2, 3, 100]
         */

        /* typescript
         * export declare namespace cssPriority {
         *     function compare(p1: number[], p2: number[]): number;
         * }
         * export declare function cssPriority(
         *     selector: string,
         *     options?: {
         *         important?: boolean;
         *         inlineStyle?: boolean;
         *         position?: number;
         *     }
         * ): number[];
         */

        /* dependencies
         * selector each startWith contain cmpVersion 
         */ // https://github.com/yibn2008/css-priority

        exports = function(sel) {
            var _ref =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : {},
                _ref$important = _ref.important,
                important = _ref$important === void 0 ? false : _ref$important,
                _ref$inlineStyle = _ref.inlineStyle,
                inlineStyle = _ref$inlineStyle === void 0 ? false : _ref$inlineStyle,
                _ref$position = _ref.position,
                position = _ref$position === void 0 ? 0 : _ref$position;

            var ret = [0, 0, 0, 0, 0, position];
            if (important) ret[0] = 1;
            if (inlineStyle) ret[1] = 1;
            var group = selector.parse(sel)[0];
            each(group, function(_ref2) {
                var type = _ref2.type,
                    value = _ref2.value;

                switch (type) {
                    case 'id':
                        ret[2]++;
                        break;

                    case 'class':
                    case 'attribute':
                        ret[3]++;
                        break;

                    case 'pseudo':
                        if (contain(PSEUDO_ELEMS, value.replace(/:/g, ''))) {
                            ret[4]++;
                        } else if (!startWith(value, '::')) {
                            ret[3]++;
                        }

                        break;

                    case 'tag':
                        if (value !== '*') {
                            ret[4]++;
                        }

                        break;
                }
            });
            return ret;
        };

        var PSEUDO_ELEMS = [
            'first-letter',
            'last-letter',
            'first-line',
            'last-line',
            'first-child',
            'last-child',
            'before',
            'after'
        ];

        exports.compare = function(p1, p2) {
            return cmpVersion(p1.join('.'), p2.join('.'));
        };

        return exports;
    })({});

    /* ------------------------------ sameOrigin ------------------------------ */
    _.sameOrigin = (function (exports) {
        /* Check if two urls pass the same origin policy.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |url1  |Url to check                        |
         * |url2  |Url to check                        |
         * |return|True if urls pass same origin policy|
         */

        /* example
         * const url1 = 'http://example.com/a.html';
         * const url2 = 'http://example.com/b.html';
         * const url3 = 'http://licia.liriliri.io';
         * sameOrigin(url1, url2); // -> true
         * sameOrigin(url1, url3); // -> false
         */

        /* typescript
         * export declare function sameOrigin(url1: string, url2: string): boolean;
         */

        /* dependencies
         * Url 
         */

        exports = function(url1, url2) {
            url1 = new Url(url1);
            url2 = new Url(url2);
            url1.port = url1.port | 0 || (url1.protocol === 'https' ? 443 : 80);
            url2.port = url2.port | 0 || (url2.protocol === 'https' ? 443 : 80);
            return (
                url1.protocol === url2.protocol &&
                url1.hostname === url2.hostname &&
                url1.port === url2.port
            );
        };

        return exports;
    })({});

    /* ------------------------------ sample ------------------------------ */

    var sample = _.sample = (function (exports) {
        /* Sample random values from a collection.
         *
         * |Name  |Desc                  |
         * |------|----------------------|
         * |obj   |Collection to sample  |
         * |n     |Number of values      |
         * |return|Array of sample values|
         */

        /* example
         * sample([2, 3, 1], 2); // -> [2, 3]
         * sample({ a: 1, b: 2, c: 3 }, 1); // -> [2]
         */

        /* typescript
         * export declare function sample(obj: any, n: number): any[];
         */

        /* dependencies
         * isArrLike clone values random swap 
         */

        exports = function(obj, n) {
            var sample = isArrLike(obj) ? clone(obj) : values(obj);
            var len = sample.length;
            n = Math.max(Math.min(n, len), 0);
            var last = len - 1;

            for (var i = 0; i < n; i++) {
                var rand = random(i, last);
                swap(sample, i, rand);
            }

            return sample.slice(0, n);
        };

        return exports;
    })({});

    /* ------------------------------ selectionSort ------------------------------ */
    _.selectionSort = (function (exports) {
        /* Selection sort implementation.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to sort|
         * |cmp   |Comparator   |
         * |return|Sorted array |
         */

        /* example
         * selectionSort([2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function selectionSort(arr: any[], cmp?: types.AnyFn): any[];
         */

        /* dependencies
         * swap isSorted types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : isSorted.defComparator;
            var min;

            for (var i = 0, len = arr.length; i < len; i++) {
                min = i;

                for (var j = i + 1; j < len; j++) {
                    if (cmp(arr[j], arr[min]) < 0) {
                        min = j;
                    }
                }

                if (i != min) {
                    swap(arr, i, min);
                }
            }

            return arr;
        };

        return exports;
    })({});

    /* ------------------------------ shebang ------------------------------ */
    _.shebang = (function (exports) {
        /* Get command from a shebang.
         *
         * |Name  |Desc                 |
         * |------|---------------------|
         * |str   |String to get command|
         * |return|Shebang command      |
         */

        /* example
         * shebang('#!/usr/bin/env node'); // -> '/usr/bin/env node'
         * shebang('#!/bin/bash'); // -> '/bin/bash'
         * shebang('node'); // -> undefined
         */

        /* typescript
         * export declare function shebang(str: string): string | void;
         */

        /* dependencies
         * trim 
         */

        var regShebang = /^#!(.*)/;

        exports = function(str) {
            var match = str.match(regShebang);
            if (!match) return;
            return trim(match[1]);
        };

        return exports;
    })({});

    /* ------------------------------ shellSort ------------------------------ */
    _.shellSort = (function (exports) {
        /* Shell sort implementation.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |arr   |Array to sort|
         * |cmp   |Comparator   |
         * |return|Sorted array |
         */

        /* example
         * shellSort([2, 1]); // -> [1, 2]
         */

        /* typescript
         * export declare function shellSort(arr: any[], cmp?: types.AnyFn): any[];
         */

        /* dependencies
         * swap isSorted types 
         */

        exports = function(arr) {
            var cmp =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : isSorted.defComparator;
            var len = arr.length;
            var gap = Math.floor(len / 2);

            while (gap > 0) {
                for (var i = gap; i <= len - gap; i++) {
                    for (var j = i; j > 0; j -= gap) {
                        if (cmp(arr[j], arr[j - gap]) < 0) {
                            swap(arr, j, j - gap);
                        } else {
                            break;
                        }
                    }
                }

                gap = Math.floor(gap / 2);
            }

            return arr;
        };

        return exports;
    })({});

    /* ------------------------------ shuffle ------------------------------ */
    _.shuffle = (function (exports) {
        /* Randomize the order of the elements in a given array.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |arr   |Array to randomize|
         * |return|Randomized Array  |
         */

        /* example
         * shuffle([1, 2, 3]); // -> [3, 1, 2]
         */

        /* typescript
         * export declare function shuffle(arr: any[]): any[];
         */

        /* dependencies
         * sample 
         */

        exports = function(obj) {
            return sample(obj, Infinity);
        };

        return exports;
    })({});

    /* ------------------------------ sizeof ------------------------------ */
    _.sizeof = (function (exports) {
        /* Get approximate size of a js object.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |obj   |Object to calculate|
         * |return|Size in bytes      |
         *
         * A char of string is counted as 2 bytes. And 4 bytes for boolean, 8 bytes for number.
         *
         * Object keys are treated as strings.
         */

        /* example
         * sizeof('a'); // -> 2
         * sizeof(8); // -> 8
         * sizeof(false); // -> 4
         * sizeof(function() {}); // -> 0
         * sizeof({ a: 'b' }); // -> 4
         */

        /* typescript
         * export declare function sizeof(obj: any): number;
         */

        /* dependencies
         * isArr keys isBuffer isNull 
         */ // https://stackoverflow.com/questions/4905861/memory-usage-of-different-data-types-in-javascript

        var strSize = 2;
        var boolSize = 4;
        var numSize = 8;

        exports = function(obj) {
            return sizeof(obj, {
                values: []
            });
        };

        function sizeof(obj, _ref) {
            var values = _ref.values;
            var t = typeof obj;
            if (t === 'string') return obj.length * strSize;
            if (t === 'number') return numSize;
            if (t === 'boolean') return boolSize;
            var size = 0;

            if (t === 'object' && !isNull(obj)) {
                if (values.indexOf(obj) > -1) {
                    return 0;
                }

                values.push(obj);

                if (isArr(obj)) {
                    for (var i = 0, len = obj.length; i < len; i++) {
                        size += sizeof(obj[i], {
                            values: values
                        });
                    }
                } else {
                    var _keys = keys(obj);

                    for (var _i = 0, _len = _keys.length; _i < _len; _i++) {
                        var key = _keys[_i];
                        size += key.length * strSize;
                        size += sizeof(obj[key], {
                            values: values
                        });
                    }
                }
            }

            if (isBuffer(obj)) return obj.length;
            return size;
        }

        return exports;
    })({});

    /* ------------------------------ sleep ------------------------------ */
    _.sleep = (function (exports) {
        /* Resolve a promise after a specified timeout.
         *
         * |Name   |Desc         |
         * |-------|-------------|
         * |timeout|Sleep timeout|
         */

        /* example
         * (async function() {
         *     await sleep(2000);
         * })();
         */

        /* typescript
         * export declare function sleep(timeout: number): Promise<void>;
         */
        exports = function(timeout) {
            return new Promise(function(resolve) {
                return setTimeout(resolve, timeout);
            });
        };

        return exports;
    })({});

    /* ------------------------------ slugify ------------------------------ */
    _.slugify = (function (exports) {
        /* Slugify a string.
         *
         * |Name       |Desc              |
         * |-----------|------------------|
         * |str        |String to slugify |
         * |replacement|Custom replacement|
         * |return     |Slugified string  |
         */

        /* example
         * slugify('I ♥ pony'); // -> 'I-love-pony'
         * slugify('I ♥ pony', { ' ': '_' }); // -> 'I_love_pony'
         */

        /* typescript
         * export declare function slugify(
         *     str: string,
         *     replacement?: { [index: string]: string }
         * ): string;
         */

        /* dependencies
         * defaults each reduce 
         */

        exports = function(str) {
            var replacement =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            defaults(replacement, defReplacement);
            return reduce(
                str,
                function(result, char) {
                    return result + (replacement[char] || char);
                },
                ''
            ).replace(regForbidden, '');
        };

        var regForbidden = /[^\w\s$*_+~.()'"!\-:@]/g; // https://github.com/simov/slugify

        var REPLACEMENT =
            '$ dollar,% percent,& and,< less,> greater,| or,¢ cent,£ pound,¤ currency,¥ yen,© (c),ª a,® (r),º o,À A,Á A,Â A,Ã A,Ä A,Å A,Æ AE,Ç C,È E,É E,Ê E,Ë E,Ì I,Í I,Î I,Ï I,Ð D,Ñ N,Ò O,Ó O,Ô O,Õ O,Ö O,Ø O,Ù U,Ú U,Û U,Ü U,Ý Y,Þ TH,ß ss,à a,á a,â a,ã a,ä a,å a,æ ae,ç c,è e,é e,ê e,ë e,ì i,í i,î i,ï i,ð d,ñ n,ò o,ó o,ô o,õ o,ö o,ø o,ù u,ú u,û u,ü u,ý y,þ th,ÿ y,Ā A,ā a,Ă A,ă a,Ą A,ą a,Ć C,ć c,Č C,č c,Ď D,ď d,Đ DJ,đ dj,Ē E,ē e,Ė E,ė e,Ę e,ę e,Ě E,ě e,Ğ G,ğ g,Ģ G,ģ g,Ĩ I,ĩ i,Ī i,ī i,Į I,į i,İ I,ı i,Ķ k,ķ k,Ļ L,ļ l,Ľ L,ľ l,Ł L,ł l,Ń N,ń n,Ņ N,ņ n,Ň N,ň n,Ő O,ő o,Œ OE,œ oe,Ŕ R,ŕ r,Ř R,ř r,Ś S,ś s,Ş S,ş s,Š S,š s,Ţ T,ţ t,Ť T,ť t,Ũ U,ũ u,Ū u,ū u,Ů U,ů u,Ű U,ű u,Ų U,ų u,Ź Z,ź z,Ż Z,ż z,Ž Z,ž z,ƒ f,Ơ O,ơ o,Ư U,ư u,ǈ LJ,ǉ lj,ǋ NJ,ǌ nj,Ș S,ș s,Ț T,ț t,˚ o,Ά A,Έ E,Ή H,Ί I,Ό O,Ύ Y,Ώ W,ΐ i,Α A,Β B,Γ G,Δ D,Ε E,Ζ Z,Η H,Θ 8,Ι I,Κ K,Λ L,Μ M,Ν N,Ξ 3,Ο O,Π P,Ρ R,Σ S,Τ T,Υ Y,Φ F,Χ X,Ψ PS,Ω W,Ϊ I,Ϋ Y,ά a,έ e,ή h,ί i,ΰ y,α a,β b,γ g,δ d,ε e,ζ z,η h,θ 8,ι i,κ k,λ l,μ m,ν n,ξ 3,ο o,π p,ρ r,ς s,σ s,τ t,υ y,φ f,χ x,ψ ps,ω w,ϊ i,ϋ y,ό o,ύ y,ώ w,Ё Yo,Ђ DJ,Є Ye,І I,Ї Yi,Ј J,Љ LJ,Њ NJ,Ћ C,Џ DZ,А A,Б B,В V,Г G,Д D,Е E,Ж Zh,З Z,И I,Й J,К K,Л L,М M,Н N,О O,П P,Р R,С S,Т T,У U,Ф F,Х H,Ц C,Ч Ch,Ш Sh,Щ Sh,Ъ U,Ы Y,Ь ,Э E,Ю Yu,Я Ya,а a,б b,в v,г g,д d,е e,ж zh,з z,и i,й j,к k,л l,м m,н n,о o,п p,р r,с s,т t,у u,ф f,х h,ц c,ч ch,ш sh,щ sh,ъ u,ы y,ь ,э e,ю yu,я ya,ё yo,ђ dj,є ye,і i,ї yi,ј j,љ lj,њ nj,ћ c,џ dz,Ґ G,ґ g,฿ baht,ა a,ბ b,გ g,დ d,ე e,ვ v,ზ z,თ t,ი i,კ k,ლ l,მ m,ნ n,ო o,პ p,ჟ zh,რ r,ს s,ტ t,უ u,ფ f,ქ k,ღ gh,ყ q,შ sh,ჩ ch,ც ts,ძ dz,წ ts,ჭ ch,ხ kh,ჯ j,ჰ h,ẞ SS,Ạ A,ạ a,Ả A,ả a,Ấ A,ấ a,Ầ A,ầ a,Ẩ A,ẩ a,Ẫ A,ẫ a,Ậ A,ậ a,Ắ A,ắ a,Ằ A,ằ a,Ẳ A,ẳ a,Ẵ A,ẵ a,Ặ A,ặ a,Ẹ E,ẹ e,Ẻ E,ẻ e,Ẽ E,ẽ e,Ế E,ế e,Ề E,ề e,Ể E,ể e,Ễ E,ễ e,Ệ E,ệ e,Ỉ I,ỉ i,Ị I,ị i,Ọ O,ọ o,Ỏ O,ỏ o,Ố O,ố o,Ồ O,ồ o,Ổ O,ổ o,Ỗ O,ỗ o,Ộ O,ộ o,Ớ O,ớ o,Ờ O,ờ o,Ở O,ở o,Ỡ O,ỡ o,Ợ O,ợ o,Ụ U,ụ u,Ủ U,ủ u,Ứ U,ứ u,Ừ U,ừ u,Ử U,ử u,Ữ U,ữ u,Ự U,ự u,Ỳ Y,ỳ y,Ỵ Y,ỵ y,Ỷ Y,ỷ y,Ỹ Y,ỹ y,‘ \',’ \',“ ",” ",† +,• *,… ...,₠ ecu,₢ cruzeiro,₣ french franc,₤ lira,₥ mill,₦ naira,₧ peseta,₨ rupee,₩ won,₪ new shequel,₫ dong,€ euro,₭ kip,₮ tugrik,₯ drachma,₰ penny,₱ peso,₲ guarani,₳ austral,₴ hryvnia,₵ cedi,₹ indian rupee,₽ russian ruble,₿ bitcoin,℠ sm,™ tm,∂ d,∆ delta,∑ sum,∞ infinity,♥ love,元 yuan,円 yen,﷼ rial';
        var defReplacement = {};
        each(REPLACEMENT.split(','), function(item) {
            item = item.split(' ');
            defReplacement[item[0]] = item[1];
        });
        defReplacement[' '] = '-';

        return exports;
    })({});

    /* ------------------------------ snakeCase ------------------------------ */
    _.snakeCase = (function (exports) {
        /* Convert string to "snakeCase".
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to convert |
         * |return|Snake cased string|
         */

        /* example
         * snakeCase('fooBar'); // -> foo_bar
         * snakeCase('foo bar'); // -> foo_bar
         * snakeCase('foo.bar'); // -> foo_bar
         */

        /* typescript
         * export declare function snakeCase(str: string): string;
         */

        /* dependencies
         * splitCase 
         */

        exports = function(str) {
            return splitCase(str).join('_');
        };

        return exports;
    })({});

    /* ------------------------------ sortBy ------------------------------ */
    _.sortBy = (function (exports) {
        /* Return an array of elements sorted in ascending order by results of running each element through iteratee.
         *
         * |Name             |Desc                      |
         * |-----------------|--------------------------|
         * |arr              |Collection to iterate over|
         * |iterator=identity|Iterator to sort by       |
         * |ctx              |Iterator context          |
         * |return           |New sorted array          |
         */

        /* example
         * sortBy([1, 2, 3, 4, 5, 6], function(num) {
         *     return Math.sin(num);
         * }); // -> [5, 4, 6, 3, 1, 2]
         */

        /* typescript
         * export declare function sortBy(
         *     arr: any,
         *     iterator?: types.AnyFn,
         *     ctx?: any
         * ): any[];
         */

        /* dependencies
         * safeCb pluck map isUndef types 
         */

        exports = function(obj, iteratee, ctx) {
            iteratee = safeCb(iteratee, ctx);
            var idx = 0;
            return pluck(
                map(obj, function(val, key) {
                    return {
                        val: val,
                        idx: idx++,
                        criteria: iteratee(val, key, obj)
                    };
                }).sort(function(left, right) {
                    var a = left.criteria;
                    var b = right.criteria;

                    if (a !== b) {
                        if (a > b || isUndef(a)) return 1;
                        if (a < b || isUndef(b)) return -1;
                    }

                    return left.idx - right.idx;
                }),
                'val'
            );
        };

        return exports;
    })({});

    /* ------------------------------ sortKeys ------------------------------ */
    _.sortKeys = (function (exports) {
        /* Sort keys of an object.
         *
         * |Name   |Desc                   |
         * |-------|-----------------------|
         * |obj    |Object to sort         |
         * |options|Sort options           |
         * |return |Object with sorted keys|
         *
         * Available options:
         *
         * |Name      |Desc                 |
         * |----------|---------------------|
         * |deep=false|Sort keys recursively|
         * |comparator|Comparator           |
         */

        /* example
         * sortKeys(
         *     { b: { d: 2, c: 1 }, a: 0 },
         *     {
         *         deep: true
         *     }
         * ); // -> {a: 0, b: {c: 1, d: 2}}
         */

        /* typescript
         * export declare function sortKeys(
         *     obj: object,
         *     options?: {
         *         deep?: boolean;
         *         comparator?: types.AnyFn;
         *     }
         * ): object;
         */

        /* dependencies
         * isSorted defaults keys isArr isObj types 
         */

        exports = function(obj) {
            var options =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            defaults(options, defOpts);
            var deep = options.deep,
                comparator = options.comparator;
            var visited = [];
            var visitedResult = [];

            function sort(obj) {
                var idx = visited.indexOf(obj);

                if (idx > -1) {
                    return visitedResult[idx];
                }

                var result;

                if (isArr(obj)) {
                    result = [];
                    visited.push(obj);
                    visitedResult.push(result);

                    for (var i = 0, len = obj.length; i < len; i++) {
                        var value = obj[i];

                        if (deep && isObj(value)) {
                            result[i] = sort(value);
                        } else {
                            result[i] = value;
                        }
                    }
                } else {
                    result = {};
                    visited.push(obj);
                    visitedResult.push(result);

                    var _keys = keys(obj).sort(comparator);

                    for (var _i = 0, _len = _keys.length; _i < _len; _i++) {
                        var key = _keys[_i];
                        var _value = obj[key];

                        if (deep && isObj(_value)) {
                            result[key] = sort(_value);
                        } else {
                            result[key] = _value;
                        }
                    }
                }

                return result;
            }

            return sort(obj);
        };

        var defOpts = {
            deep: false,
            comparator: isSorted.defComparator
        };

        return exports;
    })({});

    /* ------------------------------ spaceCase ------------------------------ */
    _.spaceCase = (function (exports) {
        /* Convert string to "spaceCase".
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to convert |
         * |return|Space cased string|
         */

        /* example
         * spaceCase('fooBar'); // -> foo bar
         * spaceCase('foo.bar'); // -> foo bar
         * spaceCase('foo.bar'); // -> foo bar
         */

        /* typescript
         * export declare function spaceCase(str: string): string;
         */

        /* dependencies
         * splitCase 
         */

        exports = function(str) {
            return splitCase(str).join(' ');
        };

        return exports;
    })({});

    /* ------------------------------ splitPath ------------------------------ */
    _.splitPath = (function (exports) {
        /* Split path into dir, name and ext.
         *
         * |Name  |Desc                               |
         * |------|-----------------------------------|
         * |path  |Path to split                      |
         * |return|Object containing dir, name and ext|
         */

        /* example
         * splitPath('f:/foo/bar.txt'); // -> {dir: 'f:/foo/', name: 'bar.txt', ext: '.txt'}
         * splitPath('/home/foo/bar.txt'); // -> {dir: '/home/foo/', name: 'bar.txt', ext: '.txt'}
         */

        /* typescript
         * export declare function splitPath(
         *     path: string
         * ): {
         *     dir: string;
         *     name: string;
         *     ext: string;
         * };
         */
        exports = function(path) {
            var match = path.match(regSplit);
            return {
                dir: match[1],
                name: match[2],
                ext: match[3]
            };
        };

        var regSplit = /^([\s\S]*?)((?:\.{1,2}|[^\\/]+?|)(\.[^./\\]*|))(?:[\\/]*)$/;

        return exports;
    })({});

    /* ------------------------------ stripAnsi ------------------------------ */

    var stripAnsi = _.stripAnsi = (function (exports) {
        /* Strip ansi codes from a string.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |str   |String to strip|
         * |return|Result string  |
         */

        /* example
         * stripAnsi('\u001b[4mcake\u001b[0m'); // -> 'cake'
         */

        /* typescript
         * export declare function stripAnsi(str: string): string;
         */

        /* eslint-disable no-control-regex */
        var regAnsi = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

        exports = function(str) {
            return str.replace(regAnsi, '');
        };

        return exports;
    })({});

    /* ------------------------------ strWidth ------------------------------ */

    var strWidth = _.strWidth = (function (exports) {
        /* Get string's visual width.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |str   |String to get width|
         * |return|Visual width       |
         */

        /* example
         * strWidth('Hello \nworld!'); // -> 12
         * strWidth('\u001b[4m你好，世界！\u001b[0m'); // -> 12
         */

        /* typescript
         * export declare function strWidth(str: string): number;
         */

        /* dependencies
         * stripAnsi isFullWidth 
         */

        exports = function(str) {
            str = stripAnsi(str);
            var width = 0;

            for (var i = 0, len = str.length; i < len; i++) {
                var c = str.codePointAt(i); // Control character

                if (c <= 31 || c === 127) {
                    continue;
                }

                width += isFullWidth(c) ? 2 : 1;
            }

            return width;
        };

        return exports;
    })({});

    /* ------------------------------ table ------------------------------ */

    var table = _.table = (function (exports) {
        /* Output table string.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |rows  |Table data  |
         * |return|Table string|
         */

        /* example
         * table([
         *     ['', 'firstName', 'lastName'],
         *     ['daughter', 'Emily', 'Smith'],
         *     ['father', 'John', 'Smith'],
         *     ['mother', 'Jane', 'Smith']
         * ]);
         */

        /* typescript
         * export declare function table(rows: Array<string[]>): string;
         */

        /* dependencies
         * each strWidth map repeat cloneDeep 
         */

        exports = function(rows) {
            rows = cloneDeep(rows);
            var options = {
                border: defBorder
            };
            options.columns = getColumns(rows);
            padData(rows, options);
            return render(rows, options);
        };

        function padData(rows, options) {
            var columnCount = options.columns.length;

            for (var i = 0, len = rows.length; i < len; i++) {
                while (rows[i].length < columnCount) {
                    rows[i].push('');
                }
            }

            return loopData(rows, function(data, row, column) {
                var _options$columns$colu = options.columns[column],
                    paddingLeft = _options$columns$colu.paddingLeft,
                    width = _options$columns$colu.width,
                    paddingRight = _options$columns$colu.paddingRight;
                return (
                    repeat(' ', paddingLeft) +
                    data +
                    repeat(' ', width - strWidth(data) - paddingRight)
                );
            });
        }

        function loopData(rows, handler) {
            for (var i = 0, len = rows.length; i < len; i++) {
                var row = rows[i];

                for (var j = 0, _len = row.length; j < _len; j++) {
                    var data = handler(row[j], i, j);

                    if (data) {
                        row[j] = data;
                    }
                }
            }
        }

        function getColumns(rows) {
            var columns = [];
            var paddingLeft = 1;
            var paddingRight = 1;
            loopData(rows, function(data, row, column) {
                columns[column] = columns[column] || {
                    width: paddingLeft + paddingRight,
                    paddingLeft: paddingLeft,
                    paddingRight: paddingRight
                };
                var width = strWidth(data) + paddingLeft + paddingRight;

                if (width > columns[column].width) {
                    columns[column].width = width;
                }
            });
            return columns;
        }

        function render(rows, options) {
            var ret = '';
            ret += renderBorder('top', options);
            each(rows, function(row, idx) {
                ret += renderRow(row, options);

                if (idx === rows.length - 1) {
                    ret += renderBorder('bottom', options);
                } else {
                    ret += renderBorder('join', options);
                }
            });
            return ret;
        }

        function renderRow(columns, options) {
            var border = options.border;
            return (
                border.bodyLeft +
                columns.join(border.bodyJoin) +
                border.bodyRight +
                '\n'
            );
        }

        function renderBorder(type, options) {
            var border = options.border,
                columns = options.columns;
            var left = border[type + 'Left'];
            var right = border[type + 'Right'];
            var body = border[type + 'Body'];
            var join = border[type + 'Join'];
            var ret = map(columns, function(column) {
                return repeat(body, column.width);
            }).join(join);
            ret = left + ret + right;

            if (type !== 'bottom') {
                ret += '\n';
            }

            return ret;
        }

        var defBorder = {
            topBody: '─',
            topJoin: '┬',
            topLeft: '┌',
            topRight: '┐',
            bottomBody: '─',
            bottomJoin: '┴',
            bottomLeft: '└',
            bottomRight: '┘',
            bodyLeft: '│',
            bodyRight: '│',
            bodyJoin: '│',
            joinBody: '─',
            joinLeft: '├',
            joinRight: '┤',
            joinJoin: '┼'
        };

        return exports;
    })({});

    /* ------------------------------ Benchmark ------------------------------ */
    _.Benchmark = (function (exports) {
        /* JavaScript Benchmark.
         *
         * ### constructor
         *
         * |Name   |Desc                  |
         * |-------|----------------------|
         * |fn     |Code for speed testing|
         * |options|Benchmark options     |
         *
         * Available options:
         *
         * |Name        |Desc                              |
         * |------------|----------------------------------|
         * |minTime=50  |Time needed to reduce uncertainty |
         * |maxTime=5000|Maximum time for running benchmark|
         * |minSamples=5|Minimum sample size               |
         * |delay=5     |Delay between test cycles         |
         * |name        |Benchmark name                    |
         *
         * ### run
         *
         * Run benchmark, returns a promise.
         *
         * ### all
         *
         * [static] Run some benchmarks.
         */

        /* example
         * const benchmark = new Benchmark(
         *     function test() {
         *         !!'Hello World!'.match(/o/);
         *     },
         *     {
         *         maxTime: 1500
         *     }
         * );
         * benchmark.run().then(result => {
         *     console.log(String(result));
         * });
         * Benchmark.all([
         *     function regExp() {
         *         /o/.test('Hello World!');
         *     },
         *     function indexOf() {
         *         'Hello World!'.indexOf('o') > -1;
         *     },
         *     function match() {
         *         !!'Hello World!'.match(/o/);
         *     }
         * ]).then(results => {
         *     console.log(String(results));
         * });
         */

        /* typescript
         * export declare namespace Benchmark {
         *     interface IOptions {
         *         minTime?: number;
         *         maxTime?: number;
         *         minSamples?: number;
         *         delay?: number;
         *         name?: string;
         *     }
         *     interface IResult {
         *         name: string;
         *         mean: number;
         *         variance: number;
         *         deviation: number;
         *         sem: number;
         *         moe: number;
         *         rme: number;
         *         hz: number;
         *         sample: number[];
         *     }
         * }
         * export declare class Benchmark {
         *     constructor(fn: types.AnyFn, options?: Benchmark.IOptions);
         *     run(): Promise<Benchmark.IResult>;
         *     static all(
         *         benches: Array<types.AnyFn | Benchmark>,
         *         options?: Benchmark.IOptions
         *     ): Promise<Benchmark.IResult[]>;
         * }
         */

        /* dependencies
         * Class defaults Promise perfNow delay average reduce each map table toStr types 
         */

        exports = Class(
            {
                initialize: function Benchmark(fn) {
                    var options =
                        arguments.length > 1 && arguments[1] !== undefined
                            ? arguments[1]
                            : {};
                    defaults(options, defOpts);
                    this._fn = fn;
                    this._isRunning = false;
                    this._options = options;
                },
                run: function() {
                    var _this = this;

                    if (this._isRunning) {
                        return this._pendingPromise;
                    }

                    this._reset();

                    this._isRunning = true;
                    var options = this._options;
                    var pendingPromise = new Promise(function(resolve, reject) {
                        var runSample = function() {
                            var initCount =
                                arguments.length > 0 && arguments[0] !== undefined
                                    ? arguments[0]
                                    : 1;
                            delay(function() {
                                _this
                                    ._runSample(initCount)
                                    .then(function(_ref) {
                                        var period = _ref.period,
                                            count = _ref.count;
                                        var sample = _this._sample;
                                        sample.push(period);

                                        if (
                                            perfNow() - _this._timeStamp <
                                                options.maxTime ||
                                            sample.length < options.minSamples
                                        ) {
                                            runSample(count);
                                        } else {
                                            resolve(_this._calcResult());
                                        }
                                    })
                                    .catch(function(err) {
                                        reject(err);
                                    });
                            }, options.delay);
                        };

                        runSample();
                    });

                    function complete() {
                        this._isRunning = false;
                        delete this._pendingPromise;
                    }

                    pendingPromise.then(complete).catch(complete);
                    this._pendingPromise = pendingPromise;
                    return pendingPromise;
                },
                _reset: function() {
                    this._timeStamp = perfNow();
                    this._sample = [];
                },
                _calcResult: function() {
                    var sample = this._sample;
                    var result = {
                        sample: sample,
                        toString: function() {
                            var hz = this.hz,
                                rme = this.rme,
                                name = this.name;
                            var size = this.sample.length;
                            return ''
                                .concat(name, ' x ')
                                .concat(
                                    formatNumber(hz.toFixed(hz < 100 ? 2 : 0)),
                                    ' ops/sec \xB1'
                                )
                                .concat(rme.toFixed(2), '% (')
                                .concat(size, ' run')
                                .concat(size === 1 ? '' : 's', ' sampled)');
                        }
                    };
                    var size = sample.length;
                    result.name = this._options.name || this._fn.name || 'anonymous';
                    result.mean = average.apply(null, sample);

                    function varOf(sum, x) {
                        return sum + Math.pow(x - result.mean, 2);
                    }

                    result.variance = reduce(sample, varOf, 0) / (size - 1) || 0;
                    result.deviation = Math.sqrt(result.variance);
                    result.sem = result.deviation / Math.sqrt(size);
                    var critical = tTable[Math.round(size - 1) || 1] || tTable.infinity;
                    result.moe = result.sem * critical;
                    result.rme = (result.moe / result.mean) * 100 || 0;
                    result.hz = 1000 / result.mean;
                    return result;
                },
                _runSample: function(count) {
                    var _this2 = this;

                    var options = this._options;
                    var minTime = options.minTime;
                    return new Promise(function(resolve, reject) {
                        var runCycle = function(count) {
                            delay(function() {
                                var elapsed = 0;

                                try {
                                    elapsed = _this2._runCycle(count);
                                } catch (e) {
                                    return reject(e);
                                }

                                var period = elapsed / count;

                                if (elapsed < minTime) {
                                    if (elapsed === 0) {
                                        count *= 100;
                                    } else {
                                        count += Math.ceil(
                                            (minTime - elapsed) / period
                                        );
                                    }

                                    runCycle(count);
                                } else {
                                    resolve({
                                        count: count,
                                        period: period
                                    });
                                }
                            }, options.delay);
                        };

                        runCycle(count);
                    });
                },
                _runCycle: function(count) {
                    var fn = this._fn;
                    var now = perfNow();

                    while (count--) {
                        fn();
                    }

                    return perfNow() - now;
                }
            },
            {
                all: function(benches, options) {
                    var promises = [];
                    each(benches, function(bench) {
                        if (!(bench instanceof exports)) {
                            bench = new exports(bench, options);
                        }

                        promises.push(bench.run());
                    });
                    return Promise.all(promises).then(function(results) {
                        results.toString = function() {
                            var data = map(results, function(_ref2, idx) {
                                var name = _ref2.name,
                                    sample = _ref2.sample,
                                    hz = _ref2.hz,
                                    rme = _ref2.rme;
                                var columns = [];
                                var size = sample.length;
                                columns.push(
                                    toStr(idx + 1),
                                    name || 'anonymous',
                                    formatNumber(hz.toFixed(hz < 100 ? 2 : 0)),
                                    '\xB1'.concat(rme.toFixed(2), '%'),
                                    ''
                                        .concat(size, ' run')
                                        .concat(size === 1 ? '' : 's')
                                );
                                return columns;
                            });
                            data.unshift([
                                'index',
                                'name',
                                'ops/sec',
                                'rme',
                                'sampled'
                            ]);
                            return table(data);
                        };

                        return results;
                    });
                }
            }
        );
        var defOpts = {
            minTime: 50,
            maxTime: 5000,
            minSamples: 5,
            delay: 5,
            name: ''
        };
        var tTable = {
            '1': 12.706,
            '2': 4.303,
            '3': 3.182,
            '4': 2.776,
            '5': 2.571,
            '6': 2.447,
            '7': 2.365,
            '8': 2.306,
            '9': 2.262,
            '10': 2.228,
            '11': 2.201,
            '12': 2.179,
            '13': 2.16,
            '14': 2.145,
            '15': 2.131,
            '16': 2.12,
            '17': 2.11,
            '18': 2.101,
            '19': 2.093,
            '20': 2.086,
            '21': 2.08,
            '22': 2.074,
            '23': 2.069,
            '24': 2.064,
            '25': 2.06,
            '26': 2.056,
            '27': 2.052,
            '28': 2.048,
            '29': 2.045,
            '30': 2.042,
            infinity: 1.96
        };

        function formatNumber(number) {
            number = String(number).split('.');
            return (
                number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') +
                (number[1] ? '.' + number[1] : '')
            );
        }

        return exports;
    })({});

    /* ------------------------------ stringify ------------------------------ */
    _.stringify = (function (exports) {
        /* JSON stringify with support for circular object, function etc.
         *
         * Undefined is treated as null value.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |obj   |Object to stringify|
         * |spaces|Indent spaces      |
         * |return|Stringified object |
         */

        /* example
         * stringify({ a: function() {} }); // -> '{"a":"[Function function () {}]"}'
         * const obj = { a: 1, b: {} };
         * obj.b = obj;
         * stringify(obj); // -> '{"a":1,"b":"[Circular ~]"}'
         */

        /* typescript
         * export declare function stringify(obj: any, spaces?: number): string;
         */

        /* dependencies
         * type upperFirst toStr isUndef isFn isRegExp 
         */

        exports = function(obj, spaces) {
            return JSON.stringify(obj, serializer(), spaces);
        };

        function serializer() {
            var stack = [];
            var keys = [];
            return function(key, val) {
                if (stack.length > 0) {
                    var pos = stack.indexOf(this);

                    if (pos > -1) {
                        stack.splice(pos + 1);
                        keys.splice(pos, Infinity, key);
                    } else {
                        stack.push(this);
                        keys.push(key);
                    }

                    var valPos = stack.indexOf(val);

                    if (valPos > -1) {
                        if (stack[0] === val) {
                            val = '[Circular ~]';
                        } else {
                            val =
                                '[Circular ~.' + keys.slice(0, valPos).join('.') + ']';
                        }
                    }
                } else {
                    stack.push(val);
                }

                if (isRegExp(val) || isFn(val)) {
                    val = '[' + upperFirst(type(val)) + ' ' + toStr(val) + ']';
                } else if (isUndef(val)) {
                    val = null;
                }

                return val;
            };
        }

        return exports;
    })({});

    /* ------------------------------ stringifyAll ------------------------------ */
    _.stringifyAll = (function (exports) {
        /* Stringify object into json with types.
         *
         * |Name   |Desc               |
         * |-------|-------------------|
         * |obj    |Object to stringify|
         * |options|Stringify options  |
         * |return |Stringified object |
         *
         * Available options:
         *
         * |Name              |Desc                     |
         * |------------------|-------------------------|
         * |unenumerable=false|Include unenumerable keys|
         * |symbol=false      |Include symbol keys      |
         * |accessGetter=false|Access getter value      |
         * |timeout=0         |Timeout of stringify     |
         * |depth=0           |Max depth of recursion   |
         * |ignore            |Values to ignore         |
         *
         * When time is out, all remaining values will all be "Timeout".
         *
         * ### parse
         *
         * Parse result string back to object.
         *
         * |Name  |Type           |
         * |------|---------------|
         * |obj   |String to parse|
         * |return|Result object  |
         */

        /* example
         * stringifyAll(function test() {}); // -> '{"value":"function test() {}","type":"Function",...}'
         */

        /* typescript
         * export declare namespace stringifyAll {
         *     function parse(str: string): any;
         * }
         * export declare function stringifyAll(
         *     obj: any,
         *     options?: {
         *         unenumerable?: boolean;
         *         symbol?: boolean;
         *         accessGetter?: boolean;
         *         timeout?: number;
         *         depth?: number;
         *         ignore?: any[];
         *     }
         * ): string;
         */

        /* dependencies
         * escapeJsStr type toStr endWith toSrc keys each Class getProto difference extend isPromise filter now allKeys contain isObj isMiniProgram create startWith safeSet defineProp pick isArrLike 
         */

        exports = function(obj) {
            var _ref =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : {},
                self = _ref.self,
                _ref$startTime = _ref.startTime,
                startTime = _ref$startTime === void 0 ? now() : _ref$startTime,
                _ref$timeout = _ref.timeout,
                timeout = _ref$timeout === void 0 ? 0 : _ref$timeout,
                _ref$depth = _ref.depth,
                depth = _ref$depth === void 0 ? 0 : _ref$depth,
                _ref$curDepth = _ref.curDepth,
                curDepth = _ref$curDepth === void 0 ? 1 : _ref$curDepth,
                _ref$visitor = _ref.visitor,
                visitor = _ref$visitor === void 0 ? new Visitor() : _ref$visitor,
                _ref$unenumerable = _ref.unenumerable,
                unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
                _ref$symbol = _ref.symbol,
                symbol = _ref$symbol === void 0 ? false : _ref$symbol,
                _ref$accessGetter = _ref.accessGetter,
                accessGetter = _ref$accessGetter === void 0 ? false : _ref$accessGetter,
                _ref$ignore = _ref.ignore,
                ignore = _ref$ignore === void 0 ? [] : _ref$ignore;

            var json = '';
            var options = {
                visitor: visitor,
                unenumerable: unenumerable,
                symbol: symbol,
                accessGetter: accessGetter,
                depth: depth,
                curDepth: curDepth + 1,
                timeout: timeout,
                startTime: startTime,
                ignore: ignore
            };
            var t = type(obj, false);

            if (t === 'String') {
                json = wrapStr(obj);
            } else if (t === 'Number') {
                json = toStr(obj);

                if (endWith(json, 'Infinity')) {
                    json = '{"value":"'.concat(json, '","type":"Number"}');
                }
            } else if (t === 'NaN') {
                json = '{"value":"NaN","type":"Number"}';
            } else if (t === 'Boolean') {
                json = obj ? 'true' : 'false';
            } else if (t === 'Null') {
                json = 'null';
            } else if (t === 'Undefined') {
                json = '{"type":"Undefined"}';
            } else if (t === 'Symbol') {
                var val = 'Symbol';

                try {
                    val = toStr(obj);
                    /* eslint-disable no-empty */
                } catch (e) {}

                json = '{"value":'.concat(wrapStr(val), ',"type":"Symbol"}');
            } else {
                if (timeout && now() - startTime > timeout) {
                    return wrapStr('Timeout');
                }

                if (depth && curDepth > depth) {
                    return wrapStr('{...}');
                }

                json = '{';
                var parts = [];
                var visitedObj = visitor.get(obj);
                var id;

                if (visitedObj) {
                    id = visitedObj.id;
                    parts.push('"reference":'.concat(id));
                } else {
                    id = visitor.set(obj);
                    parts.push('"id":'.concat(id));
                }

                parts.push('"type":"'.concat(t, '"'));

                if (endWith(t, 'Function')) {
                    parts.push('"value":'.concat(wrapStr(toSrc(obj))));
                } else if (t === 'RegExp') {
                    parts.push('"value":'.concat(wrapStr(obj)));
                }

                if (!visitedObj) {
                    var enumerableKeys = keys(obj);

                    if (enumerableKeys.length) {
                        parts.push(
                            iterateObj(
                                'enumerable',
                                enumerableKeys,
                                self || obj,
                                options
                            )
                        );
                    }

                    if (unenumerable) {
                        var unenumerableKeys = difference(
                            allKeys(obj, {
                                prototype: false,
                                unenumerable: true
                            }),
                            enumerableKeys
                        );

                        if (unenumerableKeys.length) {
                            parts.push(
                                iterateObj(
                                    'unenumerable',
                                    unenumerableKeys,
                                    self || obj,
                                    options
                                )
                            );
                        }
                    }

                    if (symbol) {
                        var symbolKeys = filter(
                            allKeys(obj, {
                                prototype: false,
                                symbol: true
                            }),
                            function(key) {
                                return typeof key === 'symbol';
                            }
                        );

                        if (symbolKeys.length) {
                            parts.push(
                                iterateObj('symbol', symbolKeys, self || obj, options)
                            );
                        }
                    }

                    var prototype = getProto(obj);

                    if (prototype && !contain(ignore, prototype)) {
                        var proto = '"proto":'.concat(
                            exports(
                                prototype,
                                extend(options, {
                                    self: self || obj
                                })
                            )
                        );
                        parts.push(proto);
                    }
                }

                json += parts.join(',') + '}';
            }

            return json;
        };

        function iterateObj(name, keys, obj, options) {
            var parts = [];
            each(keys, function(key) {
                var val;
                var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                var hasGetter = descriptor && descriptor.get;
                var hasSetter = descriptor && descriptor.set;

                if (!options.accessGetter && hasGetter) {
                    val = '(...)';
                } else {
                    try {
                        val = obj[key];

                        if (contain(options.ignore, val)) {
                            return;
                        }

                        if (isPromise(val)) {
                            val.catch(function() {});
                        }
                    } catch (e) {
                        val = e.message;
                    }
                }

                parts.push(''.concat(wrapKey(key), ':').concat(exports(val, options)));

                if (hasGetter) {
                    parts.push(
                        ''
                            .concat(wrapKey('get ' + toStr(key)), ':')
                            .concat(exports(descriptor.get, options))
                    );
                }

                if (hasSetter) {
                    parts.push(
                        ''
                            .concat(wrapKey('set ' + toStr(key)), ':')
                            .concat(exports(descriptor.set, options))
                    );
                }
            });
            return '"'.concat(name, '":{') + parts.join(',') + '}';
        }

        function wrapKey(key) {
            return '"'.concat(escapeJsonStr(key), '"');
        }

        function wrapStr(str) {
            return '"'.concat(escapeJsonStr(toStr(str)), '"');
        }

        function escapeJsonStr(str) {
            return escapeJsStr(str)
                .replace(/\\'/g, "'")
                .replace(/\t/g, '\\t');
        }

        var Visitor = Class({
            initialize: function() {
                this.id = 1;
                this.visited = [];
            },
            set: function(val) {
                var visited = this.visited,
                    id = this.id;
                var obj = {
                    id: id,
                    val: val
                };
                visited.push(obj);
                this.id++;
                return id;
            },
            get: function(val) {
                var visited = this.visited;

                for (var i = 0, len = visited.length; i < len; i++) {
                    var obj = visited[i];
                    if (val === obj.val) return obj;
                }

                return false;
            }
        });

        exports.parse = function(str) {
            var map = {};
            var obj = parse(JSON.parse(str), {
                map: map
            });
            correctReference(map);
            return obj;
        };

        function correctReference(map) {
            each(map, function(obj) {
                var enumerableKeys = keys(obj);

                for (var i = 0, len = enumerableKeys.length; i < len; i++) {
                    var key = enumerableKeys[i];

                    if (isObj(obj[key])) {
                        var reference = obj[key].reference;

                        if (reference && map[reference]) {
                            obj[key] = map[reference];
                        }
                    }
                }

                var proto = getProto(obj);

                if (proto && proto.reference) {
                    if (map[proto.reference]) {
                        Object.setPrototypeOf(obj, map[proto.reference]);
                    }
                }
            });
        }

        function parse(obj, options) {
            var map = options.map;

            if (!isObj(obj)) {
                return obj;
            }

            var id = obj.id,
                type = obj.type,
                value = obj.value,
                proto = obj.proto,
                reference = obj.reference;
            var enumerable = obj.enumerable,
                unenumerable = obj.unenumerable;

            if (reference) {
                return obj;
            }

            if (type === 'Number') {
                if (value === 'Infinity') {
                    return Number.POSITIVE_INFINITY;
                } else if (value === '-Infinity') {
                    return Number.NEGATIVE_INFINITY;
                }

                return NaN;
            } else if (type === 'Undefined') {
                return undefined;
            }

            var newObj;

            if (type === 'Function') {
                newObj = function() {};

                newObj.toString = function() {
                    return value;
                };

                if (proto) {
                    Object.setPrototypeOf(newObj, parse(proto, options));
                }
            } else if (type === 'RegExp') {
                newObj = strToRegExp(value);
            } else {
                if (type !== 'Object') {
                    var Fn;

                    if (!isMiniProgram) {
                        Fn = new Function(type, '');
                    } else {
                        Fn = function() {};
                    }

                    if (proto) {
                        Fn.prototype = parse(proto, options);
                    }

                    newObj = new Fn();
                } else {
                    if (proto) {
                        newObj = create(parse(proto, options));
                    } else {
                        newObj = create(null);
                    }
                }
            }

            var defineProps = {};

            if (enumerable) {
                var len;

                if (isArrLike(enumerable)) {
                    len = enumerable.length;
                    delete enumerable.length;
                }

                enumerable = pick(enumerable, function(value, key) {
                    return !handleGetterSetter(enumerable, value, key);
                });
                each(enumerable, function(value, key) {
                    var defineProp = defineProps[key] || {};

                    if (!defineProp.get) {
                        newObj[key] = parse(value, options);
                    }
                });

                if (len) {
                    newObj.length = len;
                }
            }

            if (unenumerable) {
                unenumerable = pick(unenumerable, function(value, key) {
                    return !handleGetterSetter(unenumerable, value, key);
                });
                each(unenumerable, function(value, key) {
                    var defineProp = defineProps[key] || {};

                    if (!defineProp.get) {
                        value = parse(value, options);

                        if (isObj(value) && value.reference) {
                            var _reference = value.reference;

                            value = function() {
                                return map[_reference];
                            };

                            defineProp.get = value;
                        } else {
                            defineProp.value = value;
                        }
                    }

                    defineProp.enumerable = false;
                    defineProps[key] = defineProp;
                });
            }

            defineProp(newObj, defineProps);

            function handleGetterSetter(obj, val, key) {
                key = toStr(key);
                var isGetterAndSetter = false;
                each(['get', 'set'], function(type) {
                    if (startWith(key, type + ' ')) {
                        var realKey = key.replace(type + ' ', '');

                        if (obj[realKey]) {
                            val = parse(val, options);

                            if (val === 'Timeout') {
                                val = retTimeout;
                            }

                            safeSet(defineProps, [realKey, type], val);
                            isGetterAndSetter = true;
                        }
                    }
                });
                return isGetterAndSetter;
            }

            map[id] = newObj;
            return newObj;
        }

        function retTimeout() {
            return 'Timeout';
        }

        function strToRegExp(str) {
            var lastSlash = str.lastIndexOf('/');
            return new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
        }

        return exports;
    })({});

    /* ------------------------------ stripColor ------------------------------ */
    _.stripColor = (function (exports) {
        /* Strip ansi color codes from a string.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |str   |String to strip|
         * |return|Result string  |
         */

        /* example
         * stripColor('\u001b[31mred\u001b[39m'); // -> 'red'
         */

        /* typescript
         * export declare function stripColor(str: string): string;
         */

        /* eslint-disable no-control-regex */
        var regColor = /\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g;

        exports = function(str) {
            return str.replace(regColor, '');
        };

        return exports;
    })({});

    /* ------------------------------ stripHtmlTag ------------------------------ */
    _.stripHtmlTag = (function (exports) {
        /* Strip html tags from a string.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |str   |String to strip|
         * |return|Result string  |
         */

        /* example
         * stripHtmlTag('<p>Hello</p>'); // -> 'Hello'
         */

        /* typescript
         * export declare function stripHtmlTag(str: string): string;
         */
        var regHtmlTag = /<[^>]*>/g;

        exports = function(str) {
            return str.replace(regHtmlTag, '');
        };

        return exports;
    })({});

    /* ------------------------------ stripIndent ------------------------------ */
    _.stripIndent = (function (exports) {
        /* Strip indentation from multi-line strings.
         *
         * |Name  |Desc           |
         * |------|---------------|
         * |str   |String to strip|
         * |return|Result string  |
         *
         * It can be used as function or template tag.
         */

        /* example
         * stripIndent`
         *     Test string
         *         * item one
         *         * item two
         * `; // -> 'Test string\n    * item one\n    * item two'
         */

        /* typescript
         * export declare function stripIndent(str: string): string;
         * export declare function stripIndent(
         *     literals: TemplateStringsArray,
         *     ...placeholders: any[]
         * ): string;
         */

        /* dependencies
         * isStr toArr min map trim 
         */

        exports = function(literals) {
            if (isStr(literals)) literals = toArr(literals);
            var str = '';

            for (
                var _len = arguments.length,
                    placeholders = new Array(_len > 1 ? _len - 1 : 0),
                    _key = 1;
                _key < _len;
                _key++
            ) {
                placeholders[_key - 1] = arguments[_key];
            }

            for (var i = 0, len = literals.length; i < len; i++) {
                str += literals[i];
                if (placeholders[i]) str += placeholders[i];
            }

            var lines = str.split('\n');
            var indentLens = [];

            for (var _i = 0, _len2 = lines.length; _i < _len2; _i++) {
                var line = lines[_i];

                var _indent = line.match(regStartSpaces);

                if (_indent) {
                    indentLens.push(_indent[1].length);
                }
            }

            var indent = indentLens.length > 0 ? min.apply(null, indentLens) : 0;
            return trim(
                map(lines, function(line) {
                    return line[0] === ' ' ? line.slice(indent) : line;
                }).join('\n')
            );
        };

        var regStartSpaces = /^(\s+)\S+/;

        return exports;
    })({});

    /* ------------------------------ stripNum ------------------------------ */
    _.stripNum = (function (exports) {
        /* Strip number to a specified precision.
         *
         * |Name        |Desc           |
         * |------------|---------------|
         * |num         |Number to strip|
         * |precision=12|Precision      |
         * |return      |Result number  |
         */

        /* example
         * stripNum(0.1 + 0.2); // -> 0.3
         */

        /* typescript
         * export declare function stripNum(num: number, precision?: number): number;
         */
        exports = function(num) {
            var precision =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;
            return parseFloat(num.toPrecision(precision));
        };

        return exports;
    })({});

    /* ------------------------------ sum ------------------------------ */
    _.sum = (function (exports) {
        /* Compute sum of given numbers.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |...num|Numbers to calculate|
         * |return|Sum of numbers      |
         */

        /* example
         * sum(1, 2, 5); // -> 8
         */

        /* typescript
         * export declare function sum(...num: number[]): number;
         */
        exports = function() {
            var arr = arguments;
            var ret = 0;

            for (var i = 0, len = arr.length; i < len; i++) {
                ret += arr[i];
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ throttle ------------------------------ */
    _.throttle = (function (exports) {
        /* Return a new throttled version of the passed function.
         *
         * |Name  |Desc                           |
         * |------|-------------------------------|
         * |fn    |Function to throttle           |
         * |wait  |Number of milliseconds to delay|
         * |return|New throttled function         |
         */

        /* example
         * const updatePos = throttle(function() {}, 100);
         * // $(window).scroll(updatePos);
         */

        /* typescript
         * export declare function throttle<T extends types.AnyFn>(fn: T, wait: number): T;
         */

        /* dependencies
         * debounce types 
         */

        exports = function(fn, wait) {
            return debounce(fn, wait, true);
        };

        return exports;
    })({});

    /* ------------------------------ timeAgo ------------------------------ */
    _.timeAgo = (function (exports) {
        /* Format datetime with *** time ago statement.
         *
         * |Name        |Desc                     |
         * |------------|-------------------------|
         * |date        |Date to calculate        |
         * |now=new Date|Current date             |
         * |return      |Formatted time ago string|
         */

        /* example
         * const now = new Date().getTime();
         * timeAgo(now - 1000 * 6); // -> right now
         * timeAgo(now + 1000 * 15); // -> in 15 minutes
         * timeAgo(now - 1000 * 60 * 60 * 5, now); // -> 5 hours ago
         */

        /* typescript
         * export declare function timeAgo(
         *     date: Date | number,
         *     now?: Date | number
         * ): string;
         */

        /* dependencies
         * isDate toInt 
         */

        exports = function(date, now) {
            if (!isDate(date)) date = new Date(date);
            now = now || new Date();
            if (!isDate(now)) now = new Date(now);
            var diff = (now - date) / 1000;
            var i = 0;
            var ago = diff > 0;
            diff = Math.abs(diff);

            while (diff >= secArr[i] && i < secArrLen) {
                diff /= secArr[i];
                i++;
            }

            diff = toInt(diff);
            i *= 2;
            if (diff > (i === 0 ? 9 : 1)) i += 1;
            return format(diff, i, ago);
        };

        var secArr = [60, 60, 24, 7, 365 / 7 / 12, 12];
        var secArrLen = secArr.length;

        function format(diff, i, ago) {
            return exports.i18n[i][ago ? 0 : 1].replace('%s', diff);
        }

        exports.i18n = [
            ['just now', 'right now'],
            ['%s seconds ago', 'in %s seconds'],
            ['1 minute ago', 'in 1 minute'],
            ['%s minutes ago', 'in %s minutes'],
            ['1 hour ago', 'in 1 hour'],
            ['%s hours ago', 'in %s hours'],
            ['1 day ago', 'in 1 day'],
            ['%s days ago', 'in %s days'],
            ['1 week ago', 'in 1 week'],
            ['%s weeks ago', 'in %s weeks'],
            ['1 month ago', 'in 1 month'],
            ['%s months ago', 'in %s months'],
            ['1 year ago', 'in 1 year'],
            ['%s years ago', 'in %s years']
        ];

        return exports;
    })({});

    /* ------------------------------ timeTaken ------------------------------ */
    _.timeTaken = (function (exports) {
        /* Get execution time of a function.
         *
         * |Name  |Desc                    |
         * |------|------------------------|
         * |fn    |Function to measure time|
         * |return|Execution time, ms      |
         */

        /* example
         * timeTaken(function() {
         *     // Do something.
         * }); // -> Time taken to execute given function.
         */

        /* typescript
         * export declare function timeTaken(fn: types.AnyFn): number;
         */

        /* dependencies
         * perfNow types 
         */

        exports = function(fn) {
            var start = perfNow();
            fn();
            return perfNow() - start;
        };

        return exports;
    })({});

    /* ------------------------------ times ------------------------------ */
    _.times = (function (exports) {
        /* Invoke given function n times.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |n     |Times to invoke function      |
         * |fn    |Function invoked per iteration|
         * |ctx   |Function context              |
         * |return|Array of results              |
         */

        /* example
         * times(3, String); // -> ['0', '1', '2']
         */

        /* typescript
         * export declare function times<T>(
         *     n: number,
         *     fn: (n: number) => T,
         *     ctx?: any
         * ): T[];
         */

        /* dependencies
         * optimizeCb 
         */

        exports = function(n, fn, ctx) {
            var ret = Array(Math.max(0, n));
            fn = optimizeCb(fn, ctx, 1);

            for (var i = 0; i < n; i++) {
                ret[i] = fn(i);
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ toAsync ------------------------------ */
    _.toAsync = (function (exports) {
        /* Use generator like async/await.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |fn    |Generator function|
         * |return|Result function   |
         */

        /* example
         * const sleep = require('licia/sleep');
         *
         * const fn = toAsync(function*() {
         *     yield sleep(200);
         *     return 'licia';
         * });
         *
         * fn().then(str => {});
         */

        /* typescript
         * export declare function toAsync(fn: types.AnyFn): types.AnyFn;
         */

        /* dependencies
         * toArr isGeneratorFn isPromise toStr types 
         */ // https://github.com/tj/co

        exports = function(fn) {
            if (!isGeneratorFn(fn)) {
                throw new TypeError('Expected a generator function');
            }

            return function() {
                var _this = this;

                var args = toArr(arguments);
                return new Promise(function(resolve, reject) {
                    var generator = fn.apply(_this, args);

                    function onFulfilled(res) {
                        var ret;

                        try {
                            ret = generator.next(res);
                        } catch (e) {
                            return reject(e);
                        }

                        next(ret);
                    }

                    function onRejected(err) {
                        var ret;

                        try {
                            ret = generator.throw(err);
                        } catch (e) {
                            return reject(e);
                        }

                        next(ret);
                    }

                    function next(ret) {
                        if (ret.done) return resolve(ret.value);

                        if (isPromise(ret.value)) {
                            return ret.value.then(onFulfilled, onRejected);
                        }

                        return onRejected(
                            new TypeError(
                                'You may only yield a promise, '.concat(
                                    toStr(ret.value),
                                    ' is passed'
                                )
                            )
                        );
                    }

                    onFulfilled();
                });
            };
        };

        return exports;
    })({});

    /* ------------------------------ topoSort ------------------------------ */
    _.topoSort = (function (exports) {
        /* Topological sorting algorithm.
         *
         * |Name  |Desc        |
         * |------|------------|
         * |edges |Dependencies|
         * |return|Sorted order|
         */

        /* example
         * topoSort([
         *     [1, 2],
         *     [1, 3],
         *     [3, 2]
         * ]); // -> [1, 3, 2]
         */

        /* typescript
         * export declare function topoSort(edges: any[]): any[];
         */
        exports = function(edges) {
            return sort(uniqueNodes(edges), edges);
        };

        function uniqueNodes(arr) {
            var ret = [];

            for (var i = 0, len = arr.length; i < len; i++) {
                var edge = arr[i];
                if (ret.indexOf(edge[0]) < 0) ret.push(edge[0]);
                if (ret.indexOf(edge[1]) < 0) ret.push(edge[1]);
            }

            return ret;
        }

        function sort(nodes, edges) {
            var cursor = nodes.length;
            var sorted = new Array(cursor);
            var visited = {};
            var i = cursor;

            while (i--) {
                if (!visited[i]) visit(nodes[i], i, []);
            }

            function visit(node, i, predecessors) {
                if (predecessors.indexOf(node) >= 0) {
                    throw new Error('Cyclic dependency: ' + JSON.stringify(node));
                }

                if (visited[i]) return;
                visited[i] = true;
                var outgoing = edges.filter(function(edge) {
                    return edge[0] === node;
                });
                /* eslint-disable no-cond-assign */

                if ((i = outgoing.length)) {
                    var preds = predecessors.concat(node);

                    do {
                        var child = outgoing[--i][1];
                        visit(child, nodes.indexOf(child), preds);
                    } while (i);
                }

                sorted[--cursor] = node;
            }

            return sorted;
        }

        return exports;
    })({});

    /* ------------------------------ truncate ------------------------------ */
    _.truncate = (function (exports) {
        /* Truncate a string to a specific width.
         *
         * |Name   |Desc                 |
         * |-------|---------------------|
         * |txt    |Text to truncate     |
         * |width  |Maximum string length|
         * |options|Options object       |
         * |return |Truncated string     |
         *
         * Options:
         *
         * |Name          |Desc                              |
         * |--------------|----------------------------------|
         * |ellipsis='...'|String to indicate text is omitted|
         * |separator     |Separator pattern to truncate to  |
         */

        /* example
         * truncate('ORA ORA ORA ORA ORA ORA', 12); // -> 'ORA ORA O...'
         * truncate('ORA ORA ORA ORA ORA ORA', 10, {
         *     separator: ' ',
         *     ellipsis: '……'
         * }); // -> 'ORA ORA……'
         */

        /* typescript
         * export declare function truncate(
         *     txt: string,
         *     width: number,
         *     options?: {
         *         ellipsis?: string;
         *         separator: string;
         *     }
         * ): string;
         */

        /* dependencies
         * defaults isUndef 
         */

        exports = function(txt, width) {
            var options =
                arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            defaults(options, defOptions);
            var ellipsis = options.ellipsis,
                separator = options.separator;
            var len = txt.length;
            if (width > len) return txt;
            var end = width - ellipsis.length;
            if (end < 1) return ellipsis;
            var ret = txt.slice(0, end);
            if (isUndef(separator)) return ret + ellipsis;

            if (txt.indexOf(separator, end) !== end) {
                var idx = ret.lastIndexOf(separator);

                if (idx > -1) {
                    ret = ret.slice(0, idx);
                }
            }

            return ret + ellipsis;
        };

        var defOptions = {
            ellipsis: '...'
        };

        return exports;
    })({});

    /* ------------------------------ tryIt ------------------------------ */
    _.tryIt = (function (exports) {
        /* Run function in a try catch.
         *
         * |Name|Desc                 |
         * |----|---------------------|
         * |fn  |Function to try catch|
         * |cb  |Callback             |
         */

        /* example
         * tryIt(
         *     function() {
         *         // Do something that might cause an error.
         *     },
         *     function(err, result) {
         *         if (err) console.log(err);
         *     }
         * );
         */

        /* typescript
         * export declare function tryIt(fn: types.AnyFn, cb?: types.AnyFn): void;
         */

        /* dependencies
         * noop types 
         */

        exports = function(fn, cb) {
            cb = cb || noop;

            try {
                cb(null, fn());
            } catch (e) {
                cb(e);
                return;
            }
        };

        return exports;
    })({});

    /* ------------------------------ unescape ------------------------------ */
    _.unescape = (function (exports) {
        /* Convert HTML entities back, the inverse of escape.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |str   |String to unescape|
         * |return|Unescaped string  |
         */

        /* example
         * unescape('You &amp; Me'); // -> 'You & Me'
         */

        /* typescript
         * export declare function unescape(str: string): string;
         */

        /* dependencies
         * escape keys invert 
         */

        exports = function(str) {
            return regTest.test(str) ? str.replace(regReplace, replaceFn) : str;
        };

        var map = invert(escape.map);
        var regSrc = '(?:' + keys(map).join('|') + ')';
        var regTest = new RegExp(regSrc);
        var regReplace = new RegExp(regSrc, 'g');

        function replaceFn(match) {
            return map[match];
        }

        return exports;
    })({});

    /* ------------------------------ union ------------------------------ */
    _.union = (function (exports) {
        /* Create an array of unique values, in order, from all given arrays.
         *
         * |Name  |Desc                        |
         * |------|----------------------------|
         * |...arr|Arrays to inspect           |
         * |return|New array of combined values|
         */

        /* example
         * union([2, 1], [4, 2], [1, 2]); // -> [2, 1, 4]
         */

        /* typescript
         * export declare function union(...arr: Array<any[]>): any[];
         */

        /* dependencies
         * restArgs unique flatten 
         */

        exports = restArgs(function(arrays) {
            return unique(flatten(arrays));
        });

        return exports;
    })({});

    /* ------------------------------ universalify ------------------------------ */
    _.universalify = (function (exports) {
        /* Make an async function support both promises and callbacks.
         *
         * |Name  |Desc                            |
         * |------|--------------------------------|
         * |fn    |Async function                  |
         * |type  |Source type, promise or callback|
         * |return|Result function                 |
         */

        /* example
         * function callbackFn(str, cb) {
         *     setTimeout(() => {
         *         cb(null, str);
         *     }, 10);
         * }
         *
         * const fn = universalify(callbackFn, 'callback');
         * fn('licia', (err, result) => {
         *     console.log(result); // -> 'licia'
         * });
         * fn('licia').then(result => {
         *     console.log(result); // -> 'licia'
         * });
         */

        /* typescript
         * export declare function universalify(
         *     fn: types.AnyFn,
         *     type: string
         * ): types.AnyFn;
         */

        /* dependencies
         * promisify callbackify last isFn types 
         */

        exports = function(fn, type) {
            var callbackFn;
            var promiseFn;

            if (type === 'callback') {
                callbackFn = fn;
                promiseFn = promisify(fn);
            } else {
                promiseFn = fn;
                callbackFn = callbackify(fn);
            }

            return function() {
                for (
                    var _len = arguments.length, args = new Array(_len), _key = 0;
                    _key < _len;
                    _key++
                ) {
                    args[_key] = arguments[_key];
                }

                if (isFn(last(args))) {
                    callbackFn.apply(this, args);
                } else {
                    return promiseFn.apply(this, args);
                }
            };
        };

        return exports;
    })({});

    /* ------------------------------ unzip ------------------------------ */

    var unzip = _.unzip = (function (exports) {
        /* Opposite of zip.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |arr   |Array of grouped elements to process|
         * |return|New array of regrouped elements     |
         */

        /* example
         * unzip([
         *     ['a', 1, true],
         *     ['b', 2, false]
         * ]); // -> [['a', 'b'], [1, 2], [true, false]]
         */

        /* typescript
         * declare function unzip(arr: Array<any[]>): Array<any[]>;
         */

        /* dependencies
         * map pluck max 
         */

        exports = function(arr) {
            var len = max.apply(
                null,
                map(arr, function(arr) {
                    return arr.length;
                })
            );
            var ret = Array(len);

            for (var i = 0; i < len; i++) {
                ret[i] = pluck(arr, i);
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ use ------------------------------ */
    _.use = (function (exports) {
        /* Use modules that is created by define.
         *
         * |Name    |Desc                |
         * |--------|--------------------|
         * |requires|Dependencies        |
         * |method  |Codes to be executed|
         */

        /* example
         * // define('A', () => 'A');
         * use(['A'], function(A) {
         *     console.log(A + 'B'); // -> 'AB'
         * });
         */

        /* typescript
         * export declare function use(requires: string[], method: types.AnyFn): void;
         * export declare function use(method: types.AnyFn): void;
         */

        /* dependencies
         * map define has toArr types 
         */

        exports = function(requires, method) {
            if (method == null) {
                method = requires;
                requires = [];
            }

            requires = map(toArr(requires), function(val) {
                return req(val);
            });
            method.apply(null, requires);
        };

        var modules = define._modules;
        var requireMarks = {};

        function req(name) {
            if (has(requireMarks, name)) return modules[name];
            var requires = modules[name].requires;
            var body = modules[name].body;
            var len = requires.length;

            for (var i = 0; i < len; i++) {
                requires[i] = req(requires[i]);
            }

            var exports = body.apply(null, requires);
            if (exports) modules[name] = exports;
            requireMarks[name] = true;
            return modules[name];
        }

        return exports;
    })({});

    /* ------------------------------ uuid ------------------------------ */
    _.uuid = (function (exports) {
        /* RFC4122 version 4 compliant uuid generator.
         *
         * Check [RFC4122 4.4](http://www.ietf.org/rfc/rfc4122.txt) for reference.
         */

        /* example
         * uuid(); // -> '53ce0497-6554-49e9-8d79-347406d2a88b'
         */

        /* typescript
         * export declare function uuid(): string;
         */

        /* dependencies
         * randomBytes 
         */

        exports = function() {
            var b = randomBytes(16);
            b[6] = (b[6] & 0x0f) | 0x40;
            b[8] = (b[8] & 0x3f) | 0x80;
            return (
                hexBytes[b[0]] +
                hexBytes[b[1]] +
                hexBytes[b[2]] +
                hexBytes[b[3]] +
                '-' +
                hexBytes[b[4]] +
                hexBytes[b[5]] +
                '-' +
                hexBytes[b[6]] +
                hexBytes[b[7]] +
                '-' +
                hexBytes[b[8]] +
                hexBytes[b[9]] +
                '-' +
                hexBytes[b[10]] +
                hexBytes[b[11]] +
                hexBytes[b[12]] +
                hexBytes[b[13]] +
                hexBytes[b[14]] +
                hexBytes[b[15]]
            );
        };

        var hexBytes = [];

        for (var i = 0; i < 256; i++) {
            hexBytes[i] = (i + 0x100).toString(16).substr(1);
        }

        return exports;
    })({});

    /* ------------------------------ vlq ------------------------------ */
    _.vlq = (function (exports) {
        /* Variable-length quantity encoding and decoding.
         *
         * ### encode
         *
         * Encode numbers into vlq string.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |number|Number to encode|
         * |return|Encoded string  |
         *
         * ### decode
         *
         * Decode vlq string into numbers.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |string|String to decode|
         * |return|Decoded numbers |
         */

        /* example
         * vlq.encode(123); // -> '2H'
         * vlq.encode([123, 456, 789]); // -> '2HwcqxB'
         * vlq.decode('2H'); // -> [123]
         * vlq.decode('2HwcqxB'); // -> [123, 456, 789]
         */

        /* typescript
         * export declare const vlq: {
         *     encode(number: number | number[]): string;
         *     decode(string: string): number[];
         * };
         */

        /* dependencies
         * toArr 
         */ // https://github.com/google/closure-compiler/blob/master/src/com/google/debugging/sourcemap/Base64VLQ.java

        exports = {
            encode: function(arr) {
                arr = toArr(arr);
                var ret = '';

                for (var i = 0, len = arr.length; i < len; i++) {
                    ret += encode(arr[i]);
                }

                return ret;
            },
            decode: function(str) {
                var ret = [];
                var i = 0;
                var len = str.length;

                while (i < len) {
                    var value = 0;
                    var continuation = false;
                    var shift = 0;

                    do {
                        var digit = charToInt[str[i++]];
                        continuation = (digit & VLQ_CONTINUATION_BIT) !== 0;
                        digit &= VLQ_BASE_MASK;
                        value = value + (digit << shift);
                        shift = shift + VLQ_BASE_SHIFT;
                    } while (continuation);

                    ret.push(fromVLQSigned(value));
                }

                return ret;
            }
        };
        var charToInt = {};
        var intToChar = {};
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        for (var i = 0, len = chars.length; i < len; i++) {
            charToInt[chars[i]] = i;
            intToChar[i] = chars[i];
        }

        var VLQ_BASE_SHIFT = 5;
        var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
        var VLQ_BASE_MASK = VLQ_BASE - 1;
        var VLQ_CONTINUATION_BIT = VLQ_BASE;

        function encode(value) {
            var ret = '';
            value = toVLQSigned(value);

            do {
                var digit = value & VLQ_BASE_MASK;
                value >>>= VLQ_BASE_SHIFT;

                if (value > 0) {
                    digit |= VLQ_CONTINUATION_BIT;
                }

                ret += intToChar[digit];
            } while (value > 0);

            return ret;
        }

        function toVLQSigned(value) {
            if (value < 0) {
                return (-value << 1) + 1;
            } else {
                return (value << 1) + 0;
            }
        }

        function fromVLQSigned(value) {
            var negate = (value & 1) === 1;
            value = value >> 1;
            return negate ? -value : value;
        }

        return exports;
    })({});

    /* ------------------------------ waitUntil ------------------------------ */
    _.waitUntil = (function (exports) {
        /* Wait until function returns a truthy value.
         *
         * |Name        |Desc              |
         * |------------|------------------|
         * |condition   |Condition function|
         * |timeout=0   |Timeout           |
         * |interval=250|Wait interval     |
         */

        /* example
         * let a = 5;
         * setTimeout(() => (a = 10), 500);
         * waitUntil(() => a === 10).then(() => {
         *     console.log(a); // -> 10
         * });
         */

        /* typescript
         * export declare function waitUntil(
         *     condition: types.AnyFn,
         *     timeout?: number,
         *     interval?: number
         * ): Promise<any>;
         */

        /* dependencies
         * now types 
         */

        exports = function(condition) {
            var timeout =
                arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var interval =
                arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 250;

            function evalCondition() {
                return new Promise(function(resolve, reject) {
                    try {
                        resolve(condition());
                    } catch (e) {
                        reject(e);
                    }
                });
            }

            return new Promise(function(resolve, reject) {
                var startTime = now();

                var pollCondition = function() {
                    evalCondition().then(function(val) {
                        var elapsed = now() - startTime;

                        if (val) {
                            resolve(val);
                        } else if (timeout && elapsed >= timeout) {
                            reject(
                                Error('Wait timed out after '.concat(timeout, ' ms'))
                            );
                        } else {
                            setTimeout(pollCondition, interval);
                        }
                    }, reject);
                };

                pollCondition();
            });
        };

        return exports;
    })({});

    /* ------------------------------ waterfall ------------------------------ */
    _.waterfall = (function (exports) {
        /* Run an array of functions in series.
         *
         * |Name |Desc                   |
         * |-----|-----------------------|
         * |tasks|Array of functions     |
         * |cb   |Callback once completed|
         */

        /* example
         * waterfall(
         *     [
         *         function(cb) {
         *             cb(null, 'one');
         *         },
         *         function(arg1, cb) {
         *             // arg1 -> 'one'
         *             cb(null, 'done');
         *         }
         *     ],
         *     function(err, result) {
         *         // result -> 'done'
         *     }
         * );
         */

        /* typescript
         * export declare function waterfall(tasks: types.AnyFn[], cb?: types.AnyFn): void;
         */

        /* dependencies
         * noop nextTick restArgs types 
         */

        exports = function(tasks, cb) {
            cb = cb || noop;
            var current = 0;
            var taskCb = restArgs(function(err, args) {
                if (++current >= tasks.length || err) {
                    args.unshift(err);
                    nextTick(function() {
                        cb.apply(null, args);
                    });
                } else {
                    args.push(taskCb);
                    tasks[current].apply(null, args);
                }
            });

            if (tasks.length) {
                tasks[0](taskCb);
            } else {
                nextTick(function() {
                    cb();
                });
            }
        };

        return exports;
    })({});

    /* ------------------------------ wordWrap ------------------------------ */
    _.wordWrap = (function (exports) {
        /* Wrap a string to a given length.
         *
         * |Name  |Desc                          |
         * |------|------------------------------|
         * |txt   |Text to wrap                  |
         * |width |Text width                    |
         * |return|String wrapped at given length|
         */

        /* example
         * wordWrap('Licia is a utility library.', 10);
         * // -> 'Licia is \na utility \nlibrary.'
         */

        /* typescript
         * export declare function wordWrap(txt: string, width: number): string;
         */

        /* dependencies
         * map reduce concat last trim 
         */

        exports = function(txt, width) {
            var lines = txt.split('\n');
            return map(lines, function(line) {
                return wrap(line, width);
            }).join('\n');
        };

        var regWordBoundary = /(\S+\s+)/;

        function wrap(txt, width) {
            var chunks = reduce(
                txt.split(regWordBoundary),
                function(chunks, word) {
                    if (trim(word) === '') return chunks;

                    if (word.length > width) {
                        chunks = concat(
                            chunks,
                            word.match(new RegExp('.{1,'.concat(width, '}'), 'g'))
                        );
                    } else {
                        chunks.push(word);
                    }

                    return chunks;
                },
                []
            );
            var lines = reduce(
                chunks,
                function(lines, chunk) {
                    var lastLine = last(lines);

                    if (lastLine.length + chunk.length > width) {
                        if (trim(lastLine) === '') {
                            lines.pop();
                        }

                        lines.push(chunk);
                    } else {
                        lines[lines.length - 1] = lastLine + chunk;
                    }

                    return lines;
                },
                [chunks.shift()]
            );
            return lines.join('\n');
        }

        return exports;
    })({});

    /* ------------------------------ zip ------------------------------ */
    _.zip = (function (exports) {
        /* Merge together the values of each of the arrays with the values at the corresponding position.
         *
         * |Name  |Desc                         |
         * |------|-----------------------------|
         * |arr   |Arrays to process            |
         * |return|New array of grouped elements|
         */

        /* example
         * zip(['a', 'b'], [1, 2], [true, false]); // -> [['a', 1, true], ['b', 2, false]]
         */

        /* typescript
         * export declare function zip(...arr: Array<any[]>): Array<any[]>;
         */

        /* dependencies
         * restArgs unzip 
         */

        exports = restArgs(unzip);

        return exports;
    })({});

    return _;
}));