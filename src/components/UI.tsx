import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  isLoading, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/20',
    secondary: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm',
    outline: 'border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5'
  };

  return (
    <button 
      className={cn(
        'px-5 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50',
        variants[variant],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
      ) : children}
    </button>
  );
};

export const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('glass p-4', className)}>
    {children}
  </div>
);
