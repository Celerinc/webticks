"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for webticks to be available
    if (window.webticks) {
      setIsReady(true);
    }
  }, []);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (window.webticks) {
      window.webticks.trackEvent("button_clicked", { count: newCount });
      console.log("✅ Tracked button click:", newCount);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            WebTicks Test App
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Testing analytics with yalc
          </p>
          {isReady && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              ✓ WebTicks Ready
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
          <p className="text-sm font-medium opacity-90">Click Count</p>
          <p className="text-6xl font-bold">{clickCount}</p>
        </div>

        <button
          onClick={handleClick}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Track Click Event
        </button>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Open browser console to see tracking events</p>
          <p className="mt-1 text-xs">(Debug mode is enabled)</p>
        </div>
      </main>
    </div>
  );
}
