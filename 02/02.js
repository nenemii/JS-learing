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

// 发布订阅模式：on（订阅事件）、off（取消订阅）、once（订阅一次性事件）、emit（触发事件）
class EventEmitter{
  constructor(){
    this._events = new Map();
  }

  on(event,listener){
    if(typeof listener !== 'function'){
      throw new TypeError('listener must be a function');
    }
    const arr = this._events.get(event) || [];
    arr.push(listener);
    this._events.set(event,arr);
    return this;
  }
  off(event,listener){
    if(!event) {
      this._events.clear();
      return this;
    }
    if(!arr){
      return this;
    }
    if(!listener){
      this._events.delete(event);
      return this;
    }
    const idx = arr.indexOf(listener);
    if(idx !== -1){
      arr.splice(idx,1);
      if(arr.length === 0){
        this._events.delete(event);
      }
      else{
        this._events.set(event,arr);
      }
    }
  }
  once(event, listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    wrapper._original = listener;
    return this.on(event, wrapper);
  }
  emit(event, ...args) {
    const arr = this._events.get(event);
    if (!arr || arr.length === 0) return false;
    const snapshot = arr.slice(); 
    for (const fn of snapshot) {
      try {
        fn.apply(this, args);
      } catch (err) {
        
        setTimeout(() => { throw err; }, 0);
      }
    }
    return true;
  }


  listeners(event) {
    return (this._events.get(event) || []).slice();
  }

  listenerCount(event) {
    return (this._events.get(event) || []).length;
  }
}





function Event() {
  // 键=事件名（字符串），值=回调函数数组
  const events = new Map();

  return {
    on(eventName, callback) {
      if (typeof eventName !== 'string' || eventName.trim() === '') {
        throw new Error('事件名必须是非空字符串');
      }
      if (typeof callback !== 'function') {
        throw new Error('回调函数必须是Function类型');
      }

      if (!events.has(eventName)) {
        events.set(eventName, []);
      }
      events.get(eventName).push(callback);
    },

    emit(eventName, data) {
      // 事件不存在则直接返回
      if (!events.has(eventName)) return;

      // 遍历回调列表执行（浅拷贝数组，避免执行中修改列表导致异常）
      const callbacks = [...events.get(eventName)];
      callbacks.forEach((callback) => {
        // 容错：防止个别回调报错导致后续回调无法执行
        try {
          callback(data);
        } catch (error) {
          console.error(`事件${eventName}的回调执行失败:`, error);
        }
      });
    },

    off(eventName, callback) {
      if (!events.has(eventName)) return;

      const callbacks = events.get(eventName);
      if (typeof callback === 'function') {
        // 若传入回调，过滤掉匹配的函数
        const newCallbacks = callbacks.filter((cb) => cb !== callback);
        if (newCallbacks.length > 0) {
          events.set(eventName, newCallbacks);
        } else {
          // 过滤后无回调，删除该事件（释放内存）
          events.delete(eventName);
        }
      } else if (callback === undefined) {
        // 若未传入回调，直接删除整个事件（取消所有订阅）
        events.delete(eventName);
      } else {
        throw new Error('取消订阅时，回调参数必须是Function或undefined');
      }
    },

    /**
     * @param {string} eventName - 事件名称
     * @returns {boolean} 是否存在订阅
     */
    has(eventName) {
      return events.has(eventName);
    },

    /**
     * @param {string} eventName - 事件名称
     * @returns {number} 订阅数量（事件不存在则返回0）
     */
    getListenerCount(eventName) {
      return events.has(eventName) ? events.get(eventName).length : 0;
    }
  };
}


const myEvent = Event();

function handleMessage(data) {
  console.log('收到消息:', data);
}

myEvent.on('message', handleMessage);
myEvent.on('message', (data) => console.log('匿名回调收到:', data));

myEvent.emit('message', 'Hello EventEmitter!');

console.log('message事件订阅数:', myEvent.getListenerCount('message')); // 输出：2

myEvent.off('message', handleMessage);
myEvent.emit('message', '再次触发');

myEvent.off('message');
console.log('message事件是否存在:', myEvent.has('message')); 
myEvent.emit('message', '不会触发');



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
function shallowClone(obj){
  if(typeof obj !== 'object' || obj === null){
    return obj;
  }
  if(Array.isArray(obj)){
    return obj.slice();
  }
  const proto = Object.getPrototypeOf(obj);
  const cloneObj = Object.create(proto);
  return Object.assign(cloneObj,obj);
}
// 深拷贝
function deepClone(obj, map = new Map() ){
  if(obj === null || typeof obj !== 'object'){
    return obj;
  }
  if(map.has(obj)){
    return map.get(obj);
  }
  let copy;
  if(Array.isArray(obj)){
    copy = [];
  }
  else{
    copy = {};
  }
  map.set(obj,copy);

  Reflect.ownKeys(obj).forEach(key =>{
    copy[key] = deepClone(obj[key], map);
  });
  
  return copy;
}