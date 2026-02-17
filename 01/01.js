function sum(arr){
  let sum = 0;
  for(let i=0;i<arr.length;i++){
    sum += arr[i];
  }
  return sum;
}

function maxInArray(arr){
  let max = 0;
  for(let i=0;i<arr.length;i++){
      max = max > arr[i]?max:arr[i];
    }
    return max;
  }

function unique1(arr){
  let ans =[];
  for(let i=0;i<arr.length;i++){
    if(ans.indexOf(arr[i])===-1){
      ans.push(arr[i]);
    }
  }
  return ans;
}
function unique2(arr) {
  return Array.from(new Set(arr));
}
// foreach遍历，不返回新数组
Array.prototype.myForEach = function(callback,thisArg){
  if (this == null) throw new TypeError('this is null or undefined');
  if (typeof callback !== 'function') throw new TypeError('callback is not a function');
  const O = Object(this);
  const len = O.length >>> 0;
  for(let i=0;i<len;i++){
    if(i in O){
      callback.call(thisArg,O[i],i,O);
    }
  }
}

// map遍历数组，要返回新数组
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

// filter遍历数组，返回新数组，保留回调为真值的元素
Array.prototype.myFilter = function(callback,thisArg){
  if (this == null) throw new TypeError('this is null or undefined');
  if (typeof callback !== 'function') throw new TypeError('callback is not a function');
  const O = Object(this);
  const len = O.length >>> 0;
  const res = [];
  for(let i=0;i<len;i++){
    if(i in O){
      const val = O[i];
      if(callback.call(thisArg,val,i,O)) res.push(val);
    }
  }
  return res;
}

// reduce叠加
Array.prototype.myReduce = function(callback, initialValue){
  if (this == null) throw new TypeError('this is null or undefined');
  if (typeof callback !== 'function') throw new TypeError('callback is not a function');
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  let accumulator;
  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    // find first present element
    while(k < len && !(k in O)) k++;
    if (k >= len) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = O[k++];
  }
  while(k < len){
    if(k in O){
      accumulator = callback(accumulator, O[k], k, O);
    }
    k++;
  }
  return accumulator;
}