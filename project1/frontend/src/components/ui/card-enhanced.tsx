import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-lg text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-200 shadow-sm',
        elevated: 'bg-white shadow-md hover:shadow-lg',
        outlined: 'bg-white border-2 border-gray-300',
        ghost: 'bg-transparent',
        gradient: 'bg-gradient-to-br from-primary-500 to-accent-500 text-white border-0',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md active:scale-[0.98]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

export interface CardEnhancedProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const CardEnhanced = React.forwardRef<HTMLDivElement, CardEnhancedProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  )
);
CardEnhanced.displayName = 'CardEnhanced';

export { CardEnhanced, cardVariants };
