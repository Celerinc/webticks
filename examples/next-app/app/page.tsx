'use client'

import { useState, useEffect, useRef } from 'react'

export default function Home() {
  // Timer settings (in seconds)
  const [workDuration, setWorkDuration] = useState(25 * 60) // 25 minutes
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60) // 5 minutes
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60) // 15 minutes

  // Timer state
  const [timeLeft, setTimeLeft] = useState(workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState<'work' | 'shortBreak' | 'longBreak'>('work')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Track event helper
  const trackEvent = (eventName: string, metadata: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).webticks) {
      const eventData = {
        ...metadata,
        sessionType,
        completedPomodoros,
        timestamp: new Date().toISOString()
      }
        ; (window as any).webticks.trackEvent(eventName, eventData)
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

      // Play notification sound
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

  const handleSettingsChange = (type: 'work' | 'shortBreak' | 'longBreak', value: string) => {
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
    if (typeof window === 'undefined') return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
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
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const getProgress = (): number => {
    const total = sessionType === 'work' ? workDuration :
      sessionType === 'shortBreak' ? shortBreakDuration : longBreakDuration
    return ((total - timeLeft) / total) * 100
  }

  // Get session type display
  const getSessionDisplay = () => {
    switch (sessionType) {
      case 'work':
        return '💼 Work Session'
      case 'shortBreak':
        return '☕ Short Break'
      case 'longBreak':
        return '🌴 Long Break'
    }
  }

  // Get timer card classes
  const getTimerCardClasses = () => {
    const baseClasses = 'rounded-3xl p-10 my-8 shadow-2xl border transition-all duration-300'

    switch (sessionType) {
      case 'work':
        return `${baseClasses} bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30`
      case 'shortBreak':
        return `${baseClasses} bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30`
      case 'longBreak':
        return `${baseClasses} bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30`
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          🍅 Pomodoro Timer
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
          Boost your productivity with focused work sessions
        </p>

        <div className={getTimerCardClasses()}>
          <div className="text-xl font-semibold mb-4 opacity-90">
            {getSessionDisplay()}
          </div>

          <div className="text-7xl font-bold my-6 tabular-nums tracking-wider">
            {formatTime(timeLeft)}
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden my-6">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-800 transition-all duration-1000 rounded-full"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="flex gap-4 justify-center my-8">
            <button
              className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
              onClick={handleStartPause}
            >
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              className="px-8 py-3 text-lg font-semibold rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              onClick={handleReset}
            >
              🔄 Reset
            </button>
          </div>

          <div className="flex justify-around mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Completed
              </span>
              <span className="text-3xl font-bold">
                {completedPomodoros}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Next Break
              </span>
              <span className="text-3xl font-bold">
                {completedPomodoros % 4 === 3 ? 'Long' : 'Short'}
              </span>
            </div>
          </div>
        </div>

        <button
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          onClick={() => {
            setShowSettings(!showSettings)
            trackEvent('settings_toggled', { opened: !showSettings })
          }}
        >
          ⚙️ Settings
        </button>

        {showSettings && (
          <div className="mt-4 p-8 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-6">Timer Settings</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center gap-4">
                <label className="text-left flex-1">Work Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={workDuration / 60}
                  onChange={(e) => handleSettingsChange('work', e.target.value)}
                  disabled={isRunning}
                  className="w-20 px-3 py-2 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-between items-center gap-4">
                <label className="text-left flex-1">Short Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakDuration / 60}
                  onChange={(e) => handleSettingsChange('shortBreak', e.target.value)}
                  disabled={isRunning}
                  className="w-20 px-3 py-2 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-between items-center gap-4">
                <label className="text-left flex-1">Long Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakDuration / 60}
                  onChange={(e) => handleSettingsChange('longBreak', e.target.value)}
                  disabled={isRunning}
                  className="w-20 px-3 py-2 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 rounded-2xl bg-purple-600/10 border border-purple-600/20">
          <p className="font-semibold mb-2">✨ WebTicks Analytics Active</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            All timer events are being tracked! Open the console to see event logs.
          </p>

          <details className="text-left">
            <summary className="cursor-pointer font-semibold p-2 rounded-lg hover:bg-white/5 transition-colors">
              📊 Tracked Events
            </summary>
            <ul className="mt-4 space-y-2 pl-4 text-sm">
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">pomodoro_started</code> - Work session begins</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">pomodoro_completed</code> - Work session completes</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">break_started</code> - Break begins</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">break_completed</code> - Break completes</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">timer_paused</code> - Timer paused</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">timer_resumed</code> - Timer resumed</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">timer_reset</code> - Timer reset</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">settings_changed</code> - Settings modified</li>
              <li><code className="bg-white/10 px-2 py-1 rounded text-purple-600 dark:text-purple-400">session_milestone</code> - Every 4 Pomodoros</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}

