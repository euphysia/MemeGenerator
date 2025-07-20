import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'glass' | 'file';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    id, 
    variant = 'default',
    icon,
    iconPosition = 'left',
    type = 'text',
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const baseInputClasses = `
      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2
      font-inter text-base
      placeholder:text-gray-400
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      default: `
        bg-white/90 backdrop-blur-sm border-gray-200
        focus:border-blue-500 focus:ring-blue-500
        hover:border-gray-300
        dark:bg-gray-800/90 dark:border-gray-600
        dark:focus:border-blue-400 dark:focus:ring-blue-400
        dark:hover:border-gray-500
      `,
      glass: `
        bg-white/10 backdrop-blur-md border-white/20
        focus:border-white/40 focus:ring-white/20
        hover:border-white/30
        text-white placeholder:text-white/60
      `,
      file: `
        bg-white/90 backdrop-blur-sm border-gray-200
        focus:border-blue-500 focus:ring-blue-500
        hover:border-gray-300
        cursor-pointer
        file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:text-sm file:font-medium
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100
        dark:bg-gray-800/90 dark:border-gray-600
        dark:file:bg-gray-700 dark:file:text-gray-200
        dark:hover:file:bg-gray-600
      `
    };

    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

    const renderIcon = () => {
      if (!icon) return null;
      
      return (
        <div className={cn(
          'absolute inset-y-0 flex items-center pointer-events-none',
          iconPosition === 'left' ? 'left-3' : 'right-3'
        )}>
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        </div>
      );
    };

    const renderInput = () => {
      const inputClasses = cn(
        baseInputClasses,
        variants[variant],
        errorClasses,
        icon && iconPosition === 'left' && 'pl-10',
        icon && iconPosition === 'right' && 'pr-10',
        className
      );

      return (
        <div className="relative">
          <input
            id={inputId}
            className={inputClasses}
            ref={ref}
            type={type}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {renderIcon()}
        </div>
      );
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        
        {renderInput()}
        
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input }; 