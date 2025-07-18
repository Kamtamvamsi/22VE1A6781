// import { useState } from 'react'
import './analytics'
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <div className="heading">
      <h1>Welcome to the URl shortner</h1>
    </div>
    <div className="bth-url">
      <div className="url-input">
        <input type="text" />
      </div>
      <button className="btn">Shorten URL</button> 
    </div>
    </>
  )
}

export default App
