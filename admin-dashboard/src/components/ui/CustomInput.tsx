import React from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseInputClasses = 'px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400';
  
  const variantClasses = {
    default: 'border-gray-300 bg-white',
    filled: 'border-gray-200 bg-gray-50 focus:bg-white',
  };
  
  const inputClasses = clsx(
    baseInputClasses,
    variantClasses[variant],
    {
      'border-error focus:ring-error': error,
      'w-full': fullWidth,
      'pl-12': leftIcon,
      'pr-12': rightIcon,
    },
    className
  );
  
  return (
    <div className={clsx('relative', { 'w-full': fullWidth })}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="error-message">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default CustomInput;
