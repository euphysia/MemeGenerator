import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    disabled, 
    icon,
    iconPosition = 'left',
    ...props 
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-xl 
      transition-all duration-300 ease-out transform
      focus:outline-none focus:ring-2 focus:ring-offset-2 
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      hover:scale-105 active:scale-95
      font-inter
    `;
    
    const variants = {
      primary: `
        bg-gradient-to-r from-blue-600 to-blue-700 
        text-white shadow-lg hover:shadow-xl
        hover:from-blue-700 hover:to-blue-800
        focus:ring-blue-500
        border border-blue-500/20
      `,
      secondary: `
        bg-gradient-to-r from-gray-600 to-gray-700 
        text-white shadow-lg hover:shadow-xl
        hover:from-gray-700 hover:to-gray-800
        focus:ring-gray-500
        border border-gray-500/20
      `,
      outline: `
        border-2 border-gray-300 text-gray-700 
        hover:bg-gray-50 hover:border-gray-400
        focus:ring-gray-500
        bg-white/80 backdrop-blur-sm
      `,
      ghost: `
        text-gray-700 hover:bg-gray-100 
        focus:ring-gray-500
        hover:text-gray-900
      `,
      gradient: `
        bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600
        text-white shadow-lg hover:shadow-xl
        hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700
        focus:ring-purple-500
        border border-purple-500/20
      `,
      glass: `
        bg-white/10 backdrop-blur-md border border-white/20
        text-white shadow-lg hover:shadow-xl
        hover:bg-white/20 hover:border-white/30
        focus:ring-white/50
      `
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-sm h-10',
      lg: 'px-6 py-3 text-base h-12',
      xl: 'px-8 py-4 text-lg h-14'
    };

    const renderIcon = () => {
      if (loading) {
        return (
          <svg 
            className="animate-spin h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        );
      }
      return icon;
    };

    const renderContent = () => {
      const iconElement = renderIcon();
      
      if (!iconElement) return children;
      
      if (iconPosition === 'right') {
        return (
          <>
            {children}
            <span className="ml-2">{iconElement}</span>
          </>
        );
      }
      
      return (
        <>
          <span className="mr-2">{iconElement}</span>
          {children}
        </>
      );
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 