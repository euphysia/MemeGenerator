'use client';

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeMode: 'light' | 'dark') => {
    if (typeof window === 'undefined') return; // Prevent SSR issues
    
    const root = window.document.documentElement;
    const mainContainer = document.querySelector('.min-h-screen') as HTMLElement;
    
    // Set data-theme attribute for CSS targeting
    root.setAttribute('data-theme', themeMode);
    
    // Toggle dark class for compatibility
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Force background change with data-theme attribute
    if (mainContainer) {
      mainContainer.setAttribute('data-theme', themeMode);
      
      // Direct style override as backup
      if (themeMode === 'dark') {
        mainContainer.style.background = 'linear-gradient(to bottom right, #111827, #1f2937, #111827)';
      } else {
        mainContainer.style.background = 'linear-gradient(to bottom right, #dbeafe, #e0e7ff, #f3e8ff)';
      }
    }
    
    // Log for debugging
    console.log(`Theme applied: ${themeMode}`);
    console.log('Data theme attribute:', root.getAttribute('data-theme'));
    console.log('Dark class present:', root.classList.contains('dark'));
    console.log('Main container data-theme:', mainContainer?.getAttribute('data-theme'));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    applyTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-800/80 dark:bg-white/10 backdrop-blur-sm border border-gray-600/20 dark:border-white/20 text-gray-100 dark:text-white hover:bg-gray-700/80 dark:hover:bg-white/20 transition-all duration-200 cursor-pointer z-50 shadow-lg"
        aria-label="Toggle theme"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-800/80 dark:bg-white/10 backdrop-blur-sm border border-gray-600/20 dark:border-white/20 text-gray-100 dark:text-white hover:bg-gray-700/80 dark:hover:bg-white/20 transition-all duration-200 cursor-pointer z-50 shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
} 