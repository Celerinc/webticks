'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
    const [count, setCount] = useState(0)

    const handleClick = () => {
        setCount((count) => count + 1)

        // Track custom event
        if (typeof window !== 'undefined' && window.webticks) {
            window.webticks.trackEvent('button_click', { count: count + 1 })
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.center}>
                <h1>WebTicks + Next.js Example</h1>
                <div className={styles.card}>
                    <button onClick={handleClick} className={styles.button}>
                        count is {count}
                    </button>
                    <p>Click the button to track events!</p>
                </div>
            </div>
        </main>
    )
}
