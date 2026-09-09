import React, { forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-black hover:bg-gold-dark shadow-xl focus-visible:ring-gold/50 active:scale-[0.98]',
  secondary: 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200 focus-visible:ring-stone-400 active:scale-[0.98]',
  dark: 'bg-charcoal text-white hover:bg-charcoal-deep shadow-xl focus-visible:ring-charcoal/50 active:scale-[0.98]',
  ghost: 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-stone-300 active:scale-[0.98]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      isLoading = false,
      isSuccess = false,
      loadingText,
      successText,
      fullWidth = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading || isSuccess;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-2xl font-bold transition-all outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none ${
          variantStyles[variant]
        } ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin shrink-0" size={18} />
            <span>{loadingText || children}</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="shrink-0 text-emerald-500" size={18} />
            <span>{successText || children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
