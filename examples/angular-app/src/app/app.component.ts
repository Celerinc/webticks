import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebticksAnalytics } from '@webticks/angular-ts';

declare global {
  interface Window {
    webticks?: {
      trackEvent: (eventName: string, metadata?: Record<string, any>) => void;
    };
  }
}

type SessionType = 'work' | 'shortBreak' | 'longBreak';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WebticksAnalytics],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  // Timer settings (in seconds)
  workDuration = 25 * 60;
  shortBreakDuration = 5 * 60;
  longBreakDuration = 15 * 60;

  // Timer state
  timeLeft = this.workDuration;
  isRunning = false;
  sessionType: SessionType = 'work';
  completedPomodoros = 0;
  showSettings = false;

  private intervalId: any = null;
  private startTime: number | null = null;

  ngOnInit() { }

  ngOnDestroy() {
    this.stopTimer();
  }

  // Track event helper
  private trackEvent(eventName: string, metadata: Record<string, any> = {}) {
    if (window.webticks) {
      const eventData = {
        ...metadata,
        sessionType: this.sessionType,
        completedPomodoros: this.completedPomodoros,
        timestamp: new Date().toISOString()
      };
      window.webticks.trackEvent(eventName, eventData);
      console.log(`✅ WebTicks tracked: ${eventName}`, eventData);
    }
  }

  // Timer logic
  private startTimer() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.handleTimerComplete();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private handleTimerComplete() {
    this.stopTimer();
    this.isRunning = false;

    if (this.sessionType === 'work') {
      this.completedPomodoros++;

      this.trackEvent('pomodoro_completed', {
        duration: this.workDuration,
        totalCompleted: this.completedPomodoros
      });

      if (this.completedPomodoros % 4 === 0) {
        this.trackEvent('session_milestone', {
          milestone: this.completedPomodoros,
          message: `Completed ${this.completedPomodoros} Pomodoros!`
        });
      }

      this.playNotification();

      if (this.completedPomodoros % 4 === 0) {
        this.startLongBreak();
      } else {
        this.startShortBreak();
      }
    } else {
      this.trackEvent('break_completed', {
        breakType: this.sessionType,
        duration: this.sessionType === 'shortBreak' ? this.shortBreakDuration : this.longBreakDuration
      });

      this.playNotification();
      this.startWork();
    }
  }

  private startWork() {
    this.sessionType = 'work';
    this.timeLeft = this.workDuration;
    this.isRunning = true;
    this.startTime = Date.now();
    this.startTimer();

    this.trackEvent('pomodoro_started', {
      duration: this.workDuration
    });
  }

  private startShortBreak() {
    this.sessionType = 'shortBreak';
    this.timeLeft = this.shortBreakDuration;
    this.isRunning = true;
    this.startTime = Date.now();
    this.startTimer();

    this.trackEvent('break_started', {
      breakType: 'short',
      duration: this.shortBreakDuration
    });
  }

  private startLongBreak() {
    this.sessionType = 'longBreak';
    this.timeLeft = this.longBreakDuration;
    this.isRunning = true;
    this.startTime = Date.now();
    this.startTimer();

    this.trackEvent('break_started', {
      breakType: 'long',
      duration: this.longBreakDuration
    });
  }

  handleStartPause() {
    if (this.isRunning) {
      this.stopTimer();
      this.isRunning = false;
      const elapsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;

      this.trackEvent('timer_paused', {
        timeRemaining: this.timeLeft,
        timeElapsed: elapsed
      });
    } else {
      this.isRunning = true;
      this.startTime = Date.now();
      this.startTimer();

      this.trackEvent('timer_resumed', {
        timeRemaining: this.timeLeft
      });
    }
  }

  handleReset() {
    this.stopTimer();
    this.isRunning = false;
    const duration = this.sessionType === 'work' ? this.workDuration :
      this.sessionType === 'shortBreak' ? this.shortBreakDuration : this.longBreakDuration;
    this.timeLeft = duration;

    this.trackEvent('timer_reset', {
      previousTimeLeft: this.timeLeft,
      resetTo: duration
    });
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
    this.trackEvent('settings_toggled', { opened: this.showSettings });
  }

  handleSettingsChange(type: 'work' | 'shortBreak' | 'longBreak', value: string) {
    const newValue = parseInt(value) * 60;

    if (type === 'work') {
      this.workDuration = newValue;
      if (this.sessionType === 'work' && !this.isRunning) {
        this.timeLeft = newValue;
      }
    } else if (type === 'shortBreak') {
      this.shortBreakDuration = newValue;
      if (this.sessionType === 'shortBreak' && !this.isRunning) {
        this.timeLeft = newValue;
      }
    } else if (type === 'longBreak') {
      this.longBreakDuration = newValue;
      if (this.sessionType === 'longBreak' && !this.isRunning) {
        this.timeLeft = newValue;
      }
    }

    this.trackEvent('settings_changed', {
      settingType: type,
      newValue: newValue / 60,
      unit: 'minutes'
    });
  }

  private playNotification() {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio notification not available');
    }
  }

  // Getters for template
  get formatTime(): string {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  get progress(): number {
    const total = this.sessionType === 'work' ? this.workDuration :
      this.sessionType === 'shortBreak' ? this.shortBreakDuration : this.longBreakDuration;
    return ((total - this.timeLeft) / total) * 100;
  }

  get sessionDisplay(): string {
    switch (this.sessionType) {
      case 'work':
        return '💼 Work Session';
      case 'shortBreak':
        return '☕ Short Break';
      case 'longBreak':
        return '🌴 Long Break';
      default:
        return '';
    }
  }

  get timerCardClass(): string {
    return `timer-card ${this.sessionType}`;
  }
}

