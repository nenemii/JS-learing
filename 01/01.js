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
  if(this === null){
    return new TypeError('this is null');
  }
  if(typeof callback !== 'function'){
    return new TypeError('callback is not a function');
  }
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
  if(this === null){
    return new TypeError('this is null');
  }
  if(typeof callback !== 'function'){
    return new TypeError('callback is not a function');
  }
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