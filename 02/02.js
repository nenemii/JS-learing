function myInstanceof(obj,Constructor){
  const prototypeObj = Object.getPrototypeOf(obj);
  
  while(true){
    if(prototypeObj === null) return false;
    if(prototypeObj === Constructor.prototype) return true;
    prototypeObj = Object.getPrototypeOf(prototypeObj);
  }
}


function myNew(Ctor,...args){
  if(typeof Ctor !== 'function'){
    throw new TypeError('Ctor must be a function');
  }
  const obj = Object.create(Ctor.prototype);
  let res = Ctor.apply(obj,args);
  const flag = res && (typeof res === 'object' || typeof res === 'function');
  return flag ? res : obj;


}

// 节流
function throttle(fn,wait){
  let lastTime = 0;
  return function(...args){
    const now = new Date();
    if(now-lastTime >= wait){
      fn.apply(this,args);
      lastTime = now;
    }
  }

}

// 防抖
function debounce(fn,wait){
  let timer = null;
  return function(...args){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
      fn.apply(this,args);
      timer = null;
    },wait)
  }
}


function once(fn){
  let flag = true;
  return function(...args){
    if(flag){
      fn.apply(this,args);
      flag = false;
    }
  }

}


function compose(...fns){
  if(fns.length === 0) return args => args;
  if(fns.length === 1) return fns[0];
  return fns.reduce((pre,cur)=>{
    return (...args)=>pre(cur(...args));
  })
}
// pipe就是把a，b的顺序反过来
function pipe(...fns){
  if(fns.length === 0) return args => args;
  if(fns.length === 1) return fns[0];
  return fns.reduce((pre,cur)=>{
    return (...args)=>cur(pre(...args));
  })
}


class EventEmitter{
  //skip
}

// 用 Promise 包装 setTimeout
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}


// call和apply的区别在于参数传递方式不同，call是直接传递参数，而apply是将参数放在一个数组中传递
Function.prototype.myCall = function(ctx,...args){
  if(typeof this !== 'function'){
    return new TypeError('myCall must be called on a function');
  }
  ctx = ctx || window;
  ctx.fn = this;
  const res = ctx.fn(...args);
  delete ctx.fn;
  return res;

}

// apply的参数必须是数组
Function.prototype.myApply = function(ctx,...args){
  if(typeof this !== 'function'){
    return new TypeError('myCall must be called on a function');
  }
  ctx = ctx || window;
  ctx.fn = this;
  const res = args ? ctx.fn(...args):ctx.fn();
  delete ctx.fn;
  return res;


}

// bind返回的是函数，并且有多个参数
Function.prototype.myBind = function(ctx,...args){
  if(typeof this !== 'function'){
    return new TypeError('myCall must be called on a function');
  }
  ctx = ctx || window;
  ctx.fn = this;

  return function(...arg2){
    const res  = ctx.fn(...args,...arg2);
    delete ctx.fn;
    return res;
  }

}

// 浅拷贝

// 深拷贝