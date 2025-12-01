import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

/**
 * PageLayout - استاندارد layout برای همه صفحات
 * 
 * Features:
 * - Consistent spacing
 * - Optional header with title/description/actions
 * - Responsive container
 * - Flexible content area
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  actions,
  className,
  containerSize = 'lg',
  noPadding = false,
}) => {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <Container size={containerSize} padding={noPadding ? 'none' : 'md'}>
        {/* Page Header */}
        {(title || description || actions) && (
          <div className="py-6 border-b border-gray-200 bg-white mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-gray-600 text-lg">{description}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className={cn('pb-8', !title && !description && !actions && 'pt-6')}>
          {children}
        </div>
      </Container>
    </div>
  );
};

/**
 * PageSection - استاندارد section برای محتوای صفحه
 */
interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const PageSection: React.FC<PageSectionProps> = ({
  children,
  title,
  description,
  actions,
  className,
  noPadding = false,
}) => {
  return (
    <section className={cn('mb-8', className)}>
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-600 text-sm">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'bg-white rounded-lg shadow-sm p-6')}>
        {children}
      </div>
    </section>
  );
};

/**
 * PageGrid - استاندارد grid layout
 */
interface PageGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PageGrid: React.FC<PageGridProps> = ({
  children,
  cols = 3,
  gap = 'md',
  className,
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClass = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={cn('grid', colsClass[cols], gapClass[gap], className)}>
      {children}
    </div>
  );
};
