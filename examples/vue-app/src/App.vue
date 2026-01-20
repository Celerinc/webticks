<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { WebticksAnalytics } from '@webticks/vue'

// Timer settings (in seconds)
const workDuration = ref(25 * 60) // 25 minutes
const shortBreakDuration = ref(5 * 60) // 5 minutes
const longBreakDuration = ref(15 * 60) // 15 minutes

// Timer state
const timeLeft = ref(workDuration.value)
const isRunning = ref(false)
const sessionType = ref('work') // 'work', 'shortBreak', 'longBreak'
const completedPomodoros = ref(0)
const showSettings = ref(false)

let intervalId = null
let startTime = null

// Track event helper
const trackEvent = (eventName, metadata = {}) => {
  if (window.webticks) {
    const eventData = {
      ...metadata,
      sessionType: sessionType.value,
      completedPomodoros: completedPomodoros.value,
      timestamp: new Date().toISOString()
    }
    window.webticks.trackEvent(eventName, eventData)
    console.log(`✅ WebTicks tracked: ${eventName}`, eventData)
  }
}

// Timer logic
const startTimer = () => {
  if (intervalId) return
  
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleTimerComplete()
    }
  }, 1000)
}

const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleTimerComplete = () => {
  stopTimer()
  isRunning.value = false
  
  if (sessionType.value === 'work') {
    const newCount = completedPomodoros.value + 1
    completedPomodoros.value = newCount
    
    trackEvent('pomodoro_completed', {
      duration: workDuration.value,
      totalCompleted: newCount
    })

    // Check for milestone
    if (newCount % 4 === 0) {
      trackEvent('session_milestone', {
        milestone: newCount,
        message: `Completed ${newCount} Pomodoros!`
      })
    }

    // Play notification
    playNotification()
    
    // Auto-start break
    if (newCount % 4 === 0) {
      startLongBreak()
    } else {
      startShortBreak()
    }
  } else {
    trackEvent('break_completed', {
      breakType: sessionType.value,
      duration: sessionType.value === 'shortBreak' ? shortBreakDuration.value : longBreakDuration.value
    })
    
    playNotification()
    startWork()
  }
}

const startWork = () => {
  sessionType.value = 'work'
  timeLeft.value = workDuration.value
  isRunning.value = true
  startTime = Date.now()
  startTimer()
  
  trackEvent('pomodoro_started', {
    duration: workDuration.value
  })
}

const startShortBreak = () => {
  sessionType.value = 'shortBreak'
  timeLeft.value = shortBreakDuration.value
  isRunning.value = true
  startTime = Date.now()
  startTimer()
  
  trackEvent('break_started', {
    breakType: 'short',
    duration: shortBreakDuration.value
  })
}

const startLongBreak = () => {
  sessionType.value = 'longBreak'
  timeLeft.value = longBreakDuration.value
  isRunning.value = true
  startTime = Date.now()
  startTimer()
  
  trackEvent('break_started', {
    breakType: 'long',
    duration: longBreakDuration.value
  })
}

const handleStartPause = () => {
  if (isRunning.value) {
    stopTimer()
    isRunning.value = false
    const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    
    trackEvent('timer_paused', {
      timeRemaining: timeLeft.value,
      timeElapsed: elapsed
    })
  } else {
    isRunning.value = true
    startTime = Date.now()
    startTimer()
    
    trackEvent('timer_resumed', {
      timeRemaining: timeLeft.value
    })
  }
}

const handleReset = () => {
  stopTimer()
  isRunning.value = false
  const duration = sessionType.value === 'work' ? workDuration.value : 
                   sessionType.value === 'shortBreak' ? shortBreakDuration.value : longBreakDuration.value
  timeLeft.value = duration
  
  trackEvent('timer_reset', {
    previousTimeLeft: timeLeft.value,
    resetTo: duration
  })
}

const handleSettingsChange = (type, value) => {
  const newValue = parseInt(value) * 60
  
  if (type === 'work') {
    workDuration.value = newValue
    if (sessionType.value === 'work' && !isRunning.value) {
      timeLeft.value = newValue
    }
  } else if (type === 'shortBreak') {
    shortBreakDuration.value = newValue
    if (sessionType.value === 'shortBreak' && !isRunning.value) {
      timeLeft.value = newValue
    }
  } else if (type === 'longBreak') {
    longBreakDuration.value = newValue
    if (sessionType.value === 'longBreak' && !isRunning.value) {
      timeLeft.value = newValue
    }
  }
  
  trackEvent('settings_changed', {
    settingType: type,
    newValue: newValue / 60,
    unit: 'minutes'
  })
}

const playNotification = () => {
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
const formatTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// Calculate progress percentage
const progress = computed(() => {
  const total = sessionType.value === 'work' ? workDuration.value : 
                sessionType.value === 'shortBreak' ? shortBreakDuration.value : longBreakDuration.value
  return ((total - timeLeft.value) / total) * 100
})

// Get session display text
const sessionDisplay = computed(() => {
  switch (sessionType.value) {
    case 'work':
      return '💼 Work Session'
    case 'shortBreak':
      return '☕ Short Break'
    case 'longBreak':
      return '🌴 Long Break'
    default:
      return ''
  }
})

// Get timer card class
const timerCardClass = computed(() => {
  return `timer-card ${sessionType.value}`
})

// Cleanup on unmount
onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <WebticksAnalytics />

  <div class="pomodoro-container">
    <h1>🍅 Pomodoro Timer</h1>
    <p class="subtitle">Boost your productivity with focused work sessions</p>

    <div :class="timerCardClass">
      <div class="session-type">
        {{ sessionDisplay }}
      </div>

      <div class="timer-display">
        {{ formatTime }}
      </div>

      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%` }"
        />
      </div>

      <div class="controls">
        <button 
          class="btn btn-primary" 
          @click="handleStartPause"
        >
          {{ isRunning ? '⏸ Pause' : '▶ Start' }}
        </button>
        <button 
          class="btn btn-secondary" 
          @click="handleReset"
        >
          🔄 Reset
        </button>
      </div>

      <div class="session-info">
        <div class="stat">
          <span class="stat-label">Completed</span>
          <span class="stat-value">{{ completedPomodoros }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Next Break</span>
          <span class="stat-value">
            {{ completedPomodoros % 4 === 3 ? 'Long' : 'Short' }}
          </span>
        </div>
      </div>
    </div>

    <button 
      class="btn btn-settings" 
      @click="() => {
        showSettings = !showSettings
        trackEvent('settings_toggled', { opened: !showSettings })
      }"
    >
      ⚙️ Settings
    </button>

    <div v-if="showSettings" class="settings-panel">
      <h3>Timer Settings</h3>
      <div class="setting-item">
        <label>Work Duration (minutes)</label>
        <input 
          type="number" 
          min="1" 
          max="60" 
          :value="workDuration / 60"
          @input="e => handleSettingsChange('work', e.target.value)"
          :disabled="isRunning"
        />
      </div>
      <div class="setting-item">
        <label>Short Break (minutes)</label>
        <input 
          type="number" 
          min="1" 
          max="30" 
          :value="shortBreakDuration / 60"
          @input="e => handleSettingsChange('shortBreak', e.target.value)"
          :disabled="isRunning"
        />
      </div>
      <div class="setting-item">
        <label>Long Break (minutes)</label>
        <input 
          type="number" 
          min="1" 
          max="60" 
          :value="longBreakDuration / 60"
          @input="e => handleSettingsChange('longBreak', e.target.value)"
          :disabled="isRunning"
        />
      </div>
    </div>

    <div class="webticks-info">
      <p><strong>✨ WebTicks Analytics Active</strong></p>
      <p class="info-text">
        All timer events are being tracked! Open the console to see event logs.
      </p>
      <details class="tracked-events">
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
</template>

<style scoped>
.pomodoro-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #888;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.timer-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2.5rem;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.timer-card.work {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

.timer-card.shortBreak {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
  border-color: rgba(34, 197, 94, 0.3);
}

.timer-card.longBreak {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
  border-color: rgba(59, 130, 246, 0.3);
}

.session-type {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.timer-display {
  font-size: 5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  margin: 1rem 0;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 1.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 1s linear;
  border-radius: 10px;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.btn {
  padding: 0.875rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-settings {
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.session-info {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
}

.settings-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-panel h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.setting-item label {
  flex: 1;
  text-align: left;
  font-size: 1rem;
}

.setting-item input {
  width: 80px;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  font-family: inherit;
}

.setting-item input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.webticks-info {
  margin-top: 3rem;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.webticks-info p {
  margin: 0.5rem 0;
}

.info-text {
  font-size: 0.9rem;
  color: #aaa;
}

.tracked-events {
  margin-top: 1rem;
  text-align: left;
}

.tracked-events summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.tracked-events summary:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tracked-events ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.tracked-events li {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.tracked-events code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #667eea;
}

@media (max-width: 640px) {
  .timer-display {
    font-size: 3.5rem;
  }

  .controls {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .setting-item input {
    width: 100%;
  }
}
</style>

