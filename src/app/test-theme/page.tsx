'use client';

import { ThemeToggle } from '@/components/ui';

export default function TestThemePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Theme Test Page
          </h1>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Light/Dark Mode Test Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Card Test
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This card should change colors when you toggle the theme.
            </p>
            <div className="space-y-2">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <span className="text-gray-800 dark:text-gray-200">Gray background</span>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                <span className="text-blue-800 dark:text-blue-200">Blue background</span>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded">
                <span className="text-red-800 dark:text-red-200">Red background</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Button Test
            </h2>
            <div className="space-y-4">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Primary Button
              </button>
              <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-2 px-4 rounded">
                Secondary Button
              </button>
              <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold py-2 px-4 rounded">
                Outline Button
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Text Test
          </h2>
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white text-lg">
              This is primary text that should be dark in light mode and light in dark mode.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              This is secondary text that should be medium gray in light mode and light gray in dark mode.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              This is tertiary text that should be light gray in light mode and medium gray in dark mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 