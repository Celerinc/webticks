import { useState } from 'react'
import WebTicksAnalytics from '@webticks/react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    const handleClick = () => {
        setCount((count) => count + 1)

        // Track custom event
        if (window.webticks) {
            window.webticks.trackEvent('button_click', { count: count + 1 })
        }
    }

    return (
        <>
            <WebTicksAnalytics />

            <div>
                <h1>WebTicks + React Example</h1>
                <div className="card">
                    <button onClick={handleClick}>
                        count is {count}
                    </button>
                    <p>
                        Edit <code>src/App.jsx</code> and save to test HMR
                    </p>
                </div>
                <p className="read-the-docs">
                    Click the button to track events!
                </p>
            </div>
        </>
    )
}

export default App
