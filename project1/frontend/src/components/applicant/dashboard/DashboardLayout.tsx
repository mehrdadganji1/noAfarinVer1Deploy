import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { applicantTheme } from '@/styles/applicant-theme';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn('h-full w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50', className)} dir="rtl">
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6', className)}>
      {children}
    </div>
  );
}

interface DashboardSectionProps {
  children: ReactNode;
  className?: string;
  span?: number;
}

export function DashboardSection({ children, className, span = 12 }: DashboardSectionProps) {
  return (
    <div className={cn(`lg:col-span-${span}`, className)}>
      {children}
    </div>
  );
}
