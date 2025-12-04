# Angular Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into an Angular application. The app is a fully-functional Pomodoro timer built with Angular's component architecture and TypeScript.

## 🎯 What You'll Learn

- How to install and configure WebTicks in Angular
- How to use WebTicks with Angular components and services
- How to track custom events with RxJS patterns
- Best practices for analytics in Angular applications

## 🚀 Quick Start

### Installation

```bash
cd examples/angular-app
pnpm install
pnpm start
```

Open `http://localhost:4200` to see the Pomodoro timer in action.

## 📦 WebTicks Integration Tutorial

### Step 1: Install WebTicks

```bash
pnpm add @webticks/angular-ts
```

### Step 2: Add to App Component

In `app.component.ts`, import the `WebticksAnalytics` component:

```typescript
import { Component } from '@angular/core';
import { WebticksAnalytics } from '@webticks/angular-ts';

@Component({
  selector: 'app-root',
  imports: [WebticksAnalytics],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Your component code
}
```

### Step 3: Add to Template

In `app.component.html`:

```html
<webticks-tracker />
<!-- Your app content -->
```

### Step 4: Track Custom Events

Create a tracking method in your component:

```typescript
export class AppComponent {
  private trackEvent(eventName: string, metadata: Record<string, any> = {}) {
    if (window.webticks) {
      const eventData = {
        ...metadata,
        timestamp: new Date().toISOString()
      };
      window.webticks.trackEvent(eventName, eventData);
      console.log(`✅ WebTicks tracked: ${eventName}`, eventData);
    }
  }
  
  handleButtonClick() {
    this.trackEvent('button_click', { action: 'start_timer' });
  }
}
```

### Step 5: Add TypeScript Types

Extend the Window interface:

```typescript
declare global {
  interface Window {
    webticks?: {
      trackEvent: (eventName: string, metadata?: Record<string, any>) => void;
    };
  }
}
```

### Step 6: Use Angular Lifecycle Hooks

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

export class AppComponent implements OnInit, OnDestroy {
  private intervalId: any = null;
  
  ngOnInit() {
    // Component initialized
  }
  
  ngOnDestroy() {
    // Clean up
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
```

## 🍅 Pomodoro App Features

This example implements a complete Pomodoro timer with:

- **25-minute work sessions** (customizable)
- **5-minute short breaks** (customizable)
- **15-minute long breaks** after every 4 Pomodoros (customizable)
- **Session counter** tracking completed Pomodoros
- **Pause/Resume** functionality
- **Reset** functionality
- **Audio notifications** when sessions complete
- **Settings panel** to customize timer durations
- **Visual progress bar** with smooth animations
- **Color-coded states** with component styles
- **TypeScript** for type safety

## 📊 Tracked Events

All 9 event types are tracked:

- `pomodoro_started` - Work session begins
- `pomodoro_completed` - Work session completes
- `break_started` - Break begins
- `break_completed` - Break completes
- `timer_paused` - Timer paused
- `timer_resumed` - Timer resumed
- `timer_reset` - Timer reset
- `settings_changed` - Settings modified
- `session_milestone` - Every 4 Pomodoros

## 💡 Best Practices

### 1. Use Component Methods

```typescript
export class AppComponent {
  handleStartPause() {
    if (this.isRunning) {
      this.trackEvent('timer_paused', {
        timeRemaining: this.timeLeft
      });
    } else {
      this.trackEvent('timer_resumed', {
        timeRemaining: this.timeLeft
      });
    }
    this.isRunning = !this.isRunning;
  }
}
```

### 2. Use Getters for Computed Values

```typescript
export class AppComponent {
  timeLeft = 1500;
  
  get formatTime(): string {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
```

### 3. Template Binding

```html
<div class="timer-display">{{ formatTime }}</div>
<button (click)="handleStartPause()">
  {{ isRunning ? 'Pause' : 'Start' }}
</button>
```

### 4. Property Binding

```html
<div class="progress-fill" [style.width.%]="progress"></div>
<input [disabled]="isRunning" />
```

### 5. Conditional Rendering

```html
@if (showSettings) {
  <div class="settings-panel">
    <!-- Settings content -->
  </div>
}
```

## 🔧 Configuration

### Environment Variables

Angular uses `environment.ts` files:

```typescript
export const environment = {
  production: false,
  webticksBackendUrl: 'http://localhost:3000/api/track'
};
```

## 📁 Project Structure

```
src/
└── app/
    ├── app.component.ts       # Component logic
    ├── app.component.html     # Template
    ├── app.component.css      # Styles
    └── app.config.ts          # App configuration
```

## 🎨 Viewing Tracked Events

Open your browser's Developer Console:

```
✅ WebTicks tracked: pomodoro_started {
  duration: 1500,
  sessionType: "work",
  completedPomodoros: 0,
  timestamp: "2025-12-04T15:30:00.000Z"
}
```

## 🔗 Learn More

- [WebTicks Core Documentation](../../packages/core)
- [Angular Documentation](https://angular.dev)
- [Angular Components](https://angular.dev/guide/components)

## 📝 Example Code

See the following files for the complete implementation:
- [`app.component.ts`](./src/app/app.component.ts) - Component logic with event tracking
- [`app.component.html`](./src/app/app.component.html) - Template with Angular syntax
- [`app.component.css`](./src/app/app.component.css) - Component-scoped styles

The implementation shows:
- Angular component architecture
- TypeScript types for type safety
- Lifecycle hooks (`OnInit`, `OnDestroy`)
- Template syntax and property binding
- Event tracking for all user interactions
