
// 手写 `Object.assign(target, ...sources)`。

// 函数柯里化
function curry(fn){
  return function curred(...args){
    if(args.length >= fn.length){
      return fn.apply(this,args);
    } 
    else{
      return function(...nextArgs){
        return curred.apply(this,[...args,...nextArgs]);
      }
    }
  }
}

// 扁平数据转换成树结构
function arrayToTree(data) {
  // 1. 定义映射表（快速查找父节点）和结果数组（存根节点）
  const nodeMap = new Map();
  const tree = [];

  // 第一步：遍历数据，初始化每个节点的children，并存入映射表
  data.forEach(item => {
    // 给每个节点添加children属性（避免修改原数据，面试可简化为 item.children = []）
    const node = { ...item, children: [] };
    nodeMap.set(node.id, node);
  });

  // 第二步：遍历数据，挂载子节点到对应父节点
  data.forEach(item => {
    const currentNode = nodeMap.get(item.id);
    // 根节点（parentId为0/null/undefined）直接加入结果
    if (item.parentId === 0) {
      tree.push(currentNode);
    } else {
      // 找到父节点，挂载子节点（处理父节点不存在的边界情况）
      const parentNode = nodeMap.get(item.parentId);
      if (parentNode) {
        parentNode.children.push(currentNode);
      }
    }
  });

  return tree;
}

// 测试用例（面试时可简写，体现你考虑了测试）
const flatData = [
  { id: 1, parentId: 0, name: '一级1' },
  { id: 2, parentId: 1, name: '二级1-1' },
  { id: 3, parentId: 1, name: '二级1-2' },
  { id: 4, parentId: 0, name: '一级2' },
];
console.log(arrayToTree(flatData));


//实现对象比较
function deepEqual(obj1,obj2,cache = new WeakMap()){
  //  判断引用是否相等，判断是否是NaN
  if(obj1 === obj2) return true;
  if(Number.isNaN(obj1) && Number.isNaN(obj2)) return true;
  // 不是对象，为null直接返回false
  if(typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null){
    return false;
  }
  // 处理循环引用和重复比较
  if(cache.has(obj1)) return cache.get(obj1) === obj2;
  cache.set(obj1,obj2);

  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);
  if(isArray1 !== isArray2) return false;

  if(isArray1 && isArray2){
    if(obj1.length !== obj2.length) return false;
    for(let i=0;i<obj1.length;i++){
      if(!deepEqual(obj1[i],obj2[i],cache)) return false;
    }
  }
  else{
    const keys1 = Reflect.ownKeys(obj1);
    const keys2 = Reflect.ownKeys(obj2);
    if(keys1.length !== keys2.length) return false;
    for(const key of keys1){
      if(!deepEqual(obj1[key],obj2[key],cache)) return false;
    }
  }
  return true;
}

// 简化版zustand

function createStore(initialState) {
  // 1. 闭包私有化状态（外部无法直接修改）
  let state = { ...initialState };
  // 2. 存储订阅者（回调函数集合，用Set避免重复订阅）
  const subscribers = new Set();

  // 3. 获取当前状态（返回浅拷贝，避免外部修改原状态）
  const getState = () => ({ ...state });

  // 4. 更新状态 + 通知所有订阅者
  const setState = (newState) => {
    // 合并新状态（极简版：仅支持对象形式更新）
    state = { ...state, ...newState };
    // 触发所有订阅者（发布）
    subscribers.forEach(callback => callback(getState()));
  };

  // 5. 订阅状态变化（返回取消订阅函数）
  const subscribe = (callback) => {
    subscribers.add(callback);
    // 取消订阅：从Set中移除回调
    return () => subscribers.delete(callback);
  };

  // 暴露核心API
  return { getState, setState, subscribe };
}

