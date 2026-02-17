const Counter =({count, onIncrement})=>{
  return (
    <div>
    count: {count}
    <button onClick={onIncrement}>Increment</button>
    </div>

  )
}

export default Counter