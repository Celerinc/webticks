import { useState, useEffect, useRef } from 'react'
import WebticksAnalytics from '@webticks/react'
import './App.css'

function App() {
  // Timer settings (in seconds for easier testing, multiply by 60 for actual minutes)
  const [workDuration, setWorkDuration] = useState(25 * 60) // 25 minutes
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60) // 5 minutes
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60) // 15 minutes

  // Timer state
  const [timeLeft, setTimeLeft] = useState(workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState('work') // 'work', 'shortBreak', 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  // Track event helper
  const trackEvent = (eventName, metadata = {}) => {
    if (window.webticks) {
      const eventData = {
        ...metadata,
        sessionType,
        completedPomodoros,
        timestamp: new Date().toISOString()
      }
      window.webticks.trackEvent(eventName, eventData)
      console.log(`✅ WebTicks tracked: ${eventName}`, eventData)
    }
  }

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (sessionType === 'work') {
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)

      trackEvent('pomodoro_completed', {
        duration: workDuration,
        totalCompleted: newCount
      })

      // Check for milestone
      if (newCount % 4 === 0) {
        trackEvent('session_milestone', {
          milestone: newCount,
          message: `Completed ${newCount} Pomodoros!`
        })
      }

      // Play notification sound (optional)
      playNotification()

      // Auto-start break
      if (newCount % 4 === 0) {
        startLongBreak()
      } else {
        startShortBreak()
      }
    } else {
      trackEvent('break_completed', {
        breakType: sessionType,
        duration: sessionType === 'shortBreak' ? shortBreakDuration : longBreakDuration
      })

      playNotification()
      startWork()
    }
  }

  const startWork = () => {
    setSessionType('work')
    setTimeLeft(workDuration)
    setIsRunning(true)
    startTimeRef.current = Date.now()

    trackEvent('pomodoro_started', {
      duration: workDuration
    })
  }

  const startShortBreak = () => {
    setSessionType('shortBreak')
    setTimeLeft(shortBreakDuration)
    setIsRunning(true)
    startTimeRef.current = Date.now()

    trackEvent('break_started', {
      breakType: 'short',
      duration: shortBreakDuration
    })
  }

  const startLongBreak = () => {
    setSessionType('longBreak')
    setTimeLeft(longBreakDuration)
    setIsRunning(true)
    startTimeRef.current = Date.now()

    trackEvent('break_started', {
      breakType: 'long',
      duration: longBreakDuration
    })
  }

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false)
      const elapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0

      trackEvent('timer_paused', {
        timeRemaining: timeLeft,
        timeElapsed: elapsed
      })
    } else {
      setIsRunning(true)
      startTimeRef.current = Date.now()

      trackEvent('timer_resumed', {
        timeRemaining: timeLeft
      })
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    const duration = sessionType === 'work' ? workDuration :
      sessionType === 'shortBreak' ? shortBreakDuration : longBreakDuration
    setTimeLeft(duration)

    trackEvent('timer_reset', {
      previousTimeLeft: timeLeft,
      resetTo: duration
    })
  }

  const handleSettingsChange = (type, value) => {
    const newValue = parseInt(value) * 60

    if (type === 'work') {
      setWorkDuration(newValue)
      if (sessionType === 'work' && !isRunning) {
        setTimeLeft(newValue)
      }
    } else if (type === 'shortBreak') {
      setShortBreakDuration(newValue)
      if (sessionType === 'shortBreak' && !isRunning) {
        setTimeLeft(newValue)
      }
    } else if (type === 'longBreak') {
      setLongBreakDuration(newValue)
      if (sessionType === 'longBreak' && !isRunning) {
        setTimeLeft(newValue)
      }
    }

    trackEvent('settings_changed', {
      settingType: type,
      newValue: newValue / 60,
      unit: 'minutes'
    })
  }

  const playNotification = () => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      console.log('Audio notification not available')
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const getProgress = () => {
    const total = sessionType === 'work' ? workDuration :
      sessionType === 'shortBreak' ? shortBreakDuration : longBreakDuration
    return ((total - timeLeft) / total) * 100
  }

  return (
    <>
      <WebticksAnalytics
        backendUrl="http://localhost:3002/api/track"
        appId="97069816-8b25-4640-833f-f17259208a42"
      />

      <div className="pomodoro-container">
        <h1>🍅 Pomodoro Timer</h1>
        <p className="subtitle">Boost your productivity with focused work sessions</p>

        <div className={`timer-card ${sessionType}`}>
          <div className="session-type">
            {sessionType === 'work' && '💼 Work Session'}
            {sessionType === 'shortBreak' && '☕ Short Break'}
            {sessionType === 'longBreak' && '🌴 Long Break'}
          </div>

          <div className="timer-display">
            {formatTime(timeLeft)}
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="controls">
            <button
              className="btn btn-primary"
              onClick={handleStartPause}
            >
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleReset}
            >
              🔄 Reset
            </button>
          </div>

          <div className="session-info">
            <div className="stat">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedPomodoros}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Next Break</span>
              <span className="stat-value">
                {completedPomodoros % 4 === 3 ? 'Long' : 'Short'}
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-settings"
          onClick={() => {
            setShowSettings(!showSettings)
            trackEvent('settings_toggled', { opened: !showSettings })
          }}
        >
          ⚙️ Settings
        </button>

        {showSettings && (
          <div className="settings-panel">
            <h3>Timer Settings</h3>
            <div className="setting-item">
              <label>Work Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={workDuration / 60}
                onChange={(e) => handleSettingsChange('work', e.target.value)}
                disabled={isRunning}
              />
            </div>
            <div className="setting-item">
              <label>Short Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration / 60}
                onChange={(e) => handleSettingsChange('shortBreak', e.target.value)}
                disabled={isRunning}
              />
            </div>
            <div className="setting-item">
              <label>Long Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreakDuration / 60}
                onChange={(e) => handleSettingsChange('longBreak', e.target.value)}
                disabled={isRunning}
              />
            </div>
          </div>
        )}

        <div className="webticks-info">
          <p>✨ <strong>WebTicks Analytics Active</strong></p>
          <p className="info-text">
            All timer events are being tracked! Open the console to see event logs.
          </p>
          <details className="tracked-events">
            <summary>📊 Tracked Events</summary>
            <ul>
              <li><code>pomodoro_started</code> - Work session begins</li>
              <li><code>pomodoro_completed</code> - Work session completes</li>
              <li><code>break_started</code> - Break begins</li>
              <li><code>break_completed</code> - Break completes</li>
              <li><code>timer_paused</code> - Timer paused</li>
              <li><code>timer_resumed</code> - Timer resumed</li>
              <li><code>timer_reset</code> - Timer reset</li>
              <li><code>settings_changed</code> - Settings modified</li>
              <li><code>session_milestone</code> - Every 4 Pomodoros</li>
            </ul>
          </details>
        </div>
      </div>
    </>
  )
}

export default App
