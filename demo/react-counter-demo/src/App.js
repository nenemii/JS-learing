import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Button from './button';
import Counter from './counter';
// function App() {
//   const [count, setCount] = useState(0)
//   const handleIncrement = ()=>{
//     setCount(count+1);
//   }
//   return (
//     <div>
//       <Counter count = {count}></Counter>
//       <Button onIncrement = {handleIncrement}></Button>
//     </div>
//   );
// }

function App(){
  const [count, setCount] = useState(0);
  const handleIncrement = ()=>{
    setCount(count+1);
  }
  const handelReset =()=>{
    setCount(0);
  }
  return (
    <div>
      <Counter count = {count} onIncrement = {handleIncrement}></Counter>
      <Counter count = {count} onIncrement = {handleIncrement} ></Counter>
      <button onClick={handelReset}>Reset</button>
    </div>
  );
}

export default App;
