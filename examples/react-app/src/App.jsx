import { useState } from 'react'
import WebTicksAnalytics from '@webticks/reactjs'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount((count) => count + 1)

    // Track custom event with WebTicks
    if (window.webticks) {
      window.webticks.trackEvent('button_click', { count: count + 1 })
      console.log('✅ WebTicks tracked button click:', count + 1)
    }
  }

  return (
    <>
      <WebTicksAnalytics />

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + WebTicks</h1>
      <div className="card">
        <button onClick={handleClick}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p style={{ fontSize: '0.9em', color: '#888', marginTop: '1em' }}>
          ✨ WebTicks is tracking page views and button clicks!
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
