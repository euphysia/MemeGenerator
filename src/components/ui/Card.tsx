import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', hover = false, ...props }, ref) => {
    const baseClasses = `
      rounded-2xl transition-all duration-300 ease-out
      font-inter
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
      elevated: `
        bg-white/95 backdrop-blur-sm border border-gray-200/50
        shadow-2xl shadow-gray-300/50
        dark:bg-gray-800/95 dark:border-gray-700/50
        dark:shadow-2xl dark:shadow-gray-900/50
      `,
      bordered: `
        bg-white/80 backdrop-blur-sm border-2 border-gray-200
        shadow-md
        dark:bg-gray-800/80 dark:border-gray-600
      `
    };

    const hoverClasses = hover ? `
      hover:scale-[1.02] hover:shadow-xl
      hover:bg-white/95 dark:hover:bg-gray-800/95
      cursor-pointer
    ` : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const baseClasses = 'px-6 py-4';
    
    const variants = {
      default: 'border-b border-gray-200/50 dark:border-gray-700/50',
      glass: 'border-b border-white/20'
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, padding = 'md', ...props }, ref) => {
    const paddingClasses = {
      sm: 'px-4 py-3',
      md: 'px-6 py-4',
      lg: 'px-8 py-6'
    };

    return (
      <div
        ref={ref}
        className={cn(paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const baseClasses = 'px-6 py-4';
    
    const variants = {
      default: 'border-t border-gray-200/50 dark:border-gray-700/50',
      glass: 'border-t border-white/20'
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter }; 