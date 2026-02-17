// flatToTree: 将扁平列表 [{id, parentId, ...}] 转为树形结构
function flatToTree(items, options = {}){
  const { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' } = options;
  const map = new Map();
  const roots = [];

  // 先创建映射，克隆每个节点并确保 childrenKey 存在
  for(const item of items){
    map.set(item[idKey], Object.assign({}, item, { [childrenKey]: [] }));
  }

  // 再次遍历，将节点放到父节点的 children 中，找不到父节点则作为根
  for(const item of items){
    const id = item[idKey];
    const parentId = item[parentKey];
    const node = map.get(id);
    if(parentId == null || !map.has(parentId)){
      roots.push(node);
    } else {
      map.get(parentId)[childrenKey].push(node);
    }
  }

  return roots;
}

// treeToFlat: 将树结构转回扁平数组，结果包含 depth 与 children（子 id 列表）
function treeToFlat(tree, options = {}){
  const { idKey = 'id', parentKey = 'parentId', childrenKey = 'children', depthKey = 'depth' } = options;
  const res = [];

  function dfs(nodes, parentId = null, depth = 0){
    for(const node of nodes){
      const children = Array.isArray(node[childrenKey]) ? node[childrenKey] : [];
      // 保留除 children 之外的字段
      const { [childrenKey]: _, ...rest } = node;
      const item = Object.assign({}, rest);
      item[parentKey] = parentId;
      item[depthKey] = depth;
      item[childrenKey] = children.map(c => c[idKey]);
      res.push(item);
      if(children.length) dfs(children, node[idKey], depth + 1);
    }
  }

  dfs(Array.isArray(tree) ? tree : [tree], null, 0);
  return res;
}

// 简单示例
const flat = [
  { id: 1, parentId: null, name: 'root1'},
  { id: 2, parentId: 1, name: 'child1'},
  { id: 3, parentId: 1, name: 'child2'},
  { id: 4, parentId: 2, name: 'grandchild1'},
  { id: 5, parentId: null, name: 'root2'}
];

const tree = flatToTree(flat);
const back = treeToFlat(tree);

console.log('tree:', JSON.stringify(tree, null, 2));
console.log('flat with depth:', JSON.stringify(back, null, 2));

// 导出（如果在模块环境使用）
if(typeof module !== 'undefined' && module.exports){
  module.exports = { flatToTree, treeToFlat };
}


Array.prototype.myMap = function(callback,thisArg){
  if (this == null) throw new TypeError('this is null or undefined');
  if (typeof callback !== 'function') throw new TypeError('callback is not a function');
  const O = Object(this);
  const len = O.length >>> 0;
  const A = new Array(len);
  for(let i = 0;i<len;i++){
    if(i in O){
      A[i] = callback.call(thisArg,O[i],i,O);
    }
  }
  return A;
}

Array.prototype.myFilter = function(callback,thisArg){
  if (this == null) throw new TypeError('this is null or undefined');
  if(typeof callback !== 'function') throw new TypeError('callback is not a function');
  const O = Object(this);
  const len = O.length >>> 0;
  const res = [];
  for(let i = 0;i<len;i++){
    if(i in O){
      const val = O[i];
      if(callback.call(thisArg,val,i,O)) res.push(val);
    }
  }
  return res;
}

Array.prototype.myReduce = function(callback,initialValue){
  if (this == null) throw new TypeError('this is null or undefined');
  if(typeof callback !== 'function') throw new TypeError('callback is not a function');
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;  
  let accumulator;
  if(arguments.length >=2){
    accumulator = initialValue;
  }else{
    while(k<len && !(k in O)) k++;
    if(k>=len) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = O[k];
    k++;
  }
  while(k<len){
    if(k in O){
      accumulator = callback.call(accumulator,O[k],k,O);
    }
    k++;
  }
  return accumulator;
}

// forEach遍历数组，不返回新数组
Array.prototype.myForEach = function(callback,thisArg){
  if (this == null) throw new TypeError('this is null or undefined');
  if(typeof callback !== 'function') throw new TypeError('callback is not a function');
  const O = Object(this);
  const len = O.length >>> 0;
  for(let i=0;i<len;i++){
    if(i in O){
      callback.call(thisArg,O[i],i,O);
    }
  }
}


// 洗牌算法 后序遍历
function shuffle(array){
  if(!Array.isArray(array)) throw new TypeError('argument is not an array');
  const arr = [...array];
  for(let i = arr.length - 1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;

}

// 数组扁平化
function flatten (arr){
  if(!Array.isArray(arr)) throw new TypeError('argument is not an array');
  const ans = [];
  
  for(let i = 0;i<arr.length;i++){
    const element = arr[i];
    Array.isArray(element) ? (ans = ans.concat(flatten(element))) : ans.push(element);

  }
  return ans;
}








