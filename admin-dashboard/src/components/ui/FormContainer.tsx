import React from 'react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface FormContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  showLogo?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  children,
  className,
  showLogo = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {showLogo && (
            <div className="mb-8">
              <img
                src="/assets/images/logo.png"
                alt="Food Delivery Logo"
                className="mx-auto h-16 w-auto"
              />
            </div>
          )}
          
          <h2 className="text-3xl font-quicksand-bold text-secondary-900">
            {title}
          </h2>
          
          {subtitle && (
            <p className="mt-2 text-sm text-secondary-600 font-quicksand-regular">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={clsx('card p-8', className)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
