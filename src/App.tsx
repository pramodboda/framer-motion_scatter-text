import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import InteractiveScatterText from "./components/animations/InteractiveScatterText"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div style={{ padding: '2rem' }}>
      <h1>Interactive Scatter Text</h1>
      <InteractiveScatterText 
        text="Interactive Scatter Text Like react framer-motion
        " 
        initialDelay={1000} 
        scatterDistance={120}
        animationDuration={40}
      />
      
      <div style={{ marginTop: '3rem' }}>
        <InteractiveScatterText 
          text="Hover Me!" 
          initialDelay={1000} 
          scatterDistance={80}
          animationDuration={30}
        />
      </div>
    </div>
    </>
  )
}

export default App
