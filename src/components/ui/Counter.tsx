import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CounterProps {
  value: number;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  error?: string;
  className?: string;
  duration?: number; // Animation duration in milliseconds
  prefix?: string;
  suffix?: string;
}

const Counter: React.FC<CounterProps> = ({
  value,
  title,
  subtitle,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  className,
  duration = 2000,
  prefix = '',
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsAnimating(true);
      const startValue = prevValueRef.current;
      const endValue = value;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          setDisplayValue(endValue);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
      prevValueRef.current = value;
    }
  }, [value, duration]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const baseClasses = `
    rounded-2xl transition-all duration-300 ease-out
    font-inter text-center
  `;

  const variants = {
    default: `
      bg-white/90 backdrop-blur-sm border border-gray-200/50
      shadow-lg shadow-gray-200/50
      dark:bg-gray-800/90 dark:border-gray-700/50
      dark:shadow-lg dark:shadow-gray-900/50
    `,
    glass: `
      bg-white/10 backdrop-blur-md border border-white/20
      shadow-xl shadow-black/10
      text-white
    `,
    gradient: `
      bg-gradient-to-br from-blue-500/90 to-purple-600/90
      backdrop-blur-sm border border-blue-400/30
      shadow-xl shadow-blue-500/25
      text-white
    `,
    purple: `
      bg-purple-100/95 backdrop-blur-sm border border-purple-200/50
      shadow-lg shadow-purple-200/50
      dark:bg-purple-900/90 dark:border-purple-700/50
      dark:shadow-lg dark:shadow-purple-900/50
    `
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const numberSizes = {
    sm: 'text-2xl font-bold',
    md: 'text-4xl font-bold',
    lg: 'text-6xl font-bold'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const subtitleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (error) {
    return (
      <div className={cn(
        baseClasses,
        variants.default,
        sizes[size],
        'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
        className
      )}>
        <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Error loading data</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      baseClasses,
      variants[variant],
      sizes[size],
      isAnimating && 'scale-105',
      className
    )}>
      {title && (
        <div className={cn(
          'font-medium mb-2',
          titleSizes[size],
          variant === 'glass' || variant === 'gradient' 
            ? 'text-white/90' 
            : variant === 'purple'
            ? 'text-purple-800 dark:text-purple-200'
            : 'text-gray-700 dark:text-gray-300'
        )}>
          {title}
        </div>
      )}
      
      <div className={cn(
        'transition-all duration-300',
        numberSizes[size],
        variant === 'glass' || variant === 'gradient' 
          ? 'text-white' 
          : variant === 'purple'
          ? 'text-purple-900 dark:text-purple-100'
          : 'text-gray-900 dark:text-white'
      )}>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
          </div>
        ) : (
          <span className="tabular-nums">
            {prefix}{displayValue.toLocaleString()}{suffix}
          </span>
        )}
      </div>
      
      {subtitle && (
        <div className={cn(
          'mt-2 font-medium',
          subtitleSizes[size],
          variant === 'glass' || variant === 'gradient' 
            ? 'text-white/70' 
            : variant === 'purple'
            ? 'text-purple-600 dark:text-purple-300'
            : 'text-gray-500 dark:text-gray-400'
        )}>
          {subtitle}
        </div>
      )}
      
      {isAnimating && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export { Counter }; 