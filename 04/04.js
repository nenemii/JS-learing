Promise.myResolve = function(value){
  if(value instanceof Promise) return value;
  return new Promise((resolve,reject)=>{
    if(value && typeof value === 'object' && typeof value.then === 'function'){
      value.then(resolve,reject);
    }
    else{
      resolve(value);
    }
  })
}

Promise.myReject = function(reason){
  return new Promise((resolve,reject)=>{
    reject(reason);
  })
}


function myPromiseAll(promises){
  return new Promise((resolve,reject)=>{
    if(!Array.isArray(promises)) return reject(new TypeError('Argument is not iterable'));
    const res = [];
    const count = 0;
    promises.forEach((promise,index)=>{
      Promise.resolve(promise).then(value =>{
        res[index] = value;
        count++;
        if(count === promises.length) resolve(res);
      })
    },
    err =>{
      reject(err);
    }
  )

  })
}


function myPromiseAllSettled(promises){
  return new Promise((resolve,reject)=>{
    if(!Array.isArray(promises)) return resolve([{status:'rejected',reason:new TypeError('Argument is not iterable')}]);
    const res = [];
    const count = 0;
    promises.forEach((promise,index)=>{
      Promise.resolve(promise).then(
        (value) =>{
        res[index] = {'status':'fulfilled',value};
        },
        (reason) =>{
          res[index] = {'status':'rejected',reason};
        }
        
      ).finally(()=>{
        count++;
        if(count === promises.length){
          resolve(res);
        }
      })
    })
  })
}


function myPromiseRace(promises){
  return new Promise((resolve,reject)=>{
    if(Array.isArray(promises)) return reject(new TypeError('Argument is not iterable'));
    for(const promise of promises){
      Promise.resolve(promise).then(
        (value)=>{
          resolve(value);
        },
        (reason)=>{
          reject(reason);
        }
      )
    }
  })
}


Promise.prototype.myFinally = function(callback){
  const self = this;
  return new Promise((resolve,reject)=>{
    function executeCallback(){
      if(typeof callback !== 'function'){
        return;
      }
      try {
        const res = callback();
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    self.then(
      // 成功
      (value)=>{
        executeCallback().then(
          ()=>{resolve(value);},
          (err)=>{reject(err);}
        )
      },
      // 失败
      (reason)=>{
        executeCallback().then(
          ()=> reject(reason),
          (err)=> reject(err)
        )

      }
    )
  })
}


//解析url params
function parseUrlParams(url){
  const params = {};
  const queryStr = url.split('?')[1];
  if(!queryStr) return params;
  const pairs = queryStr.split('&');
  pairs.forEach(pair=>{
    const [key,...valueParts] = pair.split('=');
    const value = valueParts.join('=');
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);
    if(params.hasOwnProperty(decodedKey)){
      if(Array.isArray(params[decodedKey])){
        params[decodedKey].push(decodedValue);
      }
      else{
        params[decodedKey] = [params[decodedKey],decodedValue];
      }
    }
    else{
      params[decodedKey] = decodedValue;
    }
  });
  return params;
}







// 千分位分割，要用字符串形式，从后向前遍历，每三个加一个，注意小数，
function formatThousandLoop(num){
  if(num === null || num === undefined) return '';
  const str = num.toString();
  const [integer,decimal] = str.split('.');
  const res ='';
  let count = 0;
  for(let i = integer.length-1;i>=0;i--){
    res = integer[i] +res;
    count++;
    if(count%3 === 0 && count!=0){
      res = ',' +res;
    }


  }
  return decimal ? `${res}.${decimal}` : res;
}