import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const baseStyles = `
      inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl
      font-semibold transition-all duration-300 focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none
      disabled:opacity-50
    `;

    const variants = {
      default: `
        bg-white/5 backdrop-blur-md border border-white/10
        hover:bg-white/10 hover:border-white/20
        active:scale-95
      `,
      outline: `
        border-2 border-[#00D9FF] bg-transparent
        hover:bg-[#00D9FF]/10 hover:border-[#00FFF5]
        active:scale-95
      `,
      ghost: `
        bg-transparent hover:bg-white/5
        active:scale-95
      `,
      gradient: `
        bg-gradient-to-r from-[#00D9FF] via-[#B026FF] to-[#FF006B]
        border-0 text-white shadow-lg shadow-[#00D9FF]/30
        hover:shadow-xl hover:shadow-[#00D9FF]/50 hover:scale-105
        active:scale-95
      `,
    };

    const sizes = {
      default: 'h-12 px-6 py-3 text-base',
      sm: 'h-9 px-4 py-2 text-sm',
      lg: 'h-14 px-8 py-4 text-lg',
      icon: 'h-10 w-10',
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
