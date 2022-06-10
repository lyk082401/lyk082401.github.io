/**function Promise(resolver) {}
 
Promise.prototype.then = function() {}
Promise.prototype.catch = function() {}
 
Promise.resolve = function() {}
Promise.reject = function() {}
Promise.all = function() {}
Promise.race = function() {}

*/
/**
'use strict';
 
// var immediate = require('immediate');
 
function INTERNAL() {}
function isFunction(func) {
  return typeof func === 'function';
}
function isObject(obj) {
  return typeof obj === 'object';
}
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}
 
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
 
// module.exports = Promise;
 
function Promise(resolver) {
  if (!isFunction(resolver)) {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.value = void 0;
  this.queue = [];
  if (resolver !== INTERNAL) {
    safelyResolveThen(this, resolver);
  }
}



function safelyResolveThen(self, then) {
  var called = false;
  try {
    then(function (value) {
      if (called) {
        return;
      }
      called = true;
      doResolve(self, value);
    }, function (error) {
      if (called) {
        return;
      }
      called = true;
      doReject(self, error);
    });
  } catch (error) {
    if (called) {
      return;
    }
    called = true;
    doReject(self, error);
  }
}



function doResolve(self, value) {
  try {
    var then = getThen(value);
    if (then) {
      safelyResolveThen(self, then);
    } else {
      self.state = FULFILLED;
      self.value = value;
      self.queue.forEach(function (queueItem) {
        queueItem.callFulfilled(value);
      });
    }
    return self;
  } catch (error) {
    return doReject(self, error);
  }
}
 
function doReject(self, error) {
  self.state = REJECTED;
  self.value = error;
  self.queue.forEach(function (queueItem) {
    queueItem.callRejected(error);
  });
  return self;
}



function getThen(obj) {
  var then = obj && obj.then;
  if (obj && (isObject(obj) || isFunction(obj)) && isFunction(then)) {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}



Promise.prototype.then = function (onFulfilled, onRejected) {
  if (!isFunction(onFulfilled) && this.state === FULFILLED ||
    !isFunction(onRejected) && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.value);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }
  return promise;
};
 
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};



function unwrap(promise, func, value) {
  /**immediate*//**(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (error) {
      return doReject(promise, error);
    }
    if (returnValue === promise) {
      doReject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      doResolve(promise, returnValue);
    }
  });
}



function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  this.callFulfilled = function (value) {
    doResolve(this.promise, value);
  };
  this.callRejected = function (error) {
    doReject(this.promise, error);
  };
  if (isFunction(onFulfilled)) {
    this.callFulfilled = function (value) {
      unwrap(this.promise, onFulfilled, value);
    };
  }
  if (isFunction(onRejected)) {
    this.callRejected = function (error) {
      unwrap(this.promise, onRejected, error);
    };
  }
}



function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return doResolve(new this(INTERNAL), value);
}
Promise.resolve = resolve;
 
function reject(reason) {
  var promise = new this(INTERNAL);
  return doReject(promise, reason);
}
Promise.reject = reject;



function all(iterable) {
  var self = this;
  if (!isArray(iterable)) {
    return this.reject(new TypeError('must be an array'));
  }
 
  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }
 
  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);
 
  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        doReject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        doResolve(promise, values);
      }
    }
  }
}
Promise.all = all;



function race(iterable) {
  var self = this;
  if (!isArray(iterable)) {
    return this.reject(new TypeError('must be an array'));
  }
 
  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }
 
  var i = -1;
  var promise = new this(INTERNAL);
 
  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        doResolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        doReject(promise, error);
      }
    });
  }
}
Promise.race = race;*/
/**
    function Promise(extceu) {
            const _this = this;//保存this
            _this.data = (function(){return arguments;})();//用来保存,调用resolve(),reject()中传入的实参,供then()中的两个回调函数调用时的实参
            _this.callback = [];//用来保存then中的回调函数
            _this.status = 'pending';//用来保存状态
            //------------------声明两个函数,供使用者调用------------
            //1.resolve()函数
            function resolve(value) {
                
                //一进来就需要判断状态,如果不是pending状态就直接return
                if (_this.status !== 'pending') {
                    return
                }
                //如果成功了,就需要改变状态
                _this.status = 'resolved'
                //3.保存传入的实参
                _this.data = arguments;
                // console.log(555)
                //4.调用了resolve函数,那么就需要调用then中的回调函数
                //4.1但是我们还不能确定是否有指定的回调函数
                if (_this.callback.length > 0) {
                    _this.callback.forEach(item => {
                        item.onResolved(value);
                    })
                }

            }
            //2.reject函数
            function reject(reason) {
                //1.一来我们就需要判断状态是否是pending,如果不是就需要直接return,不再执行
                if (_this.status !== 'pending') {
                    return;
                }
                //2.满足了状态为pending那么,我们就需要改状态
                _this.status = 'reject';
                //3.保存传入的实参
                _this.data = arguments;
                //4.当我们调用reject()时,我们就需要调用then中的回调函数
                //4.1:但是我们还不确定是否有指定的回调函数
                if (_this.callback.length > 0) {
                    _this.callback.forEach(item => {
                        item.onRejected(reason);
                    })
                }
            }
            //---------两个函数声明完成-----------------
            try {
                extceu(resolve, reject);//当我们调用这个回调函数时,如果有报错,那么状态就是reject
            } catch (err) {
                reject(err);
            }
        }
        //---------------Promise.prototype.then------------------------
        //实现Promise.prototype.then()
        Promise.prototype.then = function (onResolved, onRejected) {
            //处理onResolve和onRejected默认值的问题
            onResolved = typeof onResolved === 'function' ? onResolved : value => value
            onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
            //then的两个参数,都是回调函数
            //1.onResolved:是当调用resolve时,就会触发onResolved函数
            //2.onRejected:是当调用reject时,就会调用onRejected函数
            //3.但是不是我们调用了then()方法了,就调用回调函数,是需要判断状态是否改变的,只有当_this.status发送改变了,才允许调用回调函数
            //4.then()方法的返回值是一个新的Promise,但是他的状态由调用的回调函数的返回结果来决定的
            return new Promise((resolve, reject) => {
                const _this = this;
                function hans(callback) {
                    //1.参数是一个函数,就是then()中的回调函数
                    try {
                        let result = callback.apply(null, Array.prototype.slice.call(_this.data));//传入实参
                        //2.那么我们就判断result是不是Promsie的实例
                        if (result instanceof Promise) {
                            //那么我们就指定他的回调函数,看result的状态是什么
                            result.then(value => {
                                //调用了这个回调函数,result的状态为resolved
                                //那么我们就需要调用resolve(),来改变then()返回的Promsie的状态
                                resolve()
                            }, reason => {
                                //调用了这个回调函数,result的状态为reject
                                //那么我们就需要调用reject(),来改变then()返回的Promise的状态
                            })
                        } else {
                            //如果result不是一个Promsie那么then()的返回的Promise状态我resolve()
                            resolve(result);
                        }
                    } catch (err) {
                        //3.如果上面的代码发送了报错,那么then()返回的Promise的状态是reject
                        reject(err)



                    }

                }
                if (_this.status == 'pending') {
                    
                    //如果状态还是为pending的话,那么我们不能调用then()中的两个回调函数,因为是异步编程,所以是会出现我们指定了回调函数了,但是状态还没改变
                    //2.那么我们需要把回调函数放到_this.callback这个数组中
                    //3.hans函数是,处理then()中两个回调函数的返回值,来判断then()返回的Promise的状态
                    _this.callback.push({
                        onResolved() {
                            hans(onResolved);//hans的参数是,then()中的参数,
                            //像数组中push了一个对象,对象中有两个方法,方法中调用hans(onResolved)
                        },
                        onRejectd() {
                            hans(onRejectd);
                        }
                    })

                } else if (_this.status == 'resolved') {
                    
                    hans(onResolved);
                } else {
                    hans(onRejected);
                }
            })
        }
        //3.实现Promise.prototype.catch
        Promise.prototype.catch = function (onReject) {
            return this.then(undefined, onReject);
        }
        //4.实现Promise.resolve()  Promise.reject()
        //4.1:Promise.resolve(),的参数可以是一个失败的Promise--->Promise.reject()
        //1.如果参数是一个失败的Promsie时,那么Promise.resolve()返回的是一个失败的Promsie(即状态为reject)
        //2.如果参数是一个成功的Promsie是,那么Promsie.resolve()返回的是一个成功的Promise(即状态为resolve)
        //3.如果参数是一个一般参数,那么就是成功的Promise

        Promise.resolve = function (values) {
            return new Promise((resolve, reject) => {
                if (values instanceof Promise) {
                    //证明参数是一个Promise
                    values.then(resolve, reject);
                } else {
                    resolve(values);
                }
            })
        }
        //Promise.reject是没有这个参数的情况
        Promise.reject = function (reason) {
            return new Promise((resolve, reject)=>{
                reject(reason);
            })
        }*//**
        //实现Promise.all,与Promise.race
        Promise.all = function (options) {
            //options是一个数组,里面的每一元素,都是一个Promise
            //1.all的返回值是一个新的Promise,但是他的状态是如下:
            //2.只有options里面的Promise都是调用成功的回调那么,all的状态才会是resolve
            //3.只要options中的Promise里面有一个状态是reject,那么all的状态是reject
            return new Promise((resolve, reject) => {
                let arr = new Array(options.length);
                // console.log(arr)
                let cishu = 0;//用来记录次数的
                options.forEach((item,index) => {
                    item.then((value) => {
                        cishu++;
                        console.log(index)
                        arr[index] = value

                        if (cishu == options.length) {
                            resolve(arr)
                        }

                    }, reason => {
                        reject(reason);
                    })
                })
            })
        }
        //----------------------实现Promise.race------------------
        Promise.race = function (options) {
            //options也是一个数组,里面元素都是Promise
            //2.返回值是一个Promise,其状态是如下:
            //2.1如果options中有一个最先状态为resolve,那么状态为resolve
            //2.2:如果options中有一个最先状态为reject,那么状态为reject
            return new Promise((resolve, reject) => {
                options.forEach(item => {
                    item.then(value => {
                        resolve(value)
                    }, reason => {
                        reject(reason)
                    })
                })
            })
        }
        //验证-------------------------------------
        let l = new Promise((resolve,reject)=>{
            resolve(222)
        })
        l.then(value=>{
            console.log('value:'+value)//输出这1
            throw 666
        },reason=>{
            console.log('reason:'+reason)
        }).catch(reson=>{
            console.log('reason:'+reson+777)//输出这2
        }).then(value=>{
            console.log('value'+value)//输出这3
        },reason=>{
            console.log('reason'+reason)
        })
        let o1 = Promise.resolve(Promise.reject(99999))
        let o2 = Promise.resolve(333)
        let o3 = Promise.resolve(00)
        let p1 = Promise.reject(0.222)
        // console.log(o1)
        let o = Promise.race([o2,p1])
        o.then(value=>{
            console.log(value)
        },reason=>{
            console.log('reason'+reason)
        })

        




*/