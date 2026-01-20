"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AnalyticsTracker } from "@webticks/core/tracker";

declare global {
  interface Window {
    webticks?: AnalyticsTracker;
  }
}

type TimerMode = "work" | "break";

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export default function Home() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (window.webticks) {
      setIsReady(true);
    }
  }, []);

  const trackEvent = useCallback((eventName: string, details: Record<string, unknown>) => {
    if (window.webticks) {
      window.webticks.trackEvent(eventName, details);
      console.log(`✅ Tracked: ${eventName}`, details);
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = useCallback(() => {
    if (mode === "work") {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      trackEvent("pomodoro_completed", { mode, sessionCount: newSessionCount });

      // Switch to break
      trackEvent("mode_switched", { from: "work", to: "break" });
      setMode("break");
      setTimeRemaining(BREAK_DURATION);
    } else {
      trackEvent("pomodoro_completed", { mode, sessionCount });

      // Switch back to work
      trackEvent("mode_switched", { from: "break", to: "work" });
      setMode("work");
      setTimeRemaining(WORK_DURATION);
    }
    setIsRunning(false);
  }, [mode, sessionCount, trackEvent]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleComplete]);

  const handleStart = () => {
    const duration = mode === "work" ? WORK_DURATION : BREAK_DURATION;
    trackEvent("pomodoro_started", { mode, duration });
    setIsRunning(true);
  };

  const handlePause = () => {
    trackEvent("pomodoro_paused", { mode, timeRemaining });
    setIsRunning(false);
  };

  const handleResume = () => {
    trackEvent("pomodoro_resumed", { mode, timeRemaining });
    setIsRunning(true);
  };

  const handleReset = () => {
    trackEvent("pomodoro_reset", { mode });
    setIsRunning(false);
    setTimeRemaining(mode === "work" ? WORK_DURATION : BREAK_DURATION);
  };

  const handleSkip = () => {
    trackEvent("pomodoro_skipped", { mode, timeRemaining });
    handleComplete();
  };

  const progress = mode === "work"
    ? ((WORK_DURATION - timeRemaining) / WORK_DURATION) * 100
    : ((BREAK_DURATION - timeRemaining) / BREAK_DURATION) * 100;

  return (
    <div className={`flex min-h-screen items-center justify-center transition-colors duration-700 ${mode === "work"
      ? "bg-gradient-to-br from-rose-900 via-purple-900 to-slate-900"
      : "bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900"
      }`}>
      <main className="flex flex-col items-center gap-8 p-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-1">
            Pomodoro Timer
          </h1>
          <p className="text-white/60 text-sm">
            WebTicks Analytics Demo
          </p>
          {isReady && (
            <p className="text-xs text-emerald-400 mt-2 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Analytics Connected
            </p>
          )}
        </div>

        {/* Mode Badge */}
        <div className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${mode === "work"
          ? "bg-rose-500/30 text-rose-200 border border-rose-400/30"
          : "bg-emerald-500/30 text-emerald-200 border border-emerald-400/30"
          }`}>
          {mode === "work" ? "🎯 Focus Time" : "☕ Break Time"}
        </div>

        {/* Timer Display */}
        <div className="relative">
          {/* Progress Ring */}
          <svg className="w-56 h-56 transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/10"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={628}
              strokeDashoffset={628 - (628 * progress) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${mode === "work" ? "text-rose-400" : "text-emerald-400"
                }`}
            />
          </svg>

          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl font-bold font-mono tracking-tight ${isRunning ? "text-white" : "text-white/80"
              }`}>
              {formatTime(timeRemaining)}
            </span>
            <span className="text-white/40 text-sm mt-1">
              {isRunning ? "Running" : timeRemaining === (mode === "work" ? WORK_DURATION : BREAK_DURATION) ? "Ready" : "Paused"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={timeRemaining === (mode === "work" ? WORK_DURATION : BREAK_DURATION) ? handleStart : handleResume}
              className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              {timeRemaining === (mode === "work" ? WORK_DURATION : BREAK_DURATION) ? "Start" : "Resume"}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all duration-200 hover:bg-white/30 active:scale-95"
            >
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-4 py-3 bg-white/10 text-white/70 font-semibold rounded-xl border border-white/20 transition-all duration-200 hover:bg-white/20 hover:text-white active:scale-95"
            title="Reset"
          >
            ↺
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-3 bg-white/10 text-white/70 font-semibold rounded-xl border border-white/20 transition-all duration-200 hover:bg-white/20 hover:text-white active:scale-95"
            title="Skip to next"
          >
            ⏭
          </button>
        </div>

        {/* Session Counter */}
        <div className="flex items-center gap-2 text-white/50">
          <span className="text-2xl">🍅</span>
          <span className="text-lg font-medium">
            {sessionCount} {sessionCount === 1 ? "pomodoro" : "pomodoros"} completed
          </span>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-white/30">
          <p>All events tracked via WebTicks</p>
          <p className="mt-1">Check console for live tracking</p>
        </div>
      </main>
    </div>
  );
}
