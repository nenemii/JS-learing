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